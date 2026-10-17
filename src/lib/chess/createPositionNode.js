export function createPositionNode({
  id,
  fen,
  turn,
  label,
  depth = 0,
  parentIds = [],
  childIds = [],
  tags = [],
  notes = '',
  createdFromMove = null,
}) {
  return {
    id,
    fen,
    turn,
    label,
    depth,
    parentIds,
    childIds,
    tags,
    notes,
    createdFromMove,
  }
}