import { useRef, useEffect } from "react";
import { WaveEditorWaveType } from "../../utils/synth-utils";
import { useTheme } from "../../utils/theme-utils";

type OscillatorTypesProps = {
    waveType: WaveEditorWaveType;
    onChange: (waveType: WaveEditorWaveType) => void;
};

export function OscillatorTypes({ waveType, onChange }: OscillatorTypesProps) {
    return (
        <div className="flex gap-2">
            {Object.values(WaveEditorWaveType).map((type) => (
                <OscillatorType
                    key={type}
                    type={type}
                    active={type === waveType}
                    onClick={() => onChange(type)}
                />
            ))}
        </div>
    );
}

function getYFromWaveType(type: WaveEditorWaveType, phase: number) {
    switch (type) {
        case WaveEditorWaveType.Sine:
            return -Math.sin(phase / 2);
        case WaveEditorWaveType.FSine:
            return Math.sin(phase / 2);
        case WaveEditorWaveType.Triangle:
            return -Math.asin(Math.sin(phase / 2)) * (2 / Math.PI);
        case WaveEditorWaveType.FTriangle:
            return Math.asin(Math.sin(phase / 2)) * (2 / Math.PI);
        case WaveEditorWaveType.Sawtooth:
            return -(phase / Math.PI / 2) % 2;
        case WaveEditorWaveType.FSawtooth:
            return (phase / Math.PI / 2) % 2;
        case WaveEditorWaveType.Noise:
            return Math.random() * 2 - 1;
        default:
            return 0;
    }
}

type OscillatorTypeProps = {
    type: WaveEditorWaveType;
    active: boolean;
    onClick: () => void;
};

function OscillatorType({ type, active, onClick }: OscillatorTypeProps) {
    const theme = useTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!context || !canvas) return;

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.beginPath();
        context.moveTo(0, canvas.height / 2);

        for (let i = 0; i <= canvas.width; i++) {
            const phase = (i / canvas.width) * Math.PI * 2;
            const y = getYFromWaveType(type, phase);
            const relativeY = (y * 0.5 + 0.5) * canvas.height;
            context.lineTo(i, relativeY);
        }

        context.strokeStyle = theme.screenLine;
        context.shadowBlur = 4;
        context.shadowColor = theme.screenLine;
        context.lineWidth = 2;
        context.stroke();
    }, [type, active, theme]);

    return (
        <button
            onClick={onClick}
            className="bg-gray-200  drop-shadow-md"
            style={{
                backgroundColor: theme.screenPrimary,
                border: `2px solid ${
                    active ? theme.screenLine : theme.screenGrid
                }`,
                borderRadius: "0.3rem",
            }}
        >
            <canvas ref={canvasRef} width={33} height={33}></canvas>
        </button>
    );
}
