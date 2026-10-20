'use client';

import React from 'react';

export type ButtonVariant = 'gold' | 'emerald' | 'stone' | 'wood' | 'obsidian';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface MinecraftButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  gold: 'mc-btn-gold',
  emerald: 'mc-btn-emerald',
  stone: 'mc-btn-stone',
  wood: 'mc-btn-wood',
  obsidian: 'bg-purple-950 border-[#a855f7] text-purple-100 border-t-[#c084fc] border-l-[#c084fc] border-b-[#3b0764] border-r-[#3b0764] hover:brightness-110 shadow-[0_4px_0_#2e1065]',
};

const sizeStyles: Record<ButtonSize, { text: string; padding: string }> = {
  sm: {
    text: 'text-[9px] tracking-wider',
    padding: 'px-3.5 py-2 min-h-[36px]',
  },
  md: {
    text: 'text-[11px] tracking-wider',
    padding: 'px-5 py-2.5 min-h-[42px]',
  },
  lg: {
    text: 'text-[13px] tracking-widest',
    padding: 'px-7 py-3.5 min-h-[48px]',
  },
};

export default function MinecraftButton({
  children,
  variant = 'gold',
  size = 'md',
  href,
  target,
  rel,
  onClick,
  className = '',
  disabled = false,
  icon,
  type = 'button',
  'aria-label': ariaLabel,
}: MinecraftButtonProps) {
  const baseClasses = `
    mc-btn-bevel
    mc-button
    mc-shine
    inline-flex items-center justify-center gap-2
    font-pixel font-bold uppercase select-none
    transition-all duration-75 outline-none
    focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black
    ${variantStyles[variant]}
    ${sizeStyles[size].text}
    ${sizeStyles[size].padding}
    ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer active:translate-y-1'}
    ${className}
  `.trim();

  const content = (
    <>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </>
  );

  if (href && !disabled) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? (rel || 'noopener noreferrer') : rel}
        className={baseClasses}
        aria-label={ariaLabel}
        data-interactive="true"
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
      aria-label={ariaLabel}
      data-interactive="true"
    >
      {content}
    </button>
  );
}
