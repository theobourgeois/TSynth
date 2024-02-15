import { useState } from "react";
import { GraphData } from "../../utils/graph-utils";
import { Envelope, useSynth } from "../../utils/synth-utils";
import { Graph } from "../graph/graph";

const ENVELOPE_GRID_SIZE = { x: 4, y: 8 };

const DEFAULT_ENVELOPE_GRAPH_DATA: GraphData = {
    nodes: [
        // attack
        {
            id: 1,
            x: 0,
            y: 8,
            anchorX: true,
            anchorY: true,
        },
        // decay
        {
            id: 2,
            x: 0.5,
            y: 0,
            anchorY: true,
        },
        // release
        {
            id: 3,
            x: 2,
            y: 0,
        },
        // end
        {
            id: 4,
            x: 4,
            y: 8,
            anchorY: true,
        },
    ],
    edges: [
        // attack -> decay
        {
            id: 1,
            source: 1,
            target: 2,
            curveX: 0,
            curveY: 0,
        },
        // decay -> sustain
        {
            id: 2,
            source: 2,
            target: 3,
            curveX: 0,
            curveY: 0,
        },
        // release -> end
        {
            id: 4,
            source: 3,
            target: 4,
            curveX: 0,
            curveY: 0,
        },
    ],
};

const getEnvelopeFromGraphData = (
    data: GraphData,
    gridSize = ENVELOPE_GRID_SIZE
) => {};

const getGraphDataFromEnvelope = (
    envelope: Envelope,
    gridSize = ENVELOPE_GRID_SIZE
) => {
    const nodes = [];
    const edges = [];

    const holdX = envelope.attack.x + envelope.hold.x;
    const decayX = holdX + envelope.decay.x;
    const releaseX = decayX + envelope.release.x;

    const startNode = {
        id: 1,
        x: 0,
        y: gridSize.y,
        anchorX: true,
        anchorY: true,
    };

    const attackNode = {
        id: 2,
        x: envelope.attack.x * gridSize.x,
        y: 0,
        anchorY: true,
    };

    const holdNode = {
        id: 3,
        x: holdX * gridSize.x,
        y: 0,
        anchorY: true,
    };

    const decayNode = {
        id: 4,
        x: decayX * gridSize.x,
        y: envelope.decay.y * gridSize.y,
        anchorY: true,
    };

    const releaseNode = {
        id: 5,
        x: releaseX * gridSize.x,
        y: gridSize.y,
        anchorY: true,
    };

    nodes.push(startNode, attackNode, holdNode, decayNode, releaseNode);

    const startToAttackEdge = {
        id: 1,
        source: 1,
        target: 2,
        curveX: envelope.attack.curveX * gridSize.x,
        curveY: envelope.attack.curveY * gridSize.y,
    };

    const attackToHoldEdge = {
        id: 2,
        source: 2,
        target: 3,
        curveX: 0,
        curveY: 0,
    };

    const holdToDecayEdge = {
        id: 3,
        source: 3,
        target: 4,
        curveX: envelope.decay.curveX * gridSize.x,
        curveY: envelope.decay.curveY * gridSize.y,
    };

    const decayToReleaseEdge = {
        id: 4,
        source: 4,
        target: 5,
        curveX: envelope.release.curveX * gridSize.x,
        curveY: envelope.release.curveY * gridSize.y,
    };

    edges.push(
        startToAttackEdge,
        attackToHoldEdge,
        holdToDecayEdge,
        decayToReleaseEdge
    );

    return { nodes, edges };
};

export function EnvelopeGraph() {
    const { envelope, setEnvelope } = useSynth();
    const [envelopeGraphData, setEnvelopeGraphData] = useState<GraphData>(
        DEFAULT_ENVELOPE_GRAPH_DATA
    );

    const handleChangeGraphData = (data: GraphData) => {
        setEnvelopeGraphData(data);
    };

    const graphData = getGraphDataFromEnvelope(envelope);

    return (
        <Graph
            data={graphData}
            showGrid
            showNodes
            gridSizeX={ENVELOPE_GRID_SIZE.x}
            gridSizeY={ENVELOPE_GRID_SIZE.y}
            onChange={handleChangeGraphData}
        />
    );
}
