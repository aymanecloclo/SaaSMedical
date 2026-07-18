import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}