'use client';

import React from 'react';
import { ResponseTeam } from '@/lib/types/glof';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';
import { useLanguage } from '@/i18n';

interface ResponseTeamListProps {
  teams: ResponseTeam[];
  selectedTeamIds: string[];
  onToggleTeam: (teamId: string) => void;
  className?: string;
}

export const ResponseTeamList: React.FC<ResponseTeamListProps> = ({
  teams,
  selectedTeamIds,
  onToggleTeam,
  className,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className={cn('data-card hud-border flex flex-col rounded-[4px]', className)}>
      {/* Header */}
      <div className="p-3 hud-border-b bg-surface-container-low/80 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="groups" size="xs" className="text-secondary" />
          <span className="font-sans text-[11px] font-bold tracking-wider text-on-surface uppercase">
            {t.dispatch.responseUnits} ({teams.length} {language === 'hi' ? 'इकाइयां' : 'UNITS'})
          </span>
        </div>
        <span className="font-mono text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-[2px] border border-primary/30">
          {language === 'hi' ? 'डेमो प्रत्युत्तर दल' : 'DEMO RESPONSE UNITS'}
        </span>
      </div>

      {/* Teams Grid */}
      <div className="p-3 flex flex-col gap-2 font-mono text-[11px]">
        {teams.map((team) => {
          const isSelected = selectedTeamIds.includes(team.id);
          const isDeployed = team.status === 'DEPLOYED' || team.status === 'EN_ROUTE' || team.status === 'ON_SCENE';

          return (
            <div
              key={team.id}
              onClick={() => onToggleTeam(team.id)}
              className={cn(
                'p-3 hud-border rounded-[3px] cursor-pointer transition-all flex flex-col gap-2',
                isSelected
                  ? 'bg-secondary/15 border-secondary/50 shadow-md'
                  : 'bg-surface-container-high/60 hover:bg-surface-container-high'
              )}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-secondary font-bold font-mono">{team.code}</span>
                  <span className="font-sans font-bold text-on-surface text-[12px]">{team.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-[9px] px-2 py-0.5 rounded-[2px] font-bold border',
                      isDeployed
                        ? 'text-critical border-critical/40 bg-critical/10'
                        : 'text-advisory border-advisory/40 bg-advisory/10'
                    )}
                  >
                    {team.status.replace('_', ' ')}
                  </span>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="cursor-pointer accent-secondary"
                  />
                </div>
              </div>

              {/* Specs */}
              <div className="flex flex-wrap items-center justify-between text-[10px] text-outline pt-1 hud-border-t">
                <span className="flex items-center gap-1">
                  <Icon name="location_on" size="xs" className="text-secondary" />
                  {team.region}
                </span>
                <span>{team.personnelCount} {t.dispatch.personnelCount} · ETA: ~{team.etaMinutes} {language === 'hi' ? 'मिनट' : 'min'}</span>
              </div>

              {/* Equipment Tags */}
              <div className="flex flex-wrap gap-1 mt-0.5">
                {team.equipment.map((eq, i) => (
                  <span
                    key={i}
                    className="bg-surface-container-lowest px-1.5 py-0.5 rounded-[1px] text-[8px] text-on-surface-variant border border-surface-container-highest font-sans"
                  >
                    {eq}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
