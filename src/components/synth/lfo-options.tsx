import {
    LFO,
    getRateFromLFOValue,
    useSynthStore,
    useSynthUtils,
} from "../../utils/synth-utils";
import { createStyles } from "../../utils/theme-utils";
import { KnobText } from "../knob/knob-text";
import { OptionWrapper } from "./border";

const useStyles = createStyles((theme) => ({
    text: {
        color: theme.text,
        fontSize: "1.4rem",
    },
}));

function getRateIndicatorText(value: number) {
    const rateMs = getRateFromLFOValue(value);
    const normalizedRate = rateMs / 1000;
    if (normalizedRate === 1) return 1;
    const denominator = (1 / normalizedRate).toFixed(0);
    const stringRate = `1 / ${denominator}`;
    return stringRate;
}

export function LFOOptions() {
    const styles = useStyles();
    const LFO = useSynthStore((state) => state.LFO);
    const setLFO = useSynthStore((state) => state.setLFO);
    const draggingLFOAttachment = useSynthUtils(
        (state) => state.draggingLFOAttachment
    );

    const handleChangeLFO =
        <T extends keyof LFO>(options: T) =>
        (value: LFO[T]) => {
            setLFO({
                ...LFO,
                [options]: value,
            });
        };

    const handleDragEnd = () => {
        if (!draggingLFOAttachment) return;
        if (LFO.attachements.includes(draggingLFOAttachment)) {
            const attachements = LFO.attachements.filter(
                (attachment) => attachment !== draggingLFOAttachment
            );
            setLFO({
                ...LFO,
                attachements,
            });
            return;
        }

        const attachements = [...LFO.attachements, draggingLFOAttachment];
        setLFO({
            ...LFO,
            attachements,
        });
    };

    return (
        <OptionWrapper title="">
            <div className="flex flex-col gap-2 h-full justify-between">
                <h2
                    onDragEnd={handleDragEnd}
                    draggable
                    className="hover:cursor-grab active:cursor-grabbing"
                    style={styles.text}
                >
                    LFO
                </h2>
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
