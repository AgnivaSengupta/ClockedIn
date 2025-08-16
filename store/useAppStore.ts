import { create } from 'zustand';
import { useAttendanceStore } from './attendanceStore';

interface Subject {
    id: string;
    name: string;
    classDays: number[]; // [0-6] Sun-Sat
    attended: number; // total number of classes attended for that subject
    total: number; // total classes of that subject
}

interface AttendanceRecord {
    [subjectId: string]: {
        [date: string]: 'present' | 'absent' | 'noclass';
    };
}

interface AppState {
    userName: string;
    subjects: Subject[]; // array of Subject data-type
    targetAttendance: number;
    onboardingComplete: boolean;

    attendanceRecord: AttendanceRecord;

    // Actions/ functions to interact with the state

    setUserName: (name: string) => void;
    addSubject: (subject: Subject) => void;
    updateSubject: (id: string, updatedSubject: Partial<Subject>) => void;
    removeSubject: (id: string) => void;
    setTargetAttendance: (percentage: number) => void;
    setOnboardingComplete: (complete: boolean) => void;

    markPresent: (subjectId: string, date: string) => void;
    markAbsent: (subjectId: string, date: string) => void;
    markNoClass: (subjectId: string, date: string) => void;
}

// initial state and function definitions
export const useAppStore = create<AppState>((set) => ({
    userName: '',
    subjects: [],
    targetAttendance: 75,
    onboardingComplete: false,
    attendanceRecord: {},

    setUserName: (name) => set({ userName: name }),
    addSubject: (subject) =>
        set((state) => ({
            subjects: [...state.subjects, subject],
        })),

    updateSubject: (id, updatedSubject) =>
        set((state) => ({
            subjects: state.subjects.map((s) =>
                s.id === id ? { ...s, ...updatedSubject } : s
            ),
        })),

    removeSubject: (id) =>
        set((state) => ({
            subjects: state.subjects.filter((s) => s.id != id),
        })),

    setTargetAttendance: (percentage) => set({ targetAttendance: percentage }),
    setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),


    markPresent: (subjectId, date) =>
        set((state) => {
            const prevStatus = state.attendanceRecord[subjectId]?.[date];
            let updatedSubjects = [...state.subjects];
    
            updatedSubjects = updatedSubjects.map((subject) => {
                if (subject.id !== subjectId) return subject;
    
                let attended = subject.attended;
                let total = subject.total;
    
                // Revert previous
                if (prevStatus === 'present') return subject; // same, no change
                if (prevStatus === 'absent') total -= 1;
                if (!prevStatus) total += 1; // first marking
                if (prevStatus === 'noclass') total += 1;
    
                attended += 1;
    
                return { ...subject, attended: Math.max(0, attended), total: Math.max(0, total) };
            });
    
            const attendanceStore = useAttendanceStore.getState();
            if (!attendanceStore.hasLogForDate(subjectId, date)){
                attendanceStore.addLog({
                    id: Date.now().toString(),
                    subjectId,
                    date,
                    status: "present"
                })
            }

            return {
                subjects: updatedSubjects,
                attendanceRecord: {
                    ...state.attendanceRecord,
                    [subjectId]: {
                        ...(state.attendanceRecord[subjectId] || {}),
                        [date]: 'present',
                    },
                },
            };
        }),
    
    markAbsent: (subjectId, date) =>
        set((state) => {
            const prevStatus = state.attendanceRecord[subjectId]?.[date];
            let updatedSubjects = [...state.subjects];
    
            updatedSubjects = updatedSubjects.map((subject) => {
                if (subject.id !== subjectId) return subject;
    
                let attended = subject.attended;
                let total = subject.total;
    
                // Revert previous
                if (prevStatus === 'absent') return subject; // same, no change
                if (prevStatus === 'present') {
                    attended -= 1;
                    total -= 1;
                } else if (!prevStatus) {
                    total += 1; // first marking
                } else if (prevStatus === 'noclass') {
                    total += 1;
                }
    
                return { ...subject, attended: Math.max(0, attended), total: Math.max(0, total) };
            });
    
            const attendanceStore = useAttendanceStore.getState();
            if (!attendanceStore.hasLogForDate(subjectId, date)){
                attendanceStore.addLog({
                    id: Date.now().toString(),
                    subjectId,
                    date,
                    status: "absent"
                })
            }

            return {
                subjects: updatedSubjects,
                attendanceRecord: {
                    ...state.attendanceRecord,
                    [subjectId]: {
                        ...(state.attendanceRecord[subjectId] || {}),
                        [date]: 'absent',
                    },
                },
            };
        }),
    
    markNoClass: (subjectId, date) =>
        set((state) => {
            const prevStatus = state.attendanceRecord[subjectId]?.[date];
            if (prevStatus === 'noclass') return state; // already marked as no class
    
            let updatedSubjects = [...state.subjects];
    
            updatedSubjects = updatedSubjects.map((subject) => {
                if (subject.id !== subjectId) return subject;
    
                let attended = subject.attended;
                let total = subject.total;
    
                if (prevStatus === 'present') {
                    attended -= 1;
                    total -= 1;
                } else if (prevStatus === 'absent') {
                    total -= 1;
                } else if (!prevStatus) {
                    // If nothing was marked before, don't change anything
                }
    
                return { ...subject, attended: Math.max(0, attended), total: Math.max(0, total) };
            });

            const attendanceStore = useAttendanceStore.getState();
            if (!attendanceStore.hasLogForDate(subjectId, date)){
                attendanceStore.addLog({
                    id: Date.now().toString(),
                    subjectId,
                    date,
                    status: "noClass"
                })
            }
    
            return {
                subjects: updatedSubjects,
                attendanceRecord: {
                    ...state.attendanceRecord,
                    [subjectId]: {
                        ...(state.attendanceRecord[subjectId] || {}),
                        [date]: 'noclass',
                    },
                },
            };
        }),
    


}));