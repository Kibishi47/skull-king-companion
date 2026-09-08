import React, { useState, useEffect, useRef } from 'react';
import { ButtonPirate } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { X, Search, UserCheck, Users } from 'lucide-react';

interface PlayerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetIndex: number;
  currentAssignedPlayers: string[];
  savedPlayers: string[];
  onSelectPlayer: (index: number, name: string) => void;
}

export const PlayerPickerModal: React.FC<PlayerPickerModalProps> = ({
  isOpen,
  onClose,
  targetIndex,
  currentAssignedPlayers,
  savedPlayers,
  onSelectPlayer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4">
      <div className="w-full max-w-md bg-parchment-light rounded-2xl border-4 border-gold-dark shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between bg-parchment border-b-2 border-parchment-deep p-4">
          <div className="flex items-center gap-2.5">
            <SkullKingLogo size={32} />
            <div>
              <h3 className="font-pirate text-lg sm:text-xl text-ink font-bold leading-tight">
                Choisir le Joueur {targetIndex + 1}
              </h3>
              <p className="text-xs text-ink-light">
                Sélectionnez un joueur parmi vos profils enregistrés
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
              placeholder="Filtrer un joueur..."
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
                Tapez directement le prénom dans le champ de saisie pour l'enregistrer automatiquement.
              </p>
            </div>
          ) : (
            filteredPlayers.map((name) => {
              // Vérifier si déjà assigné à un autre slot
              const isAlreadyAssigned = currentAssignedPlayers.some(
                (p, idx) => idx !== targetIndex && p.trim().toLowerCase() === name.toLowerCase()
              );

              return (
                <button
                  key={name}
                  type="button"
                  disabled={isAlreadyAssigned}
                  onClick={() => {
                    onSelectPlayer(targetIndex, name);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all ${
                    isAlreadyAssigned
                      ? 'bg-parchment/40 border-parchment-shadow text-ink-faded opacity-50 cursor-not-allowed'
                      : 'bg-parchment hover:bg-parchment-dark border-parchment-deep text-ink shadow-xs active:scale-[0.99]'
                  }`}
                >
                  <span className="font-display font-bold text-sm sm:text-base">
                    {name}
                  </span>

                  {isAlreadyAssigned ? (
                    <span className="text-[11px] font-semibold text-wax">
                      Déjà dans la partie
                    </span>
                  ) : (
                    <UserCheck className="w-4 h-4 text-gold-deep opacity-80" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-parchment border-t border-parchment-deep flex justify-end">
          <ButtonPirate onClick={onClose} variant="ghost" size="sm" className="whitespace-nowrap">
            Fermer
          </ButtonPirate>
        </div>
      </div>
    </div>
  );
};
