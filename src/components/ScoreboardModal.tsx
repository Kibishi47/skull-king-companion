import React from 'react';
import { GameState } from '../types/game';
import { ParchmentCard, ButtonPirate } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { X, Trophy, Crown } from 'lucide-react';

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({
  isOpen,
  onClose,
  gameState,
}) => {
  if (!isOpen) return null;

  // Déterminer le classement actuel
  const latestCompletedRoundIndex = gameState.rounds
    .map((r, i) => (r.isCompleted ? i : -1))
    .filter((i) => i !== -1)
    .pop();

  const currentScores: Record<string, number> = {};
  gameState.players.forEach((p) => {
    if (latestCompletedRoundIndex !== undefined) {
      const score = gameState.rounds[latestCompletedRoundIndex]?.playerScores.find(
        (s) => s.playerId === p.id
      );
      currentScores[p.id] = score ? score.cumulativeTotal : 0;
    } else {
      currentScores[p.id] = 0;
    }
  });

  const sortedLeaderboard = [...gameState.players].sort(
    (a, b) => (currentScores[b.id] || 0) - (currentScores[a.id] || 0)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-parchment-light rounded-2xl border-4 border-gold-dark shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-parchment border-b-2 border-parchment-deep p-4">
          <div className="flex items-center gap-3">
            <SkullKingLogo size={40} />
            <div>
              <h2 className="font-pirate text-xl sm:text-2xl text-ink font-bold">
                Tableau de Score Officiel
              </h2>
              <p className="text-xs text-ink-faded font-sans">
                Grille des manches & carnet de bord
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-faded hover:text-ink hover:bg-parchment-deep"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Classement provisoire rapide */}
        <div className="bg-parchment-dark/70 border-b border-parchment-deep px-4 py-2.5 flex items-center gap-2 overflow-x-auto text-xs sm:text-sm">
          <span className="font-pirate font-bold text-ink flex items-center gap-1 shrink-0">
            <Trophy className="w-4 h-4 text-gold-deep" /> Rang :
          </span>
          {sortedLeaderboard.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border shrink-0 ${
                index === 0
                  ? 'bg-gold-light/40 border-gold-dark font-extrabold text-ink-pure'
                  : 'bg-parchment border-parchment-shadow text-ink'
              }`}
            >
              {index === 0 && <Crown className="w-3.5 h-3.5 text-gold-deep" />}
              <span>{player.name} :</span>
              <span className="font-mono font-black">{currentScores[player.id] || 0} pts</span>
            </div>
          ))}
        </div>

        {/* Grille matricielle officielle avec scroll horizontal fluide */}
        <div className="flex-1 overflow-auto p-3 sm:p-5">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full border-collapse border-2 border-ink text-center text-xs sm:text-sm bg-parchment shadow-md">
              <thead>
                <tr className="bg-pirate-wood text-parchment-light font-pirate">
                  <th className="border-2 border-ink p-2 w-16 text-center">Manche</th>
                  <th className="border-2 border-ink p-2 w-16 text-center">Cartes</th>
                  {gameState.players.map((player) => (
                    <th key={player.id} className="border-2 border-ink p-2 min-w-[90px] sm:min-w-[120px]">
                      <div className="font-extrabold truncate">{player.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gameState.rounds.map((round, rIndex) => {
                  const isCurrent = rIndex === gameState.currentRoundIndex;
                  return (
                    <tr
                      key={round.roundNumber}
                      className={
                        isCurrent
                          ? 'bg-gold-light/20 font-bold'
                          : rIndex % 2 === 0
                          ? 'bg-parchment-light'
                          : 'bg-parchment'
                      }
                    >
                      {/* Numéro de manche */}
                      <td className="border-2 border-ink font-pirate font-bold text-ink p-1.5">
                        M{round.roundNumber}
                      </td>

                      {/* Nb cartes */}
                      <td className="border-2 border-ink font-mono font-bold text-gold-deep p-1.5">
                        {round.cardCount}
                      </td>

                      {/* Cellule joueur (Style carnet officiel : mise en haut à gauche, plis en bas à droite, total) */}
                      {gameState.players.map((player) => {
                        const scoreData = round.playerScores.find((s) => s.playerId === player.id);

                        if (!round.isCompleted || !scoreData) {
                          return (
                            <td key={player.id} className="border-2 border-ink text-ink-faded p-2">
                              {isCurrent ? <span className="text-gold-deep font-bold animate-pulse">• • •</span> : '-'}
                            </td>
                          );
                        }

                        const isSuccess = scoreData.bidSuccess;

                        return (
                          <td
                            key={player.id}
                            className={`border-2 border-ink p-1.5 relative ${
                              isSuccess ? 'bg-emerald-50/60' : 'bg-wax-light/10'
                            }`}
                          >
                            <div className="flex flex-col justify-between min-h-[52px]">
                              {/* Case biseautée haut : Mise (gauche) & Plis (droite) */}
                              <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono px-1 border-b border-ink/20 pb-0.5">
                                <span className="font-bold text-ink">M:{scoreData.bid}</span>
                                <span className="font-bold text-ink-light">P:{scoreData.tricks}</span>
                              </div>

                              {/* Points de la manche (+ bonus éventuel) */}
                              <div className="text-[11px] font-mono font-semibold py-0.5">
                                <span className={scoreData.roundTotal >= 0 ? 'text-emerald-800' : 'text-wax font-bold'}>
                                  {scoreData.roundTotal >= 0 ? `+${scoreData.roundTotal}` : scoreData.roundTotal}
                                </span>
                                {scoreData.bonusScore > 0 && (
                                  <span className="text-[9px] text-gold-deep block">
                                    (+{scoreData.bonusScore} b.)
                                  </span>
                                )}
                              </div>

                              {/* Total Cumulé */}
                              <div className="text-xs sm:text-sm font-mono font-black text-ink-pure bg-black/5 rounded py-0.5 mt-0.5">
                                {scoreData.cumulativeTotal}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-parchment border-t border-parchment-deep flex justify-end">
          <ButtonPirate onClick={onClose} variant="wood" size="sm">
            Fermer le Carnet
          </ButtonPirate>
        </div>
      </div>
    </div>
  );
};
