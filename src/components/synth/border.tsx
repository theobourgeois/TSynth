import { cn } from "../../utils/style-utils";
import { createStyles } from "../../utils/theme-utils";
import { IndicatorButton } from "../indicator/indicator-button";

const useStyles = createStyles((theme) => ({
    border: {
        padding: "15px",
        backgroundColor: theme.tvBorder,
        borderRadius: "9px",
        boxShadow:
            "inset 0px 2px 2px -4px #000, inset 0px -4px 4px 0px rgba(0, 0, 0, 0.25)",
    },
    text: {
        color: theme.text,
        fontSize: "1.4rem",
    },
    body: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: theme.background,
        padding: "8px 15px",
        boxShadow: "0px -4px 4px 0px rgba(0, 0, 0, 0.2)",
    },
}));

type OptionWrapperProps = {
    children: React.ReactNode;
    title: string;
    enabled?: boolean;
    className?: string;
    onEnabledChange?: (enabled: boolean) => void;
};

export function OptionWrapper({
    children,
    className,
    title,
    enabled,
    onEnabledChange,
}: OptionWrapperProps) {
    const styles = useStyles();

    return (
        <div className={cn("select-none", className)} style={styles.border}>
            <div style={styles.body}>
                <div className={cn("flex gap-4 items-center", title && "pb-6")}>
                    <h2 style={styles.text}>{title}</h2>
                    {enabled !== undefined && onEnabledChange && (
                        <IndicatorButton
                            status={enabled ? "on" : "off"}
                            onChange={onEnabledChange}
                        />
                    )}
                </div>
                {children}
            </div>
        </div>
    );
}
