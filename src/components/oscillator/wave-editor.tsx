import { useEffect, useRef } from "react";
import { Grid } from "../graph/grid";
import {
    SampleType,
    WaveData,
    WaveEditorWaveType,
    getSampleDataFromType,
} from "../../utils/synth-utils";
import { useContainerDimensions } from "../../utils/custom-hooks";
import { Canvas } from "./editor-canvas";
import { snapTo } from "../../utils/utils-fns";

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

type WaveEditorProps = {
    gridSizeX: number;
    gridSizeY: number;
    onChange: (data: WaveData) => void;
    data: WaveData;
    waveType: WaveEditorWaveType;
};

export function WaveEditor({
    gridSizeX,
    gridSizeY,
    data,
    waveType,
    onChange,
}: WaveEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const dimensions = useContainerDimensions(editorRef);

    const currentData = useRef(data);

    useEffect(() => {
        currentData.current = data;
    }, [data]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const { width, height, left, top } = dimensions;
        const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
            const x = e.clientX - left;
            const y = e.clientY - top;
            const midPoint = height / 2;

            const normalizedY = Math.max(
                Math.min((midPoint - y) / midPoint, 1),
                -1
            );

            const normalizedX = snapTo(
                Math.max(Math.min(x / width, 1), 0),
                1 / gridSizeX,
                "floor"
            );

            // store output
            const dataArray = [];
            const sampleData = getSampleDataFromType(
                waveType,
                gridSizeY,
                snapTo(normalizedY, (1 / gridSizeY) * 2, "ceil")
            );

            const sampleSize = data.length / gridSizeX;
            if (sampleData) {
                const { period, amplitude, type, offset } = sampleData;
                let phase = 0;

                for (let i = 0; i < sampleSize; i++) {
                    const wave =
                        getYFromSample(type, phase) * amplitude - offset;
                    dataArray.push(wave);
                    const pixelsPerPeriod = period * sampleSize;
                    phase += (Math.PI * 2) / pixelsPerPeriod / 2;
                }
            }

            const newData = [...currentData.current];
            const startIndex = Math.floor(normalizedX * newData.length);

            if (startIndex > newData.length - sampleSize) return;
            for (let i = 0; i < sampleSize; i++) {
                let noiseModifier = 0;
                if (waveType === WaveEditorWaveType.Noise) {
                    noiseModifier =
                        1 - Math.abs(normalizedY) * Math.random() * 2;
                }
                const newY = noiseModifier
                    ? data[i] + noiseModifier
                    : dataArray[i];
                newData[startIndex + i] = newY;
            }
            onChange(newData);
        };
        handleMouseMove(e);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", handleMouseMove);
        });
    };

    return (
        <div
            onMouseDown={handleMouseDown}
            ref={editorRef}
            className="h-full relative"
        >
            <Grid
                gridSizeX={gridSizeX}
                gridSizeY={gridSizeY}
                dimensions={dimensions}
            />
            <Canvas dimensions={dimensions} data={data} />
        </div>
    );
}
