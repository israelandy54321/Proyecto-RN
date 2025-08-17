import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type GameKey = 'memory' | 'quiz';

type PointsState = {
  totalPoints: number;
  awarded: Record<GameKey, boolean>;
};

const STORAGE_KEY = 'points_state_v1';

const PointsContext = createContext<{
  totalPoints: number;
  awarded: Record<GameKey, boolean>;
  awardIfNotAwarded: (k: GameKey) => Promise<void>;
  resetPoints: () => Promise<void>;
  hasAward: (k: GameKey) => boolean;
} | null>(null);

export const PointsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PointsState>({
    totalPoints: 0,
    awarded: { memory: false, quiz: false },
  });

  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw));
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const awardIfNotAwarded = async (k: GameKey) => {
    setState(prev => {
      if (prev.awarded[k]) return prev;
      return { totalPoints: prev.totalPoints + 10, awarded: { ...prev.awarded, [k]: true } };
    });
  };

  const resetPoints = async () => {
    setState({ totalPoints: 0, awarded: { memory: false, quiz: false } });
  };

  const hasAward = (k: GameKey) => state.awarded[k];

  return (
    <PointsContext.Provider value={{ totalPoints: state.totalPoints, awarded: state.awarded, awardIfNotAwarded, resetPoints, hasAward }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePoints must be used within PointsProvider');
  return ctx;
};
