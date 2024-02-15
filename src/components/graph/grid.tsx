import { createStyles } from "../../utils/theme-utils";
import { Dimensions } from "../../utils/typings-utils";

const useStyles = createStyles((theme) => ({
    lines: {
        backgroundColor: theme.screenGrid,
    },
}));

type GridProps = {
    gridSizeX: number;
    gridSizeY: number;
    showGrid?: boolean;
    dimensions: Dimensions;
};

export function Grid({
    gridSizeX,
    gridSizeY,
    showGrid = true,
    dimensions,
}: GridProps) {
    const styles = useStyles();
    const { width, height } = dimensions;

    if (!showGrid) {
        return null;
    }

    return (
        <>
            {Array.from({ length: gridSizeX + 1 }, (_, i) => (
                <div
                    className="w-[1px] h-full bg-black absolute"
                    style={{
                        ...styles.lines,
                        left: (width / gridSizeX) * i + "px",
                    }}
                    key={i}
                />
            ))}
            {Array.from({ length: gridSizeY + 1 }, (_, i) => (
                <div
                    className="h-[1px] w-full bg-black absolute"
                    style={{
                        ...styles.lines,
                        top: (height / gridSizeY) * i + "px",
                    }}
                    key={i}
                />
            ))}
        </>
    );
}
