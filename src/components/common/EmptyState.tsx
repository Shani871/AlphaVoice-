import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  compact = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-[#26292F] bg-[#141619]/40 ${
        compact ? 'p-5' : 'p-8'
      }`}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1F24] text-[#5F6773]">
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-[#EDEFF2]">{title}</h4>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#5F6773]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
