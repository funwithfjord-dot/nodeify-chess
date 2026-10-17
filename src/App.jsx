import { useState } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import './App.css'
import { createInitialGraph } from './lib/chess/initialGraph'

function App() {
  const [graph, setGraph] = useState(() => createInitialGraph())

  const selectedNode = graph.nodesById[graph.selectedNodeId]

  function handlePieceDrop({ sourceSquare, targetSquare }) {
    if (!targetSquare) return false

    const currentSelected = graph.nodesById[graph.selectedNodeId]
    const chess = new Chess(currentSelected.fen)

    let move
    try {
      move = chess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      })
    } catch {
      return false
    }
    if (!move) return false

    const newFen = chess.fen()
    const newNodeId = newFen
    const connectionId = `${currentSelected.id}-${move.san}-${newNodeId}`

    setGraph((g) => {
      const from = g.nodesById[currentSelected.id]
      const existing = g.nodesById[newNodeId]
      const node = existing || {
        id: newNodeId,
        fen: newFen,
        turn: chess.turn(),
        label: `After ${move.san}`,
        depth: from.depth + 1,
        parentIds: [from.id],
        childIds: [],
        tags: [],
        notes: '',
        createdFromMove: move.san,
      }

      return {
        ...g,
        selectedNodeId: newNodeId,
        nodesById: {
          ...g.nodesById,
          [from.id]: {
            ...from,
            childIds: from.childIds.includes(newNodeId)
              ? from.childIds
              : [...from.childIds, newNodeId],
          },
          [newNodeId]: node,
        },
        connectionsById: {
          ...g.connectionsById,
          [connectionId]: {
            id: connectionId,
            fromNodeId: from.id,
            toNodeId: newNodeId,
            san: move.san,
            lan: `${move.from}${move.to}`,
            color: move.color,
            ply: from.depth + 1,
          },
        },
      }
    })

    return true
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
              options={{
                id: 'nodeify-board',
                position: selectedNode.fen,
                onPieceDrop: handlePieceDrop,
              }}
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
