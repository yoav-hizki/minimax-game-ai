import React from 'react';

export const motion = {
  div: ({ children, className, onClick }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={className} onClick={onClick}>{children}</div>
  ),
  span: ({ children, className }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span className={className}>{children}</span>
  ),
  h2: ({ children, className }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={className}>{children}</h2>
  ),
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => <>{children}</>;
