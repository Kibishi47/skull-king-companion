import React, { useState, useEffect } from 'react';
import { GameState, PlayerRoundInput, RascalOption } from '../types/game';
import { ParchmentCard, ButtonPirate } from './ParchmentUI';
import { BonusDrawer } from './BonusDrawer';
import { calculateBonusScore, createEmptyBonuses } from '../utils/scoring';
import { SkullKingLogo } from './SkullKingLogo';
import { Crown, AlertTriangle, Gem, Swords, ArrowRight, ArrowLeft, Pencil, X } from 'lucide-react';

interface RoundEntryProps {
  gameState: GameState;
  roundIndex?: number; // Index de la manche à afficher/saisir (défaut: currentRoundIndex)
  isEditing?: boolean; // Mode édition dédié
  onCancelEdit?: () => void;
  onSubmitRound: (inputs: PlayerRoundInput[]) => void;
  onOpenScoreboard: () => void;
}

// Fonction utilitaire pour cloner profondément les inputs de manche
function buildInputsForRound(
  round: import('../types/game').Round,
  players: import('../types/game').Player[]
): Record<string, PlayerRoundInput> {
  const init: Record<string, PlayerRoundInput> = {};

  // 1. Si la manche a des lastInputs enregistrés (données de saisie complètes)
  if (round.lastInputs && round.lastInputs.length > 0) {
    round.lastInputs.forEach((item) => {
      init[item.playerId] = {
        playerId: item.playerId,
        bid: item.bid,
        tricks: item.tricks,
        bonuses: { ...item.bonuses },
        rascalOption: item.rascalOption || 'buckshot',
      };
    });
    // Vérifier que tous les joueurs sont présents
    players.forEach((p) => {
      if (!init[p.id]) {
        init[p.id] = {
          playerId: p.id,
          bid: 0,
          tricks: 0,
          bonuses: createEmptyBonuses(),
          rascalOption: 'buckshot',
        };
      }
    });
    return init;
  }

  // 2. Si la manche a des playerScores enregistrés
  if (round.playerScores && round.playerScores.length > 0) {
    round.playerScores.forEach((score) => {
      init[score.playerId] = {
        playerId: score.playerId,
        bid: score.bid,
        tricks: score.tricks,
        bonuses: createEmptyBonuses(),
        rascalOption: 'buckshot',
      };
    });
    players.forEach((p) => {
      if (!init[p.id]) {
        init[p.id] = {
          playerId: p.id,
          bid: 0,
          tricks: 0,
          bonuses: createEmptyBonuses(),
          rascalOption: 'buckshot',
        };
      }
    });
    return init;
  }

  // 3. Sinon, initialisation par défaut vierge
  players.forEach((p) => {
    init[p.id] = {
      playerId: p.id,
      bid: 0,
      tricks: 0,
      bonuses: createEmptyBonuses(),
      rascalOption: 'buckshot',
    };
  });
  return init;
}

export const RoundEntry: React.FC<RoundEntryProps> = ({
  gameState,
  roundIndex,
  isEditing = false,
  onCancelEdit,
  onSubmitRound,
  onOpenScoreboard,
}) => {
  const targetRoundIndex = roundIndex !== undefined ? roundIndex : gameState.currentRoundIndex;
  const currentRound = gameState.rounds[targetRoundIndex];
  const cardCount = currentRound.cardCount;
  const isRascal = gameState.settings.mode === 'rascal';

  // Étape locale :
  // En mode édition ou si tricks, on peut commencer directement sur 'tricks'
  const [step, setStep] = useState<'bidding' | 'tricks'>(() => {
    return isEditing || gameState.status === 'tricks' ? 'tricks' : 'bidding';
  });

  // État local des inputs, strictement et profondément synchronisé dès que targetRoundIndex change
  const [inputs, setInputs] = useState<Record<string, PlayerRoundInput>>(() => {
    return buildInputsForRound(currentRound, gameState.players);
  });

  // Réinitialiser/synchroniser si la manche cible change
  useEffect(() => {
    setInputs(buildInputsForRound(currentRound, gameState.players));
    setStep(isEditing || gameState.status === 'tricks' ? 'tricks' : 'bidding');
  }, [targetRoundIndex, currentRound, gameState.players, isEditing, gameState.status]);

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

  const handleFinishRound = () => {
    const roundInputsList = gameState.players.map((p) => inputs[p.id]);
    onSubmitRound(roundInputsList);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-16">
      {/* Bandeau distinctif en mode édition */}
      {isEditing && (
        <div className="bg-wax text-parchment-light px-4 py-3 rounded-xl border-2 border-wax-border shadow-md flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-gold animate-bounce" />
            <div>
              <h3 className="font-pirate text-base sm:text-lg font-bold">
                Modification de la Manche {currentRound.roundNumber}
              </h3>
              <p className="text-xs text-parchment-light/80 font-sans">
                Modifiez les plis ou bonus • Recalcul automatique en cascade
              </p>
            </div>
          </div>
          {onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex items-center gap-1 bg-black/20 hover:bg-black/40 text-xs font-display font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Annuler</span>
            </button>
          )}
        </div>
      )}

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
            <div className="flex items-center gap-2 text-xs text-ink-light mt-0.5">
              <button
                type="button"
                onClick={() => setStep('bidding')}
                className={`font-semibold hover:underline ${
                  step === 'bidding' ? 'text-wax font-extrabold underline' : ''
                }`}
              >
                1. Mises
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setStep('tricks')}
                className={`font-semibold hover:underline ${
                  step === 'tricks' ? 'text-wax font-extrabold underline' : ''
                }`}
              >
                2. Plis & Bonus
              </button>
            </div>
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

                  {/* Sélecteur Variante Rascal individuel */}
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
            className="w-full gap-2 shadow-xl whitespace-nowrap"
          >
            <span>Passer aux plis</span>
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
                : 'bg-rose-50/80 border-rose-600 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2">
              {totalTricks !== cardCount && <AlertTriangle className="w-5 h-5 shrink-0" />}
              <span className="font-bold text-sm">
                Total des plis réalisés :{' '}
                <span className="font-mono text-base font-black underline">{totalTricks}</span> / {cardCount}
              </span>
            </div>
            <span className="text-xs font-semibold">
              {totalTricks === cardCount
                ? 'Compte exact'
                : totalTricks < cardCount
                ? `Il manque ${cardCount - totalTricks} pli(s)`
                : `${totalTricks - cardCount} pli(s) en trop`}
            </span>
          </div>

          <div className="space-y-3">
            {gameState.players.map((player) => {
              const currentInput = inputs[player.id] || {
                playerId: player.id,
                bid: 0,
                tricks: 0,
                bonuses: createEmptyBonuses(),
              };
              const currentTricks = currentInput.tricks;
              const bonusScore = calculateBonusScore(currentInput.bonuses);

              return (
                <ParchmentCard key={player.id} variant="light" className="p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-display font-extrabold text-ink text-base sm:text-lg">
                        {player.name}
                      </span>
                      <span className="text-xs text-ink-light ml-2 font-mono">
                        (Mise annoncée : <strong>{currentInput.bid}</strong>)
                      </span>
                    </div>

                    {/* Bouton pour ouvrir le tiroir des Bonus */}
                    <button
                      type="button"
                      onClick={() => setActiveBonusPlayerId(player.id)}
                      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all ${
                        bonusScore > 0
                          ? 'gold-gradient text-ink-pure border-gold-dark font-black shadow-xs'
                          : 'bg-parchment text-ink-light border-parchment-shadow hover:bg-parchment-deep'
                      }`}
                    >
                      <Gem className="w-3.5 h-3.5" />
                      <span>{bonusScore > 0 ? `+${bonusScore} bonus` : 'Bonus'}</span>
                    </button>
                  </div>

                  {/* Pavé tactile pour les plis */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {Array.from({ length: cardCount + 1 }).map((_, n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updateTricks(player.id, n)}
                        className={`min-w-[40px] flex-1 py-2 rounded-lg font-bold text-sm sm:text-base transition-all ${
                          currentTricks === n
                            ? 'bg-pirate-wood text-parchment-light ring-2 ring-gold shadow-md font-extrabold'
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 w-full max-w-md mx-auto box-border">
            <ButtonPirate
              type="button"
              onClick={() => setStep('bidding')}
              variant="ghost"
              size="md"
              className="w-full min-w-0 gap-1.5 whitespace-nowrap text-xs sm:text-sm truncate"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span className="truncate">Modifier mises</span>
            </ButtonPirate>

            <ButtonPirate
              type="button"
              onClick={handleFinishRound}
              disabled={totalTricks !== cardCount}
              variant="wax"
              size="lg"
              className="sm:col-span-2 w-full min-w-0 gap-2 shadow-xl whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base font-extrabold truncate"
            >
              <Swords className="w-5 h-5 shrink-0" />
              <span className="truncate">
                {totalTricks === cardCount
                  ? isEditing
                    ? 'Enregistrer les modifications'
                    : 'Valider la manche'
                  : `Plis requis : ${totalTricks} / ${cardCount}`}
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
