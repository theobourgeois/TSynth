class CustomOscillatorProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [
            {
                name: "mix",
                defaultValue: 0.0,
                minValue: 0.0,
                maxValue: 1.0,
                automationRate: "a-rate",
            },
        ];
    }

    constructor() {
        super();
        this.phase = 0; // Ensure phase is initialized
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        const mixParam = parameters.mix;
        const frequency = 440;
        const sampleRate = 44100;

        for (let channel = 0; channel < output.length; ++channel) {
            const outputChannel = output[channel];
            for (let i = 0; i < outputChannel.length; ++i) {
                const phaseIncrement = (2 * Math.PI * frequency) / sampleRate;
                this.phase += phaseIncrement;
                if (this.phase > 2 * Math.PI) {
                    this.phase -= 2 * Math.PI;
                }

                const mix = mixParam.length > 1 ? mixParam[i] : mixParam[0]; // Correctly handle a-rate or k-rate
                const sineWave = Math.sin(this.phase);
                const squareWave = Math.sign(sineWave);
                outputChannel[i] = (1 - mix) * sineWave + mix * squareWave;
            }
        }

        return true;
    }
}

registerProcessor("audio-processor", CustomOscillatorProcessor);
