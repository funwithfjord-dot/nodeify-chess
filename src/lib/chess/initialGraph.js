import { Chess } from 'chess.js'
import { createPositionNode } from './createPositionNode'

export function createInitialGraph() {
  const chess = new Chess()

  const startNode = createPositionNode({
    id: 'start',
    fen: chess.fen(),
    turn: chess.turn(),
    label: 'Starting Position',
    depth: 0,
  })

  return {
    rootNodeId: startNode.id,
    selectedNodeId: startNode.id,
    nodesById: {
      [startNode.id]: startNode,
    },
    connectionsById: {},
    expandedNodeIds: [],
  }
}