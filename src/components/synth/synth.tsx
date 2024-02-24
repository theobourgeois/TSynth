import { useEffect } from "react";
import {
    SynthState,
    denormalizeSynthValues,
    useSynth,
} from "../../utils/synth-utils";
import { audioProcessor } from "../../utils/audio-processing";
import { createStyles } from "../../utils/theme-utils";
import { TV } from "../tv/tv";
import { SynthOptions } from "./synth-options";
import { Logo } from "./logo";
import { Piano } from "../piano/piano";
import { Screen } from "../screen/screen";

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
        const { master, oscillator1, oscillator2, envelope, LFO, filter } =
            synth;
        const payload = denormalizeSynthValues({
            master,
            oscillator1,
            oscillator2,
            envelope,
            LFO,
            filter,
        });
        audioProcessor.setProcessorData(payload);
    }, [synth]);

    return (
        <div style={styles.synth} className="rounded-md p-4 drop-shadow-md">
            <div className="flex h-full gap-2">
                <div className="">
                    <div className="flex justify-between">
                        <Logo />
                    </div>
                    <TV>
                        <Screen />
                    </TV>
                </div>
                <SynthOptions />
                <Piano />
            </div>
        </div>
    );
}
