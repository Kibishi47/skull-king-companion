import { BonusCounts, GameMode, PlayerRoundInput, PlayerRoundScore, RascalOption } from '../types/game';

/**
 * Calcule le total des points bonus d'un joueur pour une manche
 */
export function calculateBonusScore(bonuses: BonusCounts): number {
  const standard14sScore = (bonuses.standard14s || 0) * 10;
  const black14Score = (bonuses.black14 || 0) * 20;
  const mermaidsScore = (bonuses.mermaidsByPirate || 0) * 20;
  const piratesScore = (bonuses.piratesBySkullKing || 0) * 30;
  const skullKingScore = (bonuses.skullKingByMermaid || 0) * 40;
  const lootAllianceScore = bonuses.lootAlliance ? 20 : 0;
  const rascalScore = bonuses.rascalBet || 0;

  return (
    standard14sScore +
    black14Score +
    mermaidsScore +
    piratesScore +
    skullKingScore +
    lootAllianceScore +
    rascalScore
  );
}

/**
 * Calcul du score en Mode Classique Skull King :
 * - Mise > 0 réussie : +20 points par pli remporté (+ bonus)
 * - Mise > 0 échouée : -10 points par pli de différence (bonus perdus)
 * - Mise à 0 réussie : +10 * nombre de cartes (+ bonus éventuels, ex: butin ou capture si plis=0)
 * - Mise à 0 échouée : -10 * nombre de cartes (bonus perdus)
 */
export function calculateClassicRoundScore(
  bid: number,
  tricks: number,
  cardCount: number,
  bonuses: BonusCounts
): { baseScore: number; bonusScore: number; roundTotal: number; bidSuccess: boolean } {
  const rawBonus = calculateBonusScore(bonuses);
  let baseScore = 0;
  let bidSuccess = false;
  let effectiveBonus = 0;

  if (bid === 0) {
    if (tricks === 0) {
      // 0 réussi : +10 pts par carte de la manche
      bidSuccess = true;
      baseScore = 10 * cardCount;
      effectiveBonus = rawBonus;
    } else {
      // 0 échoué : -10 pts par carte de la manche (indépendamment du nombre de plis pris)
      bidSuccess = false;
      baseScore = -10 * cardCount;
      effectiveBonus = 0; // Les bonus sont perdus en cas d'échec du contrat
    }
  } else {
    // Mise > 0
    if (tricks === bid) {
      bidSuccess = true;
      baseScore = tricks * 20;
      effectiveBonus = rawBonus;
    } else {
      bidSuccess = false;
      const diff = Math.abs(tricks - bid);
      baseScore = -10 * diff;
      effectiveBonus = 0; // Bonus perdus si contrat échoué
    }
  }

  return {
    baseScore,
    bonusScore: effectiveBonus,
    roundTotal: baseScore + effectiveBonus,
    bidSuccess,
  };
}

/**
 * Calcul du score en Mode Rascal (variante officielle) :
 * - Potentiel de manche = 10 * nombre de cartes
 *
 * Option Chevrotine (Buckshot) :
 * - Coup direct (mise exacte) : 100% potentiel + 100% bonus
 * - Frappe à revers (écart de 1) : 50% potentiel (arrondi) + 50% bonus
 * - Échec cuisant (écart >= 2) : 0 point et 0 bonus
 *
 * Option Boulet de canon (Cannonball) :
 * - Mise exacte : 15 points par carte + 100% bonus
 * - Écart >= 1 : 0 point et 0 bonus
 */
export function calculateRascalRoundScore(
  bid: number,
  tricks: number,
  cardCount: number,
  bonuses: BonusCounts,
  option: RascalOption = 'buckshot'
): { baseScore: number; bonusScore: number; roundTotal: number; bidSuccess: boolean } {
  const rawBonus = calculateBonusScore(bonuses);
  const diff = Math.abs(tricks - bid);
  const bidSuccess = diff === 0;

  if (option === 'cannonball') {
    if (bidSuccess) {
      const baseScore = 15 * cardCount;
      return {
        baseScore,
        bonusScore: rawBonus,
        roundTotal: baseScore + rawBonus,
        bidSuccess: true,
      };
    } else {
      return {
        baseScore: 0,
        bonusScore: 0,
        roundTotal: 0,
        bidSuccess: false,
      };
    }
  }

  // Option normale Buckshot (Chevrotine)
  const roundPotential = 10 * cardCount;

  if (diff === 0) {
    // Coup direct (100%)
    return {
      baseScore: roundPotential,
      bonusScore: rawBonus,
      roundTotal: roundPotential + rawBonus,
      bidSuccess: true,
    };
  } else if (diff === 1) {
    // Frappe à revers (50%)
    const baseScore = Math.round(roundPotential * 0.5);
    const bonusScore = Math.round(rawBonus * 0.5);
    return {
      baseScore,
      bonusScore,
      roundTotal: baseScore + bonusScore,
      bidSuccess: false,
    };
  } else {
    // Échec cuisant (0 point)
    return {
      baseScore: 0,
      bonusScore: 0,
      roundTotal: 0,
      bidSuccess: false,
    };
  }
}

/**
 * Calculateur pur unifié
 */
export function calculatePlayerScore(
  input: PlayerRoundInput,
  cardCount: number,
  mode: GameMode,
  previousCumulativeTotal: number = 0
): PlayerRoundScore {
  const { bid, tricks, bonuses, rascalOption } = input;

  const result =
    mode === 'classic'
      ? calculateClassicRoundScore(bid, tricks, cardCount, bonuses)
      : calculateRascalRoundScore(bid, tricks, cardCount, bonuses, rascalOption || 'buckshot');

  return {
    playerId: input.playerId,
    bid,
    tricks,
    baseScore: result.baseScore,
    bonusScore: result.bonusScore,
    roundTotal: result.roundTotal,
    cumulativeTotal: previousCumulativeTotal + result.roundTotal,
    bidSuccess: result.bidSuccess,
  };
}

/**
 * Initialise un objet BonusCounts vierge
 */
export function createEmptyBonuses(): BonusCounts {
  return {
    standard14s: 0,
    black14: 0,
    mermaidsByPirate: 0,
    piratesBySkullKing: 0,
    skullKingByMermaid: 0,
    lootAlliance: false,
    rascalBet: 0,
  };
}
