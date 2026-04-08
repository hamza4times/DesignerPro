import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'primary': return 'var(--primary)';
      case 'secondary': return 'var(--secondary)';
      case 'tertiary': return 'var(--tertiary)';
      case 'accent': return 'var(--accent)';
      case 'neutral': return 'white';
      default: return 'var(--primary)';
    }
  };

  const getPadding = () => {
    switch (size) {
      case 'sm': return '4px 8px';
      case 'md': return '8px 16px';
      case 'lg': return '12px 24px';
      case 'icon': return '8px';
      default: return '8px 16px';
    }
  };

  return (
    <button
      className={className}
      style={{
        backgroundColor: getBackgroundColor(),
        padding: getPadding(),
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...props.style,
      }}
      {...props}
    >
      {children}
    </button>
  );
};
