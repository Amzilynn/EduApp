import React from 'react';
import { motion } from 'framer-motion';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  pulse = false,
  size = 'md',
  ...props
}) {
  const base = `
    inline-flex items-center justify-center gap-2 font-extrabold
    cursor-pointer select-none border-0 outline-none
    transition-all duration-75 active:translate-y-1
    focus:outline-2 focus:outline-offset-2 focus:outline-blue-400
  `;

  const sizes = {
    sm: 'px-5 py-3 text-lg rounded-[50px]',
    md: 'px-8 py-4 text-xl rounded-[50px]',
    lg: 'px-10 py-5 text-2xl rounded-[50px]',
  };

  const variants = {
    primary: `bg-[#FFD93D] text-[#2D2D2D] border-[3px] border-black/15
              shadow-[0_4px_0px_rgba(0,0,0,0.20)]
              active:shadow-[0_1px_0px_rgba(0,0,0,0.20)]
              hover:bg-[#FFCA00] disabled:opacity-50 disabled:cursor-not-allowed`,
    secondary: `bg-white text-[#2D2D2D] border-[3px] border-black/10
                shadow-[0_4px_0px_rgba(0,0,0,0.12)]
                active:shadow-[0_1px_0px_rgba(0,0,0,0.12)]
                hover:bg-gray-50 disabled:opacity-50`,
    danger: `bg-[#FF6B6B] text-white border-[3px] border-black/10
             shadow-[0_4px_0px_rgba(0,0,0,0.20)]
             active:shadow-[0_1px_0px_rgba(0,0,0,0.20)]`,
    ghost: `bg-transparent text-[#2D2D2D] hover:bg-black/5`,
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${pulse && !disabled ? 'pulse-cta' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
