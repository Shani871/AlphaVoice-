import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'surface' | 'elevated' | 'subtle';
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'surface',
  className = '',
  onClick,
  hoverable = false,
}) => {
  const bg = {
    surface: 'bg-[#141619]',
    elevated: 'bg-[#1C1F24]',
    subtle: 'bg-[#0B0C0E]/60',
  }[variant];

  const interactive = hoverable || onClick
    ? 'cursor-pointer hover:border-[#3A3F47] hover:bg-[#1C1F24] transition-colors duration-150'
    : '';

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border border-[#26292F] p-4 ${bg} ${interactive} ${className}`}
    >
      {children}
    </div>
  );
};
