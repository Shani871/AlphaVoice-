import React from 'react';

export type BadgeTone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  tone = 'neutral',
  dot = false,
  pulse = false,
  className = '',
  size = 'md',
}) => {
  const styles: Record<BadgeTone, { bg: string; text: string; dotColor: string }> = {
    primary: {
      bg: 'bg-[#5B7FFF]/12 border-[#5B7FFF]/30',
      text: 'text-[#5B7FFF]',
      dotColor: 'bg-[#5B7FFF]',
    },
    success: {
      bg: 'bg-[#3ECF8E]/12 border-[#3ECF8E]/30',
      text: 'text-[#3ECF8E]',
      dotColor: 'bg-[#3ECF8E]',
    },
    warning: {
      bg: 'bg-[#E3A54A]/12 border-[#E3A54A]/30',
      text: 'text-[#E3A54A]',
      dotColor: 'bg-[#E3A54A]',
    },
    danger: {
      bg: 'bg-[#EF4B52]/12 border-[#EF4B52]/30',
      text: 'text-[#EF4B52]',
      dotColor: 'bg-[#EF4B52]',
    },
    neutral: {
      bg: 'bg-[#1C1F24] border-[#26292F]',
      text: 'text-[#A3AAB5]',
      dotColor: 'bg-[#5F6773]',
    },
  };

  const current = styles[tone];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses} ${current.bg} ${current.text} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${current.dotColor} ${
            pulse ? 'animate-pulse' : ''
          }`}
        />
      )}
      <span>{label}</span>
    </span>
  );
};
