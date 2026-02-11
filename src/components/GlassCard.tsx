import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = false }: GlassCardProps) {
  return (
    <div className={`glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 ${hover ? 'glass-hover' : ''} ${className}`}>
      {children}
    </div>
  );
}
