import { GraphData, getOrderedNodes } from "../../utils/graph-utils";
import { Envelope, useSynth } from "../../utils/synth-utils";
import { Graph } from "../graph/graph";

const ENVELOPE_GRID_SIZE = { x: 4, y: 8 };

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
        curveY: (1 - envelope.decay.curveY) * gridSize.y,
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

const getEnvelopeFromGraphData = (
    data: GraphData,
    gridSize = ENVELOPE_GRID_SIZE
) => {
    const orderedNodes = getOrderedNodes(data.nodes, data.edges);

    const attackNode = orderedNodes[1];
    const holdNode = orderedNodes[2];
    const decayNode = orderedNodes[3];
    const releaseNode = orderedNodes[4];

    const startToAttackEdge = data.edges.find(
        (edge) => edge.source === 1 && edge.target === attackNode.id
    );
    const holdToDecayEdge = data.edges.find(
        (edge) => edge.source === holdNode.id && edge.target === decayNode.id
    );
    const decayToReleaseEdge = data.edges.find(
        (edge) => edge.source === decayNode.id && edge.target === releaseNode.id
    );

    if (!holdToDecayEdge || !decayToReleaseEdge || !startToAttackEdge) {
        return;
    }

    const attackX = attackNode.x;
    const holdX = holdNode.x - attackX;
    const decayX = decayNode.x - holdNode.x;
    const decayY = decayNode.y;
    const releaseX = releaseNode.x - decayNode.x;

    const attack = {
        x: attackX / gridSize.x,
        y: 0,
        curveX: startToAttackEdge.curveX / gridSize.x,
        curveY: startToAttackEdge.curveY / gridSize.y,
    };

    const hold = {
        x: holdX / gridSize.x,
        y: 0,
        curveX: 0,
        curveY: 0,
    };

    const decay = {
        x: decayX / gridSize.x,
        y: 1 - decayY / gridSize.y,
        curveX: holdToDecayEdge.curveX / gridSize.x,
        curveY: holdToDecayEdge.curveY / gridSize.y,
    };

    const release = {
        x: releaseX / gridSize.x,
        y: 0,
        curveX: decayToReleaseEdge.curveX / gridSize.x,
        curveY: decayToReleaseEdge.curveY / gridSize.y,
    };

    return {
        attack,
        hold,
        decay,
        release,
    };
};

export function EnvelopeGraph() {
    const { envelope, setEnvelope } = useSynth();

    const handleChangeGraphData = (data: GraphData) => {
        const envelope = getEnvelopeFromGraphData(data);
        if (!envelope) {
            return;
        }
        setEnvelope(envelope);
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
