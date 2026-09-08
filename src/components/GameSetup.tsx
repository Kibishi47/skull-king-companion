import React, { useState } from 'react';
import { GameSettings, RoundPreset } from '../types/game';
import { ROUND_PRESETS } from '../utils/presets';
import { ButtonPirate, ParchmentCard } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { Users, Plus, Trash2, Swords, Shield, Settings2, Sparkles } from 'lucide-react';

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
  const [customRounds, setCustomRounds] = useState<number[]>([1, 2, 3, 4, 5]);

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

  const handleSelectRecentPlayer = (name: string) => {
    // Si un champ est vide, on l'y met, sinon on ajoute un champ s'il reste de la place
    const emptyIndex = playerInputs.findIndex((p) => !p.trim());
    if (emptyIndex !== -1) {
      handlePlayerInputChange(emptyIndex, name);
    } else if (playerInputs.length < 8) {
      handleAddPlayerField(name);
    }
  };

  const handlePresetSelect = (preset: RoundPreset) => {
    setSettings({
      ...settings,
      presetId: preset.id,
    });
  };

  const handleCustomRoundChange = (index: number, count: number) => {
    const updated = [...customRounds];
    updated[index] = Math.max(1, Math.min(10, count));
    setCustomRounds(updated);
  };

  const addCustomRound = () => {
    if (customRounds.length >= 15) return;
    setCustomRounds([...customRounds, Math.min(10, customRounds.length + 1)]);
  };

  const removeCustomRound = (index: number) => {
    if (customRounds.length <= 1) return;
    setCustomRounds(customRounds.filter((_, i) => i !== index));
  };

  const handleStart = () => {
    // Résolution des noms : nom saisi ou fallback "Joueur X" sobre
    const finalPlayerNames = playerInputs.map((p, idx) => p.trim() || `Joueur ${idx + 1}`);

    const finalSettings: GameSettings = {
      ...settings,
      customCardCounts: settings.presetId === 'custom' ? customRounds : undefined,
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
            <div key={idx} className="flex items-center gap-2">
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
              {playerInputs.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemovePlayerField(idx)}
                  className="text-wax hover:text-wax-dark p-2 rounded-lg transition-colors"
                  aria-label={`Supprimer le joueur ${idx + 1}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Bouton pour ajouter un joueur */}
        {playerInputs.length < 8 && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => handleAddPlayerField('')}
              className="w-full py-2 border-2 border-dashed border-parchment-shadow rounded-lg text-ink font-display font-semibold text-sm hover:bg-parchment transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-gold-deep" />
              <span>Ajouter un joueur</span>
            </button>
          </div>
        )}

        {/* Joueurs récents / favoris */}
        {savedPlayers.filter(p => !playerInputs.includes(p)).length > 0 && (
          <div className="pt-2 border-t border-parchment-deep">
            <p className="text-xs text-ink-faded mb-2 font-display">Joueurs récents :</p>
            <div className="flex flex-wrap gap-1.5">
              {savedPlayers
                .filter((p) => !playerInputs.includes(p))
                .slice(0, 10)
                .map((name, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectRecentPlayer(name)}
                    className="text-xs bg-parchment hover:bg-parchment-deep text-ink px-2.5 py-1 rounded-md border border-parchment-shadow transition-colors"
                  >
                    + {name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </ParchmentCard>

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
              +20 pts/pli, -10 pts/pli d'écart. Zéro audacieux (+10/carte ou -10/carte).
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
              <span>Mode Rascal</span>
            </div>
            <p className="text-xs text-ink-light mt-1 font-sans">
              Potentiel 10 pts/carte. Coup direct (100%), Frappe à revers (50%), ou Boulet de canon !
            </p>
          </button>
        </div>
      </ParchmentCard>

      {/* Presets de manches */}
      <ParchmentCard variant="light" className="space-y-4">
        <div className="flex items-center gap-2 border-b border-parchment-shadow pb-2">
          <Sparkles className="w-5 h-5 text-gold-deep" />
          <h2 className="font-pirate text-lg sm:text-xl text-ink">Format de la Traversée</h2>
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
            <div className="flex flex-wrap gap-2">
              {customRounds.map((count, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-white/70 border border-parchment-deep rounded-md px-2 py-1 gap-1"
                >
                  <span className="text-xs text-ink-faded font-bold">M{idx + 1}:</span>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={count}
                    onChange={(e) => handleCustomRoundChange(idx, parseInt(e.target.value) || 1)}
                    className="w-10 text-center font-bold text-ink bg-transparent focus:outline-none text-base"
                  />
                  {customRounds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCustomRound(idx)}
                      className="text-wax hover:text-wax-dark ml-1 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </ParchmentCard>

      {/* Bouton de démarrage de la partie */}
      <div className="sticky bottom-4 pt-2">
        <ButtonPirate
          type="button"
          onClick={handleStart}
          variant="wax"
          size="lg"
          className="w-full shadow-xl gap-2 tracking-wider"
        >
          <Swords className="w-5 h-5" />
          <span>Hisser le Pavillon (Démarrer)</span>
        </ButtonPirate>
      </div>
    </div>
  );
};
