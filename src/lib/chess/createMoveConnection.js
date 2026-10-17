export function createMoveConnection({
  id,
  fromNodeId,
  toNodeId,
  san,
  lan,
  color,
  ply,
}) {
  return {
    id,
    fromNodeId,
    toNodeId,
    san,
    lan,
    color,
    ply,
  }
}