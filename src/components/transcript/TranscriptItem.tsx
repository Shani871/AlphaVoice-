import React from 'react';
import { motion } from 'motion/react';
import { InlineEvent } from '../../types';
import { EventInline } from './EventInline';
import { Languages, Sparkles } from 'lucide-react';

interface TranscriptItemProps {
  speaker: string;
  timestamp: string;
  text: string;
  language: string;
  translation?: string;
  inlineEvent?: InlineEvent;
}

export const TranscriptItem: React.FC<TranscriptItemProps> = ({
  speaker,
  timestamp,
  text,
  language,
  translation,
  inlineEvent,
}) => {
  const isAI =
    speaker.toLowerCase().includes('auralife') ||
    speaker.toLowerCase().includes('ai') ||
    speaker.toLowerCase().includes('wow');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className="group py-2.5 transition-colors border-b border-[#26292F]/50 last:border-b-0"
    >
      {/* Speaker header row */}
      <div className="flex items-center justify-between text-xs mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className={`font-semibold ${
              isAI ? 'text-[#5B7FFF] flex items-center gap-1' : 'text-[#EDEFF2]'
            }`}
          >
            {isAI && <Sparkles className="h-3 w-3" />}
            {speaker}
          </span>
          <span className="rounded bg-[#1C1F24] px-1.5 py-0.5 text-[10px] font-mono text-[#A3AAB5] border border-[#26292F]">
            {language.toUpperCase()}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#5F6773]">{timestamp}</span>
      </div>

      {/* Main transcript text */}
      <p className="text-sm leading-relaxed text-[#EDEFF2] select-text">
        {text}
      </p>

      {/* Inline real-time translation when present */}
      {translation && (
        <div className="mt-2 rounded-lg border border-[#E3A54A]/30 bg-[#E3A54A]/5 p-2.5 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[#E3A54A] mb-1">
            <Languages className="h-3 w-3" />
            <span>Translated to English</span>
          </div>
          <p className="text-[#EDEFF2] italic font-normal">
            &ldquo;{translation}&rdquo;
          </p>
        </div>
      )}

      {/* Inline event notification if attached */}
      {inlineEvent && <EventInline event={inlineEvent} />}
    </motion.div>
  );
};
