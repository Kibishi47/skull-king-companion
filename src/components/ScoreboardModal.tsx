import React, { useState } from 'react';
import { GameState } from '../types/game';
import { ParchmentCard, ButtonPirate } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { X, Trophy, Crown, Table, Medal, Pencil, CheckCircle2, XCircle } from 'lucide-react';

interface ScoreboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameState: GameState;
  onEditRound?: (roundIndex: number) => void;
}

export const ScoreboardModal: React.FC<ScoreboardModalProps> = ({
  isOpen,
  onClose,
  gameState,
  onEditRound,
}) => {
  const [activeTab, setActiveTab] = useState<'ranking' | 'matrix'>('ranking');

  if (!isOpen) return null;

  // Calculer les statistiques globales par joueur
  const completedRounds = gameState.rounds.filter((r) => r.isCompleted);
  const latestCompletedRoundIndex = gameState.rounds
    .map((r, i) => (r.isCompleted ? i : -1))
    .filter((i) => i !== -1)
    .pop();

  const playerStats = gameState.players.map((player) => {
    let totalScore = 0;
    let successfulBids = 0;
    let totalBid = 0;
    let totalTricks = 0;
    let totalBonus = 0;

    if (latestCompletedRoundIndex !== undefined) {
      const scoreObj = gameState.rounds[latestCompletedRoundIndex]?.playerScores.find(
        (s) => s.playerId === player.id
      );
      if (scoreObj) totalScore = scoreObj.cumulativeTotal;
    }

    completedRounds.forEach((round) => {
      const s = round.playerScores.find((score) => score.playerId === player.id);
      if (s) {
        if (s.bidSuccess) successfulBids += 1;
        totalBid += s.bid;
        totalTricks += s.tricks;
        totalBonus += s.bonusScore;
      }
    });

    const roundsPlayed = completedRounds.length;
    const successRate = roundsPlayed > 0 ? Math.round((successfulBids / roundsPlayed) * 100) : 0;
    const avgBid = roundsPlayed > 0 ? (totalBid / roundsPlayed).toFixed(1) : '0.0';

    return {
      player,
      totalScore,
      successfulBids,
      roundsPlayed,
      successRate,
      avgBid,
      totalTricks,
      totalBonus,
    };
  });

  const sortedLeaderboard = [...playerStats].sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-2 sm:p-4">
      <div className="w-full max-w-4xl bg-parchment-light rounded-2xl border-4 border-gold-dark shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header de la Modale */}
        <div className="flex items-center justify-between bg-parchment border-b-2 border-parchment-deep p-3.5 sm:p-4">
          <div className="flex items-center gap-3">
            <SkullKingLogo size={38} />
            <div>
              <h2 className="font-pirate text-xl sm:text-2xl text-ink font-bold leading-tight">
                Tableau de Score Officiel
              </h2>
              <p className="text-xs text-ink-faded font-sans">
                Classement global & carnet papier
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-faded hover:text-ink hover:bg-parchment-deep transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sélecteur d'onglets au sommet */}
        <div className="bg-parchment-dark/60 border-b border-parchment-deep px-3 sm:px-4 pt-2.5 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('ranking')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-display font-bold rounded-t-lg transition-all border-t-2 border-x-2 ${
              activeTab === 'ranking'
                ? 'bg-parchment-light text-ink border-gold-dark shadow-sm -mb-[1px] z-10'
                : 'bg-parchment/70 text-ink-light border-transparent hover:text-ink hover:bg-parchment'
            }`}
          >
            <Medal className="w-4 h-4 text-gold-deep" />
            <span>Classement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-display font-bold rounded-t-lg transition-all border-t-2 border-x-2 ${
              activeTab === 'matrix'
                ? 'bg-parchment-light text-ink border-gold-dark shadow-sm -mb-[1px] z-10'
                : 'bg-parchment/70 text-ink-light border-transparent hover:text-ink hover:bg-parchment'
            }`}
          >
            <Table className="w-4 h-4 text-gold-deep" />
            <span>Grille des manches</span>
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">
          {/* ONGLET 1 : CLASSEMENT GLOBAL */}
          {activeTab === 'ranking' && (
            <div className="space-y-3">
              {sortedLeaderboard.map((item, rank) => {
                const isLeader = rank === 0 && item.totalScore > 0;
                return (
                  <ParchmentCard
                    key={item.player.id}
                    variant="light"
                    className={`p-3.5 border-2 transition-all ${
                      isLeader ? 'border-gold-dark ring-2 ring-gold/30' : 'border-parchment-deep'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-pirate font-black text-sm shrink-0 ${
                            rank === 0
                              ? 'gold-gradient text-ink-pure shadow-md'
                              : rank === 1
                              ? 'bg-parchment-deep text-ink font-extrabold border border-ink/20'
                              : 'bg-black/5 text-ink-light'
                          }`}
                        >
                          #{rank + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-extrabold text-base sm:text-lg text-ink">
                              {item.player.name}
                            </span>
                            {isLeader && <Crown className="w-4 h-4 text-gold-deep" />}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-light mt-0.5 font-sans">
                            <span>
                              Contrats : <strong>{item.successfulBids}/{item.roundsPlayed}</strong> ({item.successRate}%)
                            </span>
                            <span>
                              Mise moy : <strong>{item.avgBid}</strong>
                            </span>
                            {item.totalBonus > 0 && (
                              <span className="text-gold-deep font-semibold">
                                +{item.totalBonus} bonus
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono text-xl sm:text-2xl font-black text-ink-pure">
                          {item.totalScore}
                        </span>
                        <span className="text-xs text-ink-light block font-display">pts</span>
                      </div>
                    </div>
                  </ParchmentCard>
                );
              })}

              {completedRounds.length === 0 && (
                <div className="text-center py-8 text-ink-faded font-sans text-sm">
                  Aucune manche terminée pour le moment.
                </div>
              )}
            </div>
          )}

          {/* ONGLET 2 : GRILLE DES MANCHES (CARNET PAPIER OFFICIEL) */}
          {activeTab === 'matrix' && (
            <div className="overflow-x-auto pb-2">
              <table className="min-w-full border-collapse border-2 border-ink text-center text-xs sm:text-sm bg-parchment shadow-md">
                <thead>
                  <tr className="bg-pirate-wood text-parchment-light font-pirate sticky top-0 z-20">
                    <th className="border-2 border-ink p-2 w-16 text-center sticky left-0 bg-pirate-wood z-30 shadow-r">
                      Manche
                    </th>
                    <th className="border-2 border-ink p-2 w-14 text-center">Cartes</th>
                    {gameState.players.map((player) => (
                      <th key={player.id} className="border-2 border-ink p-2 min-w-[100px] sm:min-w-[130px]">
                        <div className="font-extrabold truncate">{player.name}</div>
                      </th>
                    ))}
                    {onEditRound && (
                      <th className="border-2 border-ink p-2 w-12 text-center">Éditer</th>
                    )}
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
                        {/* Numéro de manche (Sticky gauche) */}
                        <td className="border-2 border-ink font-pirate font-bold text-ink p-1.5 sticky left-0 bg-parchment-light z-10">
                          M{round.roundNumber}
                        </td>

                        {/* Nb cartes */}
                        <td className="border-2 border-ink font-mono font-bold text-gold-deep p-1.5">
                          {round.cardCount}
                        </td>

                        {/* Cellule joueur (Style carnet officiel) */}
                        {gameState.players.map((player) => {
                          const scoreData = round.playerScores.find((s) => s.playerId === player.id);

                          if (!round.isCompleted || !scoreData) {
                            return (
                              <td key={player.id} className="border-2 border-ink text-ink-faded p-2">
                                {isCurrent ? (
                                  <span className="text-gold-deep font-bold animate-pulse">• • •</span>
                                ) : (
                                  '-'
                                )}
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
                                {/* Mise & Plis */}
                                <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono px-1 border-b border-ink/20 pb-0.5">
                                  <span className="font-bold text-ink">M:{scoreData.bid}</span>
                                  <span className="font-bold text-ink-light">P:{scoreData.tricks}</span>
                                </div>

                                {/* Points de la manche */}
                                <div className="text-[11px] font-mono font-semibold py-0.5">
                                  <span
                                    className={
                                      scoreData.roundTotal >= 0 ? 'text-emerald-800' : 'text-wax font-bold'
                                    }
                                  >
                                    {scoreData.roundTotal >= 0
                                      ? `+${scoreData.roundTotal}`
                                      : scoreData.roundTotal}
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

                        {/* Action modifier la manche antérieure */}
                        {onEditRound && (
                          <td className="border-2 border-ink p-1.5 text-center">
                            {round.isCompleted ? (
                              <button
                                type="button"
                                onClick={() => {
                                  onEditRound(rIndex);
                                  onClose();
                                }}
                                className="p-1.5 rounded text-gold-deep hover:text-ink hover:bg-parchment-deep transition-colors"
                                title={`Modifier la manche ${round.roundNumber}`}
                                aria-label={`Modifier la manche ${round.roundNumber}`}
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-ink-faded text-xs">-</span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-parchment border-t border-parchment-deep flex justify-end">
          <ButtonPirate onClick={onClose} variant="wood" size="sm" className="whitespace-nowrap">
            Fermer
          </ButtonPirate>
        </div>
      </div>
    </div>
  );
};
