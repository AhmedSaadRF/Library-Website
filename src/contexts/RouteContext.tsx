"use client";

import { defaultRoute } from '@/data/defaultRoute';
import { RouteStop } from '@/types';
import { readStorage, writeStorage } from '@/utils/localStorageUtils';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface RouteContextValue {
  stops: RouteStop[];
  selectedStopId: string | null;
  setSelectedStopId: (id: string | null) => void;
  addStop: (stop: RouteStop) => void;
  updateStop: (stop: RouteStop) => void;
  deleteStop: (id: string) => void;
  moveStop: (id: string, direction: 'up' | 'down') => void;
}

const RouteContext = createContext<RouteContextValue | undefined>(undefined);

function normalize(stops: RouteStop[]): RouteStop[] {
  return [...stops]
    .sort((a, b) => a.order - b.order)
    .map((stop, index) => ({ ...stop, order: index + 1 }));
}

export function RouteProvider({ children }: { children: ReactNode }) {
  const [stops, setStops] = useState<RouteStop[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);

  useEffect(() => {
    const storedStops = normalize(readStorage<RouteStop[]>('mobile-library-stops', defaultRoute));
    setStops(storedStops);
    writeStorage('mobile-library-stops', storedStops);
  }, []);

  useEffect(() => {
    if (stops.length > 0) {
      writeStorage('mobile-library-stops', stops);
    }
  }, [stops]);

  const value = useMemo<RouteContextValue>(
    () => ({
      stops,
      selectedStopId,
      setSelectedStopId,
      addStop: (stop) => setStops((current) => normalize([...current, stop])),
      updateStop: (stop) =>
        setStops((current) => normalize(current.map((item) => (item.id === stop.id ? stop : item)))),
      deleteStop: (id) => setStops((current) => normalize(current.filter((item) => item.id !== id))),
      moveStop: (id, direction) => {
        setStops((current) => {
          const list = [...current].sort((a, b) => a.order - b.order);
          const index = list.findIndex((item) => item.id === id);
          const swapIndex = direction === 'up' ? index - 1 : index + 1;
          if (index < 0 || swapIndex < 0 || swapIndex >= list.length) return current;
          [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
          return normalize(list);
        });
      }
    }),
    [stops, selectedStopId]
  );

  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
}

export function useRouteStops() {
  const context = useContext(RouteContext);
  if (!context) throw new Error('useRouteStops must be used within RouteProvider');
  return context;
}
