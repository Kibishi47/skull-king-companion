import React from 'react';
import { GameState } from '../types/game';
import { ParchmentCard, ButtonPirate } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { ArrowRight, RotateCcw, CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface RoundRecapProps {
  gameState: GameState;
  onProceed: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onOpenScoreboard: () => void;
}

export const RoundRecap: React.FC<RoundRecapProps> = ({
  gameState,
  onProceed,
  onUndo,
  canUndo,
  onOpenScoreboard,
}) => {
  // Manche venant de se terminer
  const completedRoundIndex = gameState.currentRoundIndex - 1;
  const round = gameState.rounds[completedRoundIndex];

  if (!round) return null;

  // Trier les scores de cette manche du meilleur au moins bon
  const sortedScores = [...round.playerScores].sort((a, b) => b.cumulativeTotal - a.cumulativeTotal);

  return (
    <div className="max-w-xl mx-auto space-y-5 pb-16">
      {/* En-tête Bilan de manche */}
      <div className="text-center pt-2">
        <div className="flex justify-center mb-1">
          <SkullKingLogo size={64} />
        </div>
        <h2 className="font-pirate text-2xl sm:text-3xl text-ink font-bold">
          Bilan de la Manche {round.roundNumber}
        </h2>
        <p className="text-xs sm:text-sm text-ink-light font-display">
          {round.cardCount} cartes en jeu • Classement cumulé
        </p>
      </div>

      {/* Cartes récapitulatives par joueur */}
      <div className="space-y-3">
        {sortedScores.map((score, rank) => {
          const player = gameState.players.find((p) => p.id === score.playerId);
          const isSuccess = score.bidSuccess;

          return (
            <ParchmentCard
              key={score.playerId}
              variant="light"
              className={`p-3.5 border-2 ${
                rank === 0 ? 'border-gold-dark ring-2 ring-gold/30' : 'border-parchment-deep'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-pirate font-black text-sm ${
                      rank === 0
                        ? 'gold-gradient text-ink-pure shadow-md'
                        : 'bg-parchment-deep text-ink'
                    }`}
                  >
                    #{rank + 1}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-extrabold text-base sm:text-lg text-ink">
                        {player?.name || 'Pirate'}
                      </span>
                      {isSuccess ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-wax" />
                      )}
                    </div>
                    <div className="text-xs text-ink-light font-mono">
                      Mise: <strong>{score.bid}</strong> | Plis: <strong>{score.tricks}</strong>
                      {score.bonusScore > 0 && (
                        <span className="text-gold-deep font-bold ml-1.5">
                          (+{score.bonusScore} bonus)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`font-mono text-sm font-bold ${
                      score.roundTotal >= 0 ? 'text-emerald-700' : 'text-wax'
                    }`}
                  >
                    {score.roundTotal >= 0 ? `+${score.roundTotal}` : score.roundTotal} pts
                  </div>
                  <div className="font-mono text-base sm:text-lg font-black text-ink-pure">
                    Total: {score.cumulativeTotal}
                  </div>
                </div>
              </div>
            </ParchmentCard>
          );
        })}
      </div>

      {/* Raccourci vers la grille complète */}
      <div className="text-center">
        <button
          type="button"
          onClick={onOpenScoreboard}
          className="text-xs sm:text-sm font-bold font-display text-gold-deep hover:underline inline-flex items-center gap-1.5"
        >
          <Trophy className="w-4 h-4" />
          <span>Consulter le Tableau de Score Complet</span>
        </button>
      </div>

      {/* Barre d'actions : Undo et Prochaine manche */}
      <div className="flex gap-2.5 pt-2">
        <ButtonPirate
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          variant="ghost"
          size="md"
          className="gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Annuler (Undo)</span>
        </ButtonPirate>

        <ButtonPirate
          type="button"
          onClick={onProceed}
          variant="wax"
          size="lg"
          className="flex-1 gap-2 shadow-xl"
        >
          <span>Manche Suivante</span>
          <ArrowRight className="w-5 h-5" />
        </ButtonPirate>
      </div>
    </div>
  );
};
