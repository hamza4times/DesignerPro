import React, { HTMLAttributes } from 'react';

interface PanelProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'transparent';
  shadow?: 'sm' | 'md' | 'lg' | 'none';
  borderColor?: string;
}

export const Panel: React.FC<PanelProps> = ({ 
  children, 
  variant = 'solid', 
  shadow = 'md',
  borderColor = 'var(--text-color)',
  style,
  ...props 
}) => {
  return (
    <div
      style={{
        backgroundColor: variant === 'solid' ? 'white' : 'transparent',
        border: `4px solid ${borderColor}`,
        boxShadow: shadow === 'none' ? 'none' : `var(--shadow-${shadow})`,
        padding: '16px',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
