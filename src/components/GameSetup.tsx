import React, { useState } from 'react';
import { GameSettings, RoundPreset } from '../types/game';
import { ROUND_PRESETS } from '../utils/presets';
import { ButtonPirate, ParchmentCard } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { Users, Plus, Trash2, Swords, Shield, Settings2, Sparkles, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { PlayerPickerModal } from './PlayerPickerModal';

interface GameSetupProps {
  onStartGame: (players: string[], settings: GameSettings) => void;
  savedPlayers: string[];
  initialSettings: GameSettings;
}

export const GameSetup: React.FC<GameSetupProps> = ({
  onStartGame,
  savedPlayers,
  initialSettings,
}) => {
  // Initialisation avec 3 champs vierges
  const [playerInputs, setPlayerInputs] = useState<string[]>(['', '', '']);
  const [settings, setSettings] = useState<GameSettings>(initialSettings);
  const [customRounds, setCustomRounds] = useState<string[]>(['1', '2', '3', '4', '5']);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handlePlayerInputChange = (index: number, value: string) => {
    const updated = [...playerInputs];
    updated[index] = value;
    setPlayerInputs(updated);
  };

  const handleAddPlayerField = (name: string = '') => {
    if (playerInputs.length >= 8) return;
    setPlayerInputs([...playerInputs, name]);
  };

  const handleRemovePlayerField = (index: number) => {
    if (playerInputs.length <= 2) return; // 2 joueurs minimum
    setPlayerInputs(playerInputs.filter((_, i) => i !== index));
  };

  const handleMovePlayerUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...playerInputs];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    setPlayerInputs(updated);
  };

  const handleMovePlayerDown = (index: number) => {
    if (index >= playerInputs.length - 1) return;
    const updated = [...playerInputs];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    setPlayerInputs(updated);
  };

  const handlePresetSelect = (preset: RoundPreset) => {
    setSettings({
      ...settings,
      presetId: preset.id,
    });
  };

  const handleCustomRoundChange = (index: number, rawValue: string) => {
    // Autoriser le champ vide pour permettre à l'utilisateur d'effacer et retaper
    const updated = [...customRounds];
    if (rawValue === '') {
      updated[index] = '';
    } else {
      const parsed = parseInt(rawValue, 10);
      if (isNaN(parsed)) {
        updated[index] = '';
      } else {
        // Borner entre 1 et 10
        updated[index] = String(Math.max(1, Math.min(10, parsed)));
      }
    }
    setCustomRounds(updated);
  };

  const addCustomRound = () => {
    if (customRounds.length >= 15) return;
    const nextCount = Math.min(10, customRounds.length + 1);
    setCustomRounds([...customRounds, String(nextCount)]);
  };

  const removeCustomRound = (index: number) => {
    if (customRounds.length <= 1) return;
    setCustomRounds(customRounds.filter((_, i) => i !== index));
  };

  // Validation pour le mode personnalisé : chaque manche doit avoir un nombre valide entre 1 et 10
  const isCustomConfigValid =
    settings.presetId !== 'custom' ||
    (customRounds.length > 0 &&
      customRounds.every((val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num >= 1 && num <= 10;
      }));

  const handleStart = () => {
    if (!isCustomConfigValid) return;

    // Résolution des noms : nom saisi ou fallback "Joueur X" sobre
    const finalPlayerNames = playerInputs.map((p, idx) => p.trim() || `Joueur ${idx + 1}`);

    const finalCardCounts =
      settings.presetId === 'custom'
        ? customRounds.map((v) => parseInt(v, 10))
        : undefined;

    const finalSettings: GameSettings = {
      ...settings,
      customCardCounts: finalCardCounts,
    };
    onStartGame(finalPlayerNames, finalSettings);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header avec Logo immersif */}
      <div className="text-center pt-2">
        <div className="flex justify-center mb-2">
          <SkullKingLogo size={96} className="animate-pulse" />
        </div>
        <h1 className="font-pirate text-3xl sm:text-4xl text-ink font-black tracking-wider drop-shadow-sm">
          Skull King
        </h1>
        <p className="text-ink-faded font-display text-sm tracking-widest uppercase mt-1">
          Carnet de bord & Tenue de score
        </p>
      </div>

      {/* Sélection des Joueurs */}
      <ParchmentCard variant="light" className="space-y-4">
        <div className="flex items-center justify-between border-b border-parchment-shadow pb-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gold-deep" />
            <h2 className="font-pirate text-lg sm:text-xl text-ink">Joueurs ({playerInputs.length}/8)</h2>
          </div>
          <span className="text-xs text-ink-faded font-sans">2 à 8 joueurs</span>
        </div>

        {/* Liste des champs de saisie pour chaque joueur */}
        <div className="space-y-2.5">
          {playerInputs.map((name, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="w-7 h-7 rounded-full bg-pirate-wood text-gold text-xs flex items-center justify-center font-bold shrink-0">
                {idx + 1}
              </span>

              <input
                type="text"
                value={name}
                onChange={(e) => handlePlayerInputChange(idx, e.target.value)}
                placeholder={`Joueur ${idx + 1}`}
                maxLength={20}
                className="flex-1 bg-white/90 border-2 border-parchment-deep rounded-lg px-3 py-2 text-ink text-base focus:outline-none focus:border-gold-deep"
              />

              <div className="flex flex-col gap-0.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleMovePlayerUp(idx)}
                  disabled={idx === 0}
                  className="p-1 rounded text-ink-light hover:text-ink disabled:opacity-20 transition-colors"
                  aria-label={`Monter le joueur ${idx + 1}`}
                  title="Monter"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMovePlayerDown(idx)}
                  disabled={idx === playerInputs.length - 1}
                  className="p-1 rounded text-ink-light hover:text-ink disabled:opacity-20 transition-colors"
                  aria-label={`Descendre le joueur ${idx + 1}`}
                  title="Descendre"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {playerInputs.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemovePlayerField(idx)}
                  className="text-wax hover:text-wax-dark p-2 rounded-lg transition-colors shrink-0"
                  aria-label={`Supprimer le joueur ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Actions sous la liste des joueurs */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1 w-full box-border">
          {playerInputs.length < 8 && (
            <button
              type="button"
              onClick={() => handleAddPlayerField('')}
              className="w-full sm:flex-1 py-2.5 px-3 border-2 border-dashed border-parchment-shadow rounded-lg text-ink font-display font-semibold text-sm hover:bg-parchment transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0"
            >
              <Plus className="w-4 h-4 text-gold-deep shrink-0" />
              <span>Ajouter un joueur</span>
            </button>
          )}

          {savedPlayers.length > 0 && playerInputs.length < 8 && (
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="w-full sm:flex-1 py-2.5 px-3 bg-parchment border border-parchment-shadow rounded-lg text-ink font-display font-semibold text-sm hover:bg-parchment-deep transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap min-w-0 shadow-xs"
            >
              <Users className="w-4 h-4 text-gold-deep shrink-0" />
              <span>Joueurs récents</span>
            </button>
          )}
        </div>
      </ParchmentCard>

      {/* Modale de sélection multiple de joueurs récents */}
      {isPickerOpen && (
        <PlayerPickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          currentAssignedPlayers={playerInputs}
          savedPlayers={savedPlayers}
          onAddSelectedPlayers={(namesToAdd) => {
            // Remplir d'abord les champs vides existants, puis ajouter les restants
            const updated = [...playerInputs];
            const remainingToAdd = [...namesToAdd];

            for (let i = 0; i < updated.length; i++) {
              if (!updated[i].trim() && remainingToAdd.length > 0) {
                updated[i] = remainingToAdd.shift()!;
              }
            }

            while (remainingToAdd.length > 0 && updated.length < 8) {
              updated.push(remainingToAdd.shift()!);
            }

            setPlayerInputs(updated);
          }}
        />
      )}

      {/* Règles & Variantes */}
      <ParchmentCard variant="light" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-parchment-shadow pb-2">
          <Settings2 className="w-5 h-5 text-gold-deep" />
          <h2 className="font-pirate text-lg sm:text-xl text-ink">Mode de Jeu</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setSettings({ ...settings, mode: 'classic' })}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              settings.mode === 'classic'
                ? 'bg-parchment-light border-gold-dark ring-2 ring-gold/40 shadow-sm'
                : 'bg-parchment/70 border-parchment-deep opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-ink font-pirate font-bold text-base">
              <Swords className="w-4 h-4 text-wax" />
              <span>Classique</span>
            </div>
            <p className="text-xs text-ink-light mt-1 font-sans">
              Score traditionnel Skull King avec mises positives et mises à zéro.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setSettings({ ...settings, mode: 'rascal' })}
            className={`p-3 rounded-lg border-2 text-left transition-all ${
              settings.mode === 'rascal'
                ? 'bg-parchment-light border-gold-dark ring-2 ring-gold/40 shadow-sm'
                : 'bg-parchment/70 border-parchment-deep opacity-75 hover:opacity-100'
            }`}
          >
            <div className="flex items-center gap-1.5 text-ink font-pirate font-bold text-base">
              <Shield className="w-4 h-4 text-gold-deep" />
              <span>Rascal</span>
            </div>
            <p className="text-xs text-ink-light mt-1 font-sans">
              Variante avec potentiel de manche, coup direct et frappe à revers.
            </p>
          </button>
        </div>
      </ParchmentCard>

      {/* Presets de manches */}
      <ParchmentCard variant="light" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-parchment-shadow pb-2">
          <Sparkles className="w-5 h-5 text-gold-deep" />
          <h2 className="font-pirate text-lg sm:text-xl text-ink">Manches</h2>
        </div>

        <div className="space-y-2">
          {ROUND_PRESETS.map((preset) => {
            const isSelected = settings.presetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-parchment-light border-gold-dark ring-2 ring-gold/40'
                    : 'bg-parchment/70 border-parchment-deep hover:bg-parchment'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-ink text-sm sm:text-base font-display">
                    {preset.name}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-parchment-deep text-ink-pure">
                    {preset.id === 'custom' ? `${customRounds.length} m.` : `${preset.rounds.length} m.`}
                  </span>
                </div>
                <p className="text-xs text-ink-light mt-0.5 font-sans">
                  {preset.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Éditeur de manches personnalisées */}
        {settings.presetId === 'custom' && (
          <div className="p-3 bg-parchment border border-parchment-shadow rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-ink">
                Cartes par manche :
              </span>
              <button
                type="button"
                onClick={addCustomRound}
                className="text-xs text-gold-deep font-bold hover:underline"
              >
                + Ajouter une manche
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {customRounds.map((count, idx) => {
                const isEmptyOrInvalid = count === '' || isNaN(parseInt(count, 10));
                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between bg-white/70 border rounded-md px-2 py-1.5 min-w-0 transition-colors ${
                      isEmptyOrInvalid
                        ? 'border-wax ring-1 ring-wax'
                        : 'border-parchment-deep'
                    }`}
                  >
                    <span className="text-xs text-ink-faded font-bold shrink-0">M{idx + 1}:</span>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={count}
                      placeholder="?"
                      onChange={(e) => handleCustomRoundChange(idx, e.target.value)}
                      className="w-full text-center font-bold text-ink bg-transparent focus:outline-none text-base placeholder:text-ink-faded/50 min-w-0"
                    />
                    {customRounds.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCustomRound(idx)}
                        className="text-wax hover:text-wax-dark ml-0.5 text-xs font-bold shrink-0 p-0.5"
                        title="Supprimer la manche"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            {!isCustomConfigValid && (
              <p className="text-xs text-wax font-medium mt-1">
                Indiquez un nombre de cartes (1 à 10) pour chaque manche avant de démarrer.
              </p>
            )}
          </div>
        )}
      </ParchmentCard>

      {/* Bouton de démarrage de la partie */}
      <div className="sticky bottom-4 pt-2">
        <ButtonPirate
          type="button"
          onClick={handleStart}
          disabled={!isCustomConfigValid}
          variant="wax"
          size="lg"
          className="w-full shadow-xl gap-2 tracking-wider whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Swords className="w-5 h-5" />
          <span>
            {isCustomConfigValid ? 'Démarrer la partie' : 'Configuration incomplète'}
          </span>
        </ButtonPirate>
      </div>
    </div>
  );
};
