import { createStyles } from "../../utils/theme-utils";
import { Knob, KnobProps } from "./knob";
import {
    LFOAttachement,
    useSynthStore,
    useSynthUtils,
} from "../../utils/synth-utils";

type KnobTextProps = {
    title: string;
    attachment?: LFOAttachement;
} & KnobProps;

const useStyles = createStyles((theme, isKnobAttached) => ({
    title: {
        color: isKnobAttached ? theme.textOn : theme.text,
        textShadow: isKnobAttached ? `0 0 10px ${theme.textOn}` : "none",
        fontSize: "1rem",
        marginTop: "10px",
    },
}));

export function KnobText({ title, attachment, ...knobProps }: KnobTextProps) {
    const LFO = useSynthStore((state) => state.LFO);
    const isKnobAttached = attachment && LFO.attachements.includes(attachment);
    const setDraggingLFOAttachement = useSynthUtils(
        (state) => state.setDraggingLFOAttachment
    );
    const styles = useStyles(isKnobAttached);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDraggingLFOAttachement(attachment ?? null);
    };

    const handleDragLeave = () => {
        setDraggingLFOAttachement(null);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            id={attachment}
            className="flex flex-col items-center"
        >
            <Knob {...knobProps} />
            <p style={styles.title}>{title}</p>
        </div>
    );
}
