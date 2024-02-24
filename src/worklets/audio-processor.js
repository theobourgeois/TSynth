/**
 * File responsible for processing the audio data
 * This file is run in a separate thread
 * It receives messages from the main thread and processes the audio data
 * See the Synth component in synth.ts and the AudioProcessor class in synth-utils.ts to see where the messages are sent and their format
 */
class CustomOscillatorProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        if (!this.startTime) {
            this.startTime = new Date().getTime();
        }
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
                event.data.lfo,
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
    refreshSynthState(master, envelope, lfo, oscillator1, oscillator2, filter) {
        this.master = master;
        this.envelope = envelope;
        this.oscillator1 = oscillator1;
        this.oscillator2 = oscillator2;
        this.filter = filter;
        this.lfo = lfo;
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
            currentTime: null,
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
        const { currentTime, timeOfRelease } = this.frequencies[frequencyIndex];
        const timeSinceStart = new Date().getTime() - currentTime;
        // set the current time on the first note
        // this ensures that the time is as accurate as possible
        // if we set the time in the constructor, it will be off by the time it takes to process the message
        if (currentTime === null) {
            this.frequencies[frequencyIndex].currentTime = new Date().getTime();
        }

        const isNoteReleased = timeOfRelease !== null;
        if (isNoteReleased) {
            const releaseWeight = this.getReleaseWeight(frequencyIndex);
            return releaseWeight;
        }

        const attackTime = this.envelope.attack.x;
        const decaySustainWeight = this.getDecaySustainWeight(timeSinceStart);
        const attackWeight = Math.min(timeSinceStart / attackTime, 1);

        const totalEnvelopeWeight = attackWeight * decaySustainWeight;
        // set the level to release for the next time
        // when the note releases, this code wont be reached
        this.frequencies[frequencyIndex].levelToRelease = totalEnvelopeWeight;

        return totalEnvelopeWeight;
    }

    getOscillatorWeight(oscillatorIndex, dataIndex) {
        const oscillator =
            oscillatorIndex === 1 ? this.oscillator1 : this.oscillator2;
        const unison = oscillator.unison;
        const detune = oscillator.detune;
        const level = oscillator.level;
        const pan = oscillator.pan;
        const leftPan = pan <= 0 ? 1 : 1 - pan;
        const rightPan = pan >= 0 ? 1 : 1 + pan;

        const data = [];
        data[0] = 0;
        data[1] = 0;

        for (let u = 0; u < unison; u++) {
            data[0] += oscillator.wave.data[dataIndex] * level * leftPan;
            data[1] += oscillator.wave.data[dataIndex] * level * rightPan;
        }

        return data;
    }

    /**
     * System-invoked process callback function.
     * @param  {Array} inputs Incoming audio stream.
     * @param  {Array} outputs Outgoing audio stream.
     * @return {Boolean} Active source flag.
     */
    process(inputs, outputs) {
        const output = outputs[0];

        const dataLength = this.oscillator1.wave.data.length;

        if (this.frequencies.length === 0) {
            return true;
        }

        for (let i = 0; i < output[0].length; ++i) {
            // iterate through each frequency and calculate the output
            for (let f = 0; f < this.frequencies.length; ++f) {
                const frequency = this.frequencies[f].frequency;
                const envelopeWeight = this.getEnvelopeWeight(f);

                for (let u = 0; u < this.oscillator1.unison; u++) {
                    const newFrequency =
                        frequency + u * this.oscillator1.detune;
                    const newPlaybackRate =
                        (newFrequency * dataLength) / sampleRate;

                    const sampleIndex = Math.floor(
                        ((currentFrame + i) * newPlaybackRate) % dataLength
                    );

                    const data = this.oscillator1.wave.data[sampleIndex];

                    output[0][i] +=
                        (data / this.oscillator1.unison) * envelopeWeight;
                    output[1][i] +=
                        (data / this.oscillator1.unison) * envelopeWeight;
                }

                // const oscillator1Weight = this.getOscillatorWeight(
                //     1,
                //     dataIndex
                // );
            }
        }

        // apply master volume
        for (let i = 0; i < output[0].length; ++i) {
            output[0][i] *= this.master;
            output[1][i] *= this.master;
        }

        return true;
    }
}

registerProcessor("audio-processor", CustomOscillatorProcessor);
