import React from 'react';
import { InlineEvent } from '../../types';
import { CheckCircle2, ListTodo, Globe, AlertOctagon, HelpCircle } from 'lucide-react';

interface EventInlineProps {
  event: InlineEvent;
}

export const EventInline: React.FC<EventInlineProps> = ({ event }) => {
  const { type, label, detail } = event;

  const config = {
    DECISION: {
      icon: <CheckCircle2 className="h-3.5 w-3.5 text-[#3ECF8E]" />,
      border: 'border-[#3ECF8E]/30',
      bg: 'bg-[#3ECF8E]/5',
      badge: 'text-[#3ECF8E] bg-[#3ECF8E]/10',
    },
    TASK: {
      icon: <ListTodo className="h-3.5 w-3.5 text-[#5B7FFF]" />,
      border: 'border-[#5B7FFF]/30',
      bg: 'bg-[#5B7FFF]/5',
      badge: 'text-[#5B7FFF] bg-[#5B7FFF]/10',
    },
    LANGUAGE: {
      icon: <Globe className="h-3.5 w-3.5 text-[#E3A54A]" />,
      border: 'border-[#E3A54A]/30',
      bg: 'bg-[#E3A54A]/5',
      badge: 'text-[#E3A54A] bg-[#E3A54A]/10',
    },
    INTERRUPTED: {
      icon: <AlertOctagon className="h-3.5 w-3.5 text-[#EF4B52]" />,
      border: 'border-[#EF4B52]/30',
      bg: 'bg-[#EF4B52]/5',
      badge: 'text-[#EF4B52] bg-[#EF4B52]/10',
    },
    QUESTION: {
      icon: <HelpCircle className="h-3.5 w-3.5 text-[#E3A54A]" />,
      border: 'border-[#E3A54A]/30',
      bg: 'bg-[#E3A54A]/5',
      badge: 'text-[#E3A54A] bg-[#E3A54A]/10',
    },
  }[type];

  return (
    <div
      className={`my-2 flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all ${config.border} ${config.bg}`}
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0">{config.icon}</span>
        <span className={`rounded px-1.5 py-0.5 font-semibold text-[11px] ${config.badge}`}>
          {label}
        </span>
        {detail && <span className="text-[#EDEFF2] font-medium">{detail}</span>}
      </div>
    </div>
  );
};
