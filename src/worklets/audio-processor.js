const SAMPLE_RATE = 44100;

// create a sample. Builder returns array of data with applied effects
class SampleBuilder {
    /**
     * @param {Float32Array} data unprocessed audio data
     * @param lfo used to apply effects to the builder components
     */
    constructor(data, lfo) {
        this.data = data;
        this.lfo = lfo;
    }

    _getOscillatorData() {
        return this.data;
    }

    withOscillator1(oscillator1) {
        return this;
    }

    withOscillator2(oscillator1) {
        return this;
    }

    withEnvelope(envelope) {
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
        this.currentSample = {};
        this.frequencies = [];
        this.port.onmessage = (event) => {
            if (event.data.addFrequency) {
                this.frequencies.push(event.data.addFrequency);
                return;
            }
            if (event.data.removeFrequency) {
                this.frequencies = this.frequencies.filter(
                    (frequency) => frequency !== event.data.removeFrequency
                );
                return;
            }
            this.oscillator1 = event.data.oscillator1;
            this.oscillator2 = event.data.oscillator2;
            this.filter = event.data.filter;
            this.envelope = event.data.envelope;
            this.lfo = event.data.LFO;
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

        const data = this.oscillator1.wave.data;

        for (const frequency of this.frequencies) {
            if (!this.currentSample[frequency]) {
                this.currentSample[frequency] = 0;
            }
            for (let channel = 0; channel < output.length; ++channel) {
                const outputChannel = output[channel];
                // Calculate playback rate factor based on desired frequency and data length
                const playbackRate = (frequency * data.length) / sampleRate;
                for (let i = 0; i < outputChannel.length; ++i) {
                    if (this.currentSample[frequency] >= data.length) {
                        this.currentSample[frequency] = 0; // Reset to start if we've reached the end of the data
                    }
                    const processedData = new SampleBuilder(data, this.lfo)
                        .withOscillator1(this.oscillator1)
                        .withOscillator2(this.oscillator2)
                        .withEnvelope(this.envelope)
                        .withFilter(this.filter);
                    const dataIndex = Math.floor(this.currentSample[frequency]);

                    // Use the playback rate to adjust how we increment through the data
                    outputChannel[i] += processedData[dataIndex];
                    this.currentSample[frequency] += playbackRate; // Increment by playback rate
                }
            }
        }

        return true;
    }
}

registerProcessor("audio-processor", CustomOscillatorProcessor);
