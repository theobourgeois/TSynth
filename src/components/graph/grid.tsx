import { createStyles } from "../../utils/theme-utils";
import { Dimensions } from "../../utils/typings-utils";

const useStyles = createStyles((theme) => ({
    lines: {
        backgroundColor: theme.graph.lines,
    },
}));

type GridProps = {
    gridSize: number;
    showGrid: boolean;
    dimensions: Dimensions;
};

export function Grid({ gridSize, showGrid, dimensions }: GridProps) {
    const styles = useStyles();
    const { width, height } = dimensions;

    if (!showGrid) {
        return null;
    }

    return (
        <>
            {Array.from({ length: gridSize }, (_, i) => (
                <div
                    className="w-[1px] h-full bg-black absolute"
                    style={{
                        ...styles.lines,
                        left: (width / gridSize) * i + "px",
                    }}
                    key={i}
                />
            ))}
            {Array.from({ length: gridSize }, (_, i) => (
                <div
                    className="h-[1px] w-full bg-black absolute"
                    style={{
                        ...styles.lines,
                        top: (height / gridSize) * i + "px",
                    }}
                    key={i}
                />
            ))}
        </>
    );
}
