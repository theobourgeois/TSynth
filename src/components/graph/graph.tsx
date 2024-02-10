import { useEffect, useRef, useState } from "react";
import { createStyles } from "../../utils/theme-utils";
import { Grid } from "./grid";
import { Dimensions } from "../../utils/typings-utils";
import { Nodes } from "./nodes";
import { Edges } from "./edges";
import { getNewID, snapTo } from "../../utils/utils-fns";
import {
    Edge,
    GraphData,
    Node,
    getNeighboursFromNodes,
} from "../../utils/graph-utils";
import { useContainerDimensions } from "../../utils/custom-hooks";

type GraphProps = {
    showGrid?: boolean;
    showNodes?: boolean;
    snapValue?: number;
    data: GraphData;
    gridSize?: number;
    canAddNodes?: boolean;
    onChange?: (data: GraphData) => void;
};

const useStyles = createStyles((theme) => ({
    graph: {
        backgroundColor: theme.graph.bg,
    },
}));

export function Graph({
    showGrid = false,
    showNodes = false,
    gridSize = 8,
    data,
    canAddNodes = false,
    onChange,
    snapValue,
}: GraphProps) {
    const styles = useStyles();
    const graphRef = useRef<HTMLDivElement>(null);
    const dimensions = useContainerDimensions(graphRef);

    const handleChangeEdge = (edge: Edge) => {
        if (!onChange) {
            return;
        }
        const newEdges = data?.edges.map((e) => (e.id === edge.id ? edge : e));
        if (newEdges) {
            onChange({ ...data, edges: newEdges });
        }
    };

    const handleChangeNode = (node: Node) => {
        if (!onChange) {
            return;
        }
        const newNodes = data?.nodes.map((n) => (n.id === node.id ? node : n));
        if (newNodes) {
            onChange({ ...data, nodes: newNodes });
        }
    };

    const handleAddNode = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!canAddNodes || !onChange) {
            return;
        }
        const x = (e.clientX - dimensions.left) / (dimensions.width / gridSize);
        const y = (e.clientY - dimensions.top) / (dimensions.height / gridSize);

        const newNode: Node = {
            id: getNewID(),
            x: snapValue ? snapTo(x, snapValue) : x,
            y: snapValue ? snapTo(y, snapValue) : y,
        };

        const { closestLeftNode, closestRightNode } = getNeighboursFromNodes(
            newNode,
            data.nodes,
            data.edges
        );

        const newEdges = [...data.edges];

        // If there is a closest left node, create an edge from that node to the new node
        // then remove the old edge
        if (closestLeftNode) {
            newEdges.push({
                id: getNewID(),
                source: closestLeftNode.id,
                target: newNode.id,
                curveX: 0,
                curveY: 0,
            });
            const oldEdgeIndex = newEdges.findIndex(
                (edge) =>
                    edge.source === closestLeftNode?.id &&
                    edge.target === closestRightNode?.id
            );
            if (oldEdgeIndex !== -1) {
                newEdges.splice(oldEdgeIndex, 1);
            }
        }

        // If there is a closest right node, create an edge from the new node to that node
        if (closestRightNode) {
            const edge = data.edges.find(
                (edge) => edge.target === closestRightNode.id
            );
            newEdges.push({
                id: getNewID(),
                source: newNode.id,
                target: closestRightNode.id,
                curveX: edge?.curveX ?? 0,
                curveY: edge?.curveY ?? 0,
            });
            const oldEdgeIndex = newEdges.findIndex(
                (edge) =>
                    edge.source === closestLeftNode?.id &&
                    edge.target === closestRightNode?.id
            );
            if (oldEdgeIndex !== -1) {
                newEdges.splice(oldEdgeIndex, 1);
            }
        }

        // Update the graph with the new node and new edges
        onChange({
            ...data,
            nodes: [...data.nodes, newNode],
            edges: newEdges,
        });
    };

    const handleDeleteNode = (nodeId: Node["id"]) => {
        if (!onChange) {
            return;
        }
        const newNodes = data.nodes.filter((n) => n.id !== nodeId);
        const newEdges = data.edges?.filter(
            (edge) => edge.source !== nodeId && edge.target !== nodeId
        );

        const { closestLeftNode, closestRightNode } = getNeighboursFromNodes(
            data.nodes.find((n) => n.id === nodeId) as Node,
            data.nodes,
            data.edges
        );

        // reassign edges to closest nodes
        for (let i = 0; i < data.edges.length; i++) {
            const edge = data.edges[i];
            if (edge.source === nodeId) {
                newEdges.push({
                    id: getNewID(),
                    source: closestLeftNode?.id ?? edge.source,
                    target: edge.target,
                    curveX: 0,
                    curveY: 0,
                });
                break;
            }
            if (edge.target === nodeId) {
                newEdges.push({
                    id: getNewID(),
                    source: edge.source,
                    target: closestRightNode?.id ?? edge.target,
                    curveX: 0,
                    curveY: 0,
                });
                break;
            }
        }

        onChange({ nodes: newNodes, edges: newEdges });
    };

    return (
        <div ref={graphRef} style={styles.graph} className="w-full h-full">
            <div
                className="relative w-full h-full"
                onDoubleClick={handleAddNode}
            >
                <Grid
                    dimensions={dimensions}
                    showGrid={showGrid}
                    gridSizeX={gridSize}
                    gridSizeY={gridSize}
                />
                <Nodes
                    showNodes={showNodes}
                    onChange={handleChangeNode}
                    onDelete={handleDeleteNode}
                    dimensions={dimensions}
                    nodes={data?.nodes ?? []}
                    edges={data?.edges ?? []}
                    gridSize={gridSize}
                    snapValue={snapValue}
                />
                <Edges
                    showNodes={showNodes}
                    snapValue={snapValue}
                    onChange={handleChangeEdge}
                    dimensions={dimensions}
                    edges={data?.edges ?? []}
                    gridSize={gridSize}
                    nodes={data?.nodes ?? []}
                />
            </div>
        </div>
    );
}
