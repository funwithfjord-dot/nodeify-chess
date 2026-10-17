import { useEffect, useMemo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useReactFlow,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const X_GAP = 170
const Y_GAP = 64

function buildElements(graph) {
  const rowsByDepth = {}

  const nodes = Object.values(graph.nodesById)
    .sort((a, b) => a.depth - b.depth)
    .map((n) => {
      const row = rowsByDepth[n.depth] ?? 0
      rowsByDepth[n.depth] = row + 1
      const selected = n.id === graph.selectedNodeId

      return {
        id: n.id,
        position: { x: n.depth * X_GAP, y: row * Y_GAP },
        data: { label: n.depth === 0 ? 'Start' : n.createdFromMove },
        style: {
          width: 90,
          padding: 8,
          borderRadius: 10,
          fontWeight: 600,
          color: '#f9fafb',
          background: selected ? '#1d4ed8' : '#1f2937',
          border: selected ? '2px solid #93c5fd' : '1px solid #4b5563',
        },
      }
    })

  const edges = Object.values(graph.connectionsById).map((c) => ({
    id: c.id,
    source: c.fromNodeId,
    target: c.toNodeId,
    label: c.san,
    style: { stroke: '#6b7280' },
  }))

  return { nodes, edges }
}

function NetworkInner({ graph, onSelectNode }) {
  const { nodes, edges } = useMemo(() => buildElements(graph), [graph])
  const { fitView } = useReactFlow()
  const nodeCount = nodes.length

  useEffect(() => {
    const t = setTimeout(() => {
      fitView({ padding: 0.3, maxZoom: 1.2, duration: 300 })
    }, 50)
    return () => clearTimeout(t)
  }, [nodeCount, fitView])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={(_, node) => onSelectNode(node.id)}
      nodesDraggable={false}
      nodesConnectable={false}
      colorMode="dark"
      minZoom={0.2}
      fitView
    >
      <Background />
      <Controls showInteractive={false} />
    </ReactFlow>
  )
}

function NetworkPanel({ graph, onSelectNode }) {
  return (
    <div className="network-wrap">
      <ReactFlowProvider>
        <NetworkInner graph={graph} onSelectNode={onSelectNode} />
      </ReactFlowProvider>
    </div>
  )
}

export default NetworkPanel
