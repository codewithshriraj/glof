import React from 'react';
import { cn } from '@/lib/utils/cn';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  rightElement,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-surface-container-high pb-4 mb-4',
        className
      )}
    >
      <div>
        <h2 className="font-sans text-[20px] md:text-[24px] font-bold tracking-tight text-on-surface uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="font-sans text-[12px] md:text-[13px] text-on-surface-variant mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      {rightElement && <div className="self-start sm:self-auto">{rightElement}</div>}
    </div>
  );
};
