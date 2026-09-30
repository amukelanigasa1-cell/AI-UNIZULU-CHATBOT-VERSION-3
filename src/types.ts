export type UserRole = 'anonymous' | 'student';

export interface UserProfile {
  id: string;
  uid?: string;
  name: string;
  username: string;
  email: string;
  photoURL?: string;
  isGuest?: boolean;
  phone?: string;
  prospectiveFaculty?: string;
  targetProgram?: string;
  apsScore?: number;
  documentsChecklist: {
    certifiedId: boolean;
    matricResults: boolean;
    caoProofOfPayment: boolean;
    proofOfAddress: boolean;
    academicTranscript: boolean;
  };
  createdAt: string;
  lastActive?: string;
  updatedAt?: string;
}

export interface StoredUserSummary {
  id: string;
  name: string;
  username: string;
  email: string;
  isGuest?: boolean;
  apsScore?: number;
  targetProgram?: string;
  prospectiveFaculty?: string;
  documentsCount: number;
  messageCount: number;
  createdAt: string;
  lastActive?: string;
}

export interface CrossUserLearnedInsight {
  id: string;
  topic: string;
  insight: string;
  userInteractionsCount: number;
  category: 'admissions' | 'cao' | 'faculty' | 'campus' | 'terminology' | 'student_tip';
  lastReinforced: string;
  confidence: number;
}

export interface FeedbackPayload {
  messageId: string;
  query: string;
  responseSnippet: string;
  isHelpful: boolean;
  rating: number;
  accuracyTag?: string;
  comment?: string;
}

export interface FeedbackSubmission {
  id: string;
  messageId: string;
  query: string;
  responseSnippet: string;
  isHelpful: boolean;
  rating: number; // 1 to 5
  accuracyTag?: string; // 'Accurate', 'Partially accurate', 'Outdated info', 'Needs detail', 'Very helpful'
  comment?: string;
  timestamp: string;
  userId?: string;
}

export interface FeedbackStats {
  totalRatings: number;
  helpfulCount: number;
  accuracyPercentage: number;
  averageStars: number;
  tagsSummary: Record<string, number>;
  recentEvolutions: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  detectedLanguage?: string;
  detectedLanguageName?: string;
  feedback?: {
    isHelpful?: boolean;
    rating?: number;
    tag?: string;
    comment?: string;
    submitted?: boolean;
  };
  sources?: string[];
  isSearchGrounded?: boolean;
  searchQueries?: string[];
}

export interface EvolvedQuery {
  id: string;
  topic: string;
  question: string;
  frequency: number;
  lastUpdated: string;
  category: 'Admissions' | 'Documents' | 'CAO' | 'Faculties' | 'Housing' | 'Financial Aid';
}

export interface SubjectScore {
  id: string;
  name: string;
  percentage: number;
  level: number;
}

export interface LearnedKnowledgeItem {
  id: string;
  topic: string;
  fact: string;
  category: 'admissions' | 'cao' | 'faculty' | 'campus' | 'terminology' | 'student_tip';
  confidence: number; // 0 to 1
  trainingIterations: number;
  learnedFrom: string;
  learnedAt: string;
  weight: number;
  verified: boolean;
}

export interface MLKnowledgeMetrics {
  modelEngine: string;
  totalLearnedNodes: number;
  activeSynapses: number;
  reinforcementIterations: number;
  lastLearningEpoch: string;
  learningRate: number;
}
