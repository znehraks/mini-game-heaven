'use client';

import { SettingsModal } from '@/components/settings/SettingsModal';
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration';
import { OfflineSyncProvider } from '@/components/pwa/OfflineSyncProvider';
import { ErrorBoundary } from '@/components/error';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      {children}
      <SettingsModal />
      <ServiceWorkerRegistration />
      <OfflineSyncProvider />
    </ErrorBoundary>
  );
}
