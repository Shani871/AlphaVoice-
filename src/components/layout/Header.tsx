import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { AuraLifeLogo } from '../common/AuraLifeLogo';
import { Play, Pause, RotateCcw, ArrowLeft, SlidersHorizontal, Info } from 'lucide-react';

interface HeaderProps {
  sessionTimeFormatted: string;
  isLiveDemoPlayback: boolean;
  isPlayingScript: boolean;
  onTogglePlayScript: () => void;
  onResetScript: () => void;
  onExitToLanding: () => void;
  onTriggerErrorState?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  sessionTimeFormatted,
  isLiveDemoPlayback,
  isPlayingScript,
  onTogglePlayScript,
  onResetScript,
  onExitToLanding,
  onTriggerErrorState,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#26292F] bg-[#141619]/95 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Brand Wordmark + Back to Home */}
      <div className="flex items-center gap-3">
        <button
          onClick={onExitToLanding}
          className="flex items-center gap-1.5 text-xs text-[#A3AAB5] hover:text-[#EDEFF2] transition-colors p-1 rounded-lg hover:bg-[#1C1F24]"
          title="Return to Hero Entry"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        {/* AuraLife Wordmark with Stylish Symbol */}
        <AuraLifeLogo size="sm" />

        {/* Tagline snippet */}
        <span className="hidden xl:inline text-xs text-[#5F6773] border-l border-[#26292F] pl-3">
          Voice Intelligence Workspace
        </span>
      </div>

      {/* Center: Demo Playback Controls */}
      <div className="flex items-center gap-2 bg-[#1C1F24] rounded-lg px-2.5 py-1 border border-[#26292F]">
        {/* Transparent Demo Playback Tag - Section 8 Requirement */}
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#E3A54A]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E3A54A] animate-pulse" />
          <span className="hidden sm:inline">Demo Playback</span>
        </span>

        <span className="text-[#26292F]">|</span>

        {/* Play/Pause simulation */}
        <button
          onClick={onTogglePlayScript}
          className="flex items-center gap-1 text-xs font-medium text-[#EDEFF2] hover:text-[#5B7FFF] transition-colors px-1.5 py-0.5 rounded hover:bg-[#26292F]"
          title={isPlayingScript ? 'Pause simulation script' : 'Play simulation script'}
        >
          {isPlayingScript ? (
            <>
              <Pause className="h-3 w-3 text-[#3ECF8E]" />
              <span className="hidden md:inline text-[11px]">Playing</span>
            </>
          ) : (
            <>
              <Play className="h-3 w-3 text-[#A3AAB5]" />
              <span className="hidden md:inline text-[11px]">Paused</span>
            </>
          )}
        </button>

        {/* Restart simulation */}
        <button
          onClick={onResetScript}
          className="p-1 text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#26292F] rounded transition-colors"
          title="Restart scripted conversation"
        >
          <RotateCcw className="h-3 w-3" />
        </button>
      </div>

      {/* Right: Live Tag + Session Timer + Simulation Toggles */}
      <div className="flex items-center gap-3">
        {/* Error state trigger test button (Section 8 requirement) */}
        {onTriggerErrorState && (
          <button
            onClick={onTriggerErrorState}
            className="hidden lg:flex items-center gap-1 text-[11px] text-[#A3AAB5] hover:text-[#EF4B52] transition-colors px-2 py-1 rounded bg-[#1C1F24] border border-[#26292F]"
            title="Simulate network / mic disconnect error"
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>Simulate Error</span>
          </button>
        )}

        {/* Live Tag */}
        <div className="flex items-center gap-1.5 rounded-full bg-[#3ECF8E]/10 border border-[#3ECF8E]/30 px-2.5 py-0.5 text-xs font-semibold text-[#3ECF8E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3ECF8E] animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* Timer */}
        <div className="font-mono text-sm font-semibold text-[#EDEFF2] tracking-wider">
          {sessionTimeFormatted}
        </div>
      </div>
    </header>
  );
};
