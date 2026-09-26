import React from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

interface MicButtonProps {
  state: 'listening' | 'muted' | 'error';
  onClick: () => void;
  className?: string;
}

export const MicButton: React.FC<MicButtonProps> = ({
  state,
  onClick,
  className = '',
}) => {
  const config = {
    listening: {
      bg: 'bg-[#5B7FFF] text-[#EDEFF2] hover:bg-[#6e8eff] active:bg-[#4d70f0] ring-4 ring-[#5B7FFF]/20',
      icon: <Mic className="h-5 w-5" />,
      title: 'Microphone Active (Click to mute)',
    },
    muted: {
      bg: 'bg-[#1C1F24] text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#26292F] border border-[#26292F]',
      icon: <MicOff className="h-5 w-5 text-[#5F6773]" />,
      title: 'Microphone Muted (Click to unmute)',
    },
    error: {
      bg: 'bg-[#EF4B52] text-white hover:bg-[#ff5d64] ring-4 ring-[#EF4B52]/20',
      icon: <AlertCircle className="h-5 w-5" />,
      title: 'Microphone Error (Click to retry)',
    },
  }[state];

  return (
    <button
      onClick={onClick}
      title={config.title}
      className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 cursor-pointer shadow-lg active:scale-95 focus:outline-none ${config.bg} ${className}`}
      aria-label={config.title}
    >
      {state === 'listening' && (
        <span className="absolute -inset-1 rounded-full border border-[#5B7FFF]/40 animate-ping opacity-30 pointer-events-none" />
      )}
      {config.icon}
    </button>
  );
};
