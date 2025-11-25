import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, className, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-mono text-sm transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden";
  
  const variants = {
    primary: "bg-white/10 hover:bg-white/20 text-white border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]",
    secondary: "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className || ''} disabled:opacity-50 disabled:cursor-not-allowed`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">
        {icon}
        {children}
      </span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      )}
    </button>
  );
};