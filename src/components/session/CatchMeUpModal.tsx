import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { catchMeUpSummaryData } from '../../mock/mockSession';
import { Sparkles, Check, AlertCircle, Volume2, Pause, RotateCcw } from 'lucide-react';

interface CatchMeUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionTimeFormatted?: string;
}

export const CatchMeUpModal: React.FC<CatchMeUpModalProps> = ({
  isOpen,
  onClose,
  sessionTimeFormatted = '00:14:32',
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleTogglePlayAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(catchMeUpSummaryData.spokenAudioText);
        utterance.rate = 1.05;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        setIsPlayingAudio(true);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      // Fallback toggle
      setIsPlayingAudio(!isPlayingAudio);
    }
  };

  const handleClose = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Catch Me Up"
      subtitle={`Synthesized recap covering elapsed conversation (${sessionTimeFormatted})`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Audio Player Card */}
        <div className="rounded-xl border border-[#5B7FFF]/30 bg-[#1C1F24] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="primary"
                onClick={handleTogglePlayAudio}
                icon={
                  isPlayingAudio ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )
                }
              >
                {isPlayingAudio ? 'Pause Spoken Recap' : 'Play Spoken Recap'}
              </Button>

              <div className="text-xs">
                <span className="font-semibold text-[#EDEFF2] block">
                  AI Voice Briefing (32s)
                </span>
                <span className="text-[#A3AAB5]">Generated via AuraLife Audio Engine</span>
              </div>
            </div>

            {isPlayingAudio && (
              <div className="flex items-center gap-1 h-5">
                {[40, 90, 60, 100, 75, 45, 80, 50].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-[#5B7FFF] rounded-full animate-pulse"
                    style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-[#A3AAB5] border-t border-[#26292F] pt-2 italic">
            &ldquo;{catchMeUpSummaryData.spokenAudioText}&rdquo;
          </p>
        </div>

        {/* Resolved Items */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#3ECF8E]">
            <Check className="h-4 w-4" />
            <span>Resolved Points & Decisions (✓)</span>
          </div>
          <div className="space-y-2">
            {catchMeUpSummaryData.resolvedPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 rounded-lg border border-[#3ECF8E]/20 bg-[#3ECF8E]/5 p-3 text-xs"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#3ECF8E]/20 text-[#3ECF8E] font-bold text-[10px]">
                  ✓
                </span>
                <span className="text-[#EDEFF2] leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unresolved Items */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#E3A54A]">
            <AlertCircle className="h-4 w-4" />
            <span>Unresolved Questions & Pending Actions (!)</span>
          </div>
          <div className="space-y-2">
            {catchMeUpSummaryData.unresolvedPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 rounded-lg border border-[#E3A54A]/20 bg-[#E3A54A]/5 p-3 text-xs"
              >
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E3A54A]/20 text-[#E3A54A] font-bold text-[10px]">
                  !
                </span>
                <span className="text-[#EDEFF2] leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#26292F] pt-4">
          <Button variant="secondary" size="md" onClick={handleClose}>
            Back to Workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
};
