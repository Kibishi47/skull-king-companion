import React from 'react';

interface SkullKingLogoProps {
  className?: string;
  size?: number;
}

export const SkullKingLogo: React.FC<SkullKingLogoProps> = ({ className = '', size = 56 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={size}
      height={size}
      className={`inline-block select-none drop-shadow-md ${className}`}
      role="img"
      aria-label="Skull King Logo"
    >
      <defs>
        <linearGradient id="goldGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdf1a9"/>
          <stop offset="30%" stopColor="#f2c968"/>
          <stop offset="70%" stopColor="#e5ab48"/>
          <stop offset="100%" stopColor="#966718"/>
        </linearGradient>
        <linearGradient id="woodGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a3825"/>
          <stop offset="50%" stopColor="#3b2518"/>
          <stop offset="100%" stopColor="#24140b"/>
        </linearGradient>
        <linearGradient id="rubyGradComp" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4a4a"/>
          <stop offset="60%" stopColor="#a62828"/>
          <stop offset="100%" stopColor="#540b0b"/>
        </linearGradient>
      </defs>

      <!-- Ship Wheel -->
      <g>
        <circle cx="256" cy="256" r="210" fill="none" stroke="url(#woodGradComp)" strokeWidth="26"/>
        <circle cx="256" cy="256" r="210" fill="none" stroke="#785f4c" strokeWidth="2" strokeDasharray="8 8"/>
        <circle cx="256" cy="256" r="176" fill="none" stroke="url(#goldGradComp)" strokeWidth="6"/>

        <g stroke="url(#woodGradComp)" strokeWidth="16" strokeLinecap="round">
          <line x1="256" y1="20" x2="256" y2="492"/>
          <line x1="20" y1="256" x2="492" y2="256"/>
          <line x1="89" y1="89" x2="423" y2="423"/>
          <line x1="89" y1="423" x2="423" y2="89"/>
        </g>
        <g fill="url(#goldGradComp)">
          <circle cx="256" cy="24" r="14"/>
          <circle cx="256" cy="488" r="14"/>
          <circle cx="24" cy="256" r="14"/>
          <circle cx="488" cy="256" r="14"/>
          <circle cx="92" cy="92" r="14"/>
          <circle cx="420" cy="420" r="14"/>
          <circle cx="92" cy="420" r="14"/>
          <circle cx="420" cy="92" r="14"/>
        </g>
        <circle cx="256" cy="256" r="160" fill="#2d1e15" stroke="url(#goldGradComp)" strokeWidth="6"/>
      </g>

      <!-- Cutlasses -->
      <g stroke="#d9c29d" strokeWidth="6" fill="#ebdcc4">
        <path d="M 140 160 Q 256 256 372 352 L 360 364 Q 256 268 128 172 Z"/>
        <path d="M 372 160 Q 256 256 140 352 L 152 364 Q 256 268 384 172 Z"/>
      </g>

      <!-- Skull Base -->
      <g>
        <path d="M 180 230 C 170 170, 210 140, 256 140 C 302 140, 342 170, 332 230 C 332 265, 315 285, 305 310 L 305 350 C 305 365, 290 375, 275 375 L 237 375 C 222 375, 207 365, 207 350 L 207 310 C 197 285, 180 265, 180 230 Z" 
              fill="url(#goldGradComp)" stroke="#3b2518" strokeWidth="6"/>

        <path d="M 185 245 C 205 270, 205 295, 208 315" stroke="#785f4c" strokeWidth="4" fill="none"/>
        <path d="M 327 245 C 307 270, 307 295, 304 315" stroke="#785f4c" strokeWidth="4" fill="none"/>

        <!-- Eye Patch -->
        <path d="M 175 200 L 337 265" stroke="#18181b" strokeWidth="9" strokeLinecap="round"/>
        <path d="M 215 190 L 215 260" stroke="#18181b" strokeWidth="6" strokeLinecap="round"/>
        <ellipse cx="225" cy="235" rx="22" ry="26" fill="#18181b" stroke="#3b2518" strokeWidth="3"/>
        <circle cx="225" cy="235" r="5" fill="#a62828"/>

        <!-- Right Eye Socket -->
        <ellipse cx="287" cy="235" rx="21" ry="25" fill="#1e130c" stroke="#3b2518" strokeWidth="3"/>
        <ellipse cx="287" cy="235" rx="11" ry="14" fill="#a62828"/>
        <circle cx="289" cy="232" r="4" fill="#fdf1a9"/>

        <!-- Nose -->
        <path d="M 256 265 C 252 260, 246 270, 248 280 C 250 286, 256 292, 256 292 C 256 292, 262 286, 264 280 C 266 270, 260 260, 256 265 Z" fill="#1e130c"/>

        <!-- Teeth -->
        <g fill="#f7f2e7" stroke="#3b2518" strokeWidth="2.5">
          <rect x="224" y="322" width="10" height="15" rx="2"/>
          <rect x="236" y="322" width="10" height="17" rx="2" fill="#e5ab48"/>
          <rect x="248" y="322" width="10" height="17" rx="2"/>
          <rect x="260" y="322" width="10" height="17" rx="2"/>
          <rect x="272" y="322" width="10" height="15" rx="2"/>

          <rect x="228" y="342" width="9" height="13" rx="2"/>
          <rect x="239" y="342" width="9" height="14" rx="2"/>
          <rect x="250" y="342" width="9" height="14" rx="2"/>
          <rect x="261" y="342" width="9" height="14" rx="2"/>
          <rect x="272" y="342" width="9" height="13" rx="2"/>
        </g>

        <!-- Pirate Crown -->
        <path d="M 190 162 L 175 100 L 218 125 L 256 80 L 294 125 L 337 100 L 322 162 Z" 
              fill="url(#goldGradComp)" stroke="#3b2518" strokeWidth="5"/>
        <path d="M 188 152 Q 256 168 324 152 L 322 165 Q 256 182 190 165 Z" fill="#3b2518"/>
        
        <!-- Jewels -->
        <circle cx="175" cy="100" r="7" fill="url(#rubyGradComp)" stroke="#3b2518" strokeWidth="2"/>
        <circle cx="256" cy="80" r="10" fill="url(#rubyGradComp)" stroke="#3b2518" strokeWidth="2"/>
        <circle cx="337" cy="100" r="7" fill="url(#rubyGradComp)" stroke="#3b2518" strokeWidth="2"/>
        <circle cx="225" cy="159" r="4" fill="url(#rubyGradComp)"/>
        <circle cx="256" cy="162" r="5" fill="#fdf1a9"/>
        <circle cx="287" cy="159" r="4" fill="url(#rubyGradComp)"/>
      </g>
    </svg>
  );
};
