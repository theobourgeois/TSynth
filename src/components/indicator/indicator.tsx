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
                        ? "inset 0 -1px 3px 0 rgba(0, 0, 0, 0.5), 0px 0px 2px 0 rgba(0, 0, 0, 0.5)"
                        : `0 0 10px 0 ${color}`,
            }}
        ></div>
    );
}
