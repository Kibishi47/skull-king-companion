import { useState } from 'react';
import { useGameManager } from './hooks/useGameManager';
import { GameSetup } from './components/GameSetup';
import { RoundEntry } from './components/RoundEntry';
import { RoundRecap } from './components/RoundRecap';
import { GameOverPodium } from './components/GameOverPodium';
import { ScoreboardModal } from './components/ScoreboardModal';
import { SavedGamesModal } from './components/SavedGamesModal';
import { SkullKingLogo } from './components/SkullKingLogo';
import { Trophy, Home, AlertCircle, FolderOpen } from 'lucide-react';
import { ButtonPirate } from './components/ParchmentUI';

export function App() {
  const {
    activeGame,
    savedGames,
    savedPlayers,
    settings,
    canUndo,
    startNewGame,
    submitRound,
    proceedToNextRound,
    undoLastAction,
    editingRoundIndex,
    startEditingRound,
    cancelEditingRound,
    saveEditedRound,
    editRoundJustFinished,
    resetGame,
    loadGame,
    deleteSavedGame,
    deleteSavedPlayer,
  } = useGameManager();

  const [isScoreboardOpen, setIsScoreboardOpen] = useState(false);
  const [isSavedGamesModalOpen, setIsSavedGamesModalOpen] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  return (
    <div className="min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] flex flex-col bg-parchment-dark text-ink selection:bg-gold-light selection:text-ink-pure">
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
                className="flex items-center gap-1.5 text-xs font-display font-bold px-3 py-2 rounded-lg bg-parchment-light border border-parchment-shadow text-ink hover:bg-parchment whitespace-nowrap transition-colors"
              >
                <Home className="w-4 h-4 text-wax" />
                <span className="hidden sm:inline">Menu</span>
              </button>
            ) : savedGames.length > 0 ? (
              <button
                type="button"
                onClick={() => setIsSavedGamesModalOpen(true)}
                className="flex items-center gap-1.5 text-xs font-display font-bold px-3 py-2 rounded-lg bg-parchment-light border border-parchment-shadow text-ink hover:bg-parchment whitespace-nowrap transition-colors"
              >
                <FolderOpen className="w-4 h-4 text-gold-deep" />
                <span>Parties</span>
              </button>
            ) : null}
          </div>
        </div>
      </header>

      {/* Corps principal avec Safe Area et marge pour l'action bar sticky */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 pb-28">
        {!activeGame && (
          <GameSetup
            onStartGame={startNewGame}
            savedPlayers={savedPlayers}
            onDeleteSavedPlayer={deleteSavedPlayer}
            initialSettings={settings}
          />
        )}

        {/* Mode d'édition dédié pour modifier une manche antérieure ou venant de se terminer */}
        {activeGame && editingRoundIndex !== null && (
          <RoundEntry
            gameState={activeGame}
            roundIndex={editingRoundIndex}
            isEditing={true}
            onCancelEdit={cancelEditingRound}
            onSubmitRound={(inputs) => saveEditedRound(editingRoundIndex, inputs)}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
          />
        )}

        {/* Déroulement standard de la partie */}
        {activeGame && editingRoundIndex === null && (activeGame.status === 'bidding' || activeGame.status === 'tricks') && (
          <RoundEntry
            gameState={activeGame}
            onSubmitRound={submitRound}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
          />
        )}

        {activeGame && editingRoundIndex === null && activeGame.status === 'recap' && (
          <RoundRecap
            gameState={activeGame}
            onProceed={proceedToNextRound}
            onEditRound={editRoundJustFinished}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
          />
        )}

        {activeGame && editingRoundIndex === null && activeGame.status === 'completed' && (
          <GameOverPodium
            gameState={activeGame}
            onNewGame={resetGame}
            onOpenScoreboard={() => setIsScoreboardOpen(true)}
            onEditRound={editRoundJustFinished}
          />
        )}
      </main>

      {/* Modal du Tableau de score complet */}
      {activeGame && (
        <ScoreboardModal
          isOpen={isScoreboardOpen}
          onClose={() => setIsScoreboardOpen(false)}
          gameState={activeGame}
          onEditRound={(roundIdx) => startEditingRound(roundIdx)}
        />
      )}

      {/* Modal des parties sauvegardées */}
      <SavedGamesModal
        isOpen={isSavedGamesModalOpen}
        onClose={() => setIsSavedGamesModalOpen(false)}
        savedGames={savedGames}
        onLoadGame={(game) => {
          loadGame(game);
        }}
        onDeleteGame={(id) => {
          deleteSavedGame(id);
        }}
      />

      {/* Modale de confirmation Quitter la partie */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
          <div
            className="bg-parchment-light max-w-sm w-full rounded-t-2xl sm:rounded-2xl border-t-4 sm:border-2 border-gold-dark p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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
