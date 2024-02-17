// Generator for unique IDs
function* idGenerator() {
    let id = 0;
    while (true) {
        yield ++id;
    }
}
const idGen = idGenerator();
export const getNewID = () => idGen.next().value;

const SAMPLE_RATE = 44100;

// build the oscillator with effects
class OscillatorBuilder {
    data;
    /**
     * @param {Float32Array} data unprocessed audio data
     * @param lfo used to apply effects to the builder components
     */
    constructor(lfo) {
        this.lfo = lfo;
    }

    withOscillator(oscillator) {
        this.data = new Float32Array(oscillator.wave.data.length);
        if (!oscillator.enabled) {
            return this;
        }

        for (let i = 0; i < oscillator.wave.data.length; i++) {
            this.data[i] = oscillator.wave.data[i];
        }
        return this;
    }

    withFilter(filter) {
        return this;
    }

    build() {
        return this.data;
    }
}

// apply master effects to both oscillators
class MasterBuilder {
    data;

    constructor(length) {
        this.data = new Float32Array(length);
    }

    withOscillator1(oscillator1) {
        for (let i = 0; i < oscillator1.length; i++) {
            this.data[i] += oscillator1[i];
        }
        return this;
    }

    withOscillator2(oscillator2) {
        for (let i = 0; i < oscillator2.length; i++) {
            this.data[i] += oscillator2[i];
        }
        return this;
    }

    withMaster(master) {
        for (let i = 0; i < this.data.length; i++) {
            this.data[i] *= master;
        }
        return this;
    }

    build() {
        return this.data;
    }
}

class CustomOscillatorProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.phase = 0;
        this.timeOfRelease = null;
        this.levelToRelease = 0;
        this.frequencies = [];
        this.port.onmessage = (event) => {
            if (event.data.addFrequency) {
                const newFrequency = {
                    remove: false,
                    id: getNewID(),
                    frequency: event.data.addFrequency,
                    currentSample: 0,
                };
                this.currentTime = new Date().getTime();

                // when you play a note while releasing other note(s), the new note should override the old ones
                if (this.timeOfRelease !== null) {
                    this.timeOfRelease = null;
                    this.frequencies = [newFrequency];
                    return;
                }
                this.frequencies.push(newFrequency);
                return;
            }

            if (event.data.removeFrequency) {
                this.timeOfRelease = new Date().getTime();
                const frequencyIndex = this.frequencies.findIndex(
                    (f) => f.frequency === event.data.removeFrequency
                );

                if (frequencyIndex !== -1) {
                    this.frequencies[frequencyIndex].remove = true;
                }
                return;
            }

            this.master = event.data.master;
            this.envelope = event.data.envelope;
            this.lfo = event.data.LFO;
            const oscillator1 = event.data.oscillator1;
            const oscillator2 = event.data.oscillator2;
            const filter = event.data.filter;

            const processedOsc1Data = new OscillatorBuilder(this.lfo)
                .withOscillator(oscillator1)
                .withFilter(filter)
                .build();

            const processedOsc2Data = new OscillatorBuilder(this.lfo)
                .withOscillator(oscillator2)
                .withFilter(filter)
                .build();

            this.data = new MasterBuilder(processedOsc1Data.length)
                .withOscillator1(processedOsc1Data)
                .withOscillator2(processedOsc2Data)
                .withMaster(this.master)
                .build();
        };
    }

    /**
     * System-invoked process callback function.
     * @param  {Array} inputs Incoming audio stream.
     * @param  {Array} outputs Outgoing audio stream.
     * @param  {Object} parameters AudioParam data.
     * @return {Boolean} Active source flag.
     */
    process(inputs, outputs) {
        const output = outputs[0];
        const sampleRate = SAMPLE_RATE;

        const dataLength = this.data.length;

        if (this.frequencies.length === 0) {
            return true;
        }

        for (let f = 0; f < this.frequencies.length; ++f) {
            const frequency = this.frequencies[f].frequency;
            if (!this.frequencies[f].currentSample) {
                this.frequencies[f].currentSample = 0;
            }
            for (let channel = 0; channel < output.length; ++channel) {
                const outputChannel = output[channel];
                // Calculate playback rate factor based on desired frequency and data length
                const playbackRate = (frequency * dataLength) / sampleRate;
                for (let i = 0; i < outputChannel.length; ++i) {
                    const currentSample = this.frequencies[f].currentSample;
                    if (currentSample >= dataLength) {
                        this.frequencies[f].currentSample = 0;
                    }

                    const dataIndex = Math.floor(
                        this.frequencies[f].currentSample
                    );

                    outputChannel[i] += this.data[dataIndex];
                    this.frequencies[f].currentSample += playbackRate; // Increment by playback rate
                }
            }
        }

        // apply envelope
        for (let channel = 0; channel < output.length; ++channel) {
            const outputChannel = output[channel];
            for (let i = 0; i < outputChannel.length; ++i) {
                const attackTime = this.envelope.attack.x;
                const holdTime = this.envelope.hold.x + attackTime;
                const decayTime = this.envelope.decay.x + holdTime;
                const sustain = this.envelope.decay.y;
                const releaseTime = this.envelope.release.x;

                const hasReleased = this.timeOfRelease !== null;
                if (hasReleased) {
                    const timeSinceRelease =
                        new Date().getTime() - this.timeOfRelease;
                    const releaseWeight = Math.max(
                        1 - timeSinceRelease / releaseTime,
                        0
                    );

                    outputChannel[i] *= releaseWeight * this.levelToRelease;

                    // when the release is done, remove the frequency
                    // this is done as a cleanup.
                    // The frequency should still be removed from the list when you play another notes
                    if (releaseWeight === 0) {
                        this.frequencies = [];
                    }
                    continue;
                }

                const timeSinceStart = new Date().getTime() - this.currentTime;
                const attackWeight = Math.min(timeSinceStart / attackTime, 1);

                let decaySustainWeight = 1;
                if (timeSinceStart > decayTime) {
                    decaySustainWeight =
                        Math.min(timeSinceStart / decayTime, 1) * sustain;
                }

                outputChannel[i] *= attackWeight * decaySustainWeight;
                this.levelToRelease = outputChannel[i];
            }
        }

        return true;
    }
}

registerProcessor("audio-processor", CustomOscillatorProcessor);
