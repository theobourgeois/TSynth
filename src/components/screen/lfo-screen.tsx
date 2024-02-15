import { useSynth } from "../../utils/synth-utils";
import { ScreenTitle } from "./screen-title";

export function LFOScreen() {
    const { lfo, setLFO } = useSynth();
    return (
        <div>
            <ScreenTitle title="LFO" />
        </div>
    );
}
