import { useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import './App.css'
import { createInitialGraph } from './lib/chess/initialGraph'

function App() {
  const [graph, setGraph] = useState(() => createInitialGraph())

  const selectedNode = graph.nodesById[graph.selectedNodeId]

  function handlePieceDrop(sourceSquare, targetSquare) {
    let moveWasLegal = false

    setGraph((currentGraph) => {
      const currentSelected = currentGraph.nodesById[currentGraph.selectedNodeId]
      const chess = new Chess(currentSelected.fen)

      const move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })

      if (!move) {
        return currentGraph
      }

      moveWasLegal = true

      const newFen = chess.fen()
      const newNodeId = newFen
      const existingNode = currentGraph.nodesById[newNodeId]

      const nextNode =
        existingNode ||
        {
          id: newNodeId,
          fen: newFen,
          turn: chess.turn(),
          label: `After ${move.san}`,
          depth: currentSelected.depth + 1,
          parentIds: [currentSelected.id],
          childIds: [],
          tags: [],
          notes: '',
          createdFromMove: move.san,
        }

      const connectionId = `${currentSelected.id}-${move.san}-${newNodeId}`

      return {
        ...currentGraph,
        selectedNodeId: newNodeId,
        nodesById: {
          ...currentGraph.nodesById,
          [currentSelected.id]: {
            ...currentSelected,
            childIds: currentSelected.childIds.includes(newNodeId)
              ? currentSelected.childIds
              : [...currentSelected.childIds, newNodeId],
          },
          [newNodeId]: existingNode || nextNode,
        },
        connectionsById: {
          ...currentGraph.connectionsById,
          [connectionId]: {
            id: connectionId,
            fromNodeId: currentSelected.id,
            toNodeId: newNodeId,
            san: move.san,
            lan: `${move.from}${move.to}`,
            color: move.color,
            ply: currentSelected.depth + 1,
          },
        },
      }
    })

    return moveWasLegal
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Nodeify Chess</h1>
        <p className="subtitle">Chess knowledge explorer</p>
      </header>

      <main className="workspace board-layout">
        <section className="panel board-panel">
          <h2>Board</h2>
          <div className="board-wrap">
            <Chessboard
              id="nodeify-board"
              position={selectedNode.fen}
              onPieceDrop={handlePieceDrop}
              boardWidth={520}
              arePiecesDraggable={true}
            />
          </div>
        </section>

        <section className="panel">
          <h2>Selected Position</h2>
          <p><strong>Label:</strong> {selectedNode.label}</p>
          <p><strong>Turn:</strong> {selectedNode.turn === 'w' ? 'White' : 'Black'}</p>
          <p><strong>Depth:</strong> {selectedNode.depth}</p>
          <p><strong>FEN:</strong></p>
          <code className="fen-block">{selectedNode.fen}</code>
        </section>

        <section className="panel">
          <h2>Explorer Status</h2>
          <p><strong>Root Node:</strong> {graph.rootNodeId}</p>
          <p><strong>Selected Node:</strong> {graph.selectedNodeId}</p>
          <p><strong>Total Nodes:</strong> {Object.keys(graph.nodesById).length}</p>
          <p><strong>Total Connections:</strong> {Object.keys(graph.connectionsById).length}</p>
        </section>
      </main>
    </div>
  )
}

export default App