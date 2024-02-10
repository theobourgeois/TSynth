import { useRef, useState } from "react";
import { createStyles } from "../../utils/theme-utils";
import { Grid } from "../graph/grid";
import {
    WaveData,
    WaveEditorWaveType,
    getSampleDataFromType,
} from "../../utils/synth-utils";
import { useContainerDimensions } from "../../utils/custom-hooks";
import { Canvas } from "./editor-canvas";
import { snapTo } from "../../utils/utils-fns";
import { cn } from "../../utils/style-utils";

const useStyles = createStyles((theme) => ({
    graph: {
        backgroundColor: theme.graph.bg,
    },
}));

type WaveEditorProps = {
    gridSizeX: number;
    gridSizeY: number;
    onChangeSamples: (data: WaveData["samples"]) => void;
    data: WaveData;
};

export function WaveEditor({
    gridSizeX,
    gridSizeY,
    data,
    onChangeSamples,
}: WaveEditorProps) {
    const styles = useStyles();
    const editorRef = useRef<HTMLDivElement>(null);
    const dimensions = useContainerDimensions(editorRef);
    const [waveType, setWaveType] = useState<WaveEditorWaveType>(
        WaveEditorWaveType.FSine
    );

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
            const relativeY = snapTo(normalizedY, (1 / gridSizeY) * 2);

            let sampleIndex = 0;
            let currPeriod = 0;
            for (let j = 0; j < data.samples.length; j++) {
                currPeriod += data.samples[j].period;
                if (currPeriod * (width / data.sampleCount) > x) {
                    sampleIndex = j;
                    break;
                }
            }

            const newData = [...data.samples];
            const sample = getSampleDataFromType(
                waveType,
                newData[sampleIndex],
                gridSizeY,
                relativeY,
                normalizedY
            );
            newData[sampleIndex] = sample;

            onChangeSamples(newData);
        };
        handleMouseMove(e);
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", handleMouseMove);
        });
    };

    return (
        <>
            {Object.values(WaveEditorWaveType).map((type) => (
                <button
                    key={type}
                    onClick={() => setWaveType(type)}
                    className={cn(
                        "m-1 px-2 py-1 bg-gray-200 rounded-md",
                        waveType === type && "bg-gray-400"
                    )}
                >
                    {type}
                </button>
            ))}
            <div
                onMouseDown={handleMouseDown}
                ref={editorRef}
                style={styles.graph}
                className="w-full h-full relative"
            >
                <Grid
                    gridSizeX={gridSizeX}
                    gridSizeY={gridSizeY}
                    dimensions={dimensions}
                />
                <Canvas dimensions={dimensions} data={data} />
            </div>
        </>
    );
}
