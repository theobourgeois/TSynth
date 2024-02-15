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

    withOscillator(oscillator1) {
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
            this.master = event.data.master;
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

        const processedOsc1Data = new SampleBuilder(
            this.oscillator1.wave.data,
            this.lfo
        )
            .withOscillator(this.oscillator1)
            .withEnvelope(this.envelope)
            .withFilter(this.filter)
            .build();

        const processedOsc2Data = new SampleBuilder(
            this.oscillator2.wave.data,
            this.lfo
        )
            .withOscillator(this.oscillator2)
            .withEnvelope(this.envelope)
            .withFilter(this.filter)
            .build();

        // osc1 and osc2 data should be the same length
        const dataLength = processedOsc1Data.length;

        const masterData = new MasterBuilder(dataLength)
            .withOscillator1(processedOsc1Data)
            .withOscillator2(processedOsc2Data)
            .withMaster(this.master)
            .build();

        for (const frequency of this.frequencies) {
            if (!this.currentSample[frequency]) {
                this.currentSample[frequency] = 0;
            }
            for (let channel = 0; channel < output.length; ++channel) {
                const outputChannel = output[channel];
                // Calculate playback rate factor based on desired frequency and data length
                const playbackRate = (frequency * dataLength) / sampleRate;
                for (let i = 0; i < outputChannel.length; ++i) {
                    if (this.currentSample[frequency] >= dataLength) {
                        this.currentSample[frequency] = 0; // Reset to start if we've reached the end of the data
                    }
                    const dataIndex = Math.floor(this.currentSample[frequency]);
                    // Use the playback rate to adjust how we increment through the data
                    outputChannel[i] += masterData[dataIndex];
                    this.currentSample[frequency] += playbackRate; // Increment by playback rate
                }
            }
        }

        return true;
    }
}

registerProcessor("audio-processor", CustomOscillatorProcessor);
