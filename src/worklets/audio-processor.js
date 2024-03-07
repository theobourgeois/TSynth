/* eslint-disable no-undef */
/**
 * File responsible for processing the audio data
 * This file is run in a separate thread
 * It receives messages from the main thread and processes the audio data
 * See the Synth component in synth.ts and the AudioProcessor class in synth-utils.ts to see where the messages are sent and their format
 */

const SAMPLE_BUFFER_LENGTH = 2048;
class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        if (!this.startTime) {
            this.startTime = new Date().getTime();
        }
        // sent to the front end for audio visualisation
        this.sampleBuffer = new Float32Array(SAMPLE_BUFFER_LENGTH);
        this.currentSampleIndex = 0;
        this.buffer = [0, 0];
        this.phase = 0;
        this.frequencies = [];
        this.port.onmessage = (event) => {
            if (event.data.addFrequency) {
                this.handleAddFrequency(event.data.addFrequency);
                return;
            }
            if (event.data.removeFrequency) {
                this.handleRemoveFrequency(event.data.removeFrequency);
                return;
            }
            this.refreshSynthState(
                event.data.master,
                event.data.envelope,
                event.data.oscillator1,
                event.data.oscillator2,
                event.data.filter
            );
        };
    }

    /**
     * Reinitialized the synth state.
     * Called whenver the synth state is updated in the main thread
     */
    refreshSynthState(master, envelope, oscillator1, oscillator2, filter) {
        this.master = master;
        this.envelope = envelope;
        this.oscillator1 = oscillator1;
        this.oscillator2 = oscillator2;
        this.filter = filter;
    }

    /**
     * Handles the addition of a frequency.
     * If the frequency already exists, it will be removed and re-added
     * called whenever the play() function in the main thread is called
     */
    handleAddFrequency(frequency) {
        const newFrequency = {
            frequency: frequency,
            timeOfRelease: null,
            currentTime: currentTime,
            levelToRelease: 0,
        };

        const frequencyIndex = this.frequencies.findIndex(
            (f) => f.frequency === frequency
        );
        if (frequencyIndex !== -1) {
            this.frequencies.splice(frequencyIndex, 1);
            this.frequencies.push(newFrequency);
            return;
        }

        this.frequencies.push(newFrequency);
    }

    /**
     * Handles the release of a frequency.
     * sets the time of release when you let go of a note
     * called whenever the stop() function in the main thread is called
     */
    handleRemoveFrequency(frequency) {
        const frequencyIndex = this.frequencies.findIndex(
            (f) => f.frequency === frequency
        );

        if (frequencyIndex !== -1) {
            this.frequencies[frequencyIndex].timeOfRelease =
                new Date().getTime();
        }
    }

    /**
     * Calculates the weight of the release part of the envelope
     * @param {*} frequencyIndex the index of the frequency in the frequencies array
     * @returns
     */
    getReleaseWeight(frequencyIndex) {
        const releaseTime = this.envelope.release.x;
        const levelToRelease = this.frequencies[frequencyIndex].levelToRelease;
        const timeSinceRelease =
            new Date().getTime() -
            this.frequencies[frequencyIndex].timeOfRelease;
        const releaseWeight = Math.max(
            Math.min(1 - timeSinceRelease / releaseTime, 1),
            0
        );

        return releaseWeight * levelToRelease;
    }

    /**
     * Calculates the weight of the decay and sustain part of the envelope
     * @param {*} timeSinceStart the time since the note started playing
     */
    getDecaySustainWeight(timeSinceStart) {
        let decaySustainWeight = 1;
        const attackTime = this.envelope.attack.x;
        const holdTime = this.envelope.hold.x + attackTime;

        // start decaying after hold time
        if (timeSinceStart > holdTime) {
            const decayTime = this.envelope.decay.x;
            const sustain = this.envelope.decay.y;
            const timeInDecay = timeSinceStart - holdTime;
            const decayTimeRatio = Math.min(timeInDecay / decayTime, 1);
            // level we are in the decay phase
            const decayLevel = Math.max(1 - decayTimeRatio, sustain);

            decaySustainWeight = decayLevel;
        }

        return decaySustainWeight;
    }

    /**
     * Calculates the weight of the envelope at the given frequency
     * We need to calculate the envelope weight for each frequency
     * @returns  the weight of the envelope at the given frequency
     */
    getEnvelopeWeight(frequencyIndex) {
        const { currentTime: currentFreqTime, timeOfRelease } =
            this.frequencies[frequencyIndex];

        const isNoteReleased = timeOfRelease !== null;
        if (isNoteReleased) {
            const releaseWeight = this.getReleaseWeight(frequencyIndex);
            this.buffer[0] *= releaseWeight;
            this.buffer[1] *= releaseWeight;
        }

        const attackTime = this.envelope.attack.x;
        let timeSinceStart = (currentTime - currentFreqTime) * 1000;
        const decaySustainWeight = this.getDecaySustainWeight(timeSinceStart);
        timeSinceStart = (currentTime - currentFreqTime) * 1000;
        const attackWeight =
            attackTime === 0 ? 1 : Math.min(timeSinceStart / attackTime, 1);

        const totalEnvelopeWeight = attackWeight * decaySustainWeight;
        // set the level to release for the next time
        // when the note releases, this code wont be reached
        this.frequencies[frequencyIndex].levelToRelease = totalEnvelopeWeight;

        this.buffer[0] *= totalEnvelopeWeight;
        this.buffer[1] *= totalEnvelopeWeight;
    }

    /**
     *  Calculates the weight of the oscillator at the given frequency
     */
    getOscillatorWeight({ oscillatorIndex, frequency, frameIndex }) {
        const oscillator =
            oscillatorIndex === 1 ? this.oscillator1 : this.oscillator2;
        if (!oscillator.enabled) {
            return;
        }

        const dataLength = oscillator.wave.data.length;

        const unison = oscillator.unison;
        const detune = oscillator.detune / 100;
        const waveData = oscillator.wave.data;
        const level = oscillator.level;
        const pan = oscillator.pan;
        const leftPan = pan <= 0 ? 1 : 1 - pan;
        const rightPan = pan >= 0 ? 1 : 1 + pan;

        const maxDetuneCents = 50;

        // apply the unison and detune
        for (let u = 0; u < unison; u++) {
            // Calculate the detune factor for this oscillator
            const detuneStep =
                (u - Math.floor(unison / 2)) / Math.max(1, (unison - 1) / 2);
            const detuneRatio = Math.pow(
                2,
                (maxDetuneCents * detune * detuneStep) / 1200
            );
            const newFrequency = frequency * detuneRatio;
            const newPlaybackRate = (newFrequency * dataLength) / sampleRate;
            const sampleIndex = Math.floor(
                (frameIndex * newPlaybackRate) % dataLength
            );

            this.buffer[0] += waveData[sampleIndex] / unison;
            this.buffer[1] += waveData[sampleIndex] / unison;
        }

        // apply the level and pan
        this.buffer[0] *= level * leftPan;
        this.buffer[1] *= level * rightPan;
    }

    /**
     * System-invoked process callback function.
     * @param  {Array} inputs Incoming audio stream.
     * @param  {Array} outputs Outgoing audio stream.
     * @return {Boolean} Active source flag.
     */
    process(inputs, outputs) {
        const output = outputs[0];

        if (this.frequencies.length === 0) {
            return true;
        }

        for (let i = 0; i < output[0].length; ++i) {
            // iterate through each frequency and calculate the output
            for (let f = 0; f < this.frequencies.length; ++f) {
                const frequency = this.frequencies[f].frequency;
                const frameIndex = currentFrame + i;
                this.buffer[0] = 0;
                this.buffer[1] = 0;

                this.getOscillatorWeight({
                    oscillatorIndex: 1,
                    frequency,
                    frameIndex,
                });
                this.getOscillatorWeight({
                    oscillatorIndex: 2,
                    frequency,
                    frameIndex,
                });
                this.getEnvelopeWeight(f);

                output[0][i] += this.buffer[0];
                output[1][i] += this.buffer[1];
            }
        }

        // apply master volume
        for (let i = 0; i < output[0].length; ++i) {
            output[0][i] *= this.master;
            output[1][i] *= this.master;
        }

        for (let i = 0; i < output[0].length; i++) {
            let index = this.currentSampleIndex + i;
            if (index >= SAMPLE_BUFFER_LENGTH) {
                this.port.postMessage({ sampleBuffer: this.sampleBuffer });
                this.currentSampleIndex = 0;
                this.sampleBuffer = new Float32Array(SAMPLE_BUFFER_LENGTH);
                index = this.currentSampleIndex + i;
            }
            this.sampleBuffer[index] = (output[0][i] + output[1][i]) / 2;
            this.currentSampleIndex++;
        }

        return true;
    }
}

registerProcessor("audio-processor", AudioProcessor);
