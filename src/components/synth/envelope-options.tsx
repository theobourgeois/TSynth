import { Envelope, useSynth } from "../../utils/synth-utils";
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
            <div className="flex gap-8">
                <KnobText
                    title="ATT"
                    value={envelope.attack.x}
                    onChange={handleChangeEnvelope("attack")}
                />
                <KnobText
                    title="HOLD"
                    value={envelope.hold.x}
                    onChange={handleChangeEnvelope("hold")}
                />
                <KnobText
                    title="DECAY"
                    value={envelope.decay.x}
                    onChange={handleChangeEnvelope("decay")}
                />
                <KnobText
                    title="SUS"
                    value={envelope.decay.y}
                    onChange={handleChangeEnvelopeSustain}
                />
                <KnobText
                    title="REL"
                    value={envelope.release.x}
                    onChange={handleChangeEnvelope("release")}
                    indicatorText={(value) => value}
                />
            </div>
        </OptionWrapper>
    );
}
