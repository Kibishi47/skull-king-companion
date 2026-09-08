import React from 'react';

interface ParchmentCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'default' | 'dark' | 'wood';
}

export const ParchmentCard: React.FC<ParchmentCardProps> = ({
  children,
  className = '',
  variant = 'default',
}) => {
  const bgClass = {
    light: 'bg-parchment-light border-parchment-deep',
    default: 'bg-parchment border-parchment-shadow',
    dark: 'bg-parchment-dark border-ink-light',
    wood: 'bg-pirate-wood text-parchment border-gold-dark',
  }[variant];

  return (
    <div
      className={`relative rounded-xl border-2 shadow-parchment p-4 sm:p-5 transition-all ${bgClass} ${className}`}
    >
      {/* Coins décoratifs d'inspiration parchemin / carnet marin */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-ink-light opacity-40 pointer-events-none" />
      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-ink-light opacity-40 pointer-events-none" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-ink-light opacity-40 pointer-events-none" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-ink-light opacity-40 pointer-events-none" />
      
      {children}
    </div>
  );
};

interface ButtonPirateProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'wax' | 'wood' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const ButtonPirate: React.FC<ButtonPirateProps> = ({
  children,
  variant = 'gold',
  size = 'md',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-display font-bold tracking-wide rounded-lg select-none transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px]',
    md: 'text-sm sm:text-base px-4 py-2.5 min-h-[44px]',
    lg: 'text-base sm:text-lg px-6 py-3.5 min-h-[50px] font-extrabold',
  }[size];

  const variantStyles = {
    gold: 'gold-gradient text-ink-pure border-2 border-gold-deep shadow-md hover:brightness-105 active:shadow-inner',
    wax: 'wax-seal text-parchment-light border-2 border-wax-border shadow-wax-seal hover:brightness-110',
    wood: 'bg-pirate-wood text-parchment-light border-2 border-gold-dark shadow-md hover:bg-opacity-95',
    ghost: 'bg-transparent text-ink border border-ink-faded hover:bg-parchment-dark/50',
  }[variant];

  return (
    <button
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
