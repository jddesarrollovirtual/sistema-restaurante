import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-background-panel border border-white/5 rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
