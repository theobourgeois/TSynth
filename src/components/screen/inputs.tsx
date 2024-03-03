import { useState } from "react";
import { createStyles } from "../../utils/theme-utils";
import { cn } from "../../utils/style-utils";
import ClickAwayListener from "react-click-away-listener";

const useStyles = createStyles((theme, isSelectedValue) => ({
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
        backgroundColor: isSelectedValue
            ? theme.screenSecondary
            : theme.screenPrimary,
        color: isSelectedValue ? theme.screenPrimary : theme.screenSecondary,
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

    const label = options.find((option) => option.value === value)?.label;

    return (
        <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <div
                className="relative flex gap-2 justify-between"
                style={styles.select}
                onClick={handleOpen}
            >
                {label}
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
    const styles = useStyles(isSelectedValue);
    const handleChange = () => {
        onChange(value);
    };
    return (
        <div style={styles.option} onClick={handleChange}>
            {label}
        </div>
    );
}

export function Label({ children }: { children: React.ReactNode }) {
    const styles = useStyles();
    return <p style={styles.label}>{children}</p>;
}
