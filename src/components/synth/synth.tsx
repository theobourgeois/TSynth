import { useEffect, useRef } from "react";
import {
    LFOAttachement,
    denormalizeSynthValues,
    getMSDataFromLFOData,
    getRateFromLFOValue,
    useSynth,
} from "../../utils/synth-utils";
import { audioProcessor } from "../../utils/audio-processing";
import { createStyles } from "../../utils/theme-utils";
import { TV } from "../tv/tv";
import { SynthOptions } from "./synth-options";
import { Logo } from "./logo";
import { Screen } from "../screen/screen";
import { setContinuousInterval } from "../../utils/utils-fns";
import { Visualizer } from "../visualizer/visualizer";
import { AllProviders } from "../../providers/all-providers";

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
    const synthRef = useRef(synth);

    // when the synth state changes, update the processor's state
    useEffect(() => {
        const { master, oscillator1, oscillator2, envelope, filter } = synth;
        const payload = denormalizeSynthValues({
            master,
            oscillator1,
            oscillator2,
            envelope,
            filter,
        });
        audioProcessor.setProcessorData(payload);
        synthRef.current = synth;
    }, [synth]);

    useEffect(() => {
        const LFO = synth.LFO;
        const rateMs = getRateFromLFOValue(LFO.rate);
        const msLFOData = getMSDataFromLFOData(LFO.LFOData, rateMs);
        let interval = 0;
        if (LFO.attachements.length > 0) {
            interval = setContinuousInterval((currentMs) => {
                const msIndex = Math.min(currentMs * 4, rateMs - 1);
                const value = msLFOData[msIndex];
                changeLFOAttachements(LFO.attachements, value);
            }, rateMs);
        }

        return () => {
            clearInterval(interval);
        };
    }, [synth.LFO]);

    const changeLFOAttachements = (
        attachements: LFOAttachement[],
        value: number
    ) => {
        const { setOscillator1, setOscillator2, setEnvelope, setFilter } =
            synth;
        const oscillator1 = synthRef.current.oscillator1;
        const oscillator2 = synthRef.current.oscillator2;
        const envelope = synthRef.current.envelope;
        const filter = synthRef.current.filter;

        setOscillator1({
            ...oscillator1,
            detune: attachements.includes(LFOAttachement.DETUNE_OSC1)
                ? value
                : oscillator1.detune,
            level: attachements.includes(LFOAttachement.LEVEL_OSC1)
                ? value
                : oscillator1.level,
            pan: attachements.includes(LFOAttachement.PAN_OSC1)
                ? value
                : oscillator1.pan,
            unison: attachements.includes(LFOAttachement.UNISON_OSC1)
                ? value
                : oscillator1.unison,
        });

        setOscillator2({
            ...oscillator2,
            detune: attachements.includes(LFOAttachement.DETUNE_OSC2)
                ? value
                : oscillator2.detune,
            level: attachements.includes(LFOAttachement.LEVEL_OSC2)
                ? value
                : oscillator2.level,
            pan: attachements.includes(LFOAttachement.PAN_OSC2)
                ? value
                : oscillator2.pan,
            unison: attachements.includes(LFOAttachement.UNISON_OSC2)
                ? value
                : oscillator2.unison,
        });

        setEnvelope({
            ...envelope,
            attack: {
                ...envelope.attack,
                x: attachements.includes(LFOAttachement.ENV_ATTACK)
                    ? value
                    : envelope.attack.x,
            },
            decay: {
                ...envelope.decay,
                x: attachements.includes(LFOAttachement.ENV_DECAY)
                    ? value
                    : envelope.decay.x,
                y: attachements.includes(LFOAttachement.ENV_SUSTAIN)
                    ? value
                    : envelope.decay.y,
            },
            hold: {
                ...envelope.hold,
                x: attachements.includes(LFOAttachement.ENV_HOLD)
                    ? value
                    : envelope.hold.x,
            },
            release: {
                ...synth.envelope.release,
                x: attachements.includes(LFOAttachement.ENV_RELEASE)
                    ? value
                    : envelope.release.x,
            },
        });

        setFilter({
            ...filter,
            cutoff: attachements.includes(LFOAttachement.CUTOFF_FILTER)
                ? value
                : filter.cutoff,
            drive: attachements.includes(LFOAttachement.DRIVE_FILTER)
                ? value
                : filter.drive,
            mix: attachements.includes(LFOAttachement.MIX_FILTER)
                ? value
                : filter.mix,
            resonance: attachements.includes(LFOAttachement.RESONANCE_FILTER)
                ? value
                : filter.resonance,
        });
    };

    return (
        <AllProviders>
            <div style={styles.synth} className="rounded-md p-4 drop-shadow-lg">
                <div className="flex h-full gap-2">
                    <div>
                        <div className="flex justify-between items-center">
                            <Logo />
                            <Visualizer />
                        </div>
                        <TV>
                            <Screen />
                        </TV>
                    </div>
                    <SynthOptions />
                </div>
            </div>
        </AllProviders>
    );
}
