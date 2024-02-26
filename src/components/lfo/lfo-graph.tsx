import { useState } from "react";
import { GraphData } from "../../utils/graph-utils";
import { LFO, LFOData, useSynth } from "../../utils/synth-utils";
import { Graph } from "../graph/graph";

type GridSize = {
    x: number;
    y: number;
};

function getGraphDataFromLFO(lfo: LFO, gridSize: GridSize): GraphData {
    const nodes = lfo.LFOData.nodes.map((node) => {
        return {
            ...node,
            x: node.x * gridSize.x,
            y: node.y * gridSize.y,
        };
    });

    const edges = lfo.LFOData.edges.map((edge) => {
        return {
            ...edge,
            curveX: edge.curveX * gridSize.x,
            curveY: edge.curveY * gridSize.y,
        };
    });

    return {
        nodes,
        edges,
    };
}

function getLFOFromGraphData(data: GraphData, gridSize: GridSize): LFOData {
    const nodes = data.nodes.map((node) => {
        return {
            ...node,
            x: node.x / gridSize.x,
            y: node.y / gridSize.y,
        };
    });

    const edges = data.edges.map((edge) => {
        return {
            ...edge,
            curveX: edge.curveX / gridSize.x,
            curveY: edge.curveY / gridSize.y,
        };
    });

    return {
        nodes,
        edges,
    };
}

export function LFOGraph() {
    const { LFO, setLFO } = useSynth();
    const [gridSize, setGridSize] = useState({ x: 8, y: 8 });

    const handleChangeGraphData = (data: GraphData) => {
        const LFOData = getLFOFromGraphData(data, gridSize);
        if (!LFOData) {
            return;
        }
        setLFO({
            ...LFO,
            LFOData,
        });
    };

    const graphData = getGraphDataFromLFO(LFO, gridSize);

    return (
        <Graph
            data={graphData}
            showGrid
            showNodes
            canAddNodes
            snapValue={1}
            gridSizeX={gridSize.x}
            gridSizeY={gridSize.y}
            onChange={handleChangeGraphData}
        />
    );
}
