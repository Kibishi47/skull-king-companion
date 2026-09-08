import React, { useState } from 'react';
import { GameState, PlayerRoundInput, RascalOption } from '../types/game';
import { ParchmentCard, ButtonPirate } from './ParchmentUI';
import { BonusDrawer } from './BonusDrawer';
import { calculateBonusScore, createEmptyBonuses } from '../utils/scoring';
import { SkullKingLogo } from './SkullKingLogo';
import { Crown, AlertTriangle, Gem, Swords, ArrowRight, ArrowLeft } from 'lucide-react';

interface RoundEntryProps {
  gameState: GameState;
  onSubmitRound: (inputs: PlayerRoundInput[]) => void;
  onOpenScoreboard: () => void;
}

export const RoundEntry: React.FC<RoundEntryProps> = ({
  gameState,
  onSubmitRound,
  onOpenScoreboard,
}) => {
  const currentRound = gameState.rounds[gameState.currentRoundIndex];
  const cardCount = currentRound.cardCount;
  const isRascal = gameState.settings.mode === 'rascal';

  // Étape locale dans la saisie de la manche : 
  // Si le statut du jeu est 'tricks', démarrer directement sur 'tricks', sinon 'bidding'
  const [step, setStep] = useState<'bidding' | 'tricks'>(() => {
    return gameState.status === 'tricks' ? 'tricks' : 'bidding';
  });

  // État des saisies pour chaque joueur (conservation absolue des saisies)
  const [inputs, setInputs] = useState<Record<string, PlayerRoundInput>>(() => {
    const init: Record<string, PlayerRoundInput> = {};

    // 1. Vérifier si des saisies existaient déjà dans la manche actuelle (via lastInputs)
    if (currentRound.lastInputs && currentRound.lastInputs.length > 0) {
      currentRound.lastInputs.forEach((item) => {
        init[item.playerId] = { ...item };
      });
      return init;
    }

    // 2. Vérifier si des scores existaient déjà
    if (currentRound.playerScores && currentRound.playerScores.length > 0) {
      currentRound.playerScores.forEach((score) => {
        init[score.playerId] = {
          playerId: score.playerId,
          bid: score.bid,
          tricks: score.tricks,
          bonuses: createEmptyBonuses(),
          rascalOption: 'buckshot',
        };
      });
      return init;
    }

    // 3. Sinon, initialisation par défaut
    gameState.players.forEach((p) => {
      init[p.id] = {
        playerId: p.id,
        bid: 0,
        tricks: 0,
        bonuses: createEmptyBonuses(),
        rascalOption: 'buckshot',
      };
    });
    return init;
  });

  // Drawer de bonus
  const [activeBonusPlayerId, setActiveBonusPlayerId] = useState<string | null>(null);

  // Mises à jour partielles
  const updateBid = (playerId: string, bid: number) => {
    setInputs((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        bid: Math.max(0, Math.min(cardCount, bid)),
      },
    }));
  };

  const updateTricks = (playerId: string, tricks: number) => {
    setInputs((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        tricks: Math.max(0, Math.min(cardCount, tricks)),
      },
    }));
  };

  const updateRascalOption = (playerId: string, option: RascalOption) => {
    setInputs((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        rascalOption: option,
      },
    }));
  };

  // Sommes pour alertes
  const totalBids = Object.values(inputs).reduce((sum, item) => sum + item.bid, 0);
  const totalTricks = Object.values(inputs).reduce((sum, item) => sum + item.tricks, 0);

  const isBidsEqualToCards = totalBids === cardCount;
  const isTricksNotEqualToCards = totalTricks !== cardCount;

  const handleFinishRound = () => {
    const roundInputsList = gameState.players.map((p) => inputs[p.id]);
    onSubmitRound(roundInputsList);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-16">
      {/* Barre d'en-tête de la manche */}
      <div className="flex items-center justify-between bg-parchment-light border-2 border-parchment-deep rounded-xl p-3 shadow-md">
        <div className="flex items-center gap-2.5">
          <SkullKingLogo size={42} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pirate text-lg sm:text-xl text-ink font-bold leading-tight">
                Manche {currentRound.roundNumber} / {gameState.rounds.length}
              </h2>
              <span className="bg-gold-deep text-parchment-light px-2 py-0.5 rounded-full text-xs font-bold font-display">
                {cardCount} {cardCount > 1 ? 'cartes' : 'carte'}
              </span>
            </div>
            <p className="text-xs text-ink-light">
              {step === 'bidding' ? 'Mises' : 'Plis & Bonus'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenScoreboard}
          className="text-xs font-display font-bold text-ink bg-parchment border border-parchment-shadow px-3 py-1.5 rounded-lg hover:bg-parchment-deep transition-colors"
        >
          Grille
        </button>
      </div>

      {/* Étape 1 : Saisie des Mises (Bidding) */}
      {step === 'bidding' && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-3">
            {gameState.players.map((player) => {
              const isDealer = player.id === currentRound.dealerPlayerId;
              const currentBid = inputs[player.id]?.bid || 0;

              return (
                <ParchmentCard key={player.id} variant="light" className="p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-extrabold text-ink text-base sm:text-lg">
                        {player.name}
                      </span>
                      {isDealer && (
                        <span className="inline-flex items-center gap-1 bg-wax text-parchment-light px-2 py-0.5 rounded text-[11px] font-bold">
                          <Crown className="w-3 h-3" /> Donneur
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-ink-faded uppercase font-bold">Mise :</span>
                      <span className="font-pirate text-xl text-wax font-black w-8 text-right">
                        {currentBid}
                      </span>
                    </div>
                  </div>

                  {/* Pavé tactile rapide de sélection de la mise */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Array.from({ length: cardCount + 1 }).map((_, n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updateBid(player.id, n)}
                        className={`min-w-[40px] flex-1 py-2 rounded-lg font-bold text-sm sm:text-base transition-all ${
                          currentBid === n
                            ? n === 0
                              ? 'bg-wax text-white ring-2 ring-wax-border shadow-md'
                              : 'gold-gradient text-ink-pure ring-2 ring-gold-deep shadow-md font-extrabold'
                            : 'bg-parchment text-ink border border-parchment-shadow hover:bg-parchment-dark'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>

                  {/* Sélecteur Variante Rascal individuel (Chevrotine vs Boulet de canon) */}
                  {isRascal && (
                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-parchment-deep text-xs">
                      <span className="text-ink-faded font-bold">Option Rascal :</span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => updateRascalOption(player.id, 'buckshot')}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            inputs[player.id]?.rascalOption === 'buckshot'
                              ? 'bg-ink-light text-parchment font-bold'
                              : 'bg-parchment text-ink-faded'
                          }`}
                        >
                          Chevrotine
                        </button>
                        <button
                          type="button"
                          onClick={() => updateRascalOption(player.id, 'cannonball')}
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            inputs[player.id]?.rascalOption === 'cannonball'
                              ? 'bg-wax text-white font-bold'
                              : 'bg-parchment text-ink-faded'
                          }`}
                        >
                          Boulet de canon
                        </button>
                      </div>
                    </div>
                  )}
                </ParchmentCard>
              );
            })}
          </div>

          <ButtonPirate
            type="button"
            onClick={() => setStep('tricks')}
            variant="wax"
            size="lg"
            className="w-full gap-2 shadow-xl"
          >
            <span>Passer à la Bataille (Plis)</span>
            <ArrowRight className="w-5 h-5" />
          </ButtonPirate>
        </div>
      )}

      {/* Étape 2 : Saisie des Plis & Trésors/Bonus */}
      {step === 'tricks' && (
        <div className="space-y-4 animate-fade-in">
          {/* Indicateur clair du compte des plis avec contrôle d'intégrité */}
          <div
            className={`flex items-center justify-between p-3 rounded-lg border-2 font-display ${
              totalTricks === cardCount
                ? 'bg-emerald-50/80 border-emerald-600 text-emerald-900'
                : totalTricks < cardCount
                ? 'bg-amber-50/80 border-amber-500 text-amber-900'
                : 'bg-wax-light/20 border-wax text-wax-border'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base">Plis saisis :</span>
              <span className="font-mono font-black text-base sm:text-lg">
                {totalTricks} / {cardCount}
              </span>
            </div>

            <div className="text-xs sm:text-sm font-bold">
              {totalTricks === cardCount && (
                <span className="text-emerald-700 font-bold">Compte exact</span>
              )}
              {totalTricks < cardCount && (
                <span className="text-amber-700">
                  {cardCount - totalTricks} pli{cardCount - totalTricks > 1 ? 's' : ''} manquant{cardCount - totalTricks > 1 ? 's' : ''}
                </span>
              )}
              {totalTricks > cardCount && (
                <span className="text-wax font-bold">
                  +{totalTricks - cardCount} pli{totalTricks - cardCount > 1 ? 's' : ''} en trop
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {gameState.players.map((player) => {
              const currentInput = inputs[player.id];
              const bid = currentInput?.bid || 0;
              const tricks = currentInput?.tricks || 0;
              const bonusScore = calculateBonusScore(currentInput?.bonuses || createEmptyBonuses());
              const isMatch = bid === tricks;

              return (
                <ParchmentCard key={player.id} variant="light" className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-extrabold text-ink text-base sm:text-lg">
                          {player.name}
                        </span>
                        <span className="text-xs bg-parchment-deep text-ink-pure px-2 py-0.5 rounded font-bold">
                          Mise : {bid}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveBonusPlayerId(player.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-gold-deep bg-parchment border border-gold-dark/40 px-2.5 py-1.5 rounded-lg hover:bg-gold-light/20 transition-all"
                    >
                      <Gem className="w-3.5 h-3.5" />
                      <span>Bonus {bonusScore > 0 ? `+${bonusScore}` : ''}</span>
                    </button>
                  </div>

                  {/* Saisie rapide des plis remportés */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Array.from({ length: cardCount + 1 }).map((_, n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updateTricks(player.id, n)}
                        className={`min-w-[40px] flex-1 py-2 rounded-lg font-bold text-sm sm:text-base transition-all ${
                          tricks === n
                            ? isMatch
                              ? 'bg-emerald-700 text-white ring-2 ring-emerald-900 shadow-md font-extrabold'
                              : 'bg-wax text-white ring-2 ring-wax-border shadow-md'
                            : 'bg-parchment text-ink border border-parchment-shadow hover:bg-parchment-dark'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </ParchmentCard>
              );
            })}
          </div>

          {/* Boutons d'action avec validation bloquante */}
          <div className="flex gap-2.5 pt-2">
            <ButtonPirate
              type="button"
              onClick={() => setStep('bidding')}
              variant="ghost"
              size="md"
              className="gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Corriger Mises</span>
            </ButtonPirate>

            <ButtonPirate
              type="button"
              onClick={handleFinishRound}
              disabled={totalTricks !== cardCount}
              variant="wax"
              size="lg"
              className="flex-1 gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Swords className="w-5 h-5" />
              <span>
                {totalTricks === cardCount ? 'Valider la Manche' : `Plis incorrects (${totalTricks}/${cardCount})`}
              </span>
            </ButtonPirate>
          </div>
        </div>
      )}

      {/* Tiroir de Bonus */}
      {activeBonusPlayerId && (
        <BonusDrawer
          isOpen={Boolean(activeBonusPlayerId)}
          onClose={() => setActiveBonusPlayerId(null)}
          playerName={gameState.players.find((p) => p.id === activeBonusPlayerId)?.name || 'Pirate'}
          bonuses={inputs[activeBonusPlayerId].bonuses}
          onChange={(newBonuses) => {
            setInputs((prev) => ({
              ...prev,
              [activeBonusPlayerId]: {
                ...prev[activeBonusPlayerId],
                bonuses: newBonuses,
              },
            }));
          }}
        />
      )}
    </div>
  );
};
