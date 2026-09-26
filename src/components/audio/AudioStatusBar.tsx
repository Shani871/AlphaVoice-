import React from 'react';
import { AudioLevels } from '../../types';
import { MicButton } from './MicButton';
import { Button } from '../common/Button';
import {
  Mic,
  MicOff,
  Sparkles,
  PhoneOff,
  AlertTriangle,
  RefreshCw,
  Radio,
} from 'lucide-react';

interface AudioStatusBarProps {
  statusLabel: string;
  statusSubLabel: string;
  audioLevels: AudioLevels;
  isMuted: boolean;
  onToggleMute: () => void;
  micState: 'listening' | 'muted' | 'error';
  onMicClick: () => void;
  onCatchMeUp: () => void;
  onEndSession: () => void;
  errorMessage?: string;
  onClearError?: () => void;
  isUsingLiveMic?: boolean;
  onToggleLiveMic?: () => void;
}

export const AudioStatusBar: React.FC<AudioStatusBarProps> = ({
  statusLabel,
  statusSubLabel,
  audioLevels,
  isMuted,
  onToggleMute,
  micState,
  onMicClick,
  onCatchMeUp,
  onEndSession,
  errorMessage,
  onClearError,
  isUsingLiveMic,
  onToggleLiveMic,
}) => {
  // Generate multi-bar live equalizer (8 bars)
  const barHeights = React.useMemo(() => {
    if (isMuted) return [10, 10, 10, 10, 10, 10, 10, 10];
    const { bass, mid, treble, overall } = audioLevels;
    return [
      Math.max(12, bass * 85),
      Math.max(16, (bass + mid) * 50),
      Math.max(14, mid * 95),
      Math.max(20, overall * 100),
      Math.max(18, mid * 90),
      Math.max(15, treble * 92),
      Math.max(12, (treble + mid) * 45),
      Math.max(10, treble * 80),
    ];
  }, [audioLevels, isMuted]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#26292F] bg-[#141619]/95 backdrop-blur-md px-4 sm:px-6 py-2.5">
      {/* Error Banner if triggered */}
      {errorMessage && (
        <div className="mb-2.5 flex items-center justify-between rounded-xl border border-[#EF4B52]/40 bg-[#EF4B52]/10 px-4 py-2 text-xs text-[#EF4B52]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
          {onClearError && (
            <button
              onClick={onClearError}
              className="flex items-center gap-1 rounded bg-[#EF4B52]/20 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-[#EF4B52]/30 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Try Again
            </button>
          )}
        </div>
      )}

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Left: Status Label & Sub-label */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1C1F24] border border-[#26292F] text-[#5B7FFF]">
            <Radio className="h-4 w-4 animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#3ECF8E] animate-pulse shrink-0" />
              <h4 className="truncate text-sm font-bold text-[#EDEFF2]">
                {statusLabel}
              </h4>
            </div>
            <p className="truncate text-xs text-[#A3AAB5] hidden md:block">
              {statusSubLabel}
            </p>
          </div>
        </div>

        {/* Center: Live Level Meter + Mic Button */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Level Meter (equalizer bars) */}
          <div
            className="flex items-end gap-1 h-7 px-2.5 py-1 rounded-lg bg-[#1C1F24] border border-[#26292F]"
            title="Live Audio Frequency Spectrum"
          >
            {barHeights.map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-75 ${
                  isMuted
                    ? 'bg-[#5F6773]'
                    : h > 65
                    ? 'bg-[#5B7FFF]'
                    : 'bg-[#3ECF8E]'
                }`}
                style={{ height: `${Math.min(100, Math.max(15, h))}%` }}
              />
            ))}
          </div>

          {/* Center Mic Button */}
          <MicButton state={micState} onClick={onMicClick} />

          {/* Live Mic Toggle Pill (optional real microphone input) */}
          {onToggleLiveMic && (
            <button
              onClick={onToggleLiveMic}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isUsingLiveMic
                  ? 'bg-[#3ECF8E]/15 text-[#3ECF8E] border-[#3ECF8E]/40'
                  : 'bg-[#1C1F24] text-[#A3AAB5] border-[#26292F] hover:text-[#EDEFF2]'
              }`}
              title="Test with your real microphone input"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isUsingLiveMic ? 'bg-[#3ECF8E] animate-pulse' : 'bg-[#5F6773]'
                }`}
              />
              {isUsingLiveMic ? 'Live Mic: ON' : 'Use Real Mic'}
            </button>
          )}
        </div>

        {/* Right: Actions (Mute, Catch Up, End) */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant={isMuted ? 'danger' : 'secondary'}
            onClick={onToggleMute}
            icon={isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
            className="hidden sm:inline-flex"
          >
            {isMuted ? 'Unmute' : 'Mute'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onCatchMeUp}
            icon={<Sparkles className="h-3.5 w-3.5 text-[#5B7FFF]" />}
          >
            Catch Up
          </Button>

          <Button
            size="sm"
            variant="danger"
            onClick={onEndSession}
            icon={<PhoneOff className="h-3.5 w-3.5" />}
          >
            End
          </Button>
        </div>
      </div>
    </footer>
  );
};
