import React, { useState, useEffect, useRef } from 'react';
import { ButtonPirate } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { X, Search, Check, Users, Trash2, ArrowUpDown } from 'lucide-react';

interface PlayerPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAssignedPlayers: string[];
  savedPlayers: string[];
  onDeleteSavedPlayer?: (name: string) => void;
  onAddSelectedPlayers: (namesToAdd: string[]) => void;
}

export const PlayerPickerModal: React.FC<PlayerPickerModalProps> = ({
  isOpen,
  onClose,
  currentAssignedPlayers,
  savedPlayers,
  onDeleteSavedPlayer,
  onAddSelectedPlayers,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'alphaAsc' | 'alphaDesc'>('recent');
  const [confirmDeleteName, setConfirmDeleteName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Nombre de slots encore disponibles (max 8)
  const nonBlankCurrentCount = currentAssignedPlayers.filter((p) => p.trim()).length;
  const availableSlots = Math.max(0, 8 - nonBlankCurrentCount);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedNames([]);
      setConfirmDeleteName(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filtrer les joueurs enregistrés selon la recherche
  const queryTrimmed = searchQuery.trim().toLowerCase();
  let displayedPlayers = savedPlayers.filter((name) =>
    name.toLowerCase().includes(queryTrimmed)
  );

  // Tri de la liste
  if (sortBy === 'alphaAsc') {
    displayedPlayers = [...displayedPlayers].sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
  } else if (sortBy === 'alphaDesc') {
    displayedPlayers = [...displayedPlayers].sort((a, b) => b.localeCompare(a, 'fr', { sensitivity: 'base' }));
  }

  const cycleSort = () => {
    if (sortBy === 'recent') setSortBy('alphaAsc');
    else if (sortBy === 'alphaAsc') setSortBy('alphaDesc');
    else setSortBy('recent');
  };

  const toggleSelectName = (name: string) => {
    if (selectedNames.includes(name)) {
      setSelectedNames(selectedNames.filter((n) => n !== name));
    } else {
      if (selectedNames.length >= availableSlots) return;
      setSelectedNames([...selectedNames, name]);
    }
  };

  const handleDelete = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (confirmDeleteName === name) {
      if (onDeleteSavedPlayer) {
        onDeleteSavedPlayer(name);
      }
      setSelectedNames((prev) => prev.filter((n) => n !== name));
      setConfirmDeleteName(null);
    } else {
      setConfirmDeleteName(name);
    }
  };

  const handleConfirm = () => {
    if (selectedNames.length > 0) {
      onAddSelectedPlayers(selectedNames);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div
        className="w-full max-w-lg bg-parchment-light rounded-t-2xl sm:rounded-2xl border-t-4 sm:border-2 border-gold-dark shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Drawer */}
        <div className="flex items-center justify-between bg-parchment border-b-2 border-parchment-deep p-4">
          <div className="flex items-center gap-2.5">
            <SkullKingLogo size={34} />
            <div>
              <h3 className="font-pirate text-lg sm:text-xl text-ink font-bold leading-tight">
                Joueurs Récents
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
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Barre de recherche et Tri */}
        <div className="p-3 bg-parchment border-b border-parchment-deep flex items-center gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 text-ink-faded absolute left-3 pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un joueur..."
              className="w-full bg-white/90 border-2 border-parchment-deep rounded-lg pl-9 pr-8 py-2 text-ink text-base focus:outline-none focus:border-gold-deep"
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

          {/* Bouton de tri */}
          <button
            type="button"
            onClick={cycleSort}
            className="flex items-center gap-1 px-2.5 py-2 bg-white/80 border-2 border-parchment-deep rounded-lg text-xs font-display font-bold text-ink hover:bg-parchment transition-colors shrink-0"
            title="Changer le tri"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-gold-deep" />
            <span className="hidden sm:inline">
              {sortBy === 'recent' ? 'Récents' : sortBy === 'alphaAsc' ? 'A → Z' : 'Z → A'}
            </span>
            <span className="sm:hidden">
              {sortBy === 'recent' ? 'Réc.' : sortBy === 'alphaAsc' ? 'A-Z' : 'Z-A'}
            </span>
          </button>
        </div>

        {/* Liste des joueurs */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {displayedPlayers.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Users className="w-8 h-8 text-gold-deep mx-auto opacity-40" />
              <p className="font-display text-sm font-semibold text-ink">
                {savedPlayers.length === 0
                  ? 'Aucun joueur enregistré pour le moment'
                  : 'Aucun joueur ne correspond à la recherche'}
              </p>
              <p className="text-xs text-ink-light max-w-xs mx-auto font-sans">
                Les noms tapés dans la configuration s'enregistrent automatiquement ici.
              </p>
            </div>
          ) : (
            displayedPlayers.map((name) => {
              const isAlreadyInGame = currentAssignedPlayers.some(
                (p) => p.trim().toLowerCase() === name.toLowerCase()
              );
              const isSelected = selectedNames.includes(name);
              const canSelectMore = selectedNames.length < availableSlots;
              const isDeleting = confirmDeleteName === name;

              return (
                <div
                  key={name}
                  onClick={() => !isAlreadyInGame && (isSelected || canSelectMore) && toggleSelectName(name)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${
                    isAlreadyInGame
                      ? 'bg-parchment/40 border-parchment-shadow text-ink-faded opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-gold-light/40 border-gold-dark text-ink font-bold shadow-xs cursor-pointer'
                      : 'bg-parchment hover:bg-parchment-dark border-parchment-deep text-ink cursor-pointer active:scale-[0.99]'
                  }`}
                >
                  <span className="font-display font-bold text-sm sm:text-base truncate mr-2">
                    {name}
                  </span>

                  <div className="flex items-center gap-2 shrink-0">
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

                    {/* Bouton supprimer de la mémoire */}
                    {onDeleteSavedPlayer && (
                      <button
                        type="button"
                        onClick={(e) => handleDelete(e, name)}
                        className={`p-1.5 rounded-lg transition-colors ml-1 ${
                          isDeleting
                            ? 'bg-wax text-white font-bold text-xs px-2'
                            : 'text-ink-faded hover:text-wax hover:bg-parchment-deep'
                        }`}
                        title={isDeleting ? 'Confirmer la suppression' : 'Supprimer des récents'}
                        aria-label={`Supprimer ${name} des joueurs récents`}
                      >
                        {isDeleting ? 'Supprimer ?' : <Trash2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer avec action d'ajout global */}
        <div className="p-3 bg-parchment border-t border-parchment-deep">
          <ButtonPirate
            onClick={handleConfirm}
            disabled={selectedNames.length === 0}
            variant="wax"
            size="md"
            className="w-full whitespace-nowrap shadow-md disabled:opacity-50"
          >
            <span>
              {selectedNames.length === 0
                ? 'Sélectionner des joueurs'
                : `Ajouter ${selectedNames.length} joueur${selectedNames.length > 1 ? 's' : ''}`}
            </span>
          </ButtonPirate>
        </div>
      </div>
    </div>
  );
};
