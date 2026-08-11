'use client';

import React, { ReactNode } from 'react';
import { LanguageProvider } from '@/i18n';

export function AppProviders({ children }: { children: ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
