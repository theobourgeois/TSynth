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

type UpDownButtonProps = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    horizontal?: boolean;
};

export function UpDownButton({
    value,
    min = 0,
    max = 64,
    onChange,
    horizontal = false,
}: UpDownButtonProps) {
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
        <div
            className={cn(
                "flex flex-col gap-1",
                horizontal && "rotate-90 mx-1"
            )}
        >
            <button
                disabled={value >= max}
                onMouseDown={handleUp}
                style={styles.arrowUp}
            ></button>
            <button
                disabled={value <= min}
                onMouseDown={handleDown}
                style={styles.arrowDown}
            ></button>
        </div>
    );
}
