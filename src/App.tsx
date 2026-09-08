import { useState } from 'react';
import { useGameManager } from './hooks/useGameManager';
import { GameSetup } from './components/GameSetup';
import { RoundEntry } from './components/RoundEntry';
import { RoundRecap } from './components/RoundRecap';
import { GameOverPodium } from './components/GameOverPodium';
import { ScoreboardModal } from './components/ScoreboardModal';
import { SkullKingLogo } from './components/SkullKingLogo';
import { Trophy, History, Home, AlertCircle } from 'lucide-react';
import { ButtonPirate } from './components/ParchmentUI';

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
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-parchment-dark text-ink selection:bg-gold-light selection:text-ink-pure">
      {/* Top Navigation Bar Ultra-épurée avec Safe Area iOS */}
      <header className="sticky top-0 z-40 bg-parchment/95 backdrop-blur-md border-b-2 border-parchment-shadow px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SkullKingLogo size={34} />
            <span className="font-pirate text-xl font-bold tracking-wider text-ink">
              Skull King
            </span>
          </div>

          <div>
            {activeGame ? (
              <button
                type="button"
                onClick={() => setShowQuitConfirm(true)}
                title="Quitter la partie"
                aria-label="Quitter / Menu principal"
                className="flex items-center gap-1.5 text-xs font-display font-bold px-3 py-2 rounded-lg bg-parchment-light border border-parchment-shadow text-ink hover:bg-parchment transition-colors"
              >
                <Home className="w-4 h-4 text-wax" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            ) : gameHistory.length > 0 ? (
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                className="flex items-center gap-1.5 text-xs font-display font-bold px-3 py-2 rounded-lg bg-parchment-light border border-parchment-shadow text-ink hover:bg-parchment transition-colors"
              >
                <History className="w-4 h-4 text-gold-deep" />
                <span>Archives ({gameHistory.length})</span>
              </button>
            ) : null}
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

      {/* Modale de confirmation Quitter la partie */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-parchment-light max-w-sm w-full rounded-2xl border-4 border-gold-dark p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-parchment-shadow pb-3">
              <div className="p-2 rounded-full bg-wax-light/20 text-wax">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-pirate text-lg text-ink font-bold">
                  Quitter la partie ?
                </h3>
                <p className="text-xs text-ink-light">
                  Vos données restent sauvegardées
                </p>
              </div>
            </div>

            <p className="text-sm text-ink-light font-sans">
              Vous pouvez revenir à tout moment au menu principal. Votre partie en cours ne sera pas perdue.
            </p>

            <div className="flex gap-2 pt-2">
              <ButtonPirate
                type="button"
                onClick={() => setShowQuitConfirm(false)}
                variant="ghost"
                size="sm"
                className="flex-1"
              >
                Continuer
              </ButtonPirate>

              <ButtonPirate
                type="button"
                onClick={() => {
                  setShowQuitConfirm(false);
                  resetGame();
                }}
                variant="wax"
                size="sm"
                className="flex-1"
              >
                Quitter
              </ButtonPirate>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
