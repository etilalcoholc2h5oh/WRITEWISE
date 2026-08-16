export type Role = 'student' | 'teacher';

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface Assignment {
  id: string;
  classId: string;
  title: string;
  genre: string;
  topic: string;
  instructions: string;
  dueDate: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  status: 'draft' | 'submitted' | 'graded';
  submittedAt?: string;
  aiLog: AssistanceLog;
  aiAnalysis?: AIAnalysis;
  teacherFeedback?: string;
  finalScore?: number;
  rubricScores?: Record<string, number>;
}

export interface AssistanceLog {
  errorsDetected: number;
  hintsUsed: number;
  explainsOpened: number;
  correctionsApplied: number;
  revisionCount: number;
  pasteEvents: number;
  activeTimeMinutes: number;
}

export interface AIAnalysis {
  suggestedScore: number;
  rubricSuggestions: Record<string, number>;
  errorPatterns: string[];
  summary: string;
}

export interface ClassInfo {
  id: string;
  name: string;
  teacherId: string;
}
