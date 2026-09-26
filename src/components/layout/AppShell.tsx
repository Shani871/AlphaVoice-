import React, { useState } from 'react';
import {
  CoreState,
  AudioLevels,
  Participant,
  LanguageInfo,
  TranscriptItemData,
  DecisionItem,
  TaskItem,
  QuestionItem,
  AvatarProfile,
} from '../../types';
import { Header } from './Header';
import { AgentAvatar } from '../avatar/AgentAvatar';
import { HumanAvatar } from '../avatar/HumanAvatar';
import { AvatarModal } from '../avatar/AvatarModal';
import { DEFAULT_AVATAR, AVATAR_PROFILES } from '../../config/avatars';
import { VoiceSidebar } from '../sidebar/VoiceSidebar';
import { TranscriptPanel } from '../transcript/TranscriptPanel';
import { IntelligencePanel } from '../intelligence/IntelligencePanel';
import { AudioStatusBar } from '../audio/AudioStatusBar';
import { CatchMeUpModal } from '../session/CatchMeUpModal';
import { SessionSummary } from '../session/SessionSummary';
import { Maximize2, Minimize2, Sparkles, Sliders, RefreshCw } from 'lucide-react';

interface AppShellProps {
  // Session State
  coreState: CoreState;
  audioLevels: AudioLevels;
  statusLabel: string;
  statusSubLabel: string;
  sessionTimeFormatted: string;
  participants: Participant[];
  languages: LanguageInfo[];
  transcripts: TranscriptItemData[];
  decisions: DecisionItem[];
  tasks: TaskItem[];
  questions: QuestionItem[];

  // Script & Player Controls
  isPlayingScript: boolean;
  onTogglePlayScript: () => void;
  onResetScript: () => void;
  onExitToLanding: () => void;

  // Mutations
  onTaskStatusChange: (id: string, status: TaskItem['status']) => void;
  onTaskEditTitle: (id: string, title: string) => void;
  onResolveQuestion: (id: string, answer?: string) => void;
  onStartNewSession: () => void;

  // Real Mic (optional)
  isUsingLiveMic?: boolean;
  onToggleLiveMic?: () => void;
}

export const AppShell: React.FC<AppShellProps> = ({
  coreState,
  audioLevels,
  statusLabel,
  statusSubLabel,
  sessionTimeFormatted,
  participants,
  languages,
  transcripts,
  decisions,
  tasks,
  questions,
  isPlayingScript,
  onTogglePlayScript,
  onResetScript,
  onExitToLanding,
  onTaskStatusChange,
  onTaskEditTitle,
  onResolveQuestion,
  onStartNewSession,
  isUsingLiveMic,
  onToggleLiveMic,
}) => {
  const [isCatchMeUpOpen, setIsCatchMeUpOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);

  // Active digital human avatar & switcher modal
  const [activeAvatar, setActiveAvatar] = useState<AvatarProfile>(DEFAULT_AVATAR);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const handleToggleBoyGirl = () => {
    setActiveAvatar((prev) =>
      prev.id === 'boy' ? AVATAR_PROFILES[1] : AVATAR_PROFILES[0]
    );
  };

  // Clean workspace state options
  const [isVoiceSidebarCollapsed, setIsVoiceSidebarCollapsed] = useState(false);
  const [coreViewMode, setCoreViewMode] = useState<'normal' | 'compact'>('normal');

  // Mobile navigation tab ('voice' | 'workspace' | 'intelligence')
  const [mobileTab, setMobileTab] = useState<'voice' | 'workspace' | 'intelligence'>('workspace');

  const handleToggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const handleMicClick = () => {
    if (simulatedError) {
      setSimulatedError(null);
    } else {
      setIsMuted((prev) => !prev);
    }
  };

  const handleTriggerSimulatedError = () => {
    setSimulatedError('Audio stream interrupted • Audio input disconnected. Reconnecting...');
  };

  const activeSpeaker = participants.find((p) => p.isSpeaking)?.name;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0B0C0E] text-[#EDEFF2]">
      {/* Top Header */}
      <Header
        sessionTimeFormatted={sessionTimeFormatted}
        isLiveDemoPlayback={true}
        isPlayingScript={isPlayingScript}
        onTogglePlayScript={onTogglePlayScript}
        onResetScript={onResetScript}
        onExitToLanding={onExitToLanding}
        onTriggerErrorState={handleTriggerSimulatedError}
      />

      {/* Mobile Tab Navigation (visible only on small screens < lg) */}
      <div className="flex lg:hidden items-center justify-around border-b border-[#26292F] bg-[#141619] px-2 py-1.5 text-xs font-semibold shrink-0">
        <button
          onClick={() => setMobileTab('voice')}
          className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
            mobileTab === 'voice'
              ? 'bg-[#1C1F24] text-[#5B7FFF] border border-[#5B7FFF]/30'
              : 'text-[#A3AAB5]'
          }`}
        >
          <span>Voice & Avatar</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#3ECF8E] animate-pulse" />
        </button>
        <button
          onClick={() => setMobileTab('workspace')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            mobileTab === 'workspace'
              ? 'bg-[#1C1F24] text-[#5B7FFF] border border-[#5B7FFF]/30'
              : 'text-[#A3AAB5]'
          }`}
        >
          Core & Transcript
        </button>
        <button
          onClick={() => setMobileTab('intelligence')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            mobileTab === 'intelligence'
              ? 'bg-[#1C1F24] text-[#5B7FFF] border border-[#5B7FFF]/30'
              : 'text-[#A3AAB5]'
          }`}
        >
          Intelligence ({decisions.length + tasks.length})
        </button>
      </div>

      {/* MAIN WORKSPACE BODY */}
      <div className="flex-1 flex overflow-hidden pb-16">
        {/* LEFT DEDICATED VOICE SIDEBAR (Contains Cartoon Dog Avatar, Mic, Spectrum, Speakers) */}
        <div
          className={`${
            isVoiceSidebarCollapsed ? 'w-14' : 'w-72 xl:w-80'
          } shrink-0 transition-all duration-300 ${
            mobileTab === 'voice' ? 'block w-full' : 'hidden lg:block'
          }`}
        >
          <VoiceSidebar
            isSpeaking={coreState === 'USER_SPEAKING' || !!activeSpeaker}
            activeSpeakerName={activeSpeaker}
            coreState={coreState}
            audioLevels={audioLevels}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            isUsingLiveMic={isUsingLiveMic}
            onToggleLiveMic={onToggleLiveMic}
            participants={participants}
            languages={languages}
            avatarProfile={activeAvatar}
            onChangeAvatarClick={() => setIsAvatarModalOpen(true)}
            isCollapsed={isVoiceSidebarCollapsed}
            onToggleCollapse={() => setIsVoiceSidebarCollapsed((c) => !c)}
            className="h-full"
          />
        </div>

        {/* CENTER MAIN WORKSPACE: VOICE-SYNCED MID-20S HUMAN AVATAR + LIVE TRANSCRIPT */}
        <main
          className={`flex-1 flex flex-col min-w-0 p-3 sm:p-4 gap-3 overflow-hidden ${
            mobileTab === 'workspace' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Top: Human Avatar Visualizer (Mid-20s, Real-Time Lip Sync, Switchable Persona) */}
          <div className="relative rounded-2xl border border-[#26292F] bg-[#141619] shadow-inner overflow-hidden flex flex-col justify-center transition-all duration-200">
            {/* Top Bar with Avatar Identity and Clean View Controls */}
            <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-bold text-[#EDEFF2]">Aura Digital Human</span>
                <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                  Virtual AI Representative
                </span>
                <span className="hidden md:inline text-[11px] text-[#5F6773]">
                  • Cinematic Neural Audio Sync
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCoreViewMode((m) => (m === 'normal' ? 'compact' : 'normal'))
                  }
                  className="p-1 rounded-lg text-[#5F6773] hover:text-[#EDEFF2] hover:bg-[#1C1F24] transition-colors"
                  title={
                    coreViewMode === 'normal'
                      ? 'Collapse to Compact View'
                      : 'Expand to Full View'
                  }
                >
                  {coreViewMode === 'normal' ? (
                    <Minimize2 className="h-3.5 w-3.5" />
                  ) : (
                    <Maximize2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Voice-Synced Premium Digital Human Avatar */}
            <div
              className={`transition-all duration-300 flex items-center justify-center ${
                coreViewMode === 'compact'
                  ? 'h-[140px] sm:h-[160px]'
                  : 'h-[210px] sm:h-[240px]'
              }`}
            >
              <AgentAvatar
                speaker={
                  coreState === 'USER_SPEAKING'
                    ? 'user'
                    : coreState === 'AI_SPEAKING' || !!activeSpeaker
                    ? 'agent'
                    : 'none'
                }
                amplitude={Math.min(1.0, Math.max(audioLevels.overall, audioLevels.bass * 0.8, audioLevels.mid * 0.9))}
                connectionState={
                  coreState === 'AI_INTERRUPTED'
                    ? 'interrupted'
                    : coreState === 'ERROR'
                    ? 'disconnected'
                    : 'connected'
                }
                isThinking={coreState === 'TRANSLATING'}
                size={coreViewMode === 'compact' ? 'compact' : 'normal'}
                className="w-full h-full"
                agentName="Aura Digital Human"
                agentRole="Virtual AI Representative"
              />
            </div>
          </div>

          {/* Bottom: Live Transcript Panel (Clean, focused view) */}
          <div className="flex-1 min-h-0">
            <TranscriptPanel
              items={transcripts}
              liveStatusText={
                coreState === 'USER_SPEAKING'
                  ? 'Capturing team dialogue...'
                  : coreState === 'AI_SPEAKING'
                  ? 'AuraLife synthesizing response...'
                  : coreState === 'AI_INTERRUPTED'
                  ? 'Speech priority yielded to speaker'
                  : 'Listening to room audio...'
              }
            />
          </div>
        </main>

        {/* RIGHT COLUMN: INTELLIGENCE PANEL (Decisions, Action Items, Questions) */}
        <section
          className={`w-full lg:w-80 xl:w-96 shrink-0 flex-col p-3 sm:p-4 pl-0 overflow-hidden ${
            mobileTab === 'intelligence' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <IntelligencePanel
            decisions={decisions}
            tasks={tasks}
            questions={questions}
            onCatchMeUp={() => setIsCatchMeUpOpen(true)}
            onTaskStatusChange={onTaskStatusChange}
            onTaskEditTitle={onTaskEditTitle}
            onResolveQuestion={onResolveQuestion}
          />
        </section>
      </div>

      {/* Sleek, Clean Fixed Bottom Audio Status Bar */}
      <AudioStatusBar
        statusLabel={statusLabel}
        statusSubLabel={statusSubLabel}
        audioLevels={audioLevels}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        micState={simulatedError ? 'error' : isMuted ? 'muted' : 'listening'}
        onMicClick={handleMicClick}
        onCatchMeUp={() => setIsCatchMeUpOpen(true)}
        onEndSession={() => setIsSummaryOpen(true)}
        errorMessage={simulatedError || undefined}
        onClearError={() => setSimulatedError(null)}
        isUsingLiveMic={isUsingLiveMic}
        onToggleLiveMic={onToggleLiveMic}
      />

      {/* Catch Me Up Modal */}
      <CatchMeUpModal
        isOpen={isCatchMeUpOpen}
        onClose={() => setIsCatchMeUpOpen(false)}
        sessionTimeFormatted={sessionTimeFormatted}
      />

      {/* Session Executive Summary Modal */}
      <SessionSummary
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        onStartNewSession={() => {
          setIsSummaryOpen(false);
          onStartNewSession();
        }}
        durationFormatted={sessionTimeFormatted}
        participants={participants}
        languages={languages}
        decisions={decisions}
        tasks={tasks}
        questions={questions}
      />

      {/* Avatar Switcher Modal */}
      <AvatarModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        activeAvatar={activeAvatar}
        onSelectAvatar={(avatar) => setActiveAvatar(avatar)}
      />
    </div>
  );
};
