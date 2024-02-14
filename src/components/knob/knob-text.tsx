import { createStyles } from "../../utils/theme-utils";
import { Knob, KnobProps } from "./knob";

type KnobTextProps = {
    title: string;
} & KnobProps;

const useStyles = createStyles((theme) => ({
    title: {
        color: theme.text,
        fontSize: "1rem",
        marginTop: "10px",
    },
}));

export function KnobText({ title, ...knobProps }: KnobTextProps) {
    const styles = useStyles();
    return (
        <div className="flex flex-col items-center">
            <Knob {...knobProps} />
            <p style={styles.title}>{title}</p>
        </div>
    );
}
