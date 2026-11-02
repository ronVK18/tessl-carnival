import { describe, expect, it } from 'vitest';
import { createScoreBoard, type CarnivalGame } from './carnival';
import { trophyShelves } from './trophies';

const game = (id: string, prizes?: CarnivalGame['prizes']): CarnivalGame => ({
  id,
  name: id,
  description: `The ${id} game`,
  prizes,
  start: () => () => {},
});

function board() {
  const memory = new Map<string, string>();
  let clock = 0;
  return createScoreBoard(
    {
      getItem: (key) => memory.get(key) ?? null,
      setItem: (key, value) => void memory.set(key, value),
    },
    () => clock++,
  );
}

const tiers = [
  { name: 'Bronze', minScore: 30 },
  { name: 'Gold', minScore: 100 },
  { name: 'Silver', minScore: 60 },
];

describe('trophyShelves', () => {
  it('shows each game its top five scores, highest first', () => {
    const scores = board();
    for (const score of [10, 80, 40, 70, 20, 90, 5]) scores.record('ring-toss', score);
    scores.record('water-cannon', 12);

    const shelves = trophyShelves([game('ring-toss'), game('water-cannon')], scores.top);

    expect(shelves.map((s) => s.game.id)).toEqual(['ring-toss', 'water-cannon']);
    expect(shelves[0].top.map((e) => e.score)).toEqual([90, 80, 70, 40, 20]);
    expect(shelves[1].top.map((e) => e.score)).toEqual([12]);
  });

  it('gives each game the best prize its best score has won', () => {
    const scores = board();
    scores.record('ring-toss', 65);
    scores.record('ring-toss', 20);
    scores.record('water-cannon', 10);

    const [ringToss, waterCannon] = trophyShelves(
      [game('ring-toss', tiers), game('water-cannon', tiers)],
      scores.top,
    );

    expect(ringToss.prize?.name).toBe('Silver');
    expect(waterCannon.prize).toBeUndefined();
  });

  it('has no prize for a game with no scores or no prize tiers', () => {
    const scores = board();
    scores.record('no-prizes', 500);

    const shelves = trophyShelves([game('unplayed', tiers), game('no-prizes')], scores.top);

    expect(shelves[0].top).toEqual([]);
    expect(shelves[0].prize).toBeUndefined();
    expect(shelves[1].prize).toBeUndefined();
  });
});
