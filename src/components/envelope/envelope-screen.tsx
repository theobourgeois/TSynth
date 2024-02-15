import { ScreenTitle } from "../screen/screen-title";
import { EnvelopeGraph } from "./envelope-graph";

export function EnvelopeScreen() {
    return (
        <div className="h-full w-full flex flex-col gap-4">
            <ScreenTitle title="ENVELOPE" />
            <EnvelopeGraph />
        </div>
    );
}
