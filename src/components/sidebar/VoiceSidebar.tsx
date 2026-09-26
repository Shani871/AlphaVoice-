import React from 'react';
import { HumanAvatar } from '../avatar/HumanAvatar';
import { AudioLevels, CoreState, Participant, LanguageInfo, AvatarProfile } from '../../types';
import { Mic, MicOff, Volume2, Radio, Globe2, Sparkles, Activity, ShieldCheck, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';

interface VoiceSidebarProps {
  isSpeaking: boolean;
  activeSpeakerName?: string;
  coreState: CoreState;
  audioLevels: AudioLevels;
  isMuted: boolean;
  onToggleMute: () => void;
  isUsingLiveMic?: boolean;
  onToggleLiveMic?: () => void;
  participants: Participant[];
  languages: LanguageInfo[];
  avatarProfile?: AvatarProfile;
  onChangeAvatarClick?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const VoiceSidebar: React.FC<VoiceSidebarProps> = ({
  isSpeaking,
  activeSpeakerName,
  coreState,
  audioLevels,
  isMuted,
  onToggleMute,
  isUsingLiveMic,
  onToggleLiveMic,
  participants,
  languages,
  avatarProfile,
  onChangeAvatarClick,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
}) => {
  const currentSpeaker =
    activeSpeakerName ||
    participants.find((p) => p.isSpeaking)?.name ||
    (coreState === 'USER_SPEAKING' ? 'User' : undefined);

  if (isCollapsed) {
    return (
      <aside className={`flex flex-col items-center py-4 px-2 w-14 bg-[#141619] border-r border-[#26292F] transition-all duration-300 ${className}`}>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#1C1F24] transition-colors mb-4"
          title="Expand Voice Sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Mini mic icon */}
        <button
          onClick={onToggleMute}
          className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
            isMuted ? 'bg-[#EF4B52]/15 text-[#EF4B52]' : 'bg-[#5B7FFF]/15 text-[#5B7FFF]'
          }`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>

        {/* Mini pulsing voice indicator */}
        <div className="mt-4 flex flex-col gap-1 items-center">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              isSpeaking || coreState === 'USER_SPEAKING'
                ? 'bg-[#3ECF8E] animate-ping'
                : 'bg-[#5F6773]'
            }`}
          />
          <span className="text-[9px] font-mono text-[#5F6773] [writing-mode:vertical-rl]">
            VOICE
          </span>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={`flex flex-col h-full overflow-hidden bg-[#141619] border-r border-[#26292F] transition-all duration-300 ${className}`}
    >
      {/* Top Header of Sidebar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#26292F]">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-[#5B7FFF] animate-pulse" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#EDEFF2]">
            Voice Companion
          </h2>
        </div>

        <div className="flex items-center gap-1">
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 text-[#5F6773] hover:text-[#EDEFF2] hover:bg-[#1C1F24] rounded-lg transition-colors"
              title="Collapse Voice Sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* HUMAN AVATAR (Voice Synced) */}
        <div>
          <HumanAvatar
            isSpeaking={isSpeaking || coreState === 'USER_SPEAKING'}
            audioLevels={audioLevels}
            coreState={coreState}
            speakerName={currentSpeaker}
            avatarProfile={avatarProfile}
            onChangeAvatarClick={onChangeAvatarClick}
            size="compact"
            enableHoverCircle={true}
          />
        </div>

        {/* VOICE INPUT & HARDWARE CONTROLS */}
        <div className="rounded-xl border border-[#26292F] bg-[#1C1F24]/70 p-3 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-[#EDEFF2]">
            <span>Input Controls</span>
            <span className="text-[10px] font-mono text-[#3ECF8E] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3ECF8E] animate-pulse" />
              48kHz • Opus
            </span>
          </div>

          {/* Quick mic action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onToggleMute}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                isMuted
                  ? 'bg-[#EF4B52]/15 text-[#EF4B52] border-[#EF4B52]/30 hover:bg-[#EF4B52]/25'
                  : 'bg-[#141619] text-[#EDEFF2] border-[#26292F] hover:bg-[#26292F]'
              }`}
            >
              {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-[#3ECF8E]" />}
              <span>{isMuted ? 'Muted' : 'Mic Live'}</span>
            </button>

            {onToggleLiveMic && (
              <button
                onClick={onToggleLiveMic}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  isUsingLiveMic
                    ? 'bg-[#3ECF8E]/15 text-[#3ECF8E] border-[#3ECF8E]/40'
                    : 'bg-[#141619] text-[#A3AAB5] border-[#26292F] hover:text-[#EDEFF2]'
                }`}
                title="Use real physical microphone"
              >
                <Activity className="h-3.5 w-3.5 text-[#5B7FFF]" />
                <span>{isUsingLiveMic ? 'Hardware' : 'Simulated'}</span>
              </button>
            )}
          </div>

          {/* 3-Band Frequency Spectrum Meters */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-[#A3AAB5]">
              <span>Bass (Body)</span>
              <span className="font-mono text-[10px] text-[#EDEFF2]">
                {Math.round(audioLevels.bass * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#141619] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#5B7FFF] transition-all duration-75"
                style={{ width: `${Math.min(100, audioLevels.bass * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#A3AAB5]">
              <span>Mid (Vocal Clarity)</span>
              <span className="font-mono text-[10px] text-[#EDEFF2]">
                {Math.round(audioLevels.mid * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#141619] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#3ECF8E] transition-all duration-75"
                style={{ width: `${Math.min(100, audioLevels.mid * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#A3AAB5]">
              <span>Treble (Articulation)</span>
              <span className="font-mono text-[10px] text-[#EDEFF2]">
                {Math.round(audioLevels.treble * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#141619] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#E3A54A] transition-all duration-75"
                style={{ width: `${Math.min(100, audioLevels.treble * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ACTIVE PARTICIPANTS STREAM */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#EDEFF2]">
            <span>Voice Streams ({participants.length})</span>
            <span className="text-[10px] text-[#A3AAB5]">Auto-diarization</span>
          </div>

          <div className="space-y-1.5">
            {participants.map((p) => {
              const active = p.isSpeaking;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    active
                      ? 'bg-[#1C1F24] border-[#3ECF8E]/40 shadow-sm'
                      : 'bg-[#141619]/60 border-[#26292F]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        active
                          ? 'bg-[#3ECF8E]/20 text-[#3ECF8E] ring-1 ring-[#3ECF8E]'
                          : 'bg-[#1C1F24] text-[#A3AAB5]'
                      }`}
                    >
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-xs font-semibold text-[#EDEFF2]">
                        {p.name}
                      </div>
                      <div className="truncate text-[10px] text-[#5F6773]">
                        {p.role}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {active ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-[#3ECF8E] bg-[#3ECF8E]/10 px-1.5 py-0.5 rounded">
                        <Volume2 className="h-3 w-3 animate-pulse" />
                        Speaking
                      </span>
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#5F6773]" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DETECTED LANGUAGES */}
        <div className="pt-2 border-t border-[#26292F] space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[#EDEFF2]">
            <span className="flex items-center gap-1.5">
              <Globe2 className="h-3.5 w-3.5 text-[#5B7FFF]" />
              Languages
            </span>
            <span className="text-[10px] text-[#A3AAB5]">Live translation</span>
          </div>

          <div className="space-y-1.5">
            {languages.map((l) => (
              <div key={l.code} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#EDEFF2]">{l.name}</span>
                  <span className="text-[#A3AAB5] font-mono text-[10px]">{l.percentage}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-[#1C1F24] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      l.isPrimary ? 'bg-[#5B7FFF]' : 'bg-[#E3A54A]'
                    }`}
                    style={{ width: `${l.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
