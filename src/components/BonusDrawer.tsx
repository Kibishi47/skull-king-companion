import React from 'react';
import { BonusCounts } from '../types/game';
import { ParchmentCard } from './ParchmentUI';
import { X, Sparkles, Anchor, Gem } from 'lucide-react';

interface BonusDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  bonuses: BonusCounts;
  onChange: (updated: BonusCounts) => void;
}

export const BonusDrawer: React.FC<BonusDrawerProps> = ({
  isOpen,
  onClose,
  playerName,
  bonuses,
  onChange,
}) => {
  if (!isOpen) return null;

  const updateBonus = <K extends keyof BonusCounts>(field: K, value: BonusCounts[K]) => {
    onChange({
      ...bonuses,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div
        className="w-full max-w-lg bg-parchment-light rounded-t-2xl sm:rounded-2xl border-t-4 sm:border-2 border-gold-dark shadow-2xl p-5 max-h-[85vh] overflow-y-auto space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Drawer */}
        <div className="flex items-start justify-between gap-3 border-b border-parchment-shadow pb-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <Gem className="w-6 h-6 text-gold-deep shrink-0 mt-0.5" />
            <div className="min-w-0">
              <h3 className="font-pirate text-base sm:text-xl text-ink font-bold leading-tight break-words">
                Trésors & Bonus de {playerName}
              </h3>
              <p className="text-xs text-ink-faded font-sans mt-0.5">
                Seuls les contrats réussis valident les butins !
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-faded hover:text-ink hover:bg-parchment transition-colors shrink-0"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lignes de bonus interactives */}
        <div className="space-y-3">
          {/* 14 de couleur */}
          <div className="flex items-center justify-between gap-3 bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div className="min-w-0">
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5 leading-snug">
                <span className="w-3 h-3 rounded-full bg-pirate-emerald shrink-0 inline-block" />
                <span>14 de couleur</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gold-deep font-black bg-gold/15 px-1.5 py-0.5 rounded shrink-0">+10 pts</span>
                <span className="text-xs text-ink-light truncate">Vert, Jaune, Violet</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => updateBonus('standard14s', Math.max(0, bonuses.standard14s - 1))}
                className="w-8 h-8 rounded bg-parchment-dark text-ink font-bold hover:bg-parchment-deep"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-base text-ink">{bonuses.standard14s}</span>
              <button
                type="button"
                onClick={() => updateBonus('standard14s', Math.min(3, bonuses.standard14s + 1))}
                className="w-8 h-8 rounded bg-gold-dark text-ink-pure font-bold hover:bg-gold"
              >
                +
              </button>
            </div>
          </div>

          {/* 14 Noir Atout */}
          <div className="flex items-center justify-between gap-3 bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div className="min-w-0">
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5 leading-snug">
                <span className="w-3 h-3 rounded-full bg-pirate-black shrink-0 inline-block border border-gold" />
                <span>14 Noir</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gold-deep font-black bg-gold/15 px-1.5 py-0.5 rounded shrink-0">+20 pts</span>
                <span className="text-xs text-ink-light truncate">Jolly Roger</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => updateBonus('black14', Math.max(0, bonuses.black14 - 1))}
                className="w-8 h-8 rounded bg-parchment-dark text-ink font-bold hover:bg-parchment-deep"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-base text-ink">{bonuses.black14}</span>
              <button
                type="button"
                onClick={() => updateBonus('black14', Math.min(1, bonuses.black14 + 1))}
                className="w-8 h-8 rounded bg-gold-dark text-ink-pure font-bold hover:bg-gold"
              >
                +
              </button>
            </div>
          </div>

          {/* Sirène capturée par un Pirate */}
          <div className="flex items-center justify-between gap-3 bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div className="min-w-0">
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5 leading-snug">
                <Sparkles className="w-4 h-4 text-pirate-cyan shrink-0" />
                <span>Sirène prise par Pirate</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gold-deep font-black bg-gold/15 px-1.5 py-0.5 rounded shrink-0">+20 pts</span>
                <span className="text-xs text-ink-light truncate">Par sirène</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => updateBonus('mermaidsByPirate', Math.max(0, bonuses.mermaidsByPirate - 1))}
                className="w-8 h-8 rounded bg-parchment-dark text-ink font-bold hover:bg-parchment-deep"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-base text-ink">{bonuses.mermaidsByPirate}</span>
              <button
                type="button"
                onClick={() => updateBonus('mermaidsByPirate', Math.min(2, bonuses.mermaidsByPirate + 1))}
                className="w-8 h-8 rounded bg-gold-dark text-ink-pure font-bold hover:bg-gold"
              >
                +
              </button>
            </div>
          </div>

          {/* Pirate capturé par le Skull King */}
          <div className="flex items-center justify-between gap-3 bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div className="min-w-0">
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5 leading-snug">
                <Anchor className="w-4 h-4 text-wax shrink-0" />
                <span>Pirate pris par Skull King</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gold-deep font-black bg-gold/15 px-1.5 py-0.5 rounded shrink-0">+30 pts</span>
                <span className="text-xs text-ink-light truncate">Par pirate</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => updateBonus('piratesBySkullKing', Math.max(0, bonuses.piratesBySkullKing - 1))}
                className="w-8 h-8 rounded bg-parchment-dark text-ink font-bold hover:bg-parchment-deep"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-base text-ink">{bonuses.piratesBySkullKing}</span>
              <button
                type="button"
                onClick={() => updateBonus('piratesBySkullKing', Math.min(5, bonuses.piratesBySkullKing + 1))}
                className="w-8 h-8 rounded bg-gold-dark text-ink-pure font-bold hover:bg-gold"
              >
                +
              </button>
            </div>
          </div>

          {/* Skull King capturé par une Sirène */}
          <div className="flex items-center justify-between gap-3 bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div className="min-w-0">
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5 leading-snug">
                <Sparkles className="w-4 h-4 text-wax shrink-0" />
                <span>Skull King pris par Sirène</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gold-deep font-black bg-gold/15 px-1.5 py-0.5 rounded shrink-0">+40 pts</span>
                <span className="text-xs text-ink-light truncate">Prise suprême</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => updateBonus('skullKingByMermaid', Math.max(0, bonuses.skullKingByMermaid - 1))}
                className="w-8 h-8 rounded bg-parchment-dark text-ink font-bold hover:bg-parchment-deep"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-base text-ink">{bonuses.skullKingByMermaid}</span>
              <button
                type="button"
                onClick={() => updateBonus('skullKingByMermaid', Math.min(1, bonuses.skullKingByMermaid + 1))}
                className="w-8 h-8 rounded bg-gold-dark text-ink-pure font-bold hover:bg-gold"
              >
                +
              </button>
            </div>
          </div>

          {/* Alliance Butin */}
          <div className="flex items-center justify-between gap-3 bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div className="min-w-0">
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5 leading-snug">
                <Gem className="w-4 h-4 text-gold-deep shrink-0" />
                <span>Alliance Butin</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gold-deep font-black bg-gold/15 px-1.5 py-0.5 rounded shrink-0">+20 pts</span>
                <span className="text-xs text-ink-light truncate">Pari d'alliance réussi</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => updateBonus('lootAlliance', !bonuses.lootAlliance)}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm whitespace-nowrap shrink-0 transition-all ${
                bonuses.lootAlliance
                  ? 'bg-gold text-ink-pure shadow-sm'
                  : 'bg-parchment-dark text-ink-light'
              }`}
            >
              {bonuses.lootAlliance ? 'ACTIF +20' : 'NON'}
            </button>
          </div>

          {/* Pari Rascal le Flambeur */}
          <div className="bg-parchment p-3 rounded-lg border border-parchment-deep space-y-2">
            <div>
              <div className="font-display font-bold text-ink text-sm sm:text-base leading-snug">
                Pari Rascal
              </div>
              <div className="mt-1">
                <span className="text-xs text-gold-deep font-black bg-gold/15 px-1.5 py-0.5 rounded shrink-0">±10 / ±20 pts</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1">
              {([-20, -10, 0, 10, 20] as const).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateBonus('rascalBet', val)}
                  className={`py-1 rounded text-xs font-bold transition-all ${
                    bonuses.rascalBet === val
                      ? val > 0
                        ? 'bg-emerald-600 text-white'
                        : val < 0
                        ? 'bg-wax text-white'
                        : 'bg-ink-light text-white'
                      : 'bg-parchment-dark text-ink'
                  }`}
                >
                  {val > 0 ? `+${val}` : val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton Fermer */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full gold-gradient py-3 rounded-xl font-display font-bold text-ink-pure text-base shadow-md hover:brightness-105"
          >
            Valider les Trésors
          </button>
        </div>
      </div>
    </div>
  );
};
