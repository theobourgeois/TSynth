import {
    Envelope,
    LFOAttachement,
    getDenormalizedAudioLevel,
    getDenormalizedMs,
    useSynth,
} from "../../utils/synth-utils";
import { KnobText } from "../knob/knob-text";
import { OptionWrapper } from "./border";

export function EnvelopeOptions() {
    const { envelope, setEnvelope } = useSynth();

    // change non-sustain envelope values
    const handleChangeEnvelope =
        <T extends keyof Envelope>(options: T) =>
        (value: Envelope[T]["x"]) => {
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
                    attachment={LFOAttachement.ENV_ATTACK}
                    value={envelope.attack.x}
                    onChange={handleChangeEnvelope("attack")}
                    indicatorText={(value) =>
                        getDenormalizedMs(value).toFixed(0) + " MS"
                    }
                />
                <KnobText
                    title="HOLD"
                    attachment={LFOAttachement.ENV_HOLD}
                    value={envelope.hold.x}
                    onChange={handleChangeEnvelope("hold")}
                    indicatorText={(value) =>
                        getDenormalizedMs(value).toFixed(0) + " MS"
                    }
                />
                <KnobText
                    title="DECAY"
                    attachment={LFOAttachement.ENV_DECAY}
                    value={envelope.decay.x}
                    indicatorText={(value) =>
                        getDenormalizedMs(value).toFixed(0) + " MS"
                    }
                    onChange={handleChangeEnvelope("decay")}
                />
                <KnobText
                    title="SUS"
                    attachment={LFOAttachement.ENV_SUSTAIN}
                    value={envelope.decay.y}
                    onChange={handleChangeEnvelopeSustain}
                    indicatorText={(value) =>
                        getDenormalizedAudioLevel(1 - value).toFixed(0) + " Db"
                    }
                />
                <KnobText
                    title="REL"
                    attachment={LFOAttachement.ENV_RELEASE}
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
