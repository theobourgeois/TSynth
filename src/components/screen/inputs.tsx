import { useState } from "react";
import { createStyles } from "../../utils/theme-utils";
import { cn } from "../../utils/style-utils";
import ClickAwayListener from "react-click-away-listener";
import { UpDownButton, UpDownInput } from "./up-down-button";

const useStyles = createStyles((theme, isSelectedValue, isHovering) => ({
    select: {
        backgroundColor: theme.screenPrimary,
        color: theme.screenSecondary,
        padding: "0.2rem 0.5rem",
        cursor: "pointer",
        borderRadius: "0.2rem",
        border: `2px solid ${theme.screenSecondary}`,
    },
    optionList: {
        width: "100%",
        height: "max-content",
        padding: "0.5rem",
        backgroundColor: theme.screenPrimary,
        borderRadius: "0.2rem",
        borderBottom: `2px solid ${theme.screenSecondary}`,
        borderLeft: `2px solid ${theme.screenSecondary}`,
        borderRight: `2px solid ${theme.screenSecondary}`,
    },
    option: {
        padding: "0.1rem 0.5rem",
        backgroundColor:
            isSelectedValue || isHovering
                ? theme.screenSecondary
                : theme.screenPrimary,
        color:
            isSelectedValue || isHovering
                ? theme.screenPrimary
                : theme.screenSecondary,
        cursor: "pointer",
    },
    label: {
        color: theme.screenSecondary,
        fontSize: "1rem",
    },
}));

type SelectProps = {
    value: string;
    onChange: (value: string) => void;
    options: {
        label: string;
        value: string;
    }[];
};

export function Select({ value, options, onChange }: SelectProps) {
    const styles = useStyles();
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (value: string) => {
        onChange(value);
    };

    const handleOpen = () => {
        setIsOpen(!isOpen);
    };

    const handleNext = () => {
        const currentIndex = options.findIndex(
            (option) => option.value === value
        );
        const nextIndex = (currentIndex + 1) % options.length;
        onChange(options[nextIndex].value);
    };

    const handlePrev = () => {
        const currentIndex = options.findIndex(
            (option) => option.value === value
        );
        const prevIndex = (currentIndex - 1 + options.length) % options.length;
        onChange(options[prevIndex].value);
    };

    const label = options.find((option) => option.value === value)?.label;

    return (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <div
                className="relative flex gap-2 justify-between"
                style={styles.select}
                onClick={handleOpen}
            >
                {label}
                <UpDownButton
                    onDown={handlePrev}
                    onUp={handleNext}
                    horizontal
                />
                <div
                    style={styles.optionList}
                    className={cn(
                        "absolute hidden left-0 top-[31px]",
                        isOpen && "block"
                    )}
                >
                    {options.map((option) => (
                        <Option
                            isSelectedValue={option.value === value}
                            key={option.value}
                            value={option.value}
                            label={option.label}
                            onChange={handleChange}
                        />
                    ))}
                </div>
            </div>
        </ClickAwayListener>
    );
}

type OptionProps = {
    value: string;
    label: string;
    onChange: (value: string) => void;
    isSelectedValue: boolean;
};

function Option({ label, value, onChange, isSelectedValue }: OptionProps) {
    // i hate that i have to do this
    const [isHovering, setIsHovering] = useState(false);
    const styles = useStyles(isSelectedValue, isHovering);

    const handleChange = () => {
        onChange(value);
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={styles.option}
            onClick={handleChange}
        >
            {label}
        </div>
    );
}

export function Label({ children }: { children: React.ReactNode }) {
    const styles = useStyles();
    return <p style={styles.label}>{children}</p>;
}
