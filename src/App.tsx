/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  CoreState,
  AudioLevels,
  Participant,
  LanguageInfo,
  TranscriptItemData,
  DecisionItem,
  TaskItem,
  QuestionItem,
  ScriptStep,
} from './types';
import {
  initialParticipants,
  initialLanguages,
  mockScriptSteps,
} from './mock/mockSession';
import { LandingHero } from './components/landing/LandingHero';
import { AppShell } from './components/layout/AppShell';
import { useRealAudio } from './hooks/useRealAudio';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'landing' | 'workspace'>('landing');

  // Session state
  const [sessionSeconds, setSessionSeconds] = useState(872); // Starts at 00:14:32 for realism
  const [scriptStepIndex, setScriptStepIndex] = useState(0);
  const [isPlayingScript, setIsPlayingScript] = useState(true);

  // Live workspace data
  const [coreState, setCoreState] = useState<CoreState>('LISTENING');
  const [statusLabel, setStatusLabel] = useState('Listening');
  const [statusSubLabel, setStatusSubLabel] = useState('Room audio stream active • 3 participants');
  const [audioLevels, setAudioLevels] = useState<AudioLevels>({
    bass: 0.12,
    mid: 0.08,
    treble: 0.05,
    overall: 0.08,
  });

  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [languages, setLanguages] = useState<LanguageInfo[]>(initialLanguages);
  const [transcripts, setTranscripts] = useState<TranscriptItemData[]>([]);
  const [decisions, setDecisions] = useState<DecisionItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  // Real microphone hook
  const realAudio = useRealAudio();

  // If live mic is active, override simulated audio levels
  useEffect(() => {
    if (realAudio.isActive) {
      setAudioLevels(realAudio.levels);
      if (realAudio.levels.overall > 0.08) {
        setCoreState('USER_SPEAKING');
        setStatusLabel('Live Microphone Input');
        setStatusSubLabel('Detecting live voice frequencies from your device');
      } else {
        setCoreState('LISTENING');
        setStatusLabel('Listening');
        setStatusSubLabel('Live microphone active • Awaiting speech');
      }
    }
  }, [realAudio.isActive, realAudio.levels]);

  // Session timer incrementer
  useEffect(() => {
    if (currentScreen !== 'workspace') return;
    const timer = setInterval(() => {
      setSessionSeconds((sec) => sec + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [currentScreen]);

  // Format session seconds to HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Process a script step
  const executeStep = useCallback((step: ScriptStep) => {
    if (!realAudio.isActive) {
      setCoreState(step.coreState);
      setAudioLevels(step.audioLevels);
      setStatusLabel(step.statusLabel);
      setStatusSubLabel(step.statusSubLabel);
    }

    // Speaking participants update
    if (step.speakingUpdates) {
      setParticipants((prev) =>
        prev.map((p) => ({
          ...p,
          isSpeaking: !!step.speakingUpdates?.[p.name],
        }))
      );
    }

    // Language share update
    if (step.languageShare) {
      setLanguages(step.languageShare);
    }

    // Add new transcript item if not already present
    if (step.newTranscript) {
      setTranscripts((prev) => {
        if (prev.some((t) => t.id === step.newTranscript!.id)) return prev;
        return [...prev, step.newTranscript!];
      });
    }

    // Add new decision
    if (step.newDecision) {
      setDecisions((prev) => {
        if (prev.some((d) => d.id === step.newDecision!.id)) return prev;
        return [...prev, step.newDecision!];
      });
    }

    // Add new task
    if (step.newTask) {
      setTasks((prev) => {
        if (prev.some((t) => t.id === step.newTask!.id)) return prev;
        return [...prev, step.newTask!];
      });
    }

    // Add new question
    if (step.newQuestion) {
      setQuestions((prev) => {
        if (prev.some((q) => q.id === step.newQuestion!.id)) return prev;
        return [...prev, step.newQuestion!];
      });
    }

    // Resolve question if specified in step
    if (step.resolveQuestionId) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === step.resolveQuestionId
            ? {
                ...q,
                isResolved: true,
                resolvedAnswer: 'Decided by Rahul: EU cutover deferred out of scope.',
              }
            : q
        )
      );
    }
  }, [realAudio.isActive]);

  // Automated Script Timeline playback runner
  useEffect(() => {
    if (currentScreen !== 'workspace' || !isPlayingScript) return;

    if (scriptStepIndex >= mockScriptSteps.length) {
      return; // Finished script
    }

    const currentStep = mockScriptSteps[scriptStepIndex];
    executeStep(currentStep);

    // Calculate delay to next step
    const nextStep = mockScriptSteps[scriptStepIndex + 1];
    const delay = nextStep
      ? (nextStep.timeSec - currentStep.timeSec) * 1000
      : 5000;

    const timeout = setTimeout(() => {
      setScriptStepIndex((idx) => idx + 1);
    }, Math.max(1200, delay));

    return () => clearTimeout(timeout);
  }, [currentScreen, isPlayingScript, scriptStepIndex, executeStep]);

  // Reset script simulation
  const handleResetScript = () => {
    setScriptStepIndex(0);
    setTranscripts([]);
    setDecisions([]);
    setTasks([]);
    setQuestions([]);
    setLanguages(initialLanguages);
    setParticipants(initialParticipants);
    setCoreState('LISTENING');
    setStatusLabel('Listening');
    setStatusSubLabel('Room audio stream active • 3 participants');
    setIsPlayingScript(true);
  };

  // Start fresh session
  const handleStartNewSession = () => {
    setSessionSeconds(0);
    handleResetScript();
  };

  // Task status modifications
  const handleTaskStatusChange = (id: string, newStatus: TaskItem['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const handleTaskEditTitle = (id: string, newTitle: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  // Question resolution
  const handleResolveQuestion = (id: string, answer?: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              isResolved: true,
              resolvedAnswer: answer || 'Resolved during discussion',
            }
          : q
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] font-sans antialiased text-[#EDEFF2]">
      {currentScreen === 'landing' ? (
        <LandingHero
          onEnterWorkspace={() => {
            setCurrentScreen('workspace');
            setIsPlayingScript(true);
          }}
        />
      ) : (
        <AppShell
          coreState={coreState}
          audioLevels={audioLevels}
          statusLabel={statusLabel}
          statusSubLabel={statusSubLabel}
          sessionTimeFormatted={formatTime(sessionSeconds)}
          participants={participants}
          languages={languages}
          transcripts={transcripts}
          decisions={decisions}
          tasks={tasks}
          questions={questions}
          isPlayingScript={isPlayingScript}
          onTogglePlayScript={() => setIsPlayingScript((prev) => !prev)}
          onResetScript={handleResetScript}
          onExitToLanding={() => setCurrentScreen('landing')}
          onTaskStatusChange={handleTaskStatusChange}
          onTaskEditTitle={handleTaskEditTitle}
          onResolveQuestion={handleResolveQuestion}
          onStartNewSession={handleStartNewSession}
          isUsingLiveMic={realAudio.isActive}
          onToggleLiveMic={() => {
            if (realAudio.isActive) {
              realAudio.stopLiveAudio();
            } else {
              realAudio.startLiveAudio();
            }
          }}
        />
      )}
    </div>
  );
}
