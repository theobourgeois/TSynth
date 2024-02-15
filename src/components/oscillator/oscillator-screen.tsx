import { useState } from "react";
import {
    Oscillator,
    WaveData,
    WaveEditorWaveType,
} from "../../utils/synth-utils";
import { WaveEditor } from "./wave-editor";
import { ScreenTitle } from "../screen/screen-title";
import { createStyles } from "../../utils/theme-utils";
import { UpDownButton } from "../screen/up-down-button";
import { OscillatorTypes } from "./oscillator-shapes";

const useStyles = createStyles((theme) => ({
    text: {
        filter: `drop-shadow(0 0 1px ${theme.screenSecondary})`,
        color: theme.screenSecondary,
    },
    gridTitleText: {
        color: theme.screenPrimary,
        textAlign: "center",
        fontSize: "0.9rem",
    },
    gridTitleContainer: {
        padding: "0 0.3rem",
        display: "flex",
        alignItems: "center",
        backgroundColor: theme.screenSecondary,
    },
}));

const DEFAULT_GRID_SIZES = { x: 2, y: 2 };

type OscillatorScreenProps = {
    oscillator: Oscillator;
    setOscillator: (oscillator: Oscillator) => void;
    oscillatorNumber: number;
};

export function OscillatorScreen({
    oscillator,
    setOscillator,
    oscillatorNumber,
}: OscillatorScreenProps) {
    const styles = useStyles();
    const [gridSizes, setGridSizes] = useState(DEFAULT_GRID_SIZES);
    const [waveType, setWaveType] = useState<WaveEditorWaveType>(
        WaveEditorWaveType.FSine
    );
    const handleChangeData = (data: WaveData) => {
        setOscillator({ ...oscillator, wave: { ...oscillator.wave, data } });
    };
    return (
        <div className="w-full h-full flex flex-col">
            <ScreenTitle title={`OSC ${oscillatorNumber}`} />
            <div className="flex flex-col h-full">
                <div className="my-1 h-full">
                    <WaveEditor
                        waveType={waveType}
                        gridSizeX={gridSizes.x}
                        gridSizeY={gridSizes.y}
                        data={oscillator.wave.data}
                        onChange={handleChangeData}
                    />
                </div>
                <div className="flex justify-between">
                    <OscillatorTypes
                        waveType={waveType}
                        onChange={setWaveType}
                    />
                    <div className="flex  items-center gap-2">
                        <div style={styles.gridTitleContainer}>
                            <p style={styles.gridTitleText}>GRID</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex gap-2">
                                <p style={styles.text}>{gridSizes.x}</p>
                                <UpDownButton
                                    horizontal
                                    value={gridSizes.x}
                                    onChange={(value) =>
                                        setGridSizes({ ...gridSizes, x: value })
                                    }
                                />
                            </div>
                            <div className="flex gap-1">
                                <p style={styles.text}>{gridSizes.y}</p>
                                <UpDownButton
                                    value={gridSizes.y}
                                    onChange={(value) =>
                                        setGridSizes({ ...gridSizes, y: value })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
