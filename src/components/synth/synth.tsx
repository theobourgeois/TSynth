import { useEffect } from "react";
import { useSynth } from "../../utils/synth-utils";
import { audioProcessor } from "../../utils/audio-processing";
import { createStyles } from "../../utils/theme-utils";
import { TV } from "../tv/tv";
import { OptionWrapper } from "./border";
import { Knob } from "../knob/knob";
import { OscillatorOptions } from "./oscillator-options";
import { FilterOptions } from "./filter-option";
import { LFOOptions } from "./lfo-options";
import { EnvelopeOptions } from "./envelope-options";
import { SynthOptions } from "./synth-options";
import { Logo } from "./logo";

const SYNTH_WIDTH = 1200;
const SYNTH_HEIGHT = 750;

const useStyles = createStyles((theme) => ({
    synth: {
        backgroundColor: theme.background,
        boxShadow: `inset 0 0 10px rgba(0, 0, 0, 0.2)`,
        width: "100%",
        height: "100%",
    },
}));

export function Synth() {
    const styles = useStyles();
    const synth = useSynth();

    // when the synth state changes, update the processor's state
    useEffect(() => {
        const { oscillator1, oscillator2, envelope, LFO, filter } = synth;
        const payload = {
            oscillator1,
            oscillator2,
            envelope,
            LFO,
            filter,
        };
        audioProcessor.setProcessorData(payload);
    }, [synth]);

    return (
        <div style={styles.synth} className="p-4 rounded-md drop-shadow-md">
            <div className="flex h-full gap-2">
                <div>
                    <div className="flex justify-between">
                        <Logo />
                    </div>
                    <TV>Hello world</TV>
                </div>
                <SynthOptions />
            </div>
        </div>
    );
}
