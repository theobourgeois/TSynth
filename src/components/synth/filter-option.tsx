import { Filter, LFOAttachement, useSynth } from "../../utils/synth-utils";
import { createStyles } from "../../utils/theme-utils";
import { IndicatorButton } from "../indicator/indicator-button";
import { KnobText } from "../knob/knob-text";
import { OptionWrapper } from "./border";

const useStyles = createStyles((theme) => ({
    text: {
        color: theme.text,
        fontSize: "1.4rem",
    },
}));

export function FilterOptions() {
    const styles = useStyles();
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
        <OptionWrapper enabled={filter.enabled} title="">
            <div className="flex flex-col gap-4 h-full justify-between">
                <div className="flex items-center gap-2">
                    <h2
                        draggable
                        className="hover:cursor-grab active:cursor-grabbing"
                        style={styles.text}
                    >
                        FILTER
                    </h2>
                    <IndicatorButton
                        status={filter.enabled ? "on" : "off"}
                        onChange={(enabled) =>
                            setFilter({ ...filter, enabled })
                        }
                    />
                </div>
                <div className="flex gap-8">
                    <KnobText
                        title="CUTOFF"
                        attachment={LFOAttachement.CUTOFF_FILTER}
                        value={filter.cutoff}
                        onChange={handleChangeFilter("cutoff")}
                    />
                    <KnobText
                        title="RES"
                        attachment={LFOAttachement.RESONANCE_FILTER}
                        value={filter.resonance}
                        onChange={handleChangeFilter("resonance")}
                    />
                    <KnobText
                        title="DRIVE"
                        attachment={LFOAttachement.DRIVE_FILTER}
                        value={filter.drive}
                        onChange={handleChangeFilter("drive")}
                    />
                    <KnobText
                        title="MIX"
                        attachment={LFOAttachement.MIX_FILTER}
                        value={filter.mix}
                        onChange={handleChangeFilter("mix")}
                    />
                </div>
            </div>
        </OptionWrapper>
    );
}
