import { useState } from "react";
import { createStyles, useTheme } from "../../utils/theme-utils";
import { snapTo } from "../../utils/utils-fns";

const KNOB_SIZE = 50;

const useStyles = (isMaster: boolean) =>
    createStyles((theme) => ({
        background: {
            backgroundColor: theme.knob.bg,
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            padding: "5px",
            zIndex: 2,
            borderRadius: "50%",
            boxShadow:
                "inset 0 -2px 3px 0 rgba(0, 0, 0, 0.4), 0 10px 10px 0 rgba(0, 0, 0, 0.5)",
        },
        foreground: {
            backgroundColor: isMaster ? theme.knob.master : theme.knob.color,
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            position: "relative",
        },
        notch: {
            backgroundColor: theme.knob.bg,
            width: 6,
            height: 14,
            position: "absolute",
            left: "42%",
            top: 0,
        },
        indicator: {
            zIndex: 1,
            transform: "rotate(61deg)",
            position: "absolute",
            left: -25,
            top: -24.5,
        },
    }));

export type KnobProps = {
    value: number;
    onChange: (value: number) => void;
    indicatorText?: (value: number) => string | number;
    isMaster?: boolean; // used to change the color of the knob
};

const MAX = 1;
const MIN = 0;
const STEP = 0.01;

export function Knob({
    value,
    onChange,
    indicatorText,
    isMaster = false,
}: KnobProps) {
    const styles = useStyles(isMaster)();
    const theme = useTheme();
    const [isShowingValuePopup, setIsShowingValuePopup] = useState(false);

    const getRotation = () => {
        const ratio = value / MAX;
        const rotation = 135 * 2 * ratio - 135;
        return `rotate(${rotation}deg)`;
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsShowingValuePopup(true);
        const startY = e.clientY; // Record the starting Y position

        const handleMouseMove = (e: MouseEvent) => {
            const sensitivity = 0.5; // Adjust this factor to control sensitivity
            const movementY = -1 * (e.clientY - startY);
            const newValue = value + movementY * STEP * sensitivity;
            const clampedValue = snapTo(
                Math.max(MIN, Math.min(MAX, newValue)),
                STEP,
                "floor"
            );

            if (clampedValue !== value) {
                onChange(clampedValue);
            }
        };

        const handleMouseUp = () => {
            setIsShowingValuePopup(false);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div
            className="relative"
            style={{
                width: KNOB_SIZE,
                height: KNOB_SIZE,
            }}
        >
            <KnobPopup
                value={value}
                indicatorText={indicatorText ?? ((value) => value.toFixed(2))}
                isShowing={isShowingValuePopup}
            />
            <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                style={styles.indicator}
            >
                <circle
                    cx="50"
                    cy="50"
                    r="30"
                    fill="none"
                    stroke={theme.knob.indicator}
                    strokeWidth="4"
                    strokeDasharray={`15 4`} // Length of the dashes
                    style={{ borderStyle: "dashed" }}
                />
            </svg>
            <div
                className="absolute flex items-center justify-center"
                onMouseDown={handleMouseDown}
                style={styles.background}
            >
                <div
                    style={{
                        ...styles.foreground,
                        transform: getRotation(),
                    }}
                >
                    <div style={styles.notch}></div>
                </div>
            </div>
        </div>
    );
}

type KnobPopupProps = {
    value: number;
    indicatorText: (value: number) => string | number;
    isShowing: boolean;
};

function KnobPopup({ value, isShowing, indicatorText }: KnobPopupProps) {
    const theme = useTheme();
    if (!isShowing) {
        return null;
    }

    return (
        <div
            className="absolute z-20 left-1/2 -translate-x-1/2"
            style={{
                top: -30,
                width: "max-content",
                backgroundColor: `${theme.tvShadow}80`,
                color: theme.text,
                padding: "2px 4px",
                borderRadius: 4,
                fontSize: 12,
            }}
        >
            {indicatorText(value)}
        </div>
    );
}
