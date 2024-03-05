import { useEffect, useRef } from "react";
import { useContainerDimensions } from "../../utils/custom-hooks";
import { useRecorder } from "../../providers/recorder-provider";
import { createStyles, useTheme } from "../../utils/theme-utils";
import { audioProcessor } from "../../utils/audio-processing";

const useStyles = createStyles((theme) => ({
    canvasContainer: {
        background: theme.screenPrimary,
        borderRadius: "0.3rem",
    },
}));

export function RecordingWaveform() {
    const styles = useStyles();
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useTheme();
    const { width, height } = useContainerDimensions(containerRef);
    const { audioChunks } = useRecorder();

    useEffect(() => {
        renderWaveform(audioChunks);
    }, [audioChunks, width, height, theme]);

    const renderWaveform = async (audioChunks: Blob[]) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context) return;
        context.clearRect(0, 0, width, height);

        function handleDrawStroke() {
            if (!context) return;
            context.strokeStyle = theme.screenLine;
            context.lineWidth = 2;
            context.shadowColor = theme.screenLine;
            context.shadowBlur = 10;
            context.stroke();
        }

        if (audioChunks.length === 0) {
            context.beginPath();
            context.moveTo(0, height / 2);
            context.lineTo(width, height / 2);
            handleDrawStroke();
            return;
        }

        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const arrayBuffer = await audioBlob.arrayBuffer();

        audioProcessor?.audioContext?.decodeAudioData(arrayBuffer, (buffer) => {
            const leftChannelData = buffer.getChannelData(0);
            const rightChannelData = buffer.getChannelData(1);
            const step = Math.ceil(leftChannelData.length / width);
            const amp = height / 2;

            context.beginPath();
            context.moveTo(0, amp);

            for (let x = 0; x < width; x++) {
                const min = x * step;
                let max = min + step;
                max =
                    max < leftChannelData.length ? max : leftChannelData.length;
                let sum = 0;
                for (let j = min; j < max; j++) {
                    const data = (leftChannelData[j] + rightChannelData[j]) / 2;
                    sum += Math.abs(data);
                }
                const avg = sum / (max - min);
                const y = amp - avg * amp;

                context.lineTo(x, y);
            }
        });

        handleDrawStroke();
    };

    return (
        <div
            ref={containerRef}
            style={styles.canvasContainer}
            className="w-full h-16"
        >
            <canvas ref={canvasRef} width={width} height={height}></canvas>
        </div>
    );
}
