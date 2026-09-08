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
        <div className="flex items-center justify-between border-b border-parchment-shadow pb-3">
          <div className="flex items-center gap-2">
            <Gem className="w-6 h-6 text-gold-deep" />
            <div>
              <h3 className="font-pirate text-lg sm:text-xl text-ink font-bold">
                Trésors & Bonus de {playerName}
              </h3>
              <p className="text-xs text-ink-faded font-sans">
                Seuls les contrats réussis valident les butins !
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-ink-faded hover:text-ink hover:bg-parchment transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Lignes de bonus interactives */}
        <div className="space-y-3">
          {/* 14 de couleur */}
          <div className="flex items-center justify-between bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div>
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-pirate-emerald inline-block" />
                <span>Cartes 14 de couleur</span>
                <span className="text-xs text-gold-deep font-bold">(+10 pts ch.)</span>
              </div>
              <p className="text-xs text-ink-light">Vert, Jaune, Violet</p>
            </div>
            <div className="flex items-center gap-2">
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
          <div className="flex items-center justify-between bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div>
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-pirate-black inline-block border border-gold" />
                <span>Carte 14 Noire Atout</span>
                <span className="text-xs text-gold-deep font-bold">(+20 pts)</span>
              </div>
              <p className="text-xs text-ink-light">Jolly Roger Atout</p>
            </div>
            <div className="flex items-center gap-2">
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
          <div className="flex items-center justify-between bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div>
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-pirate-cyan" />
                <span>Sirène prise par un Pirate</span>
                <span className="text-xs text-gold-deep font-bold">(+20 pts ch.)</span>
              </div>
              <p className="text-xs text-ink-light">Chaque sirène capturée</p>
            </div>
            <div className="flex items-center gap-2">
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
          <div className="flex items-center justify-between bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div>
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5">
                <Anchor className="w-4 h-4 text-wax" />
                <span>Pirate pris par le Skull King</span>
                <span className="text-xs text-gold-deep font-bold">(+30 pts ch.)</span>
              </div>
              <p className="text-xs text-ink-light">Chaque pirate capturé par le roi</p>
            </div>
            <div className="flex items-center gap-2">
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
          <div className="flex items-center justify-between bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div>
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-wax" />
                <span>Skull King pris par Sirène</span>
                <span className="text-xs text-gold-deep font-bold">(+40 pts)</span>
              </div>
              <p className="text-xs text-ink-light">L'exploit suprême !</p>
            </div>
            <div className="flex items-center gap-2">
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
          <div className="flex items-center justify-between bg-parchment p-3 rounded-lg border border-parchment-deep">
            <div>
              <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5">
                <Gem className="w-4 h-4 text-gold-deep" />
                <span>Alliance Butin</span>
                <span className="text-xs text-gold-deep font-bold">(+20 pts)</span>
              </div>
              <p className="text-xs text-ink-light">Pari d'alliance réussi à deux</p>
            </div>
            <button
              type="button"
              onClick={() => updateBonus('lootAlliance', !bonuses.lootAlliance)}
              className={`px-3 py-1.5 rounded-lg font-bold text-sm transition-all ${
                bonuses.lootAlliance
                  ? 'bg-gold text-ink-pure shadow-sm'
                  : 'bg-parchment-dark text-ink-light'
              }`}
            >
              {bonuses.lootAlliance ? 'ACTIF (+20)' : 'NON'}
            </button>
          </div>

          {/* Pari Rascal le Flambeur */}
          <div className="bg-parchment p-3 rounded-lg border border-parchment-deep space-y-2">
            <div className="font-display font-bold text-ink text-sm sm:text-base flex items-center gap-1.5">
              <span>Pari Rascal le Flambeur</span>
              <span className="text-xs text-ink-light">(±10 ou ±20 pts)</span>
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
