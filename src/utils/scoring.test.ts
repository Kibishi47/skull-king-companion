import { describe, it, expect } from 'vitest';
import {
  calculateBonusScore,
  calculateClassicRoundScore,
  calculateRascalRoundScore,
  calculatePlayerScore,
  createEmptyBonuses,
} from './scoring';

describe('Skull King Scoring Engine', () => {
  describe('calculateBonusScore', () => {
    it('calculates individual and combined bonuses correctly', () => {
      const bonuses = createEmptyBonuses();
      bonuses.standard14s = 2; // +20
      bonuses.black14 = 1; // +20
      bonuses.mermaidsByPirate = 1; // +20
      bonuses.piratesBySkullKing = 2; // +60
      bonuses.skullKingByMermaid = 1; // +40
      bonuses.lootAlliance = true; // +20
      bonuses.rascalBet = 10; // +10

      // 20 + 20 + 20 + 60 + 40 + 20 + 10 = 190
      expect(calculateBonusScore(bonuses)).toBe(190);
    });
  });

  describe('calculateClassicRoundScore', () => {
    it('calculates successful positive bid: 2 bids, 2 tricks in round 5', () => {
      const bonuses = createEmptyBonuses();
      bonuses.black14 = 1; // +20
      const result = calculateClassicRoundScore(2, 2, 5, bonuses);

      expect(result.bidSuccess).toBe(true);
      expect(result.baseScore).toBe(40); // 2 * 20
      expect(result.bonusScore).toBe(20);
      expect(result.roundTotal).toBe(60);
    });

    it('calculates failed positive bid: bid 3, made 1 trick in round 5', () => {
      const bonuses = createEmptyBonuses();
      bonuses.mermaidsByPirate = 1; // would be +20 if won
      const result = calculateClassicRoundScore(3, 1, 5, bonuses);

      expect(result.bidSuccess).toBe(false);
      expect(result.baseScore).toBe(-20); // -10 * 2 diff
      expect(result.bonusScore).toBe(0); // bonuses lost on fail
      expect(result.roundTotal).toBe(-20);
    });

    it('calculates successful zero bid: bid 0, 0 tricks in round 7', () => {
      const bonuses = createEmptyBonuses();
      const result = calculateClassicRoundScore(0, 0, 7, bonuses);

      expect(result.bidSuccess).toBe(true);
      expect(result.baseScore).toBe(70); // +10 * 7
      expect(result.roundTotal).toBe(70);
    });

    it('calculates failed zero bid: bid 0, 1 trick in round 7', () => {
      const bonuses = createEmptyBonuses();
      bonuses.piratesBySkullKing = 1;
      const result = calculateClassicRoundScore(0, 1, 7, bonuses);

      expect(result.bidSuccess).toBe(false);
      expect(result.baseScore).toBe(-70); // -10 * 7 regardless of trick count
      expect(result.bonusScore).toBe(0);
      expect(result.roundTotal).toBe(-70);
    });
  });

  describe('calculateRascalRoundScore', () => {
    it('calculates exact hit in Buckshot mode: 100% potential + 100% bonus', () => {
      const bonuses = createEmptyBonuses();
      bonuses.standard14s = 1; // +10
      // Round 6: potential = 60
      const result = calculateRascalRoundScore(2, 2, 6, bonuses, 'buckshot');

      expect(result.bidSuccess).toBe(true);
      expect(result.baseScore).toBe(60);
      expect(result.bonusScore).toBe(10);
      expect(result.roundTotal).toBe(70);
    });

    it('calculates backhand strike (1 diff) in Buckshot mode: 50% potential + 50% bonus', () => {
      const bonuses = createEmptyBonuses();
      bonuses.black14 = 1; // +20
      // Round 6: potential = 60. 50% = 30. Bonus 50% of 20 = 10. Total = 40.
      const result = calculateRascalRoundScore(2, 3, 6, bonuses, 'buckshot');

      expect(result.bidSuccess).toBe(false);
      expect(result.baseScore).toBe(30);
      expect(result.bonusScore).toBe(10);
      expect(result.roundTotal).toBe(40);
    });

    it('calculates severe failure (diff >= 2) in Buckshot mode: 0 points', () => {
      const bonuses = createEmptyBonuses();
      bonuses.black14 = 1;
      const result = calculateRascalRoundScore(3, 0, 6, bonuses, 'buckshot');

      expect(result.bidSuccess).toBe(false);
      expect(result.baseScore).toBe(0);
      expect(result.bonusScore).toBe(0);
      expect(result.roundTotal).toBe(0);
    });

    it('calculates Cannonball mode: 15 per card on exact hit', () => {
      const bonuses = createEmptyBonuses();
      // Round 8: 15 * 8 = 120
      const result = calculateRascalRoundScore(4, 4, 8, bonuses, 'cannonball');

      expect(result.bidSuccess).toBe(true);
      expect(result.baseScore).toBe(120);
      expect(result.roundTotal).toBe(120);
    });

    it('calculates Cannonball mode: 0 points on any difference', () => {
      const bonuses = createEmptyBonuses();
      const result = calculateRascalRoundScore(4, 3, 8, bonuses, 'cannonball');

      expect(result.bidSuccess).toBe(false);
      expect(result.baseScore).toBe(0);
      expect(result.roundTotal).toBe(0);
    });
  });

  describe('calculatePlayerScore with cumulative history', () => {
    it('accurately accumulates scores across rounds', () => {
      const round1 = calculatePlayerScore(
        { playerId: 'p1', bid: 1, tricks: 1, bonuses: createEmptyBonuses() },
        1,
        'classic',
        0
      );
      expect(round1.cumulativeTotal).toBe(20);

      const round2 = calculatePlayerScore(
        { playerId: 'p1', bid: 2, tricks: 1, bonuses: createEmptyBonuses() },
        2,
        'classic',
        round1.cumulativeTotal
      );
      expect(round2.roundTotal).toBe(-10);
      expect(round2.cumulativeTotal).toBe(10);
    });
  });
});
