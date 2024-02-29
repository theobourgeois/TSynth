import { useState } from "react";
import { createStyles } from "../../utils/theme-utils";
import { Indicator, IndicatorProps } from "./indicator";

const useStyles = createStyles((theme, isButtonActive) => ({
    button: {
        backgroundColor: theme.tvButton,
        width: 50,
        height: 20,
        borderRadius: "8%",
        boxShadow: isButtonActive
            ? "inset 0 2px 6px 0 rgba(0, 0, 0, 0.3)"
            : "inset 0 -3px 4px 0 rgba(0, 0, 0, 0.4)",
        cursor: "pointer",
    },
}));

type IndicatorButtonProps = {
    onChange: (enabled: boolean) => void;
} & IndicatorProps;

export function IndicatorButton({ onChange, ...props }: IndicatorButtonProps) {
    const [isButtonActive, setIsButtonActive] = useState(false);
    const styles = useStyles(isButtonActive);

    const handleClick = () => {
        setIsButtonActive(true);
        onChange(props.status === "off");
    };

    const handleMouseUp = () => {
        setIsButtonActive(false);
    };

    return (
        <div className="flex gap-2 items-center relative z-10">
            <div
                className="hover:cursor-pointer"
                onMouseDown={handleClick}
                onMouseUp={handleMouseUp}
                style={styles.button}
            ></div>
            <Indicator {...props} />
        </div>
    );
}
