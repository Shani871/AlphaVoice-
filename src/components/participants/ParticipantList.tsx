import React from 'react';
import { Participant, LanguageInfo } from '../../types';
import { ParticipantItem } from './ParticipantItem';
import { Users, Globe2, Sparkles } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface ParticipantListProps {
  participants: Participant[];
  languages: LanguageInfo[];
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  participants,
  languages,
}) => {
  const activeCount = participants.filter((p) => p.isOnline).length;
  const speakingParticipant = participants.find((p) => p.isSpeaking);

  return (
    <div className="flex h-full flex-col justify-between overflow-y-auto pr-1">
      {/* Top: Participants */}
      <div className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-[#5B7FFF]" />
            <h3 className="text-sm font-bold tracking-tight text-[#EDEFF2]">
              Participants
            </h3>
            <span className="rounded-full bg-[#1C1F24] px-2 py-0.5 text-xs font-semibold text-[#A3AAB5]">
              {participants.length}
            </span>
          </div>
          <span className="text-xs text-[#3ECF8E] flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#3ECF8E] animate-pulse" />
            {activeCount} active
          </span>
        </div>

        {/* List */}
        {participants.length === 0 ? (
          <EmptyState
            compact
            icon={<Users className="h-5 w-5" />}
            title="No participants detected"
            description="Speakers will automatically appear when speech stream starts."
          />
        ) : (
          <div className="space-y-2">
            {participants.map((participant) => (
              <ParticipantItem key={participant.id} participant={participant} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom: Detected Languages Breakdown */}
      <div className="mt-6 pt-5 border-t border-[#26292F] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-[#EDEFF2]">
            <Globe2 className="h-3.5 w-3.5 text-[#5B7FFF]" />
            <span>Spoken Languages</span>
          </div>
          <span className="text-[11px] text-[#A3AAB5]">Auto-detect active</span>
        </div>

        <div className="space-y-2.5">
          {languages.map((lang) => (
            <div key={lang.code} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-[#EDEFF2] flex items-center gap-1.5">
                  {lang.name}
                  {lang.isPrimary && (
                    <span className="rounded bg-[#5B7FFF]/15 px-1.5 py-0.2 text-[10px] text-[#5B7FFF]">
                      Primary
                    </span>
                  )}
                </span>
                <span className="text-[#A3AAB5] font-mono">{lang.percentage}%</span>
              </div>
              {/* Progress bar */}
              <div className="h-1.5 w-full rounded-full bg-[#1C1F24] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    lang.isPrimary ? 'bg-[#5B7FFF]' : 'bg-[#E3A54A]'
                  }`}
                  style={{ width: `${lang.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* AI Auto-Translation badge */}
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#141619] p-2.5 border border-[#26292F] text-xs text-[#A3AAB5]">
          <Sparkles className="h-3.5 w-3.5 text-[#E3A54A] shrink-0" />
          <span>Real-time cross-lingual translation enabled</span>
        </div>
      </div>
    </div>
  );
};
