import React, { useEffect } from 'react';
import { GameState } from '../types/game';
import { ParchmentCard, ButtonPirate } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { Trophy, Crown, RotateCcw, Swords, Flame, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameOverPodiumProps {
  gameState: GameState;
  onNewGame: () => void;
  onOpenScoreboard: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export const GameOverPodium: React.FC<GameOverPodiumProps> = ({
  gameState,
  onNewGame,
  onOpenScoreboard,
  onUndo,
  canUndo,
}) => {
  // Déclencher les feux d'artifice/confettis à l'apparition du podium
  useEffect(() => {
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#e5ab48', '#a62828', '#1e130c', '#f2c968'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch {
      // ignore
    }
  }, []);

  const lastRound = gameState.rounds[gameState.rounds.length - 1];
  const finalScores = [...(lastRound?.playerScores || [])].sort(
    (a, b) => b.cumulativeTotal - a.cumulativeTotal
  );

  const winner = finalScores[0];
  const winnerPlayer = gameState.players.find((p) => p.id === winner?.playerId);

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-16 text-center">
      {/* Vainqueur / Roi des Pirates */}
      <div className="pt-2">
        <div className="relative inline-block">
          <SkullKingLogo size={96} className="animate-bounce" />
          <Crown className="w-10 h-10 text-gold absolute -top-4 -right-2 drop-shadow-md" />
        </div>
        <p className="text-xs uppercase font-display font-extrabold tracking-widest text-gold-deep mt-2">
          Le Roi Suprême des Sept Mers
        </p>
        <h1 className="font-pirate text-3xl sm:text-4xl text-ink font-black mt-1">
          {winnerPlayer?.name || 'Pirate'}
        </h1>
        <div className="inline-block bg-wax text-parchment-light px-4 py-1 rounded-full font-mono font-black text-lg mt-2 shadow-md">
          {winner?.cumulativeTotal || 0} Points
        </div>
      </div>

      {/* Podium visuel officiel */}
      <ParchmentCard variant="light" className="p-4 space-y-3">
        <h3 className="font-pirate text-lg sm:text-xl text-ink border-b border-parchment-shadow pb-2 flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-gold-deep" />
          <span>Classement Final</span>
        </h3>

        <div className="space-y-2 text-left">
          {finalScores.map((score, rank) => {
            const p = gameState.players.find((item) => item.id === score.playerId);
            const isFirst = rank === 0;

            return (
              <div
                key={score.playerId}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  isFirst
                    ? 'bg-gold-light/40 border-gold-dark ring-2 ring-gold/40 font-bold'
                    : 'bg-parchment border-parchment-deep'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-pirate font-black text-sm ${
                      isFirst
                        ? 'gold-gradient text-ink-pure shadow'
                        : 'bg-parchment-deep text-ink-light'
                    }`}
                  >
                    {rank + 1}
                  </span>
                  <div>
                    <span className="font-display font-bold text-ink text-base">
                      {p?.name}
                    </span>
                    {isFirst && (
                      <span className="text-xs text-gold-deep font-bold block">
                        Roi des Pirates 👑
                      </span>
                    )}
                  </div>
                </div>

                <div className="font-mono text-lg font-black text-ink-pure">
                  {score.cumulativeTotal} pts
                </div>
              </div>
            );
          })}
        </div>
      </ParchmentCard>

      {/* Raccourcis et Actions */}
      <div className="space-y-3 pt-2">
        <ButtonPirate
          type="button"
          onClick={onOpenScoreboard}
          variant="wood"
          size="md"
          className="w-full gap-2 whitespace-nowrap"
        >
          <Trophy className="w-4 h-4" />
          <span>Grille de score</span>
        </ButtonPirate>

        <div className="flex gap-2">
          <ButtonPirate
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            variant="ghost"
            size="md"
            className="gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Annuler manche</span>
          </ButtonPirate>

          <ButtonPirate
            type="button"
            onClick={onNewGame}
            variant="wax"
            size="lg"
            className="flex-1 gap-2 shadow-xl whitespace-nowrap"
          >
            <Swords className="w-5 h-5" />
            <span>Nouvelle partie</span>
          </ButtonPirate>
        </div>
      </div>
    </div>
  );
};
