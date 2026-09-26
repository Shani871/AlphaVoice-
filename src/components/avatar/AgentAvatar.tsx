import React, { useState, useEffect, useRef } from 'react';

export type SpeakerType = 'user' | 'agent' | 'none';
export type ConnectionStateType = 'connected' | 'connecting' | 'disconnected' | 'interrupted';

export interface AgentAvatarProps {
  speaker?: SpeakerType;
  amplitude?: number; // 0.0 to 1.0
  connectionState?: ConnectionStateType;
  isThinking?: boolean;
  size?: 'compact' | 'normal' | 'hero';
  className?: string;
  onInteract?: () => void;
  // Optional identity metadata
  agentName?: string;
  agentRole?: string;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  speaker = 'none',
  amplitude = 0,
  connectionState = 'connected',
  isThinking = false,
  size = 'normal',
  className = '',
  onInteract,
  agentName = 'Aura Digital Human',
  agentRole = 'Virtual AI Representative',
}) => {
  const [blink, setBlink] = useState(false);
  const [interruptedFlash, setInterruptedFlash] = useState(false);
  const [smoothAmp, setSmoothAmp] = useState(0);
  const [mouthTier, setMouthTier] = useState(0);

  const prevConnectionState = useRef(connectionState);
  const smoothedAmpRef = useRef(0);
  const smoothedOpennessRef = useRef(0);
  const headBobRef = useRef({ y: 0, tilt: 0, scale: 1 });
  const animFrameIdRef = useRef<number | null>(null);

  const isUserSpeaking = speaker === 'user';
  const isAgentSpeaking = speaker === 'agent';
  const isDisconnected = connectionState === 'disconnected';
  const isInterrupted = connectionState === 'interrupted' || interruptedFlash;
  const isThinkingState = isThinking || connectionState === 'connecting';

  // Watch for transition to interrupted to trigger the amber pulse
  useEffect(() => {
    if (
      connectionState === 'interrupted' &&
      prevConnectionState.current !== 'interrupted'
    ) {
      setInterruptedFlash(true);
      const timer = setTimeout(() => setInterruptedFlash(false), 800);
      return () => clearTimeout(timer);
    }
    prevConnectionState.current = connectionState;
  }, [connectionState]);

  // Periodic natural eye blinking when idle or listening
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      // Don't blink during intense interruption flash
      if (!isInterrupted) {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
      }
    }, 3400 + Math.random() * 2400);

    return () => clearInterval(blinkInterval);
  }, [isInterrupted]);

  // 60FPS physics interpolation loop for smooth natural motion & 6 mouth states
  useEffect(() => {
    let startTime = performance.now();

    const updateLoop = (currentTime: number) => {
      const elapsed = (currentTime - startTime) * 0.001;

      // 1. Target amplitude smoothing
      const rawTargetAmp = isAgentSpeaking ? Math.min(1.0, Math.max(0, amplitude)) : 0;
      smoothedAmpRef.current += (rawTargetAmp - smoothedAmpRef.current) * 0.28;
      const currentAmp = smoothedAmpRef.current;
      setSmoothAmp(currentAmp);

      // 2. 6-Stage Mouth Openness State Calculation (Only when AGENT is speaking)
      let targetTier = 0;
      let targetOpenness = 0;

      if (isAgentSpeaking && !isInterrupted && !isThinkingState) {
        if (currentAmp < 0.08) {
          targetTier = 0; // State 0: Resting closed
          targetOpenness = 0;
        } else if (currentAmp < 0.22) {
          targetTier = 1; // State 1: Micro-parted lips
          targetOpenness = 0.22;
        } else if (currentAmp < 0.40) {
          targetTier = 2; // State 2: Soft vowel opening
          targetOpenness = 0.45;
        } else if (currentAmp < 0.60) {
          targetTier = 3; // State 3: Moderate syllable articulation
          targetOpenness = 0.68;
        } else if (currentAmp < 0.80) {
          targetTier = 4; // State 4: Expressive speech opening
          targetOpenness = 0.86;
        } else {
          targetTier = 5; // State 5: Full vocal resonance
          targetOpenness = 1.0;
        }
      } else {
        // When USER is speaking, IDLE, THINKING, or INTERRUPTED: mouth strictly resting
        targetTier = 0;
        targetOpenness = 0;
      }

      setMouthTier(targetTier);
      smoothedOpennessRef.current += (targetOpenness - smoothedOpennessRef.current) * 0.32;

      // 3. Subtle Organic Head Motion
      if (isAgentSpeaking) {
        // Conversational subtle micro-nodding synced to speech cadence
        headBobRef.current = {
          y: Math.sin(elapsed * 5.2) * (1.2 + currentAmp * 1.8),
          tilt: Math.sin(elapsed * 2.8) * (0.4 + currentAmp * 0.6),
          scale: 1.0,
        };
      } else if (isUserSpeaking) {
        // Attentive listening posture: slight forward focus, very subtle stillness
        headBobRef.current = {
          y: Math.sin(elapsed * 1.4) * 0.6,
          tilt: 0.35,
          scale: 1.014,
        };
      } else {
        // Idle gentle breathing & floating
        headBobRef.current = {
          y: Math.sin(elapsed * 1.5) * 1.4,
          tilt: Math.cos(elapsed * 0.8) * 0.25,
          scale: 1.0,
        };
      }

      animFrameIdRef.current = requestAnimationFrame(updateLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isAgentSpeaking, isUserSpeaking, isInterrupted, isThinkingState, amplitude]);

  // Dimension scaling
  const dimensions = {
    compact: {
      viewport: 'w-24 h-24 sm:w-28 sm:h-28',
      halo: 'w-32 h-32 sm:w-36 sm:h-36',
      container: 'h-auto py-1',
    },
    normal: {
      viewport: 'w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52',
      halo: 'w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72',
      container: 'h-[210px] sm:h-[240px]',
    },
    hero: {
      viewport: 'w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80',
      halo: 'w-80 h-80 sm:w-96 sm:h-96 md:w-[420px] md:h-[420px]',
      container: 'h-[360px] sm:h-[420px]',
    },
  }[size];

  // Dynamic Aura Reactions
  const auraGlowIntensity = isDisconnected
    ? 0.12
    : isInterrupted
    ? 0.75
    : isUserSpeaking
    ? 0.45 + Math.min(0.4, amplitude * 0.5)
    : isAgentSpeaking
    ? 0.55 + smoothAmp * 0.45
    : isThinkingState
    ? 0.5
    : 0.35;

  const auraColorClass = isInterrupted
    ? 'from-amber-500/40 via-red-500/20 to-transparent'
    : isDisconnected
    ? 'from-slate-600/20 via-slate-800/10 to-transparent'
    : isThinkingState
    ? 'from-cyan-400/35 via-blue-500/20 to-transparent'
    : isUserSpeaking
    ? 'from-emerald-400/30 via-cyan-500/20 to-transparent'
    : 'from-cyan-500/35 via-blue-600/20 to-transparent';

  // HUD Ring styling based on state
  const hudBorderColor = isInterrupted
    ? 'border-amber-500/70 shadow-[0_0_25px_rgba(245,158,11,0.35)]'
    : isDisconnected
    ? 'border-slate-700/40'
    : isThinkingState
    ? 'border-cyan-400/70 shadow-[0_0_25px_rgba(6,182,212,0.35)]'
    : isAgentSpeaking
    ? 'border-cyan-400/80 shadow-[0_0_30px_rgba(6,182,212,0.4)]'
    : isUserSpeaking
    ? 'border-emerald-400/70 shadow-[0_0_25px_rgba(52,211,153,0.3)]'
    : 'border-cyan-500/30 hover:border-cyan-400/50';

  const statusLabel = isDisconnected
    ? 'Disconnected'
    : isInterrupted
    ? 'Interrupted'
    : isThinkingState
    ? 'Processing...'
    : isAgentSpeaking
    ? 'Digital Human Speaking'
    : isUserSpeaking
    ? 'Listening Attentively'
    : 'Online • Attentive';

  const statusIndicatorColor = isDisconnected
    ? 'bg-slate-500'
    : isInterrupted
    ? 'bg-amber-400 animate-ping'
    : isThinkingState
    ? 'bg-cyan-400 animate-pulse'
    : isAgentSpeaking
    ? 'bg-cyan-400 animate-pulse'
    : isUserSpeaking
    ? 'bg-emerald-400 animate-pulse'
    : 'bg-cyan-500';

  const curOpen = smoothedOpennessRef.current;

  return (
    <div
      onClick={onInteract}
      className={`relative select-none flex flex-col items-center justify-center transition-all duration-300 ${dimensions.container} ${className}`}
    >
      {/* 1. SOFT CIRCULAR CYAN AURA BEHIND THE AVATAR */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-500 bg-gradient-to-tr ${auraColorClass} blur-3xl`}
        style={{
          width: isAgentSpeaking ? '118%' : '100%',
          height: isAgentSpeaking ? '118%' : '100%',
          opacity: auraGlowIntensity,
          transform: `scale(${1.0 + (isAgentSpeaking ? smoothAmp * 0.15 : isUserSpeaking ? amplitude * 0.1 : 0)})`,
        }}
      />

      {/* 2. SUBTLE HOLOGRAPHIC DUST PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <span
          className="absolute h-1 w-1 rounded-full bg-cyan-400/60 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse"
          style={{ top: '22%', left: '26%', animationDuration: '4s' }}
        />
        <span
          className="absolute h-1 w-1 rounded-full bg-cyan-300/50 shadow-[0_0_6px_rgba(6,182,212,0.6)] animate-pulse"
          style={{ top: '68%', right: '24%', animationDuration: '5.2s' }}
        />
        <span
          className="absolute h-0.5 w-0.5 rounded-full bg-emerald-400/50 animate-pulse"
          style={{ top: '35%', right: '28%', animationDuration: '3.6s' }}
        />
        <span
          className="absolute h-0.5 w-0.5 rounded-full bg-blue-400/50 animate-pulse"
          style={{ bottom: '26%', left: '30%', animationDuration: '4.8s' }}
        />
      </div>

      {/* 3. THIN CIRCULAR FUTURISTIC HUD RING */}
      <div
        className={`absolute rounded-full pointer-events-none transition-all duration-500 ${dimensions.halo} flex items-center justify-center`}
      >
        {/* Outer Orbit Segment Ring */}
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-500 ${hudBorderColor} ${
            isThinkingState ? 'animate-spin' : ''
          }`}
          style={{
            animationDuration: isThinkingState ? '8s' : '30s',
            borderStyle: isThinkingState ? 'dashed' : 'solid',
            borderWidth: '1px',
          }}
        />

        {/* Futuristic Calibration Degree Ticks */}
        <svg
          viewBox="0 0 100 100"
          className={`w-full h-full absolute inset-0 opacity-40 transition-transform duration-1000 ${
            isAgentSpeaking ? 'rotate-12' : ''
          }`}
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="1.5 6"
            className={isInterrupted ? 'text-amber-400' : 'text-cyan-400/60'}
          />
          {/* Cyan Focal Quadrant Marks */}
          <line x1="50" y1="0" x2="50" y2="4" stroke="currentColor" strokeWidth="1.2" className="text-cyan-400" />
          <line x1="50" y1="96" x2="50" y2="100" stroke="currentColor" strokeWidth="1.2" className="text-cyan-400" />
          <line x1="0" y1="50" x2="4" y2="50" stroke="currentColor" strokeWidth="1.2" className="text-cyan-400" />
          <line x1="96" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="1.2" className="text-cyan-400" />
        </svg>

        {/* Audio-Reactive HUD Pulse Wave when speaking */}
        {isAgentSpeaking && smoothAmp > 0.15 && (
          <div
            className="absolute rounded-full border border-cyan-400/40 animate-ping pointer-events-none"
            style={{
              width: '92%',
              height: '92%',
              animationDuration: '2.4s',
            }}
          />
        )}
      </div>

      {/* 4. PREMIUM DIGITAL HUMAN PORTRAIT VIEWPORT */}
      <div
        className={`relative z-10 rounded-full overflow-hidden transition-all duration-300 border shadow-2xl bg-[#090B0E] ${dimensions.viewport} ${
          isInterrupted
            ? 'border-amber-500/80 shadow-[0_0_35px_rgba(245,158,11,0.45)]'
            : isDisconnected
            ? 'border-slate-800'
            : isThinkingState
            ? 'border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.35)]'
            : isAgentSpeaking
            ? 'border-cyan-400/80 shadow-[0_0_35px_rgba(6,182,212,0.4)]'
            : isUserSpeaking
            ? 'border-emerald-400/70 shadow-[0_0_25px_rgba(52,211,153,0.3)]'
            : 'border-[#26292F] hover:border-cyan-500/50'
        }`}
        style={{
          transform: `translateY(${headBobRef.current.y}px) rotate(${headBobRef.current.tilt}deg) scale(${headBobRef.current.scale})`,
          filter: isDisconnected ? 'grayscale(85%) contrast(90%) opacity(0.65)' : 'none',
        }}
      >
        {/* BASE HIGH-QUALITY DIGITAL HUMAN PORTRAIT (RESTING CALM STATE) */}
        <img
          src="/avatars/digital_human_rest.jpg"
          alt={agentName}
          className="w-full h-full object-cover object-center select-none pointer-events-none"
          draggable={false}
        />

        {/* 5. 6-STAGE NATURAL MOUTH ARTICULATION LAYER */}
        {/* Uses high-resolution photographic speaking viseme with feathered alpha masking */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-100 ease-out"
          style={{
            opacity: curOpen,
            transform: `translateY(${curOpen * 1.8}px) scaleY(${1.0 + curOpen * 0.03})`,
            // Masked exactly over mouth & jaw region with smooth feathered gradient boundary
            WebkitMaskImage:
              'radial-gradient(ellipse 34% 18% at 50% 64.5%, black 40%, transparent 100%)',
            maskImage:
              'radial-gradient(ellipse 34% 18% at 50% 64.5%, black 40%, transparent 100%)',
          }}
        >
          <img
            src="/avatars/digital_human_speaking.jpg"
            alt={`${agentName} speaking`}
            className="w-full h-full object-cover object-center select-none"
            draggable={false}
          />
        </div>

        {/* NATURAL EYE BLINKING OVERLAY */}
        {blink && !isInterrupted && (
          <div
            className="absolute pointer-events-none z-20 flex justify-between px-2"
            style={{
              top: '38.5%',
              left: '28%',
              right: '28%',
              height: '5%',
            }}
          >
            <span className="w-5 h-1.5 rounded-full bg-[#B3876B]/90 shadow-sm blur-[0.3px]" />
            <span className="w-5 h-1.5 rounded-full bg-[#B3876B]/90 shadow-sm blur-[0.3px]" />
          </div>
        )}

        {/* THINKING STATE: SOFT CYAN SCANNING BEAM EFFECT */}
        {isThinkingState && (
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <div
              className="w-full h-10 bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent animate-scan"
              style={{
                boxShadow: '0 0 15px rgba(6,182,212,0.4)',
              }}
            />
          </div>
        )}

        {/* INTERRUPTED STATE: AMBER FLASH PULSE OVERLAY */}
        {isInterrupted && (
          <div className="absolute inset-0 bg-amber-500/20 backdrop-blur-[0.5px] pointer-events-none z-25 animate-pulse" />
        )}

        {/* ATTENTIVE LISTENING CATCHLIGHT BOOST WHEN USER SPEAKS */}
        {isUserSpeaking && (
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent pointer-events-none z-10" />
        )}

        {/* SUBTLE CINEMATIC VIGNETTE */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090B0E]/50 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 5. MINIMAL, PREMIUM METADATA HUD BADGE */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full px-3.5 py-1 bg-[#101317]/90 border border-[#26292F] shadow-xl backdrop-blur-md pointer-events-auto">
        <span className={`h-2 w-2 rounded-full ${statusIndicatorColor}`} />
        <span className="text-xs font-semibold text-[#EDEFF2] tracking-wide">
          {statusLabel}
        </span>
        {isAgentSpeaking && (
          <span className="text-[10px] font-mono text-cyan-400 pl-1 border-l border-[#26292F]">
            Mouth State {mouthTier}/5
          </span>
        )}
      </div>
    </div>
  );
};
