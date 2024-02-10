import { useState } from "react";
import { Oscillator, WaveData } from "../../utils/synth-utils";
import { WaveEditor } from "./wave-editor";

const DEFAULT_GRID_SIZES = { x: 8, y: 8 };

type OscillatorProps = {
    oscillator: Oscillator;
    onChange: (oscillator: Oscillator) => void;
};

export function Oscillator({ oscillator, onChange }: OscillatorProps) {
    const [gridSizes, setGridSizes] = useState(DEFAULT_GRID_SIZES);

    const handleChangeData = (data: WaveData) => {
        onChange({ ...oscillator, wave: { ...oscillator.wave, data } });
    };

    return (
        <>
            <div>
                <p>Grid X {gridSizes.x}</p>
                <input
                    type="range"
                    onChange={(e) =>
                        setGridSizes({ x: +e.target.value, y: gridSizes.y })
                    }
                />
            </div>
            <div>
                <p>Grid Y {gridSizes.y}</p>
                <input
                    type="range"
                    onChange={(e) =>
                        setGridSizes({ x: gridSizes.x, y: +e.target.value })
                    }
                />
            </div>
            <WaveEditor
                gridSizeX={gridSizes.x}
                gridSizeY={gridSizes.y}
                data={oscillator.wave.data}
                onChange={handleChangeData}
            />
        </>
    );
}
