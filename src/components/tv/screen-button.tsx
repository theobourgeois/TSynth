import { useState } from "react";
import { Screens } from "../../utils/screens-utils";
import { createStyles } from "../../utils/theme-utils";

const useStyles = createStyles((theme, isActiveScreen, isButtonActive) => ({
    button: {
        backgroundColor: theme.tvButton,
        width: 50,
        height: 60,
        borderRadius: "10%",
        boxShadow: isButtonActive
            ? "inset 0 2px 6px 0 rgba(0, 0, 0, 0.5)"
            : "inset 0 -3px 4px 0 rgba(0, 0, 0, 0.5)",
        cursor: "pointer",
    },
    text: {
        color: isActiveScreen ? theme.textOn : theme.text,
        textShadow: isActiveScreen ? `0 0 10px ${theme.textOn}` : "none",
        textAlign: "center",
        fontSize: "0.6em",
    },
}));

type ScreenButtonProps = {
    isActiveScreen?: boolean;
    screen: Screens;
    onClick: () => void;
};

export function ScreenButton({
    screen,
    onClick,
    isActiveScreen = false,
}: ScreenButtonProps) {
    const [isButtonActive, setIsButtonActive] = useState(false);
    const styles = useStyles(isActiveScreen, isButtonActive);

    const handleClick = () => {
        setIsButtonActive(true);
        onClick();
    };

    const handleMouseUp = () => {
        setIsButtonActive(false);
    };

    return (
        <div className="text-2xl flex flex-col items-center">
            <div
                onMouseDown={handleClick}
                onMouseUp={handleMouseUp}
                style={styles.button}
            ></div>
            <p style={styles.text}>{screen}</p>
        </div>
    );
}
