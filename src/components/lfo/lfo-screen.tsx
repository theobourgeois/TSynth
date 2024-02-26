import { ScreenTitle } from "../screen/screen-title";
import { LFOGraph } from "./lfo-graph";

export function LFOScreen() {
    return (
        <div className="h-full w-full flex flex-col gap-4">
            <ScreenTitle title="LFO" />
            <LFOGraph />
        </div>
    );
}
