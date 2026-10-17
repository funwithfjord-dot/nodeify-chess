import { useState, useEffect } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import ReactGridLayout, { useContainerWidth } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './App.css'
import { createInitialGraph } from './lib/chess/initialGraph'
import {
  PANELS,
  GRID,
  DEFAULT_LAYOUT,
  mergeLayout,
  loadPanelState,
  savePanelState,
} from './lib/layout/panels'
import PanelFrame from './components/PanelFrame'
import NetworkPanel from './components/NetworkPanel'

const NARROW_WIDTH = 720

function App() {
  const [graph, setGraph] = useState(() => createInitialGraph())
  const [layout, setLayout] = useState(() => {
    const saved = loadPanelState()
    return saved ? mergeLayout(saved.layout) : DEFAULT_LAYOUT
  })
  const [hidden, setHidden] = useState(() => loadPanelState()?.hidden ?? [])

  const { width, containerRef, mounted } = useContainerWidth()

  const selectedNode = graph.nodesById[graph.selectedNodeId]

  useEffect(() => {
    savePanelState({ layout, hidden })
  }, [layout, hidden])

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

  function selectNode(id) {
    setGraph((g) => (g.nodesById[id] ? { ...g, selectedNodeId: id } : g))
  }

  function handleLayoutChange(nextLayout) {
    setLayout((prev) => {
      const merged = prev.map((item) => {
        const updated = nextLayout.find((n) => n.i === item.i)
        return updated ? { ...item, x: updated.x, y: updated.y, w: updated.w, h: updated.h } : item
      })
      return JSON.stringify(merged) === JSON.stringify(prev) ? prev : merged
    })
  }

  function togglePanel(id) {
    setHidden((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    )
  }

  function resetLayout() {
    setLayout(DEFAULT_LAYOUT)
    setHidden([])
  }

  function renderPanelBody(id) {
    if (id === 'board') {
      return (
        <div className="board-wrap">
          <div className="board-square">
            <Chessboard
              options={{
                id: 'nodeify-board',
                position: selectedNode.fen,
                onPieceDrop: handlePieceDrop,
              }}
            />
          </div>
        </div>
      )
    }

    if (id === 'network') {
      return <NetworkPanel graph={graph} onSelectNode={selectNode} />
    }

    if (id === 'position') {
      return (
        <>
          <p><strong>Label:</strong> {selectedNode.label}</p>
          <p><strong>Turn:</strong> {selectedNode.turn === 'w' ? 'White' : 'Black'}</p>
          <p><strong>Depth:</strong> {selectedNode.depth}</p>
          <p><strong>FEN:</strong></p>
          <code className="fen-block">{selectedNode.fen}</code>
        </>
      )
    }

    return (
      <>
        <p><strong>Root Node:</strong> {graph.rootNodeId}</p>
        <p><strong>Selected Node:</strong> {graph.selectedNodeId}</p>
        <p><strong>Total Nodes:</strong> {Object.keys(graph.nodesById).length}</p>
        <p><strong>Total Connections:</strong> {Object.keys(graph.connectionsById).length}</p>
      </>
    )
  }

  const visiblePanels = PANELS.filter((p) => !hidden.includes(p.id))
  const visibleLayout = layout.filter((l) => !hidden.includes(l.i))
  const isNarrow = width > 0 && width < NARROW_WIDTH

  function frame(p) {
    return (
      <PanelFrame
        title={p.title}
        flush={p.id === 'network'}
        onHide={() => togglePanel(p.id)}
      >
        {renderPanelBody(p.id)}
      </PanelFrame>
    )
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Nodeify Chess</h1>
          <p className="subtitle">Chess knowledge explorer</p>
        </div>

        <nav className="panel-toggles" aria-label="Panels">
          {PANELS.map((p) => (
            <button
              key={p.id}
              type="button"
              className="toggle-btn"
              aria-pressed={!hidden.includes(p.id)}
              onClick={() => togglePanel(p.id)}
            >
              {p.title}
            </button>
          ))}
          <button type="button" className="toggle-btn reset" onClick={resetLayout}>
            Reset layout
          </button>
        </nav>
      </header>

      <main ref={containerRef} className="workspace">
        {visiblePanels.length === 0 && (
          <p className="empty-note">All panels are hidden. Use the buttons above to bring one back.</p>
        )}

        {mounted && isNarrow && (
          <div className="stack">
            {visiblePanels.map((p) => (
              <div key={p.id} className="stack-item">
                {frame(p)}
              </div>
            ))}
          </div>
        )}

        {mounted && !isNarrow && (
          <ReactGridLayout
            width={width}
            layout={visibleLayout}
            gridConfig={GRID}
            dragConfig={{ handle: '.panel-handle', cancel: '.panel-close' }}
            onLayoutChange={handleLayoutChange}
          >
            {visiblePanels.map((p) => (
              <div key={p.id}>{frame(p)}</div>
            ))}
          </ReactGridLayout>
        )}
      </main>
    </div>
  )
}

export default App
