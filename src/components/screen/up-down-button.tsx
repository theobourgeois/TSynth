import { useState, useEffect } from "react";
import { cn } from "../../utils/style-utils";
import { createStyles } from "../../utils/theme-utils";

const useStyles = createStyles((theme) => ({
    arrowUp: {
        width: 0,
        height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",

        borderBottom: `10px solid ${theme.screenSecondary}`,
        filter: `drop-shadow(0 0 2px ${theme.screenSecondary})`,
        cursor: "pointer",
    },
    arrowDown: {
        width: 0,
        height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",

        borderTop: `10px solid ${theme.screenSecondary}`,
        filter: `drop-shadow(0 0 2px ${theme.screenSecondary})`,
        cursor: "pointer",
    },
}));

type UpDownInputProps = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    horizontal?: boolean;
};

export function UpDownInput({
    value,
    min = 0,
    max = 64,
    onChange,
    horizontal = false,
}: UpDownInputProps) {
    const styles = useStyles();
    const [isHoldingDown, setIsHoldingDown] = useState({
        up: false,
        down: false,
    });

    useEffect(() => {
        let interval: number;
        if (isHoldingDown.down) {
            interval = setInterval(() => {
                handleDown();
            }, 100);
        }

        if (isHoldingDown.up) {
            interval = setInterval(() => {
                handleUp();
            }, 100);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isHoldingDown]);

    useEffect(() => {
        const handleMouseUp = () => {
            setIsHoldingDown({
                up: false,
                down: false,
            });
        };
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    const handleUp = () => {
        setIsHoldingDown({
            up: true,
            down: false,
        });
        onChange(value + 1);
    };

    const handleDown = () => {
        setIsHoldingDown({
            up: false,
            down: true,
        });
        onChange(value - 1);
    };

    return (
        <UpDownButton
            horizontal={horizontal}
            onUp={handleUp}
            onDown={handleDown}
            upDisabled={value >= max}
            downDisabled={value <= min}
        />
    );
}

type UpDownButtonProps = {
    onUp: () => void;
    onDown: () => void;
    upDisabled?: boolean;
    downDisabled?: boolean;
    horizontal?: boolean;
};

export function UpDownButton({
    horizontal,
    onDown,
    onUp,
    upDisabled,
    downDisabled,
}: UpDownButtonProps) {
    const styles = useStyles();

    const handleUp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onUp();
    };

    const handleDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onDown();
    };

    return (
        <div
            className={cn(
                "flex flex-col gap-1",
                horizontal && "rotate-90 mx-1"
            )}
        >
            <button
                disabled={upDisabled}
                onMouseDown={handleUp}
                style={styles.arrowUp}
            ></button>
            <button
                disabled={downDisabled}
                onMouseDown={handleDown}
                style={styles.arrowDown}
            ></button>
        </div>
    );
}
