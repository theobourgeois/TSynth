import { ScreenTitle } from "../screen/screen-title";
import { Recorder } from "../recorder/recorder";
import { Settings } from "./settings";

export function OptionsScreen() {
    return (
        <div className="h-full w-full flex flex-col gap-4">
            <ScreenTitle title="OPTIONS" />
            <div className="flex flex-col gap-2">
                <Settings />
                <Recorder />
            </div>
        </div>
    );
}
