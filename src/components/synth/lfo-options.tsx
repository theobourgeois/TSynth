import { LFO, useSynth } from "../../utils/synth-utils";
import { KnobText } from "../knob/knob-text";
import { OptionWrapper } from "./border";

export function LFOOptions() {
    const { LFO, setLFO } = useSynth();

    const handleChangeLFO =
        <T extends keyof LFO>(options: T) =>
        (value: LFO[T]) => {
            setLFO({
                ...LFO,
                [options]: value,
            });
        };

    return (
        <OptionWrapper title="LFO">
            <div className="gap-8">
                <KnobText
                    title="RATE"
                    value={LFO.rate}
                    onChange={handleChangeLFO("rate")}
                />
            </div>
        </OptionWrapper>
    );
}
