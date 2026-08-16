import { Assignment, ClassInfo, Submission, User } from '../types';

export const currentUserStudent: User = { id: 's1', name: 'Budi Santoso', role: 'student' };
export const currentUserTeacher: User = { id: 't1', name: 'Mr. Andi', role: 'teacher' };

export const mockClasses: ClassInfo[] = [
  { id: 'c1', name: 'English 10A', teacherId: 't1' }
];

export const mockAssignments: Assignment[] = [
  {
    id: 'a1',
    classId: 'c1',
    title: 'My Unforgettable Holiday',
    genre: 'Recount Text',
    topic: 'Personal Experience',
    instructions: 'Write a recount text about your unforgettable holiday. Make sure to include orientation, events, and reorientation.',
    dueDate: '2026-08-20',
  },
  {
    id: 'a2',
    classId: 'c1',
    title: 'The Beauty of Komodo Dragon',
    genre: 'Descriptive Text',
    topic: 'Animals',
    instructions: 'Describe a Komodo Dragon. Focus on its physical appearance, habitat, and behavior.',
    dueDate: '2026-08-25',
  }
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub1',
    assignmentId: 'a1',
    studentId: 's1',
    content: 'Yesterday, I go to the beach with my family. We have a lot of fun. I swimming in the sea and my brother play sand. In the afternoon, we eat seafood. It is very delicious holiday.',
    status: 'submitted',
    submittedAt: '2026-08-15T10:00:00Z',
    aiLog: {
      errorsDetected: 5,
      hintsUsed: 3,
      explainsOpened: 2,
      correctionsApplied: 1,
      revisionCount: 4,
      pasteEvents: 0,
      activeTimeMinutes: 45
    },
    aiAnalysis: {
      suggestedScore: 72,
      rubricSuggestions: {
        Content: 18,
        Organization: 16,
        Grammar: 14,
        Vocabulary: 15,
        Mechanics: 9
      },
      errorPatterns: ['Past tense verb forms (go -> went)', 'Verb agreement (I swimming -> I swam)'],
      summary: 'The student understands the structure of a recount text but struggles with past tense verbs.'
    }
  }
];
