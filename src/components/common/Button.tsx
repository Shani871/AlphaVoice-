import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5B7FFF]/50 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-3.5 py-2 rounded-xl gap-2',
    lg: 'text-base px-5 py-2.5 rounded-xl gap-2.5 font-semibold',
  }[size];

  const variantClasses = {
    primary:
      'bg-[#5B7FFF] text-[#EDEFF2] hover:bg-[#6e8eff] active:bg-[#4d70f0] shadow-sm shadow-[#5B7FFF]/20 border border-[#5B7FFF]/30',
    secondary:
      'bg-[#1C1F24] text-[#EDEFF2] hover:bg-[#26292F] active:bg-[#141619] border border-[#26292F]',
    ghost:
      'bg-transparent text-[#A3AAB5] hover:text-[#EDEFF2] hover:bg-[#1C1F24]/80 active:bg-[#141619]',
    danger:
      'bg-[#EF4B52]/15 text-[#EF4B52] hover:bg-[#EF4B52]/25 border border-[#EF4B52]/30',
    success:
      'bg-[#3ECF8E]/15 text-[#3ECF8E] hover:bg-[#3ECF8E]/25 border border-[#3ECF8E]/30',
    outline:
      'bg-transparent text-[#EDEFF2] border border-[#26292F] hover:border-[#5B7FFF]/50 hover:bg-[#1C1F24]/50',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
