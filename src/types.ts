export interface Program {
  id: string;
  name: string;
  targetCount: number;
  targetParticipants: number;
}

export interface DailyAttendance {
  date: string; // YYYY-MM-DD
  staffMale: number;
  staffFemale: number;
  usersPresent: number;
  usersAbsent: number;
}

export interface ProgramRecord {
  id: string;
  date: string; // YYYY-MM-DD
  programId: string;
  count: number;
  participants: number;
}

export interface AppState {
  programs: Program[];
  dailyAttendances: DailyAttendance[];
  programRecords: ProgramRecord[];
}
