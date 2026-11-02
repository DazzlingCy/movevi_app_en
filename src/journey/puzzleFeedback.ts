import { drawsLeft, ownPieces, puzzleComplete, type PuzzleTeam } from './puzzleTeam';

/** Announce newly credited routes, never restored records or repeated callbacks. */
export function puzzleProgressFeedback(previous: PuzzleTeam | undefined, next: PuzzleTeam | undefined): string | undefined {
  if (!previous || !next || previous.id !== next.id) return;
  const added = next.pieces.filter(piece => !previous.pieces.some(old => old.id === piece.id));
  if (!added.length) return;
  if (!puzzleComplete(previous) && puzzleComplete(next)) {
    const remainingDraws = drawsLeft(next);
    return `Team challenge complete! The prize wheel is unlocked with ${remainingDraws} ${remainingDraws === 1 ? 'draw' : 'draws'}.`;
  }
  const own = ownPieces(next).length;
  if (added.some(piece => piece.memberId === 'self')) {
    return own >= 2
      ? 'You completed two routes. Your teammate can finish the final leg.'
      : `Route complete! Team progress: ${next.pieces.length}/3.`;
  }
  const member = next.members.find(member => member.id === added[added.length - 1].memberId);
  return `${member?.name ?? 'Your teammate'} completed a route. Team progress: ${next.pieces.length}/3.`;
}
