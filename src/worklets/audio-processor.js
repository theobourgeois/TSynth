const SAMPLE_RATE = 44100;
const MIN_FREQUENCY = 0;
const MAX_FREQUENCY = 20_000;
const DEFAULT_FREQUENCY = 440;

class CustomOscillatorProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {
                name: "frequency",
                defaultValue: DEFAULT_FREQUENCY,
                minValue: MIN_FREQUENCY,
                maxValue: MAX_FREQUENCY,
                automationRate: "a-rate",
            },
            {
                name: "playing",
                defaultValue: 1.0,
                minValue: 0.0,
                maxValue: 1.0,
                automationRate: "a-rate",
            },
        ];
    }

    constructor() {
        super();
        this.phase = 0;
        this.currentSample = 0;
        this.port.onmessage = (event) => {
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
    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const frequency = parameters.frequency[0];
        const playing = Boolean(parameters.playing[0]);
        const sampleRate = SAMPLE_RATE;
        const samplesPerCycle = sampleRate / frequency;

        if (!playing) {
            return true;
        }

        const data = this.oscillator1.wave.data;
        console.log(output);

        for (let channel = 0; channel < output.length; ++channel) {
            const outputChannel = output[channel];
            // Calculate playback rate factor based on desired frequency and data length
            const playbackRate = (frequency * data.length) / sampleRate;
            for (let i = 0; i < outputChannel.length; ++i) {
                if (this.currentSample >= data.length) {
                    this.currentSample = 0; // Reset to start if we've reached the end of the data
                }
                // Use the playback rate to adjust how we increment through the data
                outputChannel[i] = data[Math.floor(this.currentSample)]; // Assuming 'gain' is defined elsewhere
                this.currentSample += playbackRate; // Increment by playback rate
            }
        }

        return true;
    }
}

registerProcessor("audio-processor", CustomOscillatorProcessor);
