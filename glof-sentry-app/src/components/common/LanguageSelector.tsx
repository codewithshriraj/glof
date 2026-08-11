'use client';

import React from 'react';
import { useLanguage } from '@/i18n';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

interface LanguageSelectorProps {
  variant?: 'compact' | 'pill' | 'expanded';
  className?: string;
}

export function LanguageSelector({ variant = 'pill', className }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center bg-surface-container-high/80 rounded border border-outline-variant p-0.5 font-mono text-[11px]', className)}>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={cn(
            'px-2 py-1 rounded font-bold transition-all touch-manipulation cursor-pointer',
            language === 'en'
              ? 'bg-secondary/20 text-secondary border border-secondary/40 shadow-xs'
              : 'text-outline hover:text-on-surface'
          )}
          aria-label="Switch to English"
          aria-pressed={language === 'en'}
        >
          EN
        </button>
        <span className="text-outline-variant px-0.5 select-none">|</span>
        <button
          type="button"
          onClick={() => setLanguage('hi')}
          className={cn(
            'px-2 py-1 rounded font-bold transition-all touch-manipulation cursor-pointer',
            language === 'hi'
              ? 'bg-secondary/20 text-secondary border border-secondary/40 shadow-xs'
              : 'text-outline hover:text-on-surface'
          )}
          aria-label="हिन्दी में बदलें (Switch to Hindi)"
          aria-pressed={language === 'hi'}
        >
          हिन्दी
        </button>
      </div>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className={cn('bg-surface-container-lowest p-2.5 rounded hud-border flex flex-col gap-2', className)}>
        <div className="flex items-center justify-between text-[10px] text-outline font-mono">
          <span className="flex items-center gap-1.5">
            <Icon name="language" size="xs" />
            <span>LANGUAGE / भाषा:</span>
          </span>
          <span className="text-secondary font-bold uppercase">{language === 'hi' ? 'हिन्दी (Hindi)' : 'English'}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={cn(
              'p-2 rounded font-bold flex items-center justify-center gap-1.5 border transition-all touch-manipulation cursor-pointer',
              language === 'en'
                ? 'bg-secondary/20 text-secondary border-secondary/40 shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:text-on-surface'
            )}
            aria-label="Switch to English"
          >
            <span>English</span>
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={cn(
              'p-2 rounded font-bold flex items-center justify-center gap-1.5 border transition-all touch-manipulation cursor-pointer',
              language === 'hi'
                ? 'bg-secondary/20 text-secondary border-secondary/40 shadow-xs'
                : 'bg-surface-container-high text-on-surface-variant border-outline-variant hover:text-on-surface'
            )}
            aria-label="हिन्दी में बदलें (Switch to Hindi)"
          >
            <span>हिन्दी</span>
          </button>
        </div>
      </div>
    );
  }

  // Default 'pill' variant
  return (
    <div
      role="group"
      aria-label="Language Selector"
      className={cn(
        'inline-flex items-center bg-surface-container-lowest/90 border border-outline-variant/60 rounded-md p-0.5 font-mono text-[11px] select-none',
        className
      )}
    >
      <div className="flex items-center px-1.5 text-outline">
        <Icon name="language" size="xs" className="opacity-80" />
      </div>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={cn(
          'px-2.5 py-1 rounded font-bold transition-all touch-manipulation cursor-pointer min-h-[32px] flex items-center justify-center',
          language === 'en'
            ? 'bg-secondary/20 text-secondary border border-secondary/40 font-bold'
            : 'text-outline hover:text-on-surface'
        )}
        aria-label="Select English"
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        className={cn(
          'px-2.5 py-1 rounded font-bold transition-all touch-manipulation cursor-pointer min-h-[32px] flex items-center justify-center',
          language === 'hi'
            ? 'bg-secondary/20 text-secondary border border-secondary/40 font-bold'
            : 'text-outline hover:text-on-surface'
        )}
        aria-label="हिन्दी चुनें (Select Hindi)"
        aria-pressed={language === 'hi'}
      >
        हिन्दी
      </button>
    </div>
  );
}
