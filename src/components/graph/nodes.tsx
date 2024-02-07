import { getNeighboursFromNodes } from "../../utils/graph-utils";
import { createStyles } from "../../utils/theme-utils";
import { Dimensions } from "../../utils/typings-utils";
import { snapTo } from "../../utils/utils-fns";
import { Edge, Node } from "../../utils/graph-utils";

const NODE_SIZE = 16;

const useStyles = createStyles((theme) => ({
    node: {
        backgroundColor: theme.graph.node.bg,
        borderColor: theme.graph.node.border,
        width: NODE_SIZE,
        height: NODE_SIZE,
    },
}));

type NodesProps = {
    nodes: Node[];
    edges: Edge[];
    gridSize: number;
    dimensions: Dimensions;
    onChange: (node: Node) => void;
    onDelete: (nodeId: Node["id"]) => void;
    snapValue?: number;
    showNodes?: boolean;
};

export function Nodes({
    showNodes,
    nodes,
    edges,
    gridSize,
    dimensions,
    onChange,
    snapValue,
    onDelete,
}: NodesProps) {
    const styles = useStyles();
    const { width, height, left, top } = dimensions;

    if (!showNodes) return null;

    const nodeLeft = (node: Node) =>
        (width / gridSize) * node.x - NODE_SIZE / 2;
    const nodeTop = (node: Node) =>
        (height / gridSize) * node.y - NODE_SIZE / 2;

    const handleMouseDown =
        (node: Node) => (e: React.MouseEvent<HTMLDivElement>) => {
            if (node.anchor) return;
            const { closestLeftNode, closestRightNode } =
                getNeighboursFromNodes(node, nodes, edges);

            const lowerBound = closestLeftNode?.x ?? 0;
            const upperBound = closestRightNode?.x ?? gridSize;
            const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
                let x = (e.clientX - left) / (width / gridSize);
                let y = (e.clientY - top) / (height / gridSize);

                if (x < lowerBound) {
                    x = lowerBound;
                }

                if (x > upperBound) {
                    x = upperBound;
                }

                if (x < 0) {
                    x = 0;
                }
                if (y < 0) {
                    y = 0;
                }
                if (x > gridSize) {
                    x = gridSize;
                }
                if (y > gridSize) {
                    y = gridSize;
                }

                if (snapValue) {
                    x = snapTo(x, snapValue);
                    y = snapTo(y, snapValue);
                }

                onChange({ ...node, x, y });
            };
            handleMouseMove(e);

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", () => {
                window.removeEventListener("mousemove", handleMouseMove);
            });
        };

    const handleDeleteNode = (node: Node) => (e: React.MouseEvent) => {
        if (node.anchor) return;
        e.stopPropagation();
        e.preventDefault();
        onDelete(node.id);
    };

    return (
        <>
            {nodes.map((node) => (
                <div
                    key={node.id}
                    onDoubleClick={handleDeleteNode(node)}
                    className="absolute rounded-full border-2 z-30 cursor-pointer"
                    onMouseDown={handleMouseDown(node)}
                    style={{
                        ...styles.node,
                        left: nodeLeft(node),
                        top: nodeTop(node),
                    }}
                ></div>
            ))}{" "}
        </>
    );
}
