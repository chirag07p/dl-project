import React from 'react';
import { useTheme } from '../../context/useTheme';
import { SunIcon, MoonIcon } from '../icons';
import { cn } from '../../utils/cn';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg p-2 text-slate-600 transition-colors',
        'hover:bg-slate-100 hover:text-slate-900',
        'dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500',
        className
      )}
    >
      {theme === 'light' ? (
        <MoonIcon size={18} className="text-slate-700 dark:text-slate-300" />
      ) : (
        <SunIcon size={18} className="text-amber-400" />
      )}
      {showLabel && (
        <span className="text-xs font-medium">
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};
