import { RoundPreset } from '../types/game';

export const ROUND_PRESETS: RoundPreset[] = [
  {
    id: 'standard',
    name: 'Standard (10 manches)',
    description: '1 à 10 cartes. La grande odyssée classique du Skull King.',
    rounds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  {
    id: 'battle_ready',
    name: 'Prêt au combat (5 manches)',
    description: '6 à 10 cartes. Directement au cœur des manches décisives.',
    rounds: [6, 7, 8, 9, 10],
  },
  {
    id: 'lightning',
    name: 'Attaque éclair (5 manches)',
    description: '5 manches de 5 cartes. Rapide, intense et disputé.',
    rounds: [5, 5, 5, 5, 5],
  },
  {
    id: 'no_odds',
    name: "Pas d'impair (5 manches)",
    description: '2, 4, 6, 8, 10 cartes. Montée en puissance paire.',
    rounds: [2, 4, 6, 8, 10],
  },
  {
    id: 'maelstrom',
    name: 'Tourbillon (5 manches)',
    description: '9, 7, 5, 3, 1 cartes. Tension décroissante impitoyable.',
    rounds: [9, 7, 5, 3, 1],
  },
  {
    id: 'custom',
    name: 'Personnalisé',
    description: 'Définissez librement votre propre nombre de manches et de cartes.',
    rounds: [1, 2, 3, 4, 5],
  },
];
