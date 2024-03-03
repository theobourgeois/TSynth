import { useEffect, useRef } from "react";
import { audioProcessor } from "../../utils/audio-processing";
import { useSampleBufferStore } from "../../utils/synth-utils";
import { createStyles, useTheme } from "../../utils/theme-utils";

const WIDTH = 150;
const HEIGHT = 45;

const useStyles = createStyles((theme) => ({
    canvas: {
        marginRight: "0.1rem",
        height: "100%",
        background: `linear-gradient(0deg, ${theme.screenPrimary} 0%, ${theme.screenShine} 75%, ${theme.screenPrimary} 100%)`,
        boxShadow: "inset 0px 0px 10px 0px rgba(0, 0, 0, 0.3)",
        borderRadius: "0.3rem",
    },
}));

export function Visualizer() {
    const styles = useStyles();
    const setSampleBuffer = useSampleBufferStore(
        (state) => state.setSampleBuffer
    );
    const sampleBuffer = useSampleBufferStore((state) => state.sampleBuffer);
    const theme = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        audioProcessor.setSampleBufferListener(setSampleBuffer);
    }, []);

    useEffect(() => {
        renderWaveform(sampleBuffer);
    }, [sampleBuffer, theme]);

    const renderWaveform = (sampleBuffer: Float32Array) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, WIDTH, HEIGHT);
        context.beginPath();

        for (let i = 0; i < WIDTH; i++) {
            const x = i;
            const index = Math.floor((i / WIDTH) * sampleBuffer.length);
            const y = sampleBuffer[index] * (HEIGHT / 2) + HEIGHT / 2;

            context.lineTo(x, y);
        }
        context.strokeStyle = theme.screenLine;
        context.lineWidth = 2;
        context.shadowColor = theme.screenLine;
        context.shadowBlur = 10;
        context.stroke();
    };

    return (
        <canvas
            style={styles.canvas}
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
        ></canvas>
    );
}
