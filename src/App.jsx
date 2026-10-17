import { useState } from 'react'
import './App.css'
import { createInitialGraph } from './lib/chess/initialGraph'

function App() {
  const [graph] = useState(() => createInitialGraph())

  const selectedNode = graph.nodesById[graph.selectedNodeId]

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Nodeify Chess</h1>
        <p className="subtitle">Chess knowledge explorer</p>
      </header>

      <main className="workspace">
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