export const PANELS = [
  { id: 'board', title: 'Board' },
  { id: 'network', title: 'Node Network' },
  { id: 'position', title: 'Selected Position' },
  { id: 'status', title: 'Explorer Status' },
]

export const GRID = {
  cols: 12,
  rowHeight: 40,
  margin: [12, 12],
}

export const DEFAULT_LAYOUT = [
  { i: 'board', x: 0, y: 0, w: 5, h: 12, minW: 3, minH: 6 },
  { i: 'network', x: 5, y: 0, w: 7, h: 8, minW: 3, minH: 4 },
  { i: 'position', x: 5, y: 8, w: 4, h: 5, minW: 3, minH: 3 },
  { i: 'status', x: 9, y: 8, w: 3, h: 5, minW: 3, minH: 3 },
]

export function mergeLayout(saved) {
  return DEFAULT_LAYOUT.map(
    (d) => saved.find((s) => s.i === d.i) ?? d,
  )
}

const STORAGE_KEY = 'nodeify-chess:panel-layout:v2'

export function loadPanelState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed.layout) || !Array.isArray(parsed.hidden)) return null
    return parsed
  } catch {
    return null
  }
}

export function savePanelState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    /* storage unavailable, ignore */
  }
}
