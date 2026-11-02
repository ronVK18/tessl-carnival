import { prizeFor, type CarnivalGame, type PrizeTier, type ScoreEntry } from './carnival';

/** How many scores each game shows in the trophy room. */
export const TROPHY_ROOM_SCORES = 5;

export interface TrophyShelf {
  game: CarnivalGame;
  /** The game's best scores, highest first. */
  top: ScoreEntry[];
  /** The best prize the game's best score has won, if any. */
  prize: PrizeTier | undefined;
}

/** One shelf per game, in the order the games are given. */
export function trophyShelves(
  games: readonly CarnivalGame[],
  topScores: (gameId: string, count: number) => ScoreEntry[],
): TrophyShelf[] {
  return games.map((game) => {
    const top = topScores(game.id, TROPHY_ROOM_SCORES);
    const best = top[0]?.score;
    const prize = best === undefined ? undefined : prizeFor(best, game.prizes ?? []);
    return { game, top, prize };
  });
}
