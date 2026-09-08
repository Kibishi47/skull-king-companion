import { useState } from 'react';
import { useGameManager } from './hooks/useGameManager';
import { GameSetup } from './components/GameSetup';
import { RoundEntry } from './components/RoundEntry';
import { RoundRecap } from './components/RoundRecap';
import { GameOverPodium } from './components/GameOverPodium';
import { ScoreboardModal } from './components/ScoreboardModal';
import { SkullKingLogo } from './components/SkullKingLogo';
import { Trophy, RotateCcw, PlusCircle, History } from 'lucide-react';

export function App() {
  const {
    activeGame,
    gameHistory,
    savedPlayers,
    settings,
    canUndo,
    startNewGame,
    submitRound,
    proceedToNextRound,
    undoLastAction,
    resetGame,
  } = useGameManager();

  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-parchment-dark text-ink selection:bg-gold-light selection:text-ink-pure">
      {/* Top Navigation Bar avec Safe Area iOS */}
      <header className="sticky top-0 z-40 bg-parchment/95 backdrop-blur-md border-b-2 border-parchment-shadow px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div
            onClick={() => {
              if (activeGame && confirm("Voulez-vous retourner au menu principal sans perdre votre partie ?")) {
                // simple refresh or stay
              }
            }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <SkullKingLogo size={36} />
            <span className="font-pirate text-xl font-bold tracking-wider text-ink">
              Skull King
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {activeGame && (
              <>
                <button
                  type="button"
                  onClick={undoLastAction}
                  disabled={!canUndo}
                  title="Annuler (Undo)"
                  className="p-2 rounded-lg bg-parchment-light border border-parchment-shadow text-ink disabled:opacity-40 hover:bg-parchment transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsScoreboardOpen(true)}
                  title="Grille de score"
                  className="flex items-center gap-1 text-xs font-display font-bold px-3 py-2 rounded-lg bg-gold-dark text-ink-pure shadow-sm hover:brightness-105 transition-all"
                >
                  <Trophy className="w-4 h-4" />
                  <span className="hidden sm:inline">Tableau</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Commencer une nouvelle partie ? L'actuelle sera abandonnée.")) {
                      resetGame();
                    }
                  }}
                  title="Nouvelle partie"
                  className="p-2 rounded-lg bg-parchment-light border border-parchment-shadow text-wax hover:bg-parchment transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                </button>
              </>
            )}

            {!activeGame && gameHistory.length > 0 && (
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-1.5 text-xs font-display font-bold px-3 py-2 rounded-lg bg-parchment-light border border-parchment-shadow text-ink hover:bg-parchment transition-colors"
              >
                <History className="w-4 h-4 text-gold-deep" />
                <span>Archives ({gameHistory.length})</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Corps principal avec Safe Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 pb-[max(2rem,env(safe-area-inset-bottom))]">
        {!activeGame && (
          <GameSetup
            onStartGame={startNewGame}
            savedPlayers={savedPlayers}
            initialSettings={settings}
          />
        )}

        {activeGame && (activeGame.status === 'bidding' || activeGame.status === 'tricks') && (
          <RoundEntry
            gameState={activeGame}
            onSubmitRound={submitRound}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
          />
        )}

        {activeGame && activeGame.status === 'recap' && (
          <RoundRecap
            gameState={activeGame}
            onProceed={proceedToNextRound}
            onUndo={undoLastAction}
            canUndo={canUndo}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
          />
        )}

        {activeGame && activeGame.status === 'completed' && (
          <GameOverPodium
            gameState={activeGame}
            onNewGame={resetGame}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
            onUndo={undoLastAction}
            canUndo={canUndo}
          />
        )}
      </main>

      {/* Modal du Tableau de score complet */}
      {activeGame && (
        <ScoreboardModal
          isOpen={isScoreboardOpen}
          onClose={() => setIsScoreboardOpen(false)}
          gameState={activeGame}
        />
      )}

      {/* Modal d'historique des anciennes parties */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-parchment-light max-w-lg w-full rounded-xl border-2 border-gold-dark p-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-parchment-shadow pb-2">
              <h3 className="font-pirate text-xl text-ink font-bold">Archives des Traversées</h3>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-ink-faded font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {gameHistory.map((game, i) => {
                const winner = game.rounds[game.rounds.length - 1]?.playerScores.slice().sort(
                  (a, b) => b.cumulativeTotal - a.cumulativeTotal
                )[0];
                const winnerName = game.players.find((p) => p.id === winner?.playerId)?.name;

                return (
                  <div
                    key={game.id || i}
                    className="p-3 bg-parchment border border-parchment-deep rounded-lg flex justify-between items-center text-xs sm:text-sm"
                  >
                    <div>
                      <span className="font-display font-bold text-ink block">
                        Partie du {new Date(game.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                      <span className="text-ink-light">
                        {game.players.length} pirates • {game.settings.mode.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gold-deep font-bold block">
                        👑 {winnerName || 'Inconnu'}
                      </span>
                      <span className="font-mono font-bold text-ink-pure">
                        {winner?.cumulativeTotal || 0} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
