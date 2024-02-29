import { ScreenTitle } from "../screen/screen-title";
import { FilterEditor } from "./filter-editor";

export function FilterScreen() {
    return (
        <div>
            <ScreenTitle title="FILTER" />
            <FilterEditor />
        </div>
    );
}
