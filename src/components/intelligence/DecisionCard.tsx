import React from 'react';
import { DecisionItem } from '../../types';
import { CheckCircle2, Clock, UserCheck } from 'lucide-react';

interface DecisionCardProps {
  decision: DecisionItem;
}

export const DecisionCard: React.FC<DecisionCardProps> = ({ decision }) => {
  const { title, timestamp, sourceSpeaker, context } = decision;

  return (
    <div className="group rounded-xl border border-[#3ECF8E]/30 bg-[#1C1F24] p-3.5 shadow-sm transition-all hover:border-[#3ECF8E]/50">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#3ECF8E]" />
          <h4 className="text-sm font-semibold leading-snug text-[#EDEFF2]">{title}</h4>
        </div>
      </div>

      {context && (
        <p className="mt-2 text-xs leading-relaxed text-[#A3AAB5] pl-6">
          {context}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-[#26292F] pt-2.5 text-[11px] text-[#5F6773] pl-6">
        <span className="flex items-center gap-1.5 text-[#A3AAB5]">
          <UserCheck className="h-3 w-3 text-[#3ECF8E]" />
          <span>Decided by {sourceSpeaker}</span>
        </span>
        <span className="flex items-center gap-1 font-mono">
          <Clock className="h-3 w-3" />
          {timestamp}
        </span>
      </div>
    </div>
  );
};
