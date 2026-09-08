import { useState, useCallback } from 'react';
import { GameState, Player, GameSettings, PlayerRoundInput, Round, SavedGameItem } from '../types/game';
import { useLocalStorage } from './useLocalStorage';
import { calculatePlayerScore, createEmptyBonuses, recalculateGameScores } from '../utils/scoring';
import { ROUND_PRESETS } from '../utils/presets';

const STORAGE_KEYS = {
  ACTIVE_GAME: 'skullking_active_game',
  HISTORY: 'skullking_history',
  SAVED_GAMES: 'skullking_saved_games',
  SAVED_PLAYERS: 'skullking_saved_players',
  SETTINGS: 'skullking_settings',
};

const DEFAULT_SETTINGS: GameSettings = {
  mode: 'classic',
  defaultRascalOption: 'buckshot',
  presetId: 'standard',
};

function createSavedGameItem(game: GameState): SavedGameItem {
  const completedRounds = game.rounds.filter((r) => r.isCompleted);
  const lastCompletedRound = completedRounds[completedRounds.length - 1];

  const playersSummary = game.players.map((p) => {
    let score = 0;
    if (lastCompletedRound) {
      const scoreObj = lastCompletedRound.playerScores.find((s) => s.playerId === p.id);
      if (scoreObj) score = scoreObj.cumulativeTotal;
    }
    return { name: p.name, score };
  });

  return {
    id: game.id,
    date: game.updatedAt || game.createdAt,
    players: playersSummary,
    currentRound: Math.min(game.rounds.length, game.currentRoundIndex + 1),
    totalRounds: game.rounds.length,
    isFinished: game.status === 'completed',
    gameSnapshot: game,
  };
}

export function useGameManager() {
  const [activeGame, setActiveGame] = useLocalStorage<GameState | null>(STORAGE_KEYS.ACTIVE_GAME, null);
  const [gameHistory, setGameHistory] = useLocalStorage<GameState[]>(STORAGE_KEYS.HISTORY, []);
  const [savedGames, setSavedGames] = useLocalStorage<SavedGameItem[]>(STORAGE_KEYS.SAVED_GAMES, []);
  const [savedPlayers, setSavedPlayers] = useLocalStorage<string[]>(STORAGE_KEYS.SAVED_PLAYERS, []);
  const [settings, setSettings] = useLocalStorage<GameSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

  // Pile d'historique (snapshots) pour Undo/Redo au sein de la partie active
  const [historySnapshots, setHistorySnapshots] = useState<GameState[]>([]);

  // Mode édition dédié : index de la manche en cours d'édition (null si aucune)
  const [editingRoundIndex, setEditingRoundIndex] = useState<number | null>(null);

  const pushSnapshot = useCallback((state: GameState) => {
    setHistorySnapshots((prev) => [...prev.slice(-19), JSON.parse(JSON.stringify(state))]);
  }, []);

  const updateSavedGamesIndex = useCallback((game: GameState) => {
    setSavedGames((prev) => {
      const item = createSavedGameItem(game);
      const filtered = prev.filter((g) => g.id !== game.id);
      return [item, ...filtered].slice(0, 30);
    });
  }, [setSavedGames]);

  /**
   * Créer et démarrer une nouvelle partie
   */
  const startNewGame = useCallback((playerNames: string[], gameSettings: GameSettings) => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `p-${Date.now()}-${index}`,
      name: name.trim() || `Pirate ${index + 1}`,
    }));

    // Sauvegarder les noms de joueurs pour réutilisation future
    setSavedPlayers((prev) => {
      const updated = Array.from(new Set([...prev, ...playerNames.map(p => p.trim())])).filter(Boolean);
      return updated.slice(0, 20);
    });

    const preset = ROUND_PRESETS.find(p => p.id === gameSettings.presetId) || ROUND_PRESETS[0];
    const cardCounts = gameSettings.customCardCounts && gameSettings.presetId === 'custom'
      ? gameSettings.customCardCounts
      : preset.rounds;

    const rounds: Round[] = cardCounts.map((count, index) => ({
      roundNumber: index + 1,
      cardCount: count,
      dealerPlayerId: players[index % players.length].id,
      playerScores: [],
      isCompleted: false,
    }));

    const newGame: GameState = {
      id: `game-${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players,
      settings: gameSettings,
      rounds,
      currentRoundIndex: 0,
      status: 'bidding',
    };

    setHistorySnapshots([]);
    setActiveGame(newGame);
    updateSavedGamesIndex(newGame);
    return newGame;
  }, [setActiveGame, setSavedPlayers, updateSavedGamesIndex]);

  /**
   * Valider la saisie normale d'une manche en cours
   */
  const submitRound = useCallback((roundInputs: PlayerRoundInput[]) => {
    if (!activeGame) return;

    pushSnapshot(activeGame);

    const currentRound = activeGame.rounds[activeGame.currentRoundIndex];
    const cardCount = currentRound.cardCount;

    // Calculer les scores pour cette manche
    const playerScores = roundInputs.map((input) => {
      let previousCumulative = 0;
      if (activeGame.currentRoundIndex > 0) {
        const prevRound = activeGame.rounds[activeGame.currentRoundIndex - 1];
        const prevScore = prevRound.playerScores?.find((s) => s.playerId === input.playerId);
        if (prevScore) {
          previousCumulative = prevScore.cumulativeTotal;
        }
      }
      return calculatePlayerScore(input, cardCount, activeGame.settings.mode, previousCumulative);
    });

    const clonedInputs = roundInputs.map((item) => ({
      playerId: item.playerId,
      bid: item.bid,
      tricks: item.tricks,
      bonuses: { ...item.bonuses },
      rascalOption: item.rascalOption,
    }));

    const updatedRounds = [...activeGame.rounds];
    updatedRounds[activeGame.currentRoundIndex] = {
      ...currentRound,
      playerScores,
      isCompleted: true,
      lastInputs: clonedInputs,
    };

    // Recalcul en cascade de tous les totaux cumulés
    const fullyRecalculatedRounds = recalculateGameScores(updatedRounds, activeGame.settings.mode);

    const isLastRound = activeGame.currentRoundIndex >= activeGame.rounds.length - 1;
    const nextRoundIndex = isLastRound ? activeGame.currentRoundIndex : activeGame.currentRoundIndex + 1;
    const nextStatus = isLastRound ? 'completed' : 'recap';

    const updatedGame: GameState = {
      ...activeGame,
      rounds: fullyRecalculatedRounds,
      currentRoundIndex: nextRoundIndex,
      status: nextStatus,
      updatedAt: Date.now(),
    };

    setActiveGame(updatedGame);
    updateSavedGamesIndex(updatedGame);

    if (isLastRound) {
      setGameHistory((prev) => [updatedGame, ...prev.slice(0, 29)]);
    }
  }, [activeGame, pushSnapshot, setActiveGame, setGameHistory, updateSavedGamesIndex]);

  /**
   * Enregistrer les modifications d'une manche en mode édition dédié :
   * 1. Met à jour la manche ciblée
   * 2. Recalcule en cascade tous les totaux cumulés jusqu'à la manche courante
   * 3. Referme le mode édition (editingRoundIndex = null)
   * 4. Conserve l'utilisateur là où il était dans la partie active
   */
  const saveEditedRound = useCallback((targetRoundIndex: number, roundInputs: PlayerRoundInput[]) => {
    if (!activeGame || targetRoundIndex < 0 || targetRoundIndex >= activeGame.rounds.length) return;

    pushSnapshot(activeGame);

    const roundToEdit = activeGame.rounds[targetRoundIndex];
    const cardCount = roundToEdit.cardCount;

    const playerScores = roundInputs.map((input) => {
      let previousCumulative = 0;
      if (targetRoundIndex > 0) {
        const prevRound = activeGame.rounds[targetRoundIndex - 1];
        const prevScore = prevRound.playerScores?.find((s) => s.playerId === input.playerId);
        if (prevScore) {
          previousCumulative = prevScore.cumulativeTotal;
        }
      }
      return calculatePlayerScore(input, cardCount, activeGame.settings.mode, previousCumulative);
    });

    const clonedInputs = roundInputs.map((item) => ({
      playerId: item.playerId,
      bid: item.bid,
      tricks: item.tricks,
      bonuses: { ...item.bonuses },
      rascalOption: item.rascalOption,
    }));

    const updatedRounds = [...activeGame.rounds];
    updatedRounds[targetRoundIndex] = {
      ...roundToEdit,
      playerScores,
      isCompleted: true,
      lastInputs: clonedInputs,
    };

    // Recalcul en cascade des totaux cumulés de toutes les manches
    const fullyRecalculatedRounds = recalculateGameScores(updatedRounds, activeGame.settings.mode);

    const updatedGame: GameState = {
      ...activeGame,
      rounds: fullyRecalculatedRounds,
      updatedAt: Date.now(),
    };

    setActiveGame(updatedGame);
    updateSavedGamesIndex(updatedGame);
    setEditingRoundIndex(null);
  }, [activeGame, pushSnapshot, setActiveGame, updateSavedGamesIndex]);

  /**
   * Passer de l'écran récapitulatif à la manche suivante
   */
  const proceedToNextRound = useCallback(() => {
    if (!activeGame) return;
    pushSnapshot(activeGame);
    setActiveGame({
      ...activeGame,
      status: 'bidding',
      updatedAt: Date.now(),
    });
  }, [activeGame, pushSnapshot, setActiveGame]);

  /**
   * Ouvrir le mode édition pour une manche quelconque
   */
  const startEditingRound = useCallback((roundIndex: number) => {
    if (!activeGame || roundIndex < 0 || roundIndex >= activeGame.rounds.length) return;
    setEditingRoundIndex(roundIndex);
  }, [activeGame]);

  /**
   * Fermer le mode édition sans enregistrer
   */
  const cancelEditingRound = useCallback(() => {
    setEditingRoundIndex(null);
  }, []);

  /**
   * Modifier la manche qui vient de se terminer (depuis le bilan de manche)
   */
  const editRoundJustFinished = useCallback(() => {
    if (!activeGame) return;
    const targetIndex = Math.max(0, activeGame.currentRoundIndex - 1);
    startEditingRound(targetIndex);
  }, [activeGame, startEditingRound]);

  /**
   * Annuler la dernière action (Undo) et revenir immédiatement à l'étape des plis
   */
  const undoLastAction = useCallback(() => {
    if (historySnapshots.length === 0 && !activeGame) return;

    if (historySnapshots.length > 0) {
      const lastSnapshot = historySnapshots[historySnapshots.length - 1];
      setHistorySnapshots((prev) => prev.slice(0, -1));

      const targetRoundIndex =
        lastSnapshot.status === 'recap' || lastSnapshot.status === 'completed'
          ? Math.max(0, lastSnapshot.currentRoundIndex - 1)
          : lastSnapshot.currentRoundIndex;

      setActiveGame({
        ...lastSnapshot,
        currentRoundIndex: targetRoundIndex,
        status: 'tricks',
        updatedAt: Date.now(),
      });
    } else if (activeGame && (activeGame.status === 'recap' || activeGame.status === 'completed')) {
      const targetRoundIndex = Math.max(0, activeGame.currentRoundIndex - 1);
      setActiveGame({
        ...activeGame,
        currentRoundIndex: targetRoundIndex,
        status: 'tricks',
        updatedAt: Date.now(),
      });
    }
  }, [historySnapshots, activeGame, setActiveGame]);

  /**
   * Recommencer une nouvelle manche / Modifier la manche en cours
   */
  const editCurrentRound = useCallback(() => {
    if (!activeGame) return;
    pushSnapshot(activeGame);
    setActiveGame({
      ...activeGame,
      status: 'bidding',
      updatedAt: Date.now(),
    });
  }, [activeGame, pushSnapshot, setActiveGame]);

  /**
   * Terminer ou réinitialiser la partie en cours
   */
  const resetGame = useCallback(() => {
    if (activeGame) {
      pushSnapshot(activeGame);
    }
    setActiveGame(null);
  }, [activeGame, pushSnapshot, setActiveGame]);

  /**
   * Charger une partie sauvegardée
   */
  const loadGame = useCallback((savedItem: SavedGameItem) => {
    setHistorySnapshots([]);
    setActiveGame(savedItem.gameSnapshot);
    updateSavedGamesIndex(savedItem.gameSnapshot);
  }, [setActiveGame, updateSavedGamesIndex]);

  /**
   * Supprimer une partie sauvegardée
   */
  const deleteSavedGame = useCallback((id: string) => {
    setSavedGames((prev) => prev.filter((g) => g.id !== id));
    if (activeGame && activeGame.id === id) {
      setActiveGame(null);
    }
  }, [activeGame, setActiveGame, setSavedGames]);

  return {
    activeGame,
    gameHistory,
    savedGames,
    savedPlayers,
    setSavedPlayers,
    settings,
    setSettings,
    canUndo: historySnapshots.length > 0,
    editingRoundIndex,
    startEditingRound,
    cancelEditingRound,
    saveEditedRound,
    startNewGame,
    submitRound,
    proceedToNextRound,
    undoLastAction,
    editCurrentRound,
    editRoundJustFinished,
    resetGame,
    loadGame,
    deleteSavedGame,
    createEmptyBonuses,
  };
}
