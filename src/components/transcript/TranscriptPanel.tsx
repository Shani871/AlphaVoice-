import React, { useRef, useEffect, useState } from 'react';
import { TranscriptItemData } from '../../types';
import { TranscriptItem } from './TranscriptItem';
import { MessageSquare, ArrowDown, Sparkles } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface TranscriptPanelProps {
  items: TranscriptItemData[];
  liveStatusText?: string;
}

export const TranscriptPanel: React.FC<TranscriptPanelProps> = ({
  items,
  liveStatusText = 'Transcribing live...',
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll on new transcript items
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [items, autoScroll]);

  // Detect user scroll up to pause auto-scroll
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
    setAutoScroll(isAtBottom);
  };

  return (
    <div className="flex h-full flex-col bg-[#141619] rounded-xl border border-[#26292F] overflow-hidden">
      {/* Transcript Header */}
      <div className="flex items-center justify-between border-b border-[#26292F] px-4 py-3 bg-[#141619]">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[#5B7FFF]" />
          <h3 className="text-sm font-bold text-[#EDEFF2]">Live Transcript</h3>
          <span className="rounded-full bg-[#1C1F24] px-2 py-0.5 text-xs text-[#A3AAB5]">
            {items.length} lines
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-[#3ECF8E]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ECF8E] animate-pulse" />
            <span className="hidden sm:inline text-[11px] font-medium">{liveStatusText}</span>
          </div>

          {!autoScroll && (
            <button
              onClick={() => {
                setAutoScroll(true);
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-[11px] font-medium text-[#5B7FFF] bg-[#5B7FFF]/10 border border-[#5B7FFF]/30 px-2 py-0.5 rounded hover:bg-[#5B7FFF]/20 transition-colors"
            >
              <ArrowDown className="h-3 w-3" />
              Resume scroll
            </button>
          )}
        </div>
      </div>

      {/* Transcript Scroll Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-1"
      >
        {items.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="h-5 w-5" />}
            title="Waiting for voice stream"
            description="When team members begin speaking, real-time transcription and automatic translation will appear here."
          />
        ) : (
          items.map((item) => (
            <TranscriptItem
              key={item.id}
              speaker={item.speaker}
              timestamp={item.timestamp}
              text={item.text}
              language={item.language}
              translation={item.translation}
              inlineEvent={item.inlineEvent}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
