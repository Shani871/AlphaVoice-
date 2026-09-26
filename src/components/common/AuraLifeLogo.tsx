import React from 'react';

export interface AuraLifeLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  glow?: boolean;
}

/**
 * Pure SVG Abstract AI-Human "A" Icon
 * Represents:
 * - Geometric "A" Monogram (Structural precision & AI intelligence)
 * - Human Presence (Organic upward posture & conscious core node)
 * - Voice / Audio Waves (Flowing harmonic sine wave ribbon crossbar)
 * - Glowing Aura (Subtle multi-stop cyan-electric blue gradient & luminous nexus)
 */
export const AuraLifeIcon: React.FC<{
  size?: number;
  className?: string;
  glow?: boolean;
}> = ({ size = 32, className = '', glow = true }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
      aria-label="AuraLife Icon"
    >
      <defs>
        {/* Primary Monogram Gradient: Electric Blue -> Vibrant Cyan -> Ice Sky */}
        <linearGradient
          id="alIconPrimaryGrad"
          x1="8"
          y1="42"
          x2="40"
          y2="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#1E40AF" /> {/* Deep Electric Blue */}
          <stop offset="28%" stopColor="#3B82F6" /> {/* Radiant Sapphire */}
          <stop offset="65%" stopColor="#06B6D4" /> {/* Electric Cyan */}
          <stop offset="100%" stopColor="#38BDF8" /> {/* Luminous Sky */}
        </linearGradient>

        {/* Secondary Harmonic Soundwave Gradient: Cyan -> Violet Highlight */}
        <linearGradient
          id="alSoundwaveGrad"
          x1="12"
          y1="28"
          x2="36"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="48%" stopColor="#22D3EE" />
          <stop offset="82%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#818CF8" /> {/* Subtle Violet-Blue */}
        </linearGradient>

        {/* Core AI/Human Nexus Pulse Glow */}
        <radialGradient
          id="alCorePulse"
          cx="24"
          cy="18.5"
          r="6"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#06B6D4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
        </radialGradient>

        {/* Subtle Ambient Aura Backdrop Blur Filter */}
        {glow && (
          <filter id="alSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        )}
      </defs>

      {/* 1. SOFT HOLOGRAPHIC AMBIENT AURA LAYER */}
      <circle
        cx="24"
        cy="24"
        r="18"
        fill="url(#alCorePulse)"
        opacity="0.18"
        className="pointer-events-none"
      />

      {/* 2. GEOMETRIC "A" MONOGRAM ARCH (Human Presence Silhouette + AI Apex) */}
      <path
        d="M 22.35 6.85 
           C 23.05 5.75, 24.95 5.75, 25.65 6.85 
           L 39.4 39.1 
           C 39.95 40.4, 38.95 41.8, 37.55 41.8 
           L 32.4 41.8 
           C 31.5 41.8, 30.7 41.25, 30.35 40.4 
           L 26.6 31.4 
           C 25.8 29.5, 22.2 29.5, 21.4 31.4 
           L 17.65 40.4 
           C 17.3 41.25, 16.5 41.8, 15.6 41.8 
           L 10.45 41.8 
           C 9.05 41.8, 8.05 40.4, 8.6 39.1 
           Z
           M 24 13.8 
           L 18.9 26 
           C 20.6 25.2, 27.4 25.2, 29.1 26 
           Z"
        fill="url(#alIconPrimaryGrad)"
        filter={glow ? 'url(#alSoftGlow)' : undefined}
      />

      {/* 3. FLOWING SOUND-WAVE / AUDIO HARMONIC RIBBON (Connecting the crossbar) */}
      <path
        d="M 12.8 28.6 
           C 16.2 25.4, 19.8 31.8, 24 28.2 
           C 28.2 24.6, 31.8 31.0, 35.2 28.6 
           C 35.8 28.2, 36.2 28.8, 35.7 29.3 
           C 32.2 32.6, 28.4 25.8, 24 29.6 
           C 19.6 33.4, 15.8 26.6, 12.3 29.3 
           C 11.8 28.8, 12.2 28.2, 12.8 28.6 
           Z"
        fill="url(#alSoundwaveGrad)"
      />

      {/* 4. CONCENTRIC AURA RING (Subtle Resonance Waves) */}
      <circle
        cx="24"
        cy="18.5"
        r="4.2"
        stroke="#38BDF8"
        strokeWidth="0.75"
        strokeOpacity="0.45"
        strokeDasharray="2 3"
      />

      {/* 5. LUMINOUS CONSCIOUSNESS / AI CORE NODE */}
      <circle
        cx="24"
        cy="18.5"
        r="2.2"
        fill="#FFFFFF"
      />
      <circle
        cx="24"
        cy="18.5"
        r="1.2"
        fill="#E0F2FE"
      />
    </svg>
  );
};

/**
 * AuraLife Premium Logo Lockup
 * - Icon on the Left
 * - Wordmark on the Right
 * - Clean horizontal lockup with transparent background
 * - Modern geometric typography: "Aura" (Crisp White) + "Life" (Electric Cyan/Blue accent)
 */
export const AuraLifeLogo: React.FC<AuraLifeLogoProps> = ({
  size = 'md',
  className = '',
  showText = true,
  glow = true,
}) => {
  const config = {
    sm: {
      iconSize: 26,
      textStyle: 'text-[17px]',
      gap: 'gap-2.5',
      accentDot: 'h-1.5 w-1.5',
    },
    md: {
      iconSize: 32,
      textStyle: 'text-[20px]',
      gap: 'gap-3',
      accentDot: 'h-1.5 w-1.5',
    },
    lg: {
      iconSize: 38,
      textStyle: 'text-[24px]',
      gap: 'gap-3.5',
      accentDot: 'h-2 w-2',
    },
    xl: {
      iconSize: 46,
      textStyle: 'text-[28px]',
      gap: 'gap-4',
      accentDot: 'h-2.5 w-2.5',
    },
  }[size];

  return (
    <div
      className={`inline-flex items-center ${config.gap} select-none group cursor-pointer bg-transparent ${className}`}
      aria-label="AuraLife Logo"
    >
      {/* 1. Monogram Icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <AuraLifeIcon
          size={config.iconSize}
          glow={glow}
          className="group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* 2. Modern Geometric Wordmark (Aura + Life) */}
      {showText && (
        <div className="flex items-center tracking-tight leading-none font-sans">
          {/* "Aura" in Crisp Light / White */}
          <span
            className={`font-semibold text-[#F8FAFC] tracking-[-0.03em] ${config.textStyle} transition-colors group-hover:text-white`}
          >
            Aura
          </span>

          {/* "Life" in Electric Blue / Cyan Gradient Accent */}
          <span
            className={`font-semibold tracking-[-0.02em] ${config.textStyle} text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#60A5FA] to-[#818CF8]`}
          >
            Life
          </span>

          {/* Subtle Luminous Cyan Accent Dot */}
          <span
            className={`ml-1 rounded-full bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.75)] ${config.accentDot} opacity-85 group-hover:opacity-100 transition-opacity`}
          />
        </div>
      )}
    </div>
  );
};
