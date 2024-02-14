import { Envelope, useSynth } from "../../utils/synth-utils";
import { KnobText } from "../knob/knob-text";
import { OptionWrapper } from "./border";

export function EnvelopeOptions() {
    const { envelope, setEnvelope } = useSynth();
    const handleChangeEnvelope =
        <T extends keyof Envelope>(options: T) =>
        (value: Envelope[T]) => {
            setEnvelope({
                ...envelope,
                [options]: value,
            });
        };

    return (
        <OptionWrapper title="ENVELOPE">
            <div className="flex gap-4 justify-evenly">
                <KnobText
                    title="ATTACK"
                    value={envelope.attack}
                    onChange={handleChangeEnvelope("attack")}
                />
                <KnobText
                    title="DECAY"
                    value={envelope.decay}
                    onChange={handleChangeEnvelope("decay")}
                />
                <KnobText
                    title="SUSTAIN"
                    value={envelope.sustain}
                    onChange={handleChangeEnvelope("sustain")}
                />
                <KnobText
                    title="RELEASE"
                    value={envelope.release}
                    onChange={handleChangeEnvelope("release")}
                    indicatorText={(value) => value}
                />
            </div>
        </OptionWrapper>
    );
}
