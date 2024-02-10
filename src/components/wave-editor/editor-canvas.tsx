import { useEffect, useRef } from "react";
import { SampleType, WaveData } from "../../utils/synth-utils";
import { Dimensions } from "../../utils/typings-utils";
import { useTheme } from "../../utils/theme-utils";

type EditorCanvasProps = {
    dimensions: Dimensions;
    data: WaveData;
};

function getYFromSample(sample: SampleType, phase: number) {
    switch (sample) {
        case SampleType.Sine:
            return Math.sin(phase);
        case SampleType.Square:
            return Math.sign(Math.sin(phase));
        case SampleType.Triangle:
            return Math.asin(Math.sin(phase)) * (2 / Math.PI);
        case SampleType.Sawtooth:
            return (phase / Math.PI) % 2;
        default:
            return 0;
    }
}

export function Canvas({ dimensions, data }: EditorCanvasProps) {
    const { width, height } = dimensions;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { sampleCount, samples } = data;
    const theme = useTheme();

    useEffect(() => {
        renderWaveform();
    }, [data, dimensions]);

    const sampleCountSum = samples.reduce((acc, s) => acc + s.period, 0);
    if (sampleCount !== sampleCountSum) {
        console.error("Sample count and samples length do not match");
        return null;
    }

    const renderWaveform = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, width, height);
        context.beginPath();

        let phase = 0;
        for (let i = 0; i < width; i++) {
            const x = i;

            let sampleIndex = 0;
            let currPeriod = 0;
            for (let j = 0; j < samples.length; j++) {
                currPeriod += samples[j].period;
                if (currPeriod * (width / sampleCount) > x) {
                    sampleIndex = j;
                    break;
                }
            }

            const { period, amplitude, type, offset, noise } =
                samples[sampleIndex];
            const isStartOfSample =
                Math.floor((width / sampleCount) * currPeriod) === x || x == 0;

            if (isStartOfSample) {
                phase = 0;
            }

            const noiseModifier = Math.random() * 2 * noise;

            const wave =
                getYFromSample(type, phase) * amplitude + noiseModifier;

            const middleHeight = height / 2;
            const waveAmplitude = (height * wave) / 2;
            const waveOffset = offset * (height / 2);
            const y = middleHeight + waveAmplitude - waveOffset;

            const fullCycle = -1 * Math.PI * 2;
            const pixelsPerPeriod = period * (width / sampleCount);
            phase += fullCycle / pixelsPerPeriod / 2;

            context.lineTo(x, y);
        }
        context.strokeStyle = theme.waveform.line;
        context.lineWidth = 8;
        context.stroke();
    };

    return (
        <canvas
            className="absolute z-20"
            ref={canvasRef}
            width={width}
            height={height}
        ></canvas>
    );
}
