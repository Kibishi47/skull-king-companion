import React from 'react';
import { GameState } from '../types/game';
import { ParchmentCard, ButtonPirate } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { ArrowRight, Pencil, CheckCircle2, XCircle, Trophy } from 'lucide-react';

interface RoundRecapProps {
  gameState: GameState;
  onProceed: () => void;
  onEditRound: () => void;
  onOpenScoreboard: () => void;
}

export const RoundRecap: React.FC<RoundRecapProps> = ({
  gameState,
  onProceed,
  onEditRound,
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

      {/* Actions et Raccourcis */}
      <div className="space-y-3 pt-2 w-full max-w-md mx-auto box-border">
        <ButtonPirate
          type="button"
          onClick={onOpenScoreboard}
          variant="wood"
          size="md"
          className="w-full gap-2 shadow-md whitespace-nowrap text-xs sm:text-sm py-3"
        >
          <Trophy className="w-4 h-4 text-gold shrink-0" />
          <span>Tableau des scores</span>
        </ButtonPirate>

        <div className="flex flex-col sm:flex-row gap-2.5 w-full box-border">
          <ButtonPirate
            type="button"
            onClick={onEditRound}
            variant="ghost"
            size="md"
            className="flex-1 min-w-0 gap-1.5 whitespace-nowrap text-xs sm:text-sm py-3"
          >
            <Pencil className="w-4 h-4 shrink-0 text-gold-deep" />
            <span>Modifier la manche</span>
          </ButtonPirate>

          <ButtonPirate
            type="button"
            onClick={onProceed}
            variant="wax"
            size="lg"
            className="flex-1 min-w-0 gap-2 shadow-xl whitespace-nowrap text-sm sm:text-base font-extrabold py-3.5"
          >
            <span>Manche suivante</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          </ButtonPirate>
        </div>
      </div>
    </div>
  );
};
