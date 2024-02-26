import { LFO, getRateFromLFOValue, useSynth } from "../../utils/synth-utils";
import { KnobText } from "../knob/knob-text";
import { OptionWrapper } from "./border";

function getRateIndicatorText(value: number) {
    const rateMs = getRateFromLFOValue(value);
    const normalizedRate = rateMs / 1000;
    if (normalizedRate === 1) return 1;
    const denominator = (1 / normalizedRate).toFixed(0);
    const stringRate = `1 / ${denominator}`;
    return stringRate;
}

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
            <div className="space-y-1">
                <button className="-translate-y-4 w-5 h-5 rounded-full bg-black hover:cursor-copy active:cursor-grabbing"></button>
                <KnobText
                    title="RATE"
                    value={LFO.rate}
                    onChange={handleChangeLFO("rate")}
                    indicatorText={getRateIndicatorText}
                />
            </div>
        </OptionWrapper>
    );
}
