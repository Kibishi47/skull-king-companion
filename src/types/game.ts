export type GameMode = 'classic' | 'rascal';

export type RascalOption = 'buckshot' | 'cannonball'; // Chevrotine vs Boulet de canon

export interface BonusCounts {
  standard14s: number;      // Cartes 14 de couleur (vert, jaune, violet) : +10 pts
  black14: number;           // Carte 14 noire (atout Jolly Roger) : +20 pts
  mermaidsByPirate: number;  // Sirène capturée par un Pirate : +20 pts chacune
  piratesBySkullKing: number;// Pirate capturé par le Skull King : +30 pts chacun
  skullKingByMermaid: number;// Skull King capturé par une Sirène : +40 pts
  lootAlliance: boolean;     // Alliance Butin : +20 pts si pari réussi
  rascalBet: 0 | 10 | 20 | -10 | -20; // Pari Rascal le Flambeur
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
}

export interface PlayerRoundInput {
  playerId: string;
  bid: number;               // Mise annoncée
  tricks: number;            // Plis remportés
  bonuses: BonusCounts;      // Bonus de la manche
  rascalOption?: RascalOption; // Choix pour la manche en mode Rascal
}

export interface PlayerRoundScore {
  playerId: string;
  bid: number;
  tricks: number;
  baseScore: number;
  bonusScore: number;
  roundTotal: number;
  cumulativeTotal: number;
  bidSuccess: boolean;
  notes?: string;
}

export interface Round {
  roundNumber: number;
  cardCount: number;
  dealerPlayerId: string;
  playerScores: PlayerRoundScore[];
  isCompleted: boolean;
}

export interface RoundPreset {
  id: string;
  name: string;
  description: string;
  rounds: number[]; // Liste du nombre de cartes par manche
}

export interface GameSettings {
  mode: GameMode;
  defaultRascalOption: RascalOption;
  presetId: string;
  customCardCounts?: number[];
}

export interface GameState {
  id: string;
  createdAt: number;
  updatedAt: number;
  players: Player[];
  settings: GameSettings;
  rounds: Round[];
  currentRoundIndex: number;
  status: 'setup' | 'bidding' | 'tricks' | 'recap' | 'completed';
}
