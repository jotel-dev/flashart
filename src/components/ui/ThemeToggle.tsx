import React from 'react';

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  onToggle: () => void;
}

export default function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <button
      onClick={onToggle}
      type="button"
      className="relative w-9 h-9 rounded-xl border border-card-border bg-card-bg hover:bg-card-bg-hover hover:border-cyber-purple transition-premium flex items-center justify-center cursor-pointer group"
      aria-label="Toggle Theme"
    >
      <div className="relative w-4 h-4 overflow-hidden flex items-center justify-center">
        {/* Sun Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          stroke="currentColor"
          className={`w-4 h-4 absolute transition-all duration-500 ease-out ${
            isDark
              ? 'transform rotate-90 scale-0 opacity-0'
              : 'transform rotate-0 scale-100 opacity-90 text-amber-500'
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m0 13.5V21M4.75 12h2.25m11 0h2.25m-2.81-6.94-1.59 1.59m-9.19 9.19-1.59 1.59m0-12.38 1.59 1.59m9.19 9.19 1.59-1.59M15.25 12a3.25 3.25 0 1 1-6.5 0 3.25 3.25 0 0 1 6.5 0Z"
          />
        </svg>

        {/* Moon Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.2}
          stroke="currentColor"
          className={`w-4 h-4 absolute transition-all duration-500 ease-out ${
            isDark
              ? 'transform rotate-0 scale-100 opacity-90 text-cyber-orange'
              : 'transform -rotate-90 scale-0 opacity-0'
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </svg>
      </div>
    </button>
  );
}
