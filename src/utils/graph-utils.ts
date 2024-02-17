export type Node = {
  id: number;
  anchorX?: boolean;
  anchorY?: boolean;
  x: number;
  y: number;
};

export type Edge = {
  id: number;
  curveX: number;
  curveY: number;
  source: Node["id"];
  target: Node["id"];
};

export type GraphData = {
  nodes: Node[];
  edges: Edge[];
};

/**
 * get ordered list of nodes based on the edges 
 * @param nodes list of nodes
 * @param edges list of edges
 * @returns ordered list of nodes based on the edges
 */
export function getOrderedNodes(nodes: Node[], edges: Edge[]) {
  const orderedNodes: Node[] = [];

  // find the leftmost node
  // the leftmost node is not the target of any edge
  const sortedByX = nodes.sort((a, b) => a.x - b.x);
  const leftmostNode = sortedByX.find((n) => {
    return !edges.some((e) => e.target === n.id);
  })

  if (!leftmostNode) {
    return [];
  }

  // go through each edge, adding the target node to the list 
  orderedNodes.push(leftmostNode);
  let nextNode = leftmostNode;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const edge = edges.find((e) => e.source === nextNode.id);
    if (!edge) {
      break;
    }
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!targetNode) {
      break;
    }
    orderedNodes.push(targetNode);
    nextNode = targetNode;
  }


  return orderedNodes;

}


/**
 * get left and right neighbours of a node 
 * @param node node to get neighbours for. if this node is not in the list of nodes, we will find the closest left and right nodes that are connected
 * @param nodes list of nodes
 * @param edges list of edges
 * @returns 
 */
export function getNeighboursFromNodes(
  node: Node,
  nodes: Node[],
  edges: Edge[]
) {
  const orderedNodes = getOrderedNodes(nodes, edges);

  const nodeIndex = orderedNodes.findIndex((n) => n.id === node.id);

  if (nodeIndex !== -1) {
    return {
      closestLeftNode: orderedNodes[nodeIndex - 1],
      closestRightNode: orderedNodes[nodeIndex + 1],
    };
  }

  // this when the node you pass in is not in the list of nodes
  let closestLeftNode: Node | undefined;
  let closestRightNode: Node | undefined;
  nodes.forEach((n) => {
    if (n.x < node.x) {
      if (!closestLeftNode || n.x > closestLeftNode.x) {
        closestLeftNode = n;
      }
    }
    if (n.x > node.x) {
      if (!closestRightNode || n.x < closestRightNode.x) {
        closestRightNode = n;
      }
    }
  });

  // if the left node we find does not connect to the right node, we go to the next node and do the same check 
  let edge = edges.find((edge) => edge.source === closestLeftNode?.id);

  while (edge && edge?.target !== closestRightNode?.id) {
    // keep looking 
    edge = edges.find((e) => e.source === edge?.target);
  }
  closestLeftNode = nodes.find((node) => node.id === edge?.source);
  closestRightNode = nodes.find((node) => node.id === edge?.target);

  return { closestLeftNode, closestRightNode };
}
