import React, { createContext, useContext, useState, useEffect } from 'react';
import { Program, DailyAttendance, ProgramRecord, AppState } from '../types';

interface AppContextType extends AppState {
  addProgram: (p: Program) => void;
  removeProgram: (id: string) => void;
  updateProgram: (p: Program) => void;
  saveDailyAttendance: (d: DailyAttendance) => void;
  addProgramRecord: (r: ProgramRecord) => void;
  removeProgramRecord: (id: string) => void;
  resetData: () => void;
  importData: (data: AppState) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'sw-daily-manager-data';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [dailyAttendances, setDailyAttendances] = useState<DailyAttendance[]>([]);
  const [programRecords, setProgramRecords] = useState<ProgramRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const data: AppState = JSON.parse(stored);
        if (data.programs) setPrograms(data.programs);
        if (data.dailyAttendances) setDailyAttendances(data.dailyAttendances);
        if (data.programRecords) setProgramRecords(data.programRecords);
      } catch (e) {
        console.error('Failed to load data', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      const data: AppState = { programs, dailyAttendances, programRecords };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [programs, dailyAttendances, programRecords, isLoaded]);

  const addProgram = (p: Program) => setPrograms(prev => [...prev, p]);
  const removeProgram = (id: string) => setPrograms(prev => prev.filter(p => p.id !== id));
  const updateProgram = (p: Program) => setPrograms(prev => prev.map(existing => existing.id === p.id ? p : existing));
  
  const saveDailyAttendance = (d: DailyAttendance) => {
    setDailyAttendances(prev => {
      const existingIdx = prev.findIndex(item => item.date === d.date);
      if (existingIdx >= 0) {
        const newArr = [...prev];
        newArr[existingIdx] = d;
        return newArr;
      }
      return [...prev, d];
    });
  };

  const addProgramRecord = (r: ProgramRecord) => setProgramRecords(prev => [...prev, r]);
  const removeProgramRecord = (id: string) => setProgramRecords(prev => prev.filter(r => r.id !== id));

  const resetData = () => {
    if (window.confirm('모든 데이터를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      setPrograms([]);
      setDailyAttendances([]);
      setProgramRecords([]);
    }
  };

  const importData = (data: AppState) => {
    if (data.programs) setPrograms(data.programs);
    if (data.dailyAttendances) setDailyAttendances(data.dailyAttendances);
    if (data.programRecords) setProgramRecords(data.programRecords);
  };

  return (
    <AppContext.Provider value={{
      programs, dailyAttendances, programRecords,
      addProgram, removeProgram, updateProgram,
      saveDailyAttendance, addProgramRecord, removeProgramRecord,
      resetData, importData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
