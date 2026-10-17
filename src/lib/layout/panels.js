export const PANELS = [
  { id: 'board', title: 'Board' },
  { id: 'position', title: 'Selected Position' },
  { id: 'status', title: 'Explorer Status' },
]

export const GRID = {
  cols: 12,
  rowHeight: 40,
  margin: [12, 12],
}

export const DEFAULT_LAYOUT = [
  { i: 'board', x: 0, y: 0, w: 6, h: 12, minW: 3, minH: 6 },
  { i: 'position', x: 6, y: 0, w: 6, h: 6, minW: 3, minH: 3 },
  { i: 'status', x: 6, y: 6, w: 6, h: 5, minW: 3, minH: 3 },
]

const STORAGE_KEY = 'nodeify-chess:panel-layout:v1'

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
