import { Screens, useScreen } from "../../utils/screens-utils";
import {
    Envelope,
    getDenormalizedAudioLevel,
    getDenormalizedMs,
    useSynth,
} from "../../utils/synth-utils";
import { KnobText } from "../knob/knob-text";
import { OptionWrapper } from "./border";

export function EnvelopeOptions() {
    const { envelope, setEnvelope } = useSynth();
    const { setActiveScreen } = useScreen();

    // change non-sustain envelope values
    const handleChangeEnvelope =
        <T extends keyof Envelope>(options: T) =>
        (value: Envelope[T]["x"]) => {
            setActiveScreen(Screens.ENVELOPE);
            setEnvelope({
                ...envelope,
                [options]: {
                    ...envelope[options],
                    x: value,
                },
            });
        };

    // change sustain envelope value
    // Changing sustain changes the y value (volume) of the decay node
    const handleChangeEnvelopeSustain = (value: number) => {
        setActiveScreen(Screens.ENVELOPE);
        setEnvelope({
            ...envelope,
            decay: {
                ...envelope.decay,
                y: value,
            },
        });
    };

    return (
        <OptionWrapper title="ENVELOPE">
            <div className="flex gap-9">
                <KnobText
                    title="ATT"
                    value={envelope.attack.x}
                    onChange={handleChangeEnvelope("attack")}
                    indicatorText={(value) =>
                        getDenormalizedMs(value).toFixed(0) + " MS"
                    }
                />
                <KnobText
                    title="HOLD"
                    value={envelope.hold.x}
                    onChange={handleChangeEnvelope("hold")}
                    indicatorText={(value) =>
                        getDenormalizedMs(value).toFixed(0) + " MS"
                    }
                />
                <KnobText
                    title="DECAY"
                    value={envelope.decay.x}
                    onChange={handleChangeEnvelope("decay")}
                />
                <KnobText
                    title="SUSTAIN"
                    value={envelope.decay.y}
                    onChange={handleChangeEnvelopeSustain}
                    indicatorText={(value) =>
                        getDenormalizedAudioLevel(value).toFixed(0) + " Db"
                    }
                />
                <KnobText
                    title="REL"
                    value={envelope.release.x}
                    onChange={handleChangeEnvelope("release")}
                    indicatorText={(value) =>
                        getDenormalizedMs(value).toFixed(0) + " MS"
                    }
                />
            </div>
        </OptionWrapper>
    );
}
