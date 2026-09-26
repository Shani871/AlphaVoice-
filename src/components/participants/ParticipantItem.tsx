import React from 'react';
import { Participant } from '../../types';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface ParticipantItemProps {
  participant: Participant;
}

export const ParticipantItem: React.FC<ParticipantItemProps> = ({ participant }) => {
  const { name, role, isSpeaking, isOnline, language } = participant;

  return (
    <div
      className={`group relative flex items-center justify-between rounded-xl p-3 border transition-all duration-200 ${
        isSpeaking
          ? 'bg-[#1C1F24] border-[#3ECF8E]/40 shadow-sm shadow-[#3ECF8E]/10'
          : 'bg-[#141619] border-[#26292F] hover:border-[#3A3F47]'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Avatar with speaking ring */}
        <div className="relative shrink-0">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full font-semibold text-xs transition-all ${
              isSpeaking
                ? 'bg-[#3ECF8E]/20 text-[#3ECF8E] ring-2 ring-[#3ECF8E]'
                : 'bg-[#1C1F24] text-[#EDEFF2] border border-[#26292F]'
            }`}
          >
            {name.slice(0, 2).toUpperCase()}
          </div>
          {/* Online dot */}
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#141619] ${
              isOnline ? 'bg-[#3ECF8E]' : 'bg-[#5F6773]'
            }`}
          />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-[#EDEFF2]">{name}</span>
            {isSpeaking && (
              <span className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium bg-[#3ECF8E]/15 text-[#3ECF8E]">
                <Volume2 className="h-2.5 w-2.5 animate-pulse" />
                Speaking
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#A3AAB5]">
            <span className="truncate">{role}</span>
            <span className="text-[#5F6773]">•</span>
            <span className="truncate text-[#5F6773]">{language}</span>
          </div>
        </div>
      </div>

      {/* Mic status icon */}
      <div className="shrink-0 text-[#5F6773] pl-2">
        {isSpeaking ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3ECF8E]/10 text-[#3ECF8E]">
            <Mic className="h-3.5 w-3.5" />
          </span>
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1C1F24] text-[#5F6773]">
            <MicOff className="h-3.5 w-3.5" />
          </span>
        )}
      </div>
    </div>
  );
};
