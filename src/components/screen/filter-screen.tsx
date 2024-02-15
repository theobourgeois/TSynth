import { useSynth } from "../../utils/synth-utils";
import { ScreenTitle } from "./screen-title";

export function FilterScreen() {
    const { filter, setFilter } = useSynth();
    return (
        <div>
            <ScreenTitle title="FILTER" />
        </div>
    );
}
