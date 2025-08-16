import { create } from 'zustand'

export interface AttendanceLog {
    id: string; // unique Id for the log
    subjectId: string;
    date: string;
    status: 'present' | 'absent' | 'noClass';
}

interface AttendanceState {
    logs: AttendanceLog[];

    addLog: (log: AttendanceLog) => void;
    removeLog: (logId: string) => void;
    getLogsBySubject: (subjectId: string) => AttendanceLog[];
    getLogsByDate: (date: string) => AttendanceLog[];
    hasLogForDate: (subjectId: string, date: string) => boolean;
}

export const useAttendanceStore = create<AttendanceState> ((set, get) => ({
    logs: [],

    addLog: (log) =>
        set((state) => ({
          logs: [...state.logs, log],
        })),
    
      removeLog: (logId) =>
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== logId),
        })),
    
      getLogsBySubject: (subjectId) =>
        get().logs.filter((log) => log.subjectId === subjectId),
    
      getLogsByDate: (date) =>
        get().logs.filter((log) => log.date === date),
    
      hasLogForDate: (subjectId, date) =>
        get().logs.some((log) => log.subjectId === subjectId && log.date === date),
}));