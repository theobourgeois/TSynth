import { Theme, useTheme } from "../../utils/theme-utils";

// might add more status in the future...
function getIndicatorColor(status: "on" | "off", theme: Theme) {
    switch (status) {
        case "on":
            return theme.lightOn;
        case "off":
            return theme.lightOff;
    }
}

type IndicatorProps = {
    status: "on" | "off";
};

export function Indicator({ status }: IndicatorProps) {
    const theme = useTheme();
    const color = getIndicatorColor(status, theme);
    return (
        <div
            className="h-4 w-4 rounded-full"
            style={{
                backgroundColor: color,
                boxShadow:
                    status === "off"
                        ? "inset -1px 0px 10px 5px rgba(0, 0, 0, 0.95)"
                        : `0 0 10px 0 ${color}, inset 0 -3px 9px 0 rgba(0, 0, 0, 0.3)`,
            }}
        ></div>
    );
}
