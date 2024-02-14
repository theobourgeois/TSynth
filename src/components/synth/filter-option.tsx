import { Filter, useSynth } from "../../utils/synth-utils";
import { KnobText } from "../knob/knob-text";
import { OptionWrapper } from "./border";

export function FilterOptions() {
    const { filter, setFilter } = useSynth();

    const handleChangeFilter =
        <T extends keyof Filter>(options: T) =>
        (value: Filter[T]) => {
            setFilter({
                ...filter,
                [options]: value,
            });
        };

    return (
        <OptionWrapper enabled={filter.enabled} title="FILTER">
            <div className="flex gap-8">
                <KnobText
                    title="CUTOFF"
                    value={filter.cutoff}
                    onChange={handleChangeFilter("cutoff")}
                />
                <KnobText
                    title="RES"
                    value={filter.resonance}
                    onChange={handleChangeFilter("resonance")}
                />
                <KnobText
                    title="DRIVE"
                    value={filter.drive}
                    onChange={handleChangeFilter("drive")}
                />
                <KnobText
                    title="MIX"
                    value={filter.mix}
                    onChange={handleChangeFilter("mix")}
                />
            </div>
        </OptionWrapper>
    );
}
