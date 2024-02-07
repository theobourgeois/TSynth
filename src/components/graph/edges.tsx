import { useTheme } from "../../utils/theme-utils";
import { Dimensions } from "../../utils/typings-utils";
import { snapTo } from "../../utils/utils-fns";
import { Edge, Node } from "../../utils/graph-utils";

const CONTROL_POINT_SIZE = 12;
const EDGE_WIDTH = 3;

// bound the curve values between the source and target nodes
function getBoundedCurveValues(
    sourceX: number,
    sourceY: number,
    targetX: number,
    targetY: number,
    unBoundCurveX: number,
    unBoundCurveY: number
) {
    const midX = sourceX + (targetX - sourceX) / 2;
    const midY = sourceY + (targetY - sourceY) / 2;

    const maxY = Math.max(sourceY, targetY);
    const minY = Math.min(sourceY, targetY);
    const maxX = Math.max(sourceX, targetX);
    const minX = Math.min(sourceX, targetX);

    let controlX = midX + unBoundCurveX;
    let controlY = midY + unBoundCurveY;

    let curveX = unBoundCurveX;
    let curveY = unBoundCurveY;

    if (controlX < minX) {
        curveX = minX - midX;
    }

    if (controlX > maxX) {
        curveX = maxX - midX;
    }

    if (controlY < minY) {
        curveY = minY - midY;
    }

    if (controlY > maxY) {
        curveY = maxY - midY;
    }

    // recalculate control points with bounded curve values
    controlX = midX + curveX;
    controlY = midY + curveY;

    return { curveX, curveY, controlX, controlY, minX, minY, maxX, maxY };
}

type EdgesProps = {
    edges: Edge[];
    nodes: Node[];
    gridSize: number;
    dimensions: Dimensions;
    onChange: (edge: Edge) => void;
    snapValue?: number;
    showNodes?: boolean;
};

export function Edges({
    edges,
    nodes,
    gridSize,
    dimensions,
    snapValue,
    onChange,
    showNodes,
}: EdgesProps) {
    return (
        <div>
            {edges.map((edge) => (
                <Edge
                    showNodes={showNodes}
                    key={edge.id}
                    snapValue={snapValue}
                    onChange={onChange}
                    edge={edge}
                    nodes={nodes}
                    gridSize={gridSize}
                    dimensions={dimensions}
                />
            ))}
        </div>
    );
}

type EdgeProps = {
    edge: Edge;
    nodes: Node[];
    gridSize: number;
    dimensions: Dimensions;
    onChange: (edge: Edge) => void;
    snapValue?: number;
    showNodes?: boolean;
};

// component that handles rendering an edge
function Edge({
    edge,
    nodes,
    gridSize,
    dimensions,
    onChange,
    showNodes,
    snapValue,
}: EdgeProps) {
    const theme = useTheme();
    const { width, height, left, top } = dimensions;

    const nodeLeft = (node: Node) => (width / gridSize) * node.x;
    const nodeTop = (node: Node) => (height / gridSize) * node.y;

    const sourceNode = nodes.find((node) => node.id === edge.source);
    const targetNode = nodes.find((node) => node.id === edge.target);

    if (!sourceNode || !targetNode) {
        return null;
    }

    // source and target node positions
    const sourceX = nodeLeft(sourceNode);
    const sourceY = nodeTop(sourceNode);
    const targetX = nodeLeft(targetNode);
    const targetY = nodeTop(targetNode);

    // curve relative to the grid
    const unBoundCurveY = edge.curveY * (height / gridSize);
    const unBoundCurveX = edge.curveX * (width / gridSize);

    const { controlX, controlY, minX, maxX, minY, maxY } =
        getBoundedCurveValues(
            sourceX,
            sourceY,
            targetX,
            targetY,
            unBoundCurveX,
            unBoundCurveY
        );

    const path = `M ${sourceX} ${sourceY} C ${controlX} ${controlY} ${controlX} ${controlY} ${targetX} ${targetY}`;

    // change the curve value when dragging the control point
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
            const x = e.clientX - left - minX;
            const y = e.clientY - top - minY;

            const scaleFactorX = width / gridSize;
            const scaleFactorY = height / gridSize;

            const midpointX = (maxX - minX) / scaleFactorX / 2;
            const midpointY = (maxY - minY) / scaleFactorY / 2;

            const unBoundCurveX = x / scaleFactorX - midpointX;
            const unBoundCurveY = y / scaleFactorY - midpointY;

            let { curveX, curveY } = getBoundedCurveValues(
                sourceX,
                sourceY,
                targetX,
                targetY,
                unBoundCurveX,
                unBoundCurveY
            );
            if (snapValue) {
                curveX = snapTo(curveX, snapValue);
                curveY = snapTo(curveY, snapValue);
            }

            onChange({ ...edge, curveX, curveY });
        };
        handleMouseMove(e);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", () => {
            window.removeEventListener("mousemove", handleMouseMove);
        });
    };

    const handleResetCurve = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onChange({ ...edge, curveX: 0, curveY: 0 });
    };

    const mockViewBox = `0 0 ${width} ${height}`;

    return (
        <>
            {showNodes && (
                <div
                    className="absolute z-20 bg-black rounded-full cursor-pointer"
                    onMouseDown={handleMouseDown}
                    onContextMenu={handleResetCurve}
                    style={{
                        width: CONTROL_POINT_SIZE,
                        height: CONTROL_POINT_SIZE,
                        left: controlX - CONTROL_POINT_SIZE / 2,
                        top: controlY - CONTROL_POINT_SIZE / 2,
                        backgroundColor: theme.graph.edge.circle,
                    }}
                ></div>
            )}
            <svg className="absolute" viewBox={mockViewBox}>
                <path
                    d={path}
                    fill="none"
                    stroke={theme.graph.edge.line}
                    strokeWidth={EDGE_WIDTH}
                />
            </svg>
        </>
    );
}
