import React, { useState, useEffect, useRef } from 'react';
import { ButtonPirate } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { X, Search, Check, Users } from 'lucide-react';

interface PlayerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAssignedPlayers: string[];
  savedPlayers: string[];
  onAddSelectedPlayers: (namesToAdd: string[]) => void;
}

export const PlayerPickerModal: React.FC<PlayerPickerModalProps> = ({
  isOpen,
  onClose,
  currentAssignedPlayers,
  savedPlayers,
  onAddSelectedPlayers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Nombre de slots encore disponibles (max 8)
  const nonBlankCurrentCount = currentAssignedPlayers.filter((p) => p.trim()).length;
  const availableSlots = Math.max(0, 8 - nonBlankCurrentCount);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedNames([]);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtrer les joueurs enregistrés selon la recherche
  const queryTrimmed = searchQuery.trim().toLowerCase();
  const filteredPlayers = savedPlayers.filter((name) =>
    name.toLowerCase().includes(queryTrimmed)
  );

  const toggleSelectName = (name: string) => {
    if (selectedNames.includes(name)) {
      setSelectedNames(selectedNames.filter((n) => n !== name));
    } else {
      if (selectedNames.length >= availableSlots) return;
      setSelectedNames([...selectedNames, name]);
    }
  };

  const handleConfirm = () => {
    if (selectedNames.length > 0) {
      onAddSelectedPlayers(selectedNames);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-md bg-parchment-light rounded-2xl border-4 border-gold-dark shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-parchment border-b-2 border-parchment-deep p-4">
          <div className="flex items-center gap-2.5">
            <SkullKingLogo size={32} />
            <div>
              <h3 className="font-pirate text-lg sm:text-xl text-ink font-bold leading-tight">
                Ajouter des Joueurs
              </h3>
              <p className="text-xs text-ink-light">
                {selectedNames.length} sélectionné{selectedNames.length > 1 ? 's' : ''} • max {availableSlots}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-faded hover:text-ink hover:bg-parchment-deep transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Champ de recherche avec auto-focus */}
        <div className="p-3 bg-parchment border-b border-parchment-deep">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-ink-faded absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer les joueurs..."
              className="w-full bg-white/90 border-2 border-parchment-deep rounded-lg pl-9 pr-3 py-2 text-ink text-base focus:outline-none focus:border-gold-deep"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-xs text-ink-faded hover:text-ink p-1"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Liste des joueurs */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredPlayers.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Users className="w-8 h-8 text-gold-deep mx-auto opacity-40" />
              <p className="font-display text-sm font-semibold text-ink">
                {savedPlayers.length === 0
                  ? 'Aucun joueur enregistré pour le moment'
                  : 'Aucun joueur ne correspond à la recherche'}
              </p>
              <p className="text-xs text-ink-light max-w-xs mx-auto font-sans">
                Tapez directement vos prénoms dans les champs pour les enregistrer automatiquement.
              </p>
            </div>
          ) : (
            filteredPlayers.map((name) => {
              // Vérifier si déjà présent dans la partie
              const isAlreadyInGame = currentAssignedPlayers.some(
                (p) => p.trim().toLowerCase() === name.toLowerCase()
              );
              const isSelected = selectedNames.includes(name);
              const canSelectMore = selectedNames.length < availableSlots;

              return (
                <button
                  key={name}
                  type="button"
                  disabled={isAlreadyInGame || (!isSelected && !canSelectMore)}
                  onClick={() => toggleSelectName(name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    isAlreadyInGame
                      ? 'bg-parchment/40 border-parchment-shadow text-ink-faded opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-gold-light/40 border-gold-dark text-ink font-bold shadow-xs'
                      : 'bg-parchment hover:bg-parchment-dark border-parchment-deep text-ink active:scale-[0.99]'
                  }`}
                >
                  <span className="font-display font-bold text-sm sm:text-base">
                    {name}
                  </span>

                  {isAlreadyInGame ? (
                    <span className="text-[11px] font-semibold text-wax">
                      Déjà présent
                    </span>
                  ) : (
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-gold-deep border-gold-deep text-white'
                          : 'border-parchment-shadow bg-white/70'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer avec action d'ajout global */}
        <div className="p-3 bg-parchment border-t border-parchment-deep flex items-center justify-between gap-2">
          <ButtonPirate onClick={onClose} variant="ghost" size="sm" className="whitespace-nowrap">
            Fermer
          </ButtonPirate>

          <ButtonPirate
            onClick={handleConfirm}
            disabled={selectedNames.length === 0}
            variant="wax"
            size="sm"
            className="whitespace-nowrap shadow-sm disabled:opacity-50"
          >
            <span>
              {selectedNames.length === 0
                ? 'Sélectionner'
                : `Ajouter ${selectedNames.length} joueur${selectedNames.length > 1 ? 's' : ''}`}
            </span>
          </ButtonPirate>
        </div>
      </div>
    </div>
  );
};
