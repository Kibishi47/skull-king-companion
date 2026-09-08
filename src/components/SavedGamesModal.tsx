import React, { useState } from 'react';
import { SavedGameItem } from '../types/game';
import { ButtonPirate } from './ParchmentUI';
import { SkullKingLogo } from './SkullKingLogo';
import { X, Trash2, Play, Calendar, Users, Trophy } from 'lucide-react';

interface SavedGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedGames: SavedGameItem[];
  onLoadGame: (game: SavedGameItem) => void;
  onDeleteGame: (id: string) => void;
}

export const SavedGamesModal: React.FC<SavedGamesModalProps> = ({
  isOpen,
  onClose,
  savedGames,
  onLoadGame,
  onDeleteGame,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-fade-in">
      <div
        className="w-full max-w-lg bg-parchment-light rounded-t-2xl sm:rounded-2xl border-t-4 sm:border-2 border-gold-dark shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-parchment border-b-2 border-parchment-deep p-4">
          <div className="flex items-center gap-3">
            <SkullKingLogo size={36} />
            <div>
              <h2 className="font-pirate text-xl sm:text-2xl text-ink font-bold leading-tight">
                Parties Sauvegardées
              </h2>
              <p className="text-xs text-ink-light">
                {savedGames.length} partie{savedGames.length > 1 ? 's' : ''} en mémoire
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-faded hover:text-ink hover:bg-parchment-deep transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Liste des parties */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedGames.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <Trophy className="w-10 h-10 text-gold-deep mx-auto opacity-50" />
              <p className="font-display font-semibold text-ink text-base">
                Aucune partie sauvegardée
              </p>
              <p className="text-xs text-ink-light max-w-xs mx-auto font-sans">
                Démarrez une nouvelle partie et elle s'enregistrera automatiquement ici à chaque manche.
              </p>
            </div>
          ) : (
            savedGames.map((game) => {
              const formattedDate = new Date(game.date).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isConfirming = confirmDeleteId === game.id;

              return (
                <div
                  key={game.id}
                  className="bg-parchment p-3.5 rounded-xl border-2 border-parchment-deep shadow-sm space-y-2.5"
                >
                  {/* Top info : date et badge statut */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-ink-light font-display">
                      <Calendar className="w-3.5 h-3.5 text-gold-deep" />
                      <span>{formattedDate}</span>
                    </div>

                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                        game.isFinished
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-gold-light/40 text-gold-deep border border-gold-dark/40'
                      }`}
                    >
                      {game.isFinished
                        ? 'Terminée'
                        : `Manche ${game.currentRound} / ${game.totalRounds}`}
                    </span>
                  </div>

                  {/* Résumé joueurs */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <Users className="w-3.5 h-3.5 text-ink-light shrink-0" />
                    {game.players.map((p, idx) => (
                      <span
                        key={idx}
                        className="bg-parchment-light px-2 py-0.5 rounded border border-parchment-shadow font-mono text-ink font-semibold whitespace-nowrap"
                      >
                        {p.name}: <strong>{p.score}</strong>
                      </span>
                    ))}
                  </div>

                  {/* Actions Charger / Supprimer */}
                  <div className="flex items-center justify-between pt-1 border-t border-parchment-shadow/50">
                    {isConfirming ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-wax font-bold">Confirmer ?</span>
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteGame(game.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded bg-wax text-white hover:bg-wax-dark whitespace-nowrap"
                        >
                          Oui
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-2.5 py-1 text-xs font-bold rounded bg-parchment-dark text-ink whitespace-nowrap"
                        >
                          Non
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(game.id)}
                        className="text-ink-faded hover:text-wax p-1 rounded transition-colors text-xs flex items-center gap-1 whitespace-nowrap"
                        title="Supprimer la partie"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Supprimer</span>
                      </button>
                    )}

                    <ButtonPirate
                      type="button"
                      onClick={() => {
                        onLoadGame(game);
                        onClose();
                      }}
                      variant="wax"
                      size="sm"
                      className="gap-1.5 whitespace-nowrap"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{game.isFinished ? 'Revoir' : 'Reprendre'}</span>
                    </ButtonPirate>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
