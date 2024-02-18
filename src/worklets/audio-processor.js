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

class CustomOscillatorProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.phase = 0;
        this.frequencies = [];
        this.port.onmessage = (event) => {
            if (event.data.addFrequency) {
                const newFrequency = {
                    frequency: event.data.addFrequency,
                    currentSample: 0,
                    timeOfRelease: null,
                    currentTime: new Date().getTime(),
                    levelToRelease: 0,
                };

                const frequencyIndex = this.frequencies.findIndex(
                    (f) => f.frequency === event.data.addFrequency
                );
                if (frequencyIndex !== -1) {
                    this.frequencies.splice(frequencyIndex, 1);
                    this.frequencies.push(newFrequency);
                    return;
                }

                this.frequencies.push(newFrequency);
                return;
            }

            if (event.data.removeFrequency) {
                const frequencyIndex = this.frequencies.findIndex(
                    (f) => f.frequency === event.data.removeFrequency
                );

                if (frequencyIndex !== -1) {
                    this.frequencies[frequencyIndex].timeOfRelease =
                        new Date().getTime();
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

            this.data = new Float32Array(processedOsc1Data.length);
            for (let i = 0; i < processedOsc1Data.length; i++) {
                this.data[i] = processedOsc1Data[i] + processedOsc2Data[i];
            }
        };
    }

    getEnvelopeWeight(frequencyIndex) {
        const attackTime = this.envelope.attack.x;
        const holdTime = this.envelope.hold.x + attackTime;
        const decayTime = this.envelope.decay.x + holdTime;
        const sustain = this.envelope.decay.y;
        const releaseTime = this.envelope.release.x;
        const { currentTime, levelToRelease, timeOfRelease } =
            this.frequencies[frequencyIndex];

        if (timeOfRelease !== null) {
            const timeSinceRelease =
                new Date().getTime() -
                this.frequencies[frequencyIndex].timeOfRelease;
            const releaseWeight = Math.max(
                Math.min(1 - timeSinceRelease / releaseTime, 1),
                0
            );

            return releaseWeight * levelToRelease;
        }

        const timeSinceStart = new Date().getTime() - currentTime;
        const attackWeight = Math.min(timeSinceStart / attackTime, 1);

        let decaySustainWeight = 1;
        if (timeSinceStart > decayTime) {
            decaySustainWeight =
                Math.min(timeSinceStart / decayTime, 1) * (1 - sustain);
        }
        this.frequencies[frequencyIndex].levelToRelease = decaySustainWeight;

        return attackWeight * decaySustainWeight;
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

                    const envelopeWeight = this.getEnvelopeWeight(f);
                    outputChannel[i] += this.data[dataIndex] * envelopeWeight;

                    this.frequencies[f].currentSample += playbackRate;
                }
            }
        }

        for (let channel = 0; channel < output.length; ++channel) {
            const outputChannel = output[channel];
            for (let i = 0; i < outputChannel.length; ++i) {
                outputChannel[i] *= this.master;
            }
        }

        return true;
    }
}

registerProcessor("audio-processor", CustomOscillatorProcessor);
