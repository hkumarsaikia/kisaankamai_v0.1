"use client";

import { useEffect, useRef } from 'react';
import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';
import { ID, databases, APPWRITE_CONFIG } from '@/lib/appwrite';
import { usePathname, useSearchParams } from 'next/navigation';

interface PerformanceEvent {
  type: string;
  name?: string;
  value?: number;
  timestamp: number;
  metadata?: any;
}

export function PerformanceMonitor() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSimulation = searchParams.get('simulate') === 'true';
  const eventBuffer = useRef<PerformanceEvent[]>([]);
  const sessionId = useRef<string>(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const isBatching = useRef(false);

  useEffect(() => {
    // 1. Web Vitals
    const logVital = (metric: any) => {
      eventBuffer.current.push({
        type: 'web-vital',
        name: metric.name,
        value: metric.value,
        timestamp: Date.now(),
        metadata: { id: metric.id, rating: metric.rating }
      });
    };

    onLCP(logVital);
    onINP(logVital);
    onCLS(logVital);
    onFCP(logVital);
    onTTFB(logVital);

    // 2. Interaction Listeners
    const handleInteraction = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      eventBuffer.current.push({
        type: 'interaction',
        name: e.type,
        timestamp: Date.now(),
        metadata: {
          tagName: target.tagName,
          id: target.id,
          className: target.className,
          text: target.innerText?.substring(0, 50)
        }
      });
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    // 3. Batching Timer
    const interval = setInterval(() => {
      sendBatch();
    }, 5000);

    // 4. Simulation Mode
    if (isSimulation) {
      const simInterval = setInterval(() => {
        simulateUserAction();
      }, 2000);
      return () => {
        clearInterval(interval);
        clearInterval(simInterval);
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('touchstart', handleInteraction);
      };
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      sendBatch(true); // Final batch on unmount
      // eslint-disable-next-line react-hooks/exhaustive-deps
    };
  }, [pathname, isSimulation]);

  const sendBatch = async (force = false) => {
    if (eventBuffer.current.length === 0 || isBatching.current) return;
    if (!force && eventBuffer.current.length < 5) return; // Wait for at least 5 events unless forced

    const batch = [...eventBuffer.current];
    eventBuffer.current = [];
    isBatching.current = true;

    try {
      await databases.createDocument(
        APPWRITE_CONFIG.databaseId,
        APPWRITE_CONFIG.liveLogsCollectionId,
        ID.unique(),
        {
          sessionId: sessionId.current,
          batchData: JSON.stringify(batch),
          timestamp: new Date().toISOString(),
          deviceInfo: JSON.stringify({
            userAgent: navigator.userAgent,
            screen: `${window.innerWidth}x${window.innerHeight}`,
            pathname
          })
        }
      );
    } catch (error: any) {
      // Silently ignore 401 permission errors — configure Appwrite collection
      // permissions to enable logging. Other errors shown in dev only.
      const isPermissionError =
        error?.code === 401 ||
        error?.message?.includes('permissions') ||
        error?.message?.includes('Unauthorized');
      if (!isPermissionError && process.env.NODE_ENV === 'development') {
        console.warn('[PerformanceMonitor] Failed to send batch:', error?.message);
      }
      // Do NOT re-buffer failed batches — prevents memory leak on repeated failures
    } finally {
      isBatching.current = false;
    }
  };

  const simulateUserAction = () => {
    const actions = [
      () => window.scrollTo({ top: Math.random() * document.body.scrollHeight, behavior: 'smooth' }),
      () => {
        const buttons = document.querySelectorAll('button, a');
        if (buttons.length > 0) {
          const btn = buttons[Math.floor(Math.random() * buttons.length)] as HTMLElement;
          btn.click();
        }
      }
    ];
    actions[Math.floor(Math.random() * actions.length)]();
  };

  return null; // Invisible component
}
