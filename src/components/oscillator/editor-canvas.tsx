import { useEffect, useRef } from "react";
import { WaveData } from "../../utils/synth-utils";
import { Dimensions } from "../../utils/typings-utils";
import { useTheme } from "../../utils/theme-utils";

type EditorCanvasProps = {
    dimensions: Dimensions;
    data: WaveData;
};

export function Canvas({ dimensions, data }: EditorCanvasProps) {
    const { width, height } = dimensions;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const theme = useTheme();

    useEffect(() => {
        renderWaveform();
    }, [data, dimensions, theme]);

    const renderWaveform = () => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, width, height);
        context.beginPath();

        for (let i = 0; i < width; i++) {
            const x = i;
            const dataIndex = Math.floor((i / width) * data.length);
            const y = data[dataIndex] * (height / 2) + height / 2;

            context.lineTo(x, y);
        }
        context.strokeStyle = theme.screenLine;
        context.lineWidth = 8;
        context.shadowColor = theme.screenLine;
        context.shadowBlur = 10;
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
