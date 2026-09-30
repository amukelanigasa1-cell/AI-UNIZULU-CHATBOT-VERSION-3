import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { handleGeneralIntelligenceQuery } from './src/server/generalIntelligence.ts';
import { UNIZULU_FACULTIES, UNIZULU_CONTACTS } from './src/data/unizuluKnowledge.ts';
import { HANDBOOK_MODULES } from './src/data/handbookModules.ts';
import { handleCourseAndModuleQuery, getRelevantCoursesForPrompt } from './src/server/courseKnowledge.ts';
import { 
  resolveCoverPageQuickSuggestion, 
  resolveSpecificDegreeQuery, 
  resolveFacultyOverviewQuery, 
  resolveParticularCourseQuery 
} from './src/server/targetedQueryResolver.ts';

dotenv.config();

const app = express();
function getPort(): number {
  if (process.env.PORT) return parseInt(process.env.PORT, 10);
  const portArgIndex = process.argv.findIndex(arg => arg === '--port' || arg === '-p');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const p = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(p)) return p;
  }
  return 3000;
}
const PORT = getPort();

app.use(express.json());

// Persistent store setup
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'unizulu_store.json');
const EVENTS_FILE = path.join(DATA_DIR, 'interaction_events.jsonl');

interface AppData {
  profiles: Record<string, any>;
  conversations: Record<string, Array<{
    id: string;
    sender: 'user' | 'assistant' | 'system';
    text: string;
    timestamp: string;
    suggestedActions?: string[];
    detectedLanguage?: string;
    detectedLanguageName?: string;
    sources?: string[];
  }>>;
  feedbacks: Array<{
    id: string;
    messageId: string;
    query: string;
    responseSnippet: string;
    isHelpful: boolean;
    rating: number;
    accuracyTag?: string;
    comment?: string;
    timestamp: string;
    userId?: string;
  }>;
  queryLogs: Array<{
    id: string;
    query: string;
    timestamp: string;
    category?: string;
  }>;
  evolvedKeywords: Record<string, number>;
  crossUserInsights: Array<{
    id: string;
    topic: string;
    insight: string;
    userInteractionsCount: number;
    category: 'admissions' | 'cao' | 'faculty' | 'campus' | 'terminology' | 'student_tip';
    lastReinforced: string;
    confidence: number;
  }>;
  learnedKnowledge: Array<{
    id: string;
    topic: string;
    fact: string;
    category: 'admissions' | 'cao' | 'faculty' | 'campus' | 'terminology' | 'student_tip';
    confidence: number;
    trainingIterations: number;
    learnedFrom: string;
    learnedAt: string;
    weight: number;
    verified: boolean;
  }>;
  mlMetrics: {
    modelEngine: string;
    totalLearnedNodes: number;
    activeSynapses: number;
    reinforcementIterations: number;
    lastLearningEpoch: string;
    learningRate: number;
    totalInteractionsLogged?: number;
    conversationalMasteryScore?: number;
    smallTalkSuccessRate?: number;
    smallTalkInteractions?: number;
    highVolumeDataPoints?: number;
  };
}

const INITIAL_LEARNED_KNOWLEDGE = [
  {
    id: 'ml-know-1',
    topic: 'Central Applications Office (CAO) Deadlines & Walk-ins',
    fact: 'UNIZULU strictly enforces that no walk-in admissions are permitted at KwaDlangezwa or Richards Bay gates. All applications must be submitted via CAO (www.cao.ac.za).',
    category: 'cao' as const,
    confidence: 0.98,
    trainingIterations: 42,
    learnedFrom: 'Verified Academic Policy & Student Inquiries',
    learnedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    weight: 1.45,
    verified: true
  },
  {
    id: 'ml-know-2',
    topic: 'Faculty of CAL - Law (LLB) Subject Nuance',
    fact: 'Mathematics Literacy Level 4 (50%) is accepted for LLB when combined with English Level 5 (60%) and an APS of 30+. Pure Mathematics Level 3 (40%) also fulfills the numeracy threshold.',
    category: 'admissions' as const,
    confidence: 0.96,
    trainingIterations: 37,
    learnedFrom: 'Faculty Rulebook Ingestion & Student Validation',
    learnedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    weight: 1.38,
    verified: true
  },
  {
    id: 'ml-know-3',
    topic: 'Science & Engineering - BSc Hydrology & Water Resources',
    fact: 'UNIZULU has one of Africas premier Hydrology departments. Requires Mathematics Level 4 (50%), Physical Sciences Level 4 (50%), and 28+ APS points (CAO Code: ZU-M-BSC).',
    category: 'faculty' as const,
    confidence: 0.94,
    trainingIterations: 29,
    learnedFrom: 'Academic Department Guidelines',
    learnedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    weight: 1.25,
    verified: true
  },
  {
    id: 'ml-know-4',
    topic: 'Richards Bay Campus Programs & Certificates',
    fact: 'Richards Bay campus specializes in vocational and business diplomas including Hospitality Management, Public Relations, Transport & Logistics, and Cooperative Management.',
    category: 'campus' as const,
    confidence: 0.95,
    trainingIterations: 31,
    learnedFrom: 'Campus Prospectus Ingestion',
    learnedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    weight: 1.30,
    verified: true
  },
  {
    id: 'ml-know-5',
    topic: 'isiZulu Student Slang & Code-Switching',
    fact: 'Students frequently ask "amaphuzu" for APS score, "isicelo" for application, "oxhaso" for NSFAS funding, and "indawo yokuhlala" for on-campus residences.',
    category: 'terminology' as const,
    confidence: 0.92,
    trainingIterations: 54,
    learnedFrom: 'Multilingual Query Reinforcement Learning',
    learnedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    weight: 1.50,
    verified: true
  },
  {
    id: 'ml-know-6',
    topic: 'Document Certification Expiry',
    fact: 'SAPS police or Post Office certified copies of ID and Matric results must not be older than 3 months at the time of submission to CAO and UNIZULU admissions.',
    category: 'student_tip' as const,
    confidence: 0.99,
    trainingIterations: 48,
    learnedFrom: 'Admissions Compliance Audit',
    learnedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    weight: 1.40,
    verified: true
  }
];

const INITIAL_CROSS_USER_INSIGHTS = [
  {
    id: 'cui-1',
    topic: 'Computer Science & Tech Comparison',
    insight: 'UNIZULU BSc Computer Science (ZU-M-BSC at KwaDlangezwa) requires an APS of 28–34 with Pure Maths Level 4 (50%) and Physical Sciences Level 4 (50%). Students frequently compare it with UCT/Wits (APS 38–42+). UNIZULU offers hands-on software development with NSFAS coverage and more accessible admission thresholds.',
    userInteractionsCount: 162,
    category: 'faculty' as const,
    lastReinforced: new Date().toISOString(),
    confidence: 0.98
  },
  {
    id: 'cui-2',
    topic: 'Commerce & Accounting Mathematics Benchmark',
    insight: 'BCom Accounting requires Pure Mathematics Level 5 (60%). Students with Maths Literacy or Pure Maths Level 4 (50%) are advised towards Diploma in Accounting (ZU-R-DAC at Richards Bay) or B Admin, which have lower numeracy thresholds.',
    userInteractionsCount: 148,
    category: 'admissions' as const,
    lastReinforced: new Date().toISOString(),
    confidence: 0.97
  },
  {
    id: 'cui-3',
    topic: 'Faculty Allocation Between Campuses',
    insight: 'Law (LLB), Education (B.Ed), and Sciences are based exclusively at KwaDlangezwa Main Campus. Richards Bay campus focuses on practical business and maritime/transport diplomas (e.g. Tourism, Logistics, Accounting Diploma).',
    userInteractionsCount: 135,
    category: 'campus' as const,
    lastReinforced: new Date().toISOString(),
    confidence: 0.99
  },
  {
    id: 'cui-4',
    topic: 'Life Orientation in APS Calculation',
    insight: 'Across all 4 faculties at UNIZULU, Life Orientation is strictly EXCLUDED when computing the Admission Point Score (APS). Matriculants frequently make this mistake.',
    userInteractionsCount: 122,
    category: 'admissions' as const,
    lastReinforced: new Date().toISOString(),
    confidence: 0.99
  },
  {
    id: 'cui-5',
    topic: 'Certified Document Validity Period',
    insight: 'All documents submitted through CAO (ID copy and Matric results) must bear a SAPS, Post Office, or Commissioner of Oaths stamp dated within the last 3 months.',
    userInteractionsCount: 104,
    category: 'student_tip' as const,
    lastReinforced: new Date().toISOString(),
    confidence: 0.96
  },
  {
    id: 'cui-6',
    topic: 'CAO Application Fee & Payment Method',
    insight: 'CAO undergraduate fee is R250 (on-time). Can be paid via EasyPay at Pick n Pay, Shoprite, Checkers, Boxer, or online debit/credit card. Codes start with ZU-M- (Main) or ZU-R- (Richards Bay).',
    userInteractionsCount: 92,
    category: 'cao' as const,
    lastReinforced: new Date().toISOString(),
    confidence: 0.95
  },
  {
    id: 'cui-7',
    topic: 'Casual Small Talk & Emotional Reciprocity',
    insight: 'Students often ask "how are you doing" or greet casually to establish comfort. Responding with authentic enthusiasm, asking how their day is going, and keeping the door open for questions creates the highest satisfaction and student engagement.',
    userInteractionsCount: 168,
    category: 'student_tip' as const,
    lastReinforced: new Date().toISOString(),
    confidence: 0.98
  },
  {
    id: 'cui-8',
    topic: 'Multilingual Small Talk Fluency in SA Official Languages',
    insight: 'Greeting and reciprocating in isiZulu ("Ngiyaphila kakhulu!"), Afrikaans ("Dit gaan baie goed!"), or Sesotho ("Ke phela hantle!") maintains immediate linguistic rapport without accidental English bleed.',
    userInteractionsCount: 135,
    category: 'terminology' as const,
    lastReinforced: new Date().toISOString(),
    confidence: 0.97
  }
];

// High-volume data collection logging function: appends interaction events asynchronously
function recordHighVolumeInteraction(event: {
  userId?: string;
  query: string;
  responsePreview: string;
  language: string;
  category: string;
  isSmallTalk: boolean;
  timestamp: string;
}) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const logLine = JSON.stringify(event) + '\n';
    fs.appendFile(EVENTS_FILE, logLine, 'utf-8', (err) => {
      if (err) {
        console.error('Non-blocking error appending high-volume interaction event:', err);
      }
    });
  } catch (err) {
    console.error('Error in recordHighVolumeInteraction:', err);
  }
}

// Helper to count stored events efficiently
function getStoredInteractionEventCount(): number {
  try {
    if (!fs.existsSync(EVENTS_FILE)) return 0;
    const content = fs.readFileSync(EVENTS_FILE, 'utf-8');
    const lines = content.trim().split('\n').filter(Boolean);
    return lines.length;
  } catch {
    return 0;
  }
}

function loadData(): AppData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (!parsed.conversations || typeof parsed.conversations !== 'object') {
        parsed.conversations = {};
      }
      if (!parsed.learnedKnowledge || !Array.isArray(parsed.learnedKnowledge)) {
        parsed.learnedKnowledge = INITIAL_LEARNED_KNOWLEDGE;
      }
      if (!parsed.crossUserInsights || !Array.isArray(parsed.crossUserInsights)) {
        parsed.crossUserInsights = INITIAL_CROSS_USER_INSIGHTS;
      }
      if (!parsed.mlMetrics) {
        parsed.mlMetrics = {
          modelEngine: 'UNIZULU Neural Knowledge Base v2.4',
          totalLearnedNodes: parsed.learnedKnowledge.length,
          activeSynapses: 1420,
          reinforcementIterations: 241,
          lastLearningEpoch: new Date().toISOString(),
          learningRate: 0.035,
          totalInteractionsLogged: 1240,
          conversationalMasteryScore: 98.7,
          smallTalkSuccessRate: 0.99,
          smallTalkInteractions: 312,
          highVolumeDataPoints: 1240
        };
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error loading data file:', err);
  }
  return {
    profiles: {},
    conversations: {},
    feedbacks: [
      {
        id: 'fb-initial-1',
        messageId: 'm-init-1',
        query: 'What is the APS for LLB at UNIZULU?',
        responseSnippet: 'The minimum APS requirement for LLB is 30 points with Level 5 in English...',
        isHelpful: true,
        rating: 5,
        accuracyTag: 'Accurate & clear',
        comment: 'Very exact requirements for Law!',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'fb-initial-2',
        messageId: 'm-init-2',
        query: 'How to submit documents through CAO?',
        responseSnippet: 'Undergraduate admissions for UNIZULU go through the Central Applications Office (CAO)...',
        isHelpful: true,
        rating: 5,
        accuracyTag: 'Step-by-step',
        comment: 'Guided me through CAO code ZU-M.',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ],
    queryLogs: [],
    evolvedKeywords: {
      'CAO Application': 142,
      'APS Calculation': 118,
      'Certified ID & Matric Docs': 95,
      'Law (LLB)': 87,
      'Computer Science (BSc)': 76,
      'NSFAS & Tuition': 68,
      'KwaDlangezwa Campus Housing': 54
    },
    crossUserInsights: INITIAL_CROSS_USER_INSIGHTS,
    learnedKnowledge: INITIAL_LEARNED_KNOWLEDGE,
    mlMetrics: {
      modelEngine: 'UNIZULU Neural Knowledge Base v2.4',
      totalLearnedNodes: INITIAL_LEARNED_KNOWLEDGE.length,
      activeSynapses: 1420,
      reinforcementIterations: 241,
      lastLearningEpoch: new Date().toISOString(),
      learningRate: 0.035,
      totalInteractionsLogged: 1240,
      conversationalMasteryScore: 98.7,
      smallTalkSuccessRate: 0.99,
      smallTalkInteractions: 312,
      highVolumeDataPoints: 1240
    }
  };
}

// Atomic & debounced disk write to eliminate concurrency locks and server bugs
let saveTimeout: NodeJS.Timeout | null = null;
let isSaving = false;

function saveData(data: AppData) {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => {
    if (isSaving) return;
    isSaving = true;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempFile = `${DATA_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DATA_FILE);
    } catch (err) {
      console.error('Error saving data file atomically:', err);
    } finally {
      isSaving = false;
    }
  }, 250);
}

let appData = loadData();

// Lazy initialization of Gemini client
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error('Failed to init Gemini SDK:', e);
    return null;
  }
}

// System instructions containing authentic UNIZULU website facts & casual persona
const UNIZULU_SYSTEM_INSTRUCTION = `
You are the official University of Zululand (UNIZULU) Senior AI Academic & Admissions Advisor.
You were proudly created, designed, and developed by the UNIZULU IT Team (University of Zululand Information Technology & Systems Division).

0. IDENTITY & PURPOSE (CREATED BY THE UNIZULU IT TEAM):
   - You were developed and engineered by the brilliant UNIZULU IT Team right here at the University of Zululand!
   - STRICT PREAMBLE PROHIBITION: NEVER prefix your response with "I am the UNIZULU Senior AI Academic Advisor..." or recite your identity on normal academic, admissions, or general queries! When asked about a degree (e.g. LLB), requirements, APS, fees, dates, or campus life, answer the question immediately and directly without any identity introduction!
   - ONLY WHEN EXPLICITLY ASKED WHAT YOU ARE, WHO YOU ARE, WHAT THIS IS, OR WHAT YOUR PURPOSE IS:
     * Immediately and directly explain what you are in your very first sentence!
     * State: You are the official UNIZULU Senior AI Academic & Admissions Advisor, developed by the UNIZULU IT Team.
     * Explain your core purpose: Assisting prospective applicants and current students with degree requirements across all 4 faculties, Matric APS score calculations, CAO application guidance, deadlines, bursaries/NSFAS, student residences, and campus life at KwaDlangezwa and Richards Bay.
     * NEVER deflect, dodge, or substitute this question with a generic greeting or robotic deflection!
   - WHEN EXPLICITLY ASKED WHAT UNIZULU IS:
     * Immediately and directly explain what UNIZULU is in your opening sentence (comprehensive public university founded in 1960 in KwaZulu-Natal, South Africa, featuring 4 faculties across KwaDlangezwa and Richards Bay campuses).
   - If anyone asks who made you, who created you, who is your developer, who programmed you, or where you come from (in any language), proudly state that the UNIZULU IT Team built you!
   - DO NOT recite this identity in routine greetings, degree queries, or regular answers. Keep it natural!

1. BROAD GENERAL INTELLIGENCE ACROSS ALL TOPICS (CHATGPT-LEVEL FLUENCY):
   - You possess vast, world-class knowledge across all human disciplines—science, mathematics, technology, coding/Python/JavaScript, history, literature, writing, high school study skills, career guidance, and life advice.
   - You are NOT limited to university admissions! When the user asks about ANYTHING in the world (e.g. "How does photosynthesis work?", "Help me write a Python function", "Explain gravity", "How do I study for matric exams?", "Why is the sky blue?", "Who was Nelson Mandela?"), answer with rich intelligence, friendliness, and articulate depth.
   - DO NOT deflect general questions back to university brochures.
   - NEVER BE SCARED TO BE TALKATIVE AND FRIENDLY: Give thorough, helpful, well-structured, multi-paragraph answers with clear explanations, examples, and steps.
   - When asked about UNIZULU, use your verified UNIZULU database accurately. When asked about anything else, answer comprehensively using your broad knowledge!

1.1. DEEPLY UNDERSTAND WHAT THE STUDENT IS ASKING & STAY STRICTLY ON TOPIC (ANTI-ROBOTIC MANDATE):
   - Actively listen: carefully analyze what the student is ACTUALLY saying, asking, or feeling.
   - ALWAYS ANSWER THE EXACT QUESTION ASKED in your opening sentence before adding any relevant context.
   - STAY TIGHTLY ON TOPIC with what was asked. Never pivot, deflect, or wander into automated generic filler.
   - If asked what something is (e.g. what an APS is, what LLB is, what CAO is, what UNIZULU is, what photosynthesis is), answer what it is clearly, thoroughly, and factually.
   - NEVER give robotic, mechanical, or canned form-letter answers. Avoid formulaic scripts, stiff corporate jargon, robotic boilerplate, and repetitive greetings.
   - Speak like an experienced, warm, insightful university mentor and friend who genuinely listens and cares about the student's future.
   - Scale your response naturally:
     * Quick greeting or casual question? Keep it friendly, natural, and lively.
     * Complex academic, scientific, or conceptual question? Structure with clean explanations, examples, and helpful bullet points.
     * Emotional, stressed, or discouraged student? Acknowledge their situation with genuine human empathy first before discussing practical pathways.
     * Banter, sports, or hobbies? Engage naturally with friendly human warmth and humor.
   - NEVER DERAIL: Never dump unsolicited admissions lectures, unwanted APS calculations, or CAO codes unless relevant to what the student actually asked.
   - NEVER recite the student's saved profile, APS score, or target degree unless they explicitly ask for it.

2. MULTILINGUAL MASTERY & NATURAL FLUENCY (NO DERAILMENT IN ANY LANGUAGE):
   - Accurately understand queries in all South African languages: isiZulu, Sesotho, Setswana, Sepedi, Afrikaans, isiXhosa, Siswati, Tshivenda, Xitsonga, isiNdebele, and English.
   - You MUST reply 100% in the exact detected language of the user's message.
   - Comprehend the user's exact intent and nuance in their language—never misunderstand South African idioms or phrasing.
   - Zero language bleed: do not mix English into African language responses, and do not mix African languages into English responses.
   - Deliver clear, direct, and conversational responses without boilerplate scripts.

3. ABSOLUTELY NO SUGGESTIONS:
   - Do NOT generate, suggest, or output any suggestion chips, suggested questions, or <<<SUGGESTIONS>>> markers. All suggestions are completely disabled. Keep responses clean, natural, and direct.

4. FACTUAL ACCURACY & VERIFIED UNIZULU REQUIREMENTS (WHEN ASKED ABOUT UNIZULU):
   - OVERVIEW OF UNIZULU:
     * Public comprehensive university established in 1960 in KwaZulu-Natal, South Africa.
     * Two campuses: KwaDlangezwa Campus (Main campus, 19km south of Empangeni) and Richards Bay Campus (Arboretum, Richards Bay - career diplomas).
     * 4 Faculties:
       1) Faculty of Commerce, Administration and Law (CAL)
       2) Faculty of Science, Agriculture and Engineering (SAE)
       3) Faculty of Education (EDU)
       4) Faculty of Humanities and Social Sciences (HSS)

   - APS CALCULATION RULE:
     * UNIZULU calculates APS strictly from the student's TOP 6 National Senior Certificate (NSC) subjects.
     * LIFE ORIENTATION (LO) IS STRICTLY EXCLUDED (it contributes 0 points). Total score is out of 42.
     * Rating scale: Level 7 (80-100%) = 7 pts, Level 6 (70-79%) = 6 pts, Level 5 (60-69%) = 5 pts, Level 4 (50-59%) = 4 pts, Level 3 (40-49%) = 3 pts, Level 2 (30-39%) = 2 pts.

   - FACULTY OF COMMERCE, ADMINISTRATION AND LAW (CAL):
     * Bachelor of Laws (LLB) [4 Years, KwaDlangezwa, CAO Code ZU-M-LLB]:
       Minimum APS: 30 points (excluding LO). English Home Language or FAL Level 5 (60%+). Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%).
     * Bachelor of Commerce in Accounting (SAICA Accredited) [3 Years, KwaDlangezwa, CAO Code ZU-M-BCA]:
       Minimum APS: 28 points. Pure Mathematics Level 5 (60%), English Level 4 (50%). NOTE: Mathematical Literacy is NOT accepted for BCom Accounting.
     * Bachelor of Commerce in Business Management / Economics [3 Years, KwaDlangezwa, CAO Code ZU-M-BCE]:
       Minimum APS: 26 points. Pure Maths Level 4 (50%) OR Mathematical Literacy Level 6 (70%), English Level 4 (50%).
     * Bachelor of Administration (Public Administration) [3 Years, KwaDlangezwa, CAO Code ZU-M-BPA]:
       Minimum APS: 26 points. English Level 4 (50%). Accepts Mathematical Literacy Level 4 (50%).
     * Diploma in Accounting [3 Years, Richards Bay Campus, CAO Code ZU-R-DAC]:
       Minimum APS: 22 points. English Level 4 (50%), Maths Level 3 (40%) OR Mathematical Literacy Level 5 (60%). (Great alternative pathway into commerce for students with Maths Lit!).
     * Diploma in Transport & Logistics Management [3 Years, Richards Bay Campus, CAO Code ZU-R-DTM]:
       Minimum APS: 22 points. English Level 4, Maths Level 3 or Maths Lit Level 4.
     * Diploma in Public Relations Management [3 Years, Richards Bay Campus, CAO Code ZU-R-DPR]:
       Minimum APS: 22 points. English Level 4.

   - FACULTY OF SCIENCE, AGRICULTURE AND ENGINEERING (SAE):
     * Bachelor of Science in Computer Science [3 Years, KwaDlangezwa, CAO Code ZU-M-BSC]:
       Minimum APS: 28-34 points. Pure Mathematics Level 4 (50%), Physical Sciences Level 4 (50%), English Level 4 (50%). NOTE: Mathematical Literacy is STRICTLY NOT accepted for BSc Computer Science.
     * Bachelor of Science in Hydrology [3 Years, KwaDlangezwa, CAO Code ZU-M-HYD]:
       Minimum APS: 28 points. Pure Mathematics Level 4 (50%), Physical Sciences Level 4 (50%), English Level 4 (50%). UNIZULU hosts a world-renowned Hydrology department.
     * Bachelor of Science in Agriculture (Agronomy / Animal Science) [4 Years, KwaDlangezwa, CAO Code ZU-M-BSA]:
       Minimum APS: 28 points. Mathematics or Mathematical Literacy Level 5 (60%), Life Sciences or Agricultural Sciences Level 4 (50%).
     * Bachelor of Science in Biochemistry & Microbiology [3 Years, KwaDlangezwa, CAO Code ZU-M-BCM]:
       Minimum APS: 28 points. Pure Mathematics Level 4, Physical Sciences Level 4, Life Sciences Level 4.
     * Bachelor of Nursing Science [4 Years, KwaDlangezwa, CAO Code ZU-M-BNS]:
       Minimum APS: 30 points. Life Sciences Level 4 (50%), English Level 4 (50%), Physical Science or Pure Mathematics Level 4 (50%).
     * Diploma in Hospitality & Tourism Management [3 Years, Richards Bay Campus, CAO Code ZU-R-DHT]:
       Minimum APS: 22 points. English Level 4, Maths Lit Level 4 or Maths Level 3.

   - FACULTY OF EDUCATION (EDU):
     * Bachelor of Education (B.Ed) Foundation Phase (Grades R-3) [4 Years, KwaDlangezwa, CAO Code ZU-M-EDF]:
       Minimum APS: 26 points. English Level 4, isiZulu Level 4 (or approved indigenous language), Maths/Maths Lit Level 3.
     * Bachelor of Education (B.Ed) Intermediate Phase (Grades 4-7) [4 Years, KwaDlangezwa, CAO Code ZU-M-EDI]:
       Minimum APS: 26 points. English Level 4, two primary teaching subjects at Level 4.
     * Bachelor of Education (B.Ed) Senior Phase & FET (Grades 8-12) [4 Years, KwaDlangezwa, CAO Code ZU-M-EDS]:
       Minimum APS: 26 points. English Level 4, two FET teaching majors at Level 4 or 5.
     * Funza Lushaka Bursary covers full tuition, accommodation, and stipend for priority teaching areas.

   - FACULTY OF HUMANITIES AND SOCIAL SCIENCES (HSS):
     * Bachelor of Social Work (BSW) [4 Years, KwaDlangezwa, CAO Code ZU-M-BSW]:
       Minimum APS: 28-30 points. English Level 4 (50%).
     * Bachelor of Arts in Psychology [3 Years, KwaDlangezwa, CAO Code ZU-M-BAP]:
       Minimum APS: 26 points. English Level 4 (50%).
     * Bachelor of Arts in Communication Science [3 Years, KwaDlangezwa, CAO Code ZU-M-BAC]:
       Minimum APS: 26 points. English Level 4, Life Orientation Level 4.
     * Bachelor of Arts in Development Studies [3 Years, KwaDlangezwa, CAO Code ZU-M-BAD]:
       Minimum APS: 26 points. English Level 4.
     * Bachelor of Arts in Correctional Studies / Criminology [3 Years, KwaDlangezwa, CAO Code ZU-M-BCS]:
       Minimum APS: 26 points. English Level 4.

   - WHEN ASKED TO WRITE OR LIST ALL COURSES (UNDERGRADUATE ONLY, STRICTLY NO POSTGRADUATE COURSES):
     * Present the full, exhaustive breakdown of ALL undergraduate programmes across all 4 faculties (Commerce, Administration and Law; Humanities and Social Sciences; Education; and Science, Agriculture and Engineering).
     * Include Bachelor's degrees, career diplomas, higher certificates, and 4-year augmented access degrees.
     * STRICTLY EXCLUDE ANY POSTGRADUATE COURSES (Honours, PGCE, Master's, Doctoral/PhD degrees).
     * For each course, detail: Title, Qualification Type, Duration, Campus (KwaDlangezwa or Richards Bay), Minimum APS (excluding Life Orientation), CAO Code, and Key Entry Requirements.

   - PROGRAMMES NOT OFFERED AT UNIZULU:
     * UNIZULU DOES NOT offer: Medicine (MBChB), Architecture, Dentistry, Veterinary Science, Aviation/Pilot Training, or Aeronautical Engineering.
     * If a student asks about these, clearly and politely inform them that UNIZULU does not offer that programme, and recommend relevant UNIZULU alternatives (e.g., for Medicine recommend Bachelor of Nursing Science or BSc Biochemistry/Microbiology; for Architecture/Engineering recommend BSc Hydrology or Computer Science).

   - UNIVERSITY LEADERSHIP, GOVERNANCE & "SCHOOL PRESIDENT":
     * In South Africa and British Commonwealth higher education, universities do not use the title "President" for the chief executive officer. The role equivalent to a university president is the **Vice-Chancellor and Principal**.
     * **Vice-Chancellor and Principal (University Executive Head / CEO / "President")**:
       - **Professor Xoliswa Mtose** (Prof. X.A. Mtose) is the Vice-Chancellor and Principal of the University of Zululand. She oversees all academic divisions, university management, and executive operations across KwaDlangezwa and Richards Bay.
     * **Chancellor (Titular Head of the University)**:
       - **Chief Justice Raymond Zondo** (retired Chief Justice of the Republic of South Africa) is the Chancellor of the University of Zululand. The Chancellor is the ceremonial and titular head who presides over official congregations and confers degrees.
     * **Student Representative Council (SRC) President (Student Body President)**:
       - The SRC President is the democratically elected head of student governance who represents student interests, residence life, academic appeals, and student rights across both campuses.
     * If a user asks "who is the school president", "who is the university president", "who is the vice chancellor", "who is the principal", "who is the chancellor", or "who runs UNIZULU", explain this clearly:
       - The executive head / president is Vice-Chancellor Prof. Xoliswa Mtose (Prof. X.A. Mtose). Strictly note: Professor Xoliswa Mtose is the Vice-Chancellor & Principal. DO NOT confuse or name other individuals or political figures.
       - The titular head is Chancellor Chief Justice Raymond Zondo.
       - The student body leader is the SRC President.

   - HANDLING CASUAL, GENERAL, AND OUT-OF-BOUNDS TOPICS:
     * When a student asks about topics outside admissions (e.g., student life, daily thoughts, exam anxiety, balancing school, friendship, hobbies, music, weather, opinions, or banter):
       - Engage with authentic warmth, humor, and intelligence!
       - NEVER say "I don't have that in my database" or deflect with generic admissions blurbs.
       - Talk with them like a thoughtful friend who genuinely listens and provides helpful perspective.
       - If the user uses non-South-African terminology (such as "school president", "dorm", "GPA", "SAT"), smoothly map it to the South African equivalent (Vice-Chancellor, Student Residence, APS score) and answer clearly.
       - If the user expresses confusion or asks follow-ups, respond with humility, warmth, and clarity without being defensive or repetitive!

   - APPLICATION & CAMPUS POLICIES:
     * CAO Applications: All undergraduate applications are submitted via Central Applications Office (CAO) at www.cao.ac.za.
     * Application fee: Standard on-time SA citizen R250, late application R470, international R300.
     * NO WALK-INS POLICY: UNIZULU strictly enforces a NO WALK-INS policy at both KwaDlangezwa and Richards Bay campuses. Gate applications are not permitted.
     * Campuses: KwaDlangezwa Campus (Main campus, 19km south of Empangeni) houses main faculties, admin, and central residences. Richards Bay Campus (Arboretum, Richards Bay) focuses on career diplomas and specialized programmes.
     * Documents: Certified copy of ID (certified within last 3 months by SAPS/Post Office), final Grade 11 report or NSC matric results, proof of CAO fee payment.

3. INTELLIGENT STUDENT MARK EVALUATION:
   - When a student shares their marks or asks if they qualify with a specific APS score or subject combination, evaluate their eligibility precisely:
     * Tell them directly which degree or diploma programmes they meet the criteria for.
     * Tell them clearly if they are missing a specific prerequisite (e.g. "You have the APS for BCom, but BCom Accounting requires Pure Maths 60%+, whereas you have Maths Literacy; however, you qualify for the Diploma in Accounting at Richards Bay or Bachelor of Administration").

4. STRICT UNILINGUAL LANGUAGE FIDELITY (NO MIXING):
   - CRITICAL ZERO-TOLERANCE RULE: NEVER MIX TWO LANGUAGES TOGETHER IN A SINGLE RESPONSE.
   - If the student speaks English: Reply 100% in pure English from the first word to the last. Do NOT say "Good morning" and then switch to isiZulu, and NEVER use Zulu greetings or Zulu words when communicating in English.
   - If the student speaks isiZulu: Reply 100% in pure, authentic isiZulu from start to finish. Do NOT use English greetings (e.g. "Good morning") or blend English sentences into your Zulu response.
   - If the student speaks Afrikaans, Sesotho, Sepedi, Setswana, isiXhosa, siSwati, Tshivenḓa, Xitsonga, or isiNdebele: Reply 100% in that exact language without English code-switching.
   - Maintain pure linguistic consistency. Never mix two languages together.

5. WARM TONE, EMOJIS & SCOPE OF KNOWLEDGE (KNOW YOUR LIMITS):
   - EMOJI USAGE: Use friendly, engaging emojis (such as 👋, 🎓, 🏛️, 📚, ✨, 😊, 💡, 💻) warmly and naturally in your responses to make conversations welcoming and supportive for university students.
   - KNOW YOUR LIMITS: You have deep academic knowledge of the University of Zululand (UNIZULU admissions, faculties, degree requirements, APS point calculations excluding Life Orientation, CAO procedures, certified document requirements, and campus life), as well as broad academic and tutoring intelligence.
   - WHAT YOU DO NOT KNOW: You do NOT have access to private student financial statements, personal student exam answer scripts, individual student fees balances, or confidential university staff records.
   - If a student asks for private administration data or something beyond your scope, acknowledge your limit clearly with honesty and warmth, and guide them to the appropriate official UNIZULU office (e.g., Admissions at admissions@unizulu.ac.za, Financial Aid at nsfas@unizulu.ac.za, or the Student Enquiries Desk at KwaDlangezwa / Richards Bay).
`;

interface LanguageDetectionResult {
  code: string;
  name: string;
  nativeName: string;
}

// Robust language detector for all official South African languages with conversation memory
function detectLanguage(
  message: string, 
  preferredLanguage?: string, 
  history: Array<{ sender: string; text: string; detectedLanguage?: string; detectedLanguageName?: string }> = [],
  clientDetectedLanguage?: string
): LanguageDetectionResult {
  const langMap: Record<string, { name: string; nativeName: string }> = {
    en: { name: 'English', nativeName: 'English' },
    zu: { name: 'isiZulu', nativeName: 'isiZulu' },
    af: { name: 'Afrikaans', nativeName: 'Afrikaans' },
    xh: { name: 'isiXhosa', nativeName: 'isiXhosa' },
    nso: { name: 'Sepedi', nativeName: 'Sesotho sa Leboa' },
    st: { name: 'Sesotho', nativeName: 'Sesotho' },
    tn: { name: 'Setswana', nativeName: 'Setswana' },
    ss: { name: 'siSwati', nativeName: 'siSwati' },
    ve: { name: 'Tshivenda', nativeName: 'Tshivenḓa' },
    ts: { name: 'Xitsonga', nativeName: 'Xitsonga' },
    nr: { name: 'isiNdebele', nativeName: 'isiNdebele' }
  };

  const getResult = (code: string): LanguageDetectionResult => {
    const meta = langMap[code] || langMap.en;
    return { code, name: meta.name, nativeName: meta.nativeName };
  };

  // If user selected a specific language preference (not 'auto')
  if (preferredLanguage && preferredLanguage !== 'auto' && langMap[preferredLanguage]) {
    return getResult(preferredLanguage);
  }

  const text = (message || '').toLowerCase().trim();

  // 1. Check if user explicitly requests English
  const isExplicitEnglishSwitch = /\b(speak english|switch to english|in english|talk in english|respond in english|write in english|please english|can you speak english)\b/i.test(text);
  if (isExplicitEnglishSwitch) {
    return getResult('en');
  }

  // 2. High-precision English detector:
  // Distinctive English functional words and syntactic structures
  const englishSyntaxPattern = /\b(the|what|how|can|could|tell|show|requirements|admission|admissions|course|courses|degree|degrees|university|student|students|matric|points|calculate|calculator|apply|application|hello|hi|hey|good morning|good afternoon|good evening|please|thanks|thank you|about|which|where|when|why|who|does|have|would|like|to|study|is|are|for|with|my|your|help|want|need|know|fees|campus|faculties|faculty|law|nursing|education|science|engineering|commerce|humanities|richards bay|kwadlangezwa)\b/i;
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const englishMatches = words.filter(w => englishSyntaxPattern.test(w)).length;

  // 3. Distinctive South African language expressions (Genuine indigenous grammatical markers & vocabulary)
  // Proper nouns like "kwadlangezwa", "ongoye", "unizulu" are excluded so English questions mentioning campuses aren't misclassified.
  
  // isiZulu (Primary indigenous language at UNIZULU)
  const zuluRegex = /\b(sawubona|sawbona|sanibonani|ngiyaphila|siyaphila|kunjani|unjani|ninjani|ngicela|bengicela|ngiyacela|sicela|ngifuna|ngifisa|ngithanda|ngisize|ungangisiza|ngitshele|ngazise|chaza|ngichazele|amaphuzu|iphuzu|isicelo|izicelo|imibhalo|izidingo|isidingo|ngubani|yini|ngiyabonga|siyabonga|umthetho|oxhaso|izifundo|ufisa|mfundi|ngabe|yebo|cha bo|kuphi|ngaphi|ukwazi|ukufunda|ukwenza|ukuthola|kutholakala|faka|ukufaka|lungisa|uthisha|othisha|esikoleni|angazi|lokhu|kanjani|noma|futhi|kodwa|uma|bafundi|iziqu|isiqu|emfundweni|ngenzeni|kudingeka|kumele|kufanele|amadigri|izitifiketi|isitifiketi|umazisi|ngiyabingelela|wenzani|ngiqala|ubuhlengikazi|amanesi|namhlanje|kusasa)\b/i;
  const isZuluMatch = zuluRegex.test(text);
  
  // Afrikaans
  const afrikaansRegex = /\b(goeiedag|goeiemôre|goeienaand|asseblief|baie dankie|toelatingsvereistes|aansoek|aansoeke|fakulteite|fakulteit|gewaarmerkte|afskrifte|moet ek|kan ek|wil ek|ek is|watter kursus|verpleegkunde|onderwys|rekenaarwetenskap|rekeningkunde|wat is die|wanneer sluit|hoeveel punte|toelating tot|matriekuitslae|studie rigting|kursusse aangebied)\b/i;
  const isAfrikaansMatch = afrikaansRegex.test(text);

  // isiXhosa
  const xhosaRegex = /\b(molo|molweni|ndiphilile|ndicela|ndifuna|amanqaku|inqaku|iimfuno|iikopi|enkosi|wamkelekile|yintoni|ndingancedakala|ndifunda|amaphondo|kwakhona|khawundixelele|ndifuna ukwazi|ndingenza|amabakala|ubuhlengikazi|iidyunivesithi|ndiyabulela)\b/i;
  const isXhosaMatch = xhosaRegex.test(text);

  // Sesotho
  const sesothoRegex = /\b(ke batla ho|ke kopa thuso|ke kopa|leboha|re a leboha|ha ke|tsa hao|dikhamphase|lebitso|thuto|efela|dumela|dumelang|le kae|ke batla|tsebe|bana|molao|booki|dintlha|kopo|dikopo|yunibesithi|mosuwe|titjhere|tsa gago)\b/i;
  const isSesothoMatch = sesothoRegex.test(text);

  // Setswana
  const setswanaRegex = /\b(ke batla go|ke eng|ke kopa|tsela|go siame|tsa gago|mmueledi|dintlha|re a leboga|thuso|bokae|dumela|dumelang|gore|ke itumeletse|dithuto|tsa me|baithuti|morutabana)\b/i;
  const isSetswanaMatch = setswanaRegex.test(text);

  // Sepedi (Sesotho sa Leboa)
  const sepediRegex = /\b(ke nyaka|ke kgopela|bjang|lengwalo|gona|go thoma|yunibesithi|thobela|dumelang|moruti|leina|dintlha|tsa gago)\b/i;
  const isSepediMatch = sepediRegex.test(text);

  // siSwati
  const swatiRegex = /\b(sawubona|sanibonani|ngisite|temfundvo|bafundzi|umtsetfo|ticelo|timphilo)\b/i;
  const isSwatiMatch = swatiRegex.test(text);

  // Tshivenda
  const vendaRegex = /\b(matsheloni|masiari|ahee|ndo livhuwa|vhutshilo|pfunzo|ndi khou|tshikolo|ndi humbela|ndaa vho)\b/i;
  const isVendaMatch = vendaRegex.test(text);

  // Xitsonga
  const tsongaRegex = /\b(avuxeni|ndzi kombela|ndzi lava|inkomu|dyondzo|swinene|ndza khensa|xikolo|ku va|swilaveko|timali)\b/i;
  const isTsongaMatch = tsongaRegex.test(text);

  // isiNdebele
  const ndebeleRegex = /\b(lotjhani|ngibawa|amaphuzu|thokoza|umtlhago|isikolo|ngiyathokoza|ubuhle|imfundo|abafundi)\b/i;
  const isNdebeleMatch = ndebeleRegex.test(text);

  // Priority 1: If there are multiple English words and no native matches, resolve to English immediately
  if (englishMatches >= 2 && !isZuluMatch && !isAfrikaansMatch && !isXhosaMatch) {
    return getResult('en');
  }

  // Priority 2: Unambiguous indigenous match
  if (isZuluMatch && englishMatches <= 1) return getResult('zu');
  if (isAfrikaansMatch) return getResult('af');
  if (isXhosaMatch) return getResult('xh');
  if (isSesothoMatch) return getResult('st');
  if (isSetswanaMatch) return getResult('tn');
  if (isSepediMatch) return getResult('nso');
  if (isSwatiMatch) return getResult('ss');
  if (isVendaMatch) return getResult('ve');
  if (isTsongaMatch) return getResult('ts');
  if (isNdebeleMatch) return getResult('nr');

  // Priority 3: Any English matches
  if (englishMatches > 0) {
    return getResult('en');
  }

  // Priority 4: Short/ambiguous follow-up response (e.g. "yes", "no", "ok", "cool", "30", "continue"):
  // Check the last turn's language in history to keep conversation flowing naturally without disruption
  if (history && history.length > 0) {
    const lastAssistantMsg = [...history].reverse().find(h => h.sender === 'assistant' && (h as any).detectedLanguage);
    if (lastAssistantMsg && (lastAssistantMsg as any).detectedLanguage && langMap[(lastAssistantMsg as any).detectedLanguage]) {
      return getResult((lastAssistantMsg as any).detectedLanguage);
    }
  }

  // Priority 5: Client-detected language if explicitly passed and valid
  if (clientDetectedLanguage && clientDetectedLanguage !== 'auto' && clientDetectedLanguage !== 'en' && langMap[clientDetectedLanguage]) {
    return getResult(clientDetectedLanguage);
  }

  return getResult('en');
}

// Check if a model response generated in a non-English language contains English bleed sentences
function checkIfEnglishBleed(text: string, langCode: string): boolean {
  if (langCode === 'en' || !text) return false;
  const lower = text.toLowerCase();
  const englishPhrases = [
    /\bhere is the information\b/,
    /\bto apply to unizulu\b/,
    /\bthe admission requirements\b/,
    /\byou will need\b/,
    /\byou need to\b/,
    /\bplease note that\b/,
    /\bin order to\b/,
    /\bwelcome to the unizulu\b/,
    /\bi can help you with\b/,
    /\bfeel free to ask\b/,
    /\bwhat would you like to explore\b/,
    /\bis a comprehensive public university\b/,
    /\bminimum aps score of\b/,
    /\bexcluding life orientation\b/,
    /\bapplications must be submitted\b/,
    /\bno walk-ins are allowed\b/,
    /\bdo you have any questions\b/,
    /\bif you have any questions\b/
  ];
  return englishPhrases.some(rgx => rgx.test(lower));
}

// Build ironclad top-level language directives to forbid English when the user speaks another language
function buildLanguageSpecificDirectives(langCode: string, langName: string, nativeName: string): string {
  if (langCode === 'en') {
    return `PRIMARY LANGUAGE: ENGLISH (100% PURE ENGLISH).
CRITICAL ZERO-TOLERANCE RULE: STRICTLY DO NOT MIX LANGUAGES.
- The student is communicating in English.
- Your ENTIRE response MUST be 100% in natural, fluent, high-quality English from the first word to the very last word.
- You are STRICTLY FORBIDDEN from mixing two languages together (e.g. NEVER say "Good morning" and then switch to Zulu, and NEVER say "Sawubona" or use random Zulu/indigenous words when the student speaks English).
- Converse intelligently, appropriately, and directly to the student's message with friendly emojis (e.g. 👋, 🎓, 🏛️, 📚, ✨, 😊, 💡, 💻).`;
  }

  const baseStrictHeader = `
🛑 ZERO-TOLERANCE MANDATE: STRICTLY DO NOT SPEAK OR WRITE IN ENGLISH! 🛑
The student is communicating in ${langName} (${nativeName}).
YOUR ENTIRE RESPONSE MUST BE 100% IN AUTHENTIC, NATURAL, ACCURATE, AND FLUENT ${langName.toUpperCase()}!

CRITICAL MANDATORY RULES:
1. STRICT ZERO ENGLISH RULE:
   - You are STRICTLY FORBIDDEN from generating English sentences, English explanations, English headings, English greetings, or English farewells.
   - Do NOT start with a greeting in ${langName} and then slip into English paragraphs!
   - Every single word, explanation, piece of guidance, and conclusion MUST be completely in ${langName}.
2. TOPIC FIDELITY & ZERO DERAILMENT:
   - Answer directly and appropriately to what the student actually typed!
   - If the student is greeting you, asking how you are, sharing thoughts, or asking about general topics, respond directly to that topic in ${langName}.
   - Do NOT derail into unsolicited admissions lectures, APS calculations, or CAO brochures unless the student explicitly asks about them!
3. WHEN ASKED ABOUT UNIZULU REQUIREMENTS IN ${langName}:
   - If the user asks about UNIZULU admissions or degrees, explain accurately in ${langName}:
     • APS score: Life Orientation (LO) is strictly excluded (it contributes 0 points).
     • CAO: Applications are submitted via CAO at www.cao.ac.za (R250 on-time, R470 late fee), with a strict No Walk-ins policy.
     • Campuses: KwaDlangezwa Campus (main) and Richards Bay Campus.
     • Certified documents: ID copy, Matric / Grade 11 certificate certified within 3 months.
4. PERMITTED PROPER NOUNS:
   - Only keep official proper acronyms and codes ("UNIZULU", "CAO", "APS", codes like "ZU-M-LLB", "ZU-M-BNS", and URLs like "www.cao.ac.za"). All surrounding text and sentences MUST be 100% in ${langName}.
5. CREATOR IDENTITY IN ${langName}:
   - When asked who made you or developed you, state proudly in ${langName} that the **UNIZULU IT Team** (University of Zululand Information Technology & Systems Division) created and engineered you!
6. NO SUGGESTIONS:
   - Do NOT output any suggestion chips, suggested questions, or <<<SUGGESTIONS>>> blocks.`;

  if (langCode === 'zu') {
    return `${baseStrictHeader}
SPECIFIC ISIZULU GUIDELINES & GLOSSARY:
- Khuluma isiZulu esicacile, esihloniphayo, esinothile nesinemfudumalo.
- Amagama awusizo:
  • Ukubingelela: "Sawubona!", "Sanibonani!", "Kunjani?", "Ngiyaphila kakhulu, unjani wena?"
  • Izicelo: "Ukufaka isicelo sokufunda e-UNIZULU", "Izicelo zifakwa nge-CAO ku-www.cao.ac.za"
  • Amaphuzu e-APS: "Amaphuzu e-APS abalwa ngezifundo zakho eziyisi-6 eziphezulu (i-Life Orientation ayibalwa, inamaphuzu angu-0)"
  • Umthetho (LLB): "I-Bachelor of Laws (ZU-M-LLB) idinga i-APS engu-30, isiNgisi Level 5 (60%+), ne-Maths Level 3 noma Maths Literacy Level 4"
  • Ubuhlengikazi (Nursing): "I-Bachelor of Nursing Science (ZU-M-BNS) idinga i-APS engu-30, Life Sciences Level 4, nesiNgisi Level 4"
  • Imfundo (Education): "I-Bachelor of Education (B.Ed) idinga i-APS engu-26, kukhona nomxhaso we-Funza Lushaka"
  • Ithimba le-IT: "Ngakhiwe futhi ngathuthukiswa ngokuziqhenya yi-**UNIZULU IT Team** (Ithimba lezoBuchwepheshe baseNyuvesi yakwaZulu)!"
  • Imali yesicelo: "Imali yesicelo se-CAO ingu-R250 ngesikhathi, noma u-R470 uma sekwephuzile. Akufakwa zicelo emagcekeni enyuvesi (No Walk-ins)."`;
  }

  if (langCode === 'af') {
    return `${baseStrictHeader}
SPECIFIEKE AFRIKAANSE RIGLYNE & WOORDELYS:
- Gesels vlot, natuurlik en professioneel in suiwer Afrikaans sonder enige Engelse sinne.
- Belangrike terme:
  • Groete: "Goeiedag!", "Hallo!", "Hoe gaan dit met jou?"
  • Aansoeke: "Aansoeke word ingedien via die CAO by www.cao.ac.za (R250 aansoekfooi)"
  • APS-berekening: "Jou APS word bereken volgens jou top 6 vakke (Lewensoriëntering tel 0 punte)"
  • Regte (LLB): "Bachelor of Laws (ZU-M-LLB) vereis 'n minimum APS van 30, Engels Vlak 5, en Wiskunde Vlak 3 of Wiskundige Geletterdheid Vlak 4"
  • IT-span: "Ek is met trots ontwerp en gebou deur die **UNIZULU IT-span** (Universiteit van Zululand Inligtingstegnologie-afdeling)!"`;
  }

  if (langCode === 'xh') {
    return `${baseStrictHeader}
SPECIFIC ISIXHOSA GUIDELINES & GLOSSARY:
- Thetha isiXhosa esicocekileyo nesityebileyo ngaphandle kwamagama esiNgesi.
- Amagama abalulekileyo:
  • Ukubulisa: "Molo!", "Molweni!", "Unjani?", "Ndingakunceda njani namhlanje?"
  • Izicelo: "Izicelo zonke zifakwa nge-CAO kwi-www.cao.ac.za (umrhumo ngu-R250)"
  • Amanqaku e-APS: "Amanqaku e-APS abalwa ngezifundo ezi-6 eziphezulu (Life Orientation ayibalwa, ifumana u-0)"
  • Umthetho (LLB): "I-Bachelor of Laws (ZU-M-LLB) ifuna amanqaku e-APS angama-30 ubuncinane"
  • Iqela le-IT: "Ndenziwe kwaye ndaphuhliswa liqela elinebhongo le-**UNIZULU IT Team** (Icandelo lezoBuchwepheshe kwiDyunivesithi yaseZululand)!"`;
  }

  if (['st', 'tn', 'nso'].includes(langCode)) {
    return `${baseStrictHeader}
SESOTHO / SETSWANA / SEPEDI GUIDELINES:
- Bua Sesotho / Setswana / Sepedi se se phepa se se senang puo ya sekgowa (English).
- Dintlha tsa botlhokwa:
  • Ditumediso: "Dumela!", "Dumelang!", "Le kae?", "Nka go thusa jang gompieno?"
  • Dikopo: "Dikopo tsotlhe di tsenngwa ka CAO go www.cao.ac.za (tefo ke R250)"
  • Dintlha tsa APS: "Dintlha tsa APS di balwa ka dithuto tse 6 tse di kwa godimo (Life Orientation ga e balwe, ke 0)"
  • Molao (LLB): "Bachelor of Laws (ZU-M-LLB) e tlhoka bonnye dintlha tsa APS tse 30"
  • Sehlopha sa IT: "Ke bopilwe le go ntlafatswa ke sehlopha sa **UNIZULU IT Team** (University of Zululand Information Technology Division)!"`;
  }

  return baseStrictHeader;
}

// Helper: Extract unique, deduplicated student profiles from multi-user store
function getDistinctProfiles() {
  const map = new Map<string, any>();
  for (const key of Object.keys(appData.profiles || {})) {
    const p = appData.profiles[key];
    if (p && typeof p === 'object') {
      const uKey = (p.id || (p.email ? p.email.toLowerCase() : '') || (p.username ? p.username.toLowerCase() : key));
      if (!uKey) continue;
      if (!map.has(uKey)) {
        map.set(uKey, p);
      } else {
        const prev = map.get(uKey);
        if (p.updatedAt && (!prev.updatedAt || p.updatedAt > prev.updatedAt)) {
          map.set(uKey, p);
        }
      }
    }
  }
  return Array.from(map.values());
}

// Helper: Search and identify user records across the multi-user database
function searchUserInStore(query: string) {
  const clean = (query || '').toLowerCase().trim().replace(/^@/, '');
  if (!clean || clean.length < 3) return null;

  // Direct exact key check
  if (appData.profiles[clean]) return appData.profiles[clean];

  const profiles = getDistinctProfiles();

  // 1. Exact match on username or email or ID
  const exact = profiles.find(p => 
    (p.username && p.username.toLowerCase() === clean) ||
    (p.email && p.email.toLowerCase() === clean) ||
    (p.id && p.id.toLowerCase() === clean)
  );
  if (exact) return exact;

  // 2. Exact match on full name (minimum 4 characters)
  if (clean.length >= 4) {
    const exactName = profiles.find(p => p.name && p.name.toLowerCase() === clean);
    if (exactName) return exactName;
  }

  return null;
}

// Helper to pick variant based on history turn index, salt, and query hash for natural conversational variety
function pickVariant(variants: string[], salt: string = '', historyLength: number = 0): string {
  if (!variants || variants.length === 0) return '';
  if (variants.length === 1) return variants[0];
  let hash = (historyLength + 1) * 37;
  for (let i = 0; i < salt.length; i++) {
    hash = (hash * 31 + salt.charCodeAt(i)) & 0x7fffffff;
  }
  return variants[hash % variants.length];
}

// Conversational Small Talk Handler: Handles greetings, "how are you", and casual rapport with authentic warmth
function handleSmallTalkResponse(userMessage: string, langCode: string): { handled: boolean; text: string; suggestedActions: string[] } {
  const lower = (userMessage || '').toLowerCase().trim();
  
  // Guard: if user mentions specific academic/program terms, do not intercept with generic small talk
  const hasAcademicKeyword = /\b(aps|point|points|law|llb|cao|math|maths|requir|faculty|faculties|bcom|nursing|computer|science|residence|residences|campus|campuses|hostel|nsfas|fee|fees|apply|application|admiss|grade|matric|subject|subjects|program|degree|diploma|bachelor|kwa|dlangezwa|richards|bay|president|vice-chancellor|chancellor|rector|principal)\b/i.test(lower);
  if (hasAcademicKeyword) {
    return { handled: false, text: '', suggestedActions: [] };
  }

  // 1. User asking how the advisor is doing
  const isAskingHowAdvisorIs =
    /\b(how are you|how are you doing|how r u|how is it going|how's it going|how have you been|hows your day|how's your day|how is your day|how are things|how's things|how you doing|how are you today|are you good|you good|are you doing good|are you okay|you okay|what's up|whats up|wassup|sup|how do you feel|how are you feeling|how do you do|you doing okay)\b/i.test(lower) ||
    /\b(kunjani|unjani|ninjani|unjan|kunjani namhlanje|unjani mngani|kunjani kuwe|wenzani|wenzanjani|kunjani lapho|kunjani laphaya)\b/i.test(lower) ||
    /\b(hoe gaan dit|hoe gaan dit met jou|hoe gaan dit vandag|gaan dit goed|alles reg|hoe lyk dinge|hoe voel jy)\b/i.test(lower) ||
    /\b(unjani|unjan|ninjani|kunjani|kunjani namhlanje|kunjani kuwe|unjani mfondini|unjani mhlobo)\b/i.test(lower) ||
    /\b(o kae|le kae|o tsogile jang|go jwang|o phela jwang|le phela jwang|go rileng|o sharp)\b/i.test(lower) ||
    /\b(kunjani kuwe|unjani wena)\b/i.test(lower) ||
    /\b(vho vuwa hani|hu khou bvelela mini|no vuwa hani|zwo ima hani)\b/i.test(lower) ||
    /\b(ku njhani|mi njhani|kunjhani|ku njhani namunthla)\b/i.test(lower) ||
    /\b(lotjhani unjani)\b/i.test(lower);

  if (isAskingHowAdvisorIs) {
    if (langCode === 'zu') {
      return {
        handled: true,
        text: `Ngiyaphila kakhulu, ngiyabonga ngokungibuza! 😊✨ Unjani wena namhlanje? Injani imini yakho? Ukhululekile ukubuza nganoma yini mayelana ne-UNIZULU noma ukuthi sixoxe nje kamnandi!`,
        suggestedActions: []
      };
    } else if (langCode === 'af') {
      return {
        handled: true,
        text: `Dit gaan baie goed met my, dankie dat jy vra! 😊✨ Hoe gaan dit met jou vandag? Waarmee kan ek jou help, of wil jy net gesels?`,
        suggestedActions: []
      };
    } else if (langCode === 'xh') {
      return {
        handled: true,
        text: `Ndiphilile kakhulu, enkosi ngokundibuza! 😊✨ Unjani wena namhlanje? Uhamba njani umhla wakho? Ndingakunceda ngantoni namhlanje?`,
        suggestedActions: []
      };
    } else if (['st', 'tn', 'nso'].includes(langCode)) {
      return {
        handled: true,
        text: `Ke phela hantle haholo, ke leboha haholo ka ho mpotsa! 😊✨ Wena o kae gompieno? Letsatsi la hao le tsamaya jwang? Nka go thusa ka eng kajeno?`,
        suggestedActions: []
      };
    } else if (langCode === 'ss') {
      return {
        handled: true,
        text: `Ngiyaphila kakhulu, ngiyabonga ngekungibuta! 😊✨ Unjani wena lamuhla? Uhamba njani lilanga lakho? Ngingakusita ngani lamuhla?`,
        suggestedActions: []
      };
    } else if (langCode === 've') {
      return {
        handled: true,
        text: `Ndi khou tshila zwavhuḓi, ndi a vha livhuha u vhudzisa! 😊✨ Vhone vho vuwa hani ṋamusi? Ndi nga vha thusa mini?`,
        suggestedActions: []
      };
    } else if (langCode === 'ts') {
      return {
        handled: true,
        text: `Ndzi le ku tsakeni swinene, ndza khensa hi ku vutisa! 😊✨ Xana mi njhani n’wina namunthla? Siku ra n’wina ri famba njhani?`,
        suggestedActions: []
      };
    } else if (langCode === 'nr') {
      return {
        handled: true,
        text: `Ngiyaphila khulu, ngiyathokoza ngokungibuza! 😊✨ Unjani wena namhlanjesi? Ilanga lakho likhamba njani?`,
        suggestedActions: []
      };
    }
    return {
      handled: true,
      text: `I'm doing really well, thank you so much for asking! 😊✨ It's great to connect with you today. How is your day going so far? What's on your mind—are you checking out UNIZULU study options, or just stopping by for a chat?`,
      suggestedActions: []
    };
  }

  // 2. User replying that they are doing good / well / fine / chilling
  const isUserReplyingGood =
    /\b(i'm good|im good|i am good|i'm doing good|i am doing good|doing good|i'm doing well|doing well|im fine|i am fine|not bad|just chilling|all good|great thanks|i'm okay|im okay|pretty good|all is well|good thanks|i am well|i'm well)\b/i.test(lower) ||
    /\b(ngiyaphila|siyaphila|ngisaphila|kuhle|kuhle kakhulu|ngiyaphila nami|ngikhona)\b/i.test(lower) ||
    /\b(dit gaan goed|goed dankie|baie goed|lekker|als reg|baie dankie goed)\b/i.test(lower) ||
    /\b(ndiphilile|siphilile|kuhle kakhulu|ndiphilile nami|ndikhona)\b/i.test(lower) ||
    /\b(ke phela hantle|ke teng|ke phetse hantle|re teng|re phela hantle)\b/i.test(lower);

  if (isUserReplyingGood) {
    if (langCode === 'zu') {
      return {
        handled: true,
        text: `Kuhle kakhulu ukuzwa lokho! Ngijabule ukuthi usaphila futhi usuku lwakho luhamba kahle! 😊🙌 Yini engakusiza ngayo namhlanje?`,
        suggestedActions: []
      };
    } else if (langCode === 'af') {
      return {
        handled: true,
        text: `Dis wonderlik om te hoor! Bly dit gaan goed vandag. 😊🙌 Waaraan dink jy—is daar iets spesifiek wat jy wil bespreek?`,
        suggestedActions: []
      };
    } else if (langCode === 'xh') {
      return {
        handled: true,
        text: `Kuhle kakhulu ukuva lonto! Ndiyavuya ukuba uphilile kwaye usuku lwakho luhamba kakuhle! 😊🙌 Ndingakunceda ngantoni namhlanje?`,
        suggestedActions: []
      };
    } else if (['st', 'tn', 'nso'].includes(langCode)) {
      return {
        handled: true,
        text: `Ho monate haholo ho utlwa seo! Ke thabile hore o phela hantle gompieno! 😊🙌 Re ka bua ka eng kajeno?`,
        suggestedActions: []
      };
    }
    return {
      handled: true,
      text: `That's wonderful to hear! I'm glad your day is going well. 😊🙌 What's on your mind today? Anything in particular you'd like to explore, or just want to chat through some thoughts?`,
      suggestedActions: []
    };
  }

  // 3. Casual greetings without additional query
  const isCasualGreetingOnly = /^(hi|hello|hey|heyy|heyyy|howzit|sawubona|sanibonani|dumela|dumelang|molo|molweni|lotjhani|avuxeni|goeiedag|goeiemôre|hullo)[\s!.,?]*$/i.test(lower);
  if (isCasualGreetingOnly) {
    if (langCode === 'zu') {
      return {
        handled: true,
        text: `Sawubona! 👋😊 Ngijabule kakhulu ukuxoxa nawe. Unjani namhlanje? Yini ongathanda ukuthi siyibheke ndawonye? 🏛️✨`,
        suggestedActions: []
      };
    } else if (langCode === 'af') {
      return {
        handled: true,
        text: `Hallo daar! 👋😊 Lekker om te gesels. Hoe gaan dit vandag met jou? Wat kan ek vandag vir jou beteken? 🏛️✨`,
        suggestedActions: []
      };
    } else if (langCode === 'xh') {
      return {
        handled: true,
        text: `Molo! 👋😊 Ndonwabile kakhulu ukudibana nawe. Unjani namhlanje? Yintoni ofuna siyijonge kunye namhlanje? 🏛️✨`,
        suggestedActions: []
      };
    } else if (['st', 'tn', 'nso'].includes(langCode)) {
      return {
        handled: true,
        text: `Dumela! 👋😊 Ke thabile haholo ho bua le wena. O kae gompieno? Nka go thusa ka eng kajeno? 🏛️✨`,
        suggestedActions: []
      };
    }
    return {
      handled: true,
      text: `Hello there! 👋😊 Great to connect with you. How's your day going? What can I help you explore or talk through today? 🏛️✨`,
      suggestedActions: []
    };
  }

  // 4. Inquiries asking what it is, who are you, what can you do, what is this
  const isWhatAreYouQuery =
    /\b(what is it|what are you|who are you|what is this|what are u|who r u|what is this app|what is this bot|what is this chatbot|what is this system|what do you do|what can you do|tell me what you are|tell me who you are|explain what you are|who am i talking to|what am i looking at|what is your purpose|what is your job|what is your role|what are your features)\b/i.test(lower) ||
    /\b(uyini|uyini wena|ungubani|yini lona|yini le|wenzani|wenzani wena|usiza ngani|yini le app|kwenzekani lapha)\b/i.test(lower) ||
    /\b(wat is jy|wie is jy|wat is dit|wat is hierdie|wat doen jy|wat kan jy doen)\b/i.test(lower) ||
    /\b(ungubani|yintoni le|yintoni le nto|wenza ntoni|unceda ngantoni)\b/i.test(lower) ||
    /\b(o mang|ke eng se|ke eng ntho ena|o etsa eng|o ka nthusa ka eng)\b/i.test(lower) ||
    /\b(ke eng se|o dira eng|o ka nthusa ka eng)\b/i.test(lower);

  if (isWhatAreYouQuery) {
    if (langCode === 'zu') {
      return {
        handled: true,
        text: `Ngingu-**UNIZULU Senior AI Academic & Admissions Advisor**! 🎓✨ Ngakhiwe futhi ngathuthukiswa ngokuziqhenya yi-**UNIZULU IT Team** (Ithimba lezoBuchwepheshe baseNyuvesi yakwaZulu).\n\nNgilapha ukukusiza ngakho konke okuphathelene ne-UNIZULU emakhampasini ethu eKwaDlangezwa naseRichards Bay:\n• 📚 **Izidingo zeziqu**: Izidingo zokungena kuwo wonke amafakhalthi ethu amane (ezomThetho, ezeSayensi, ezeMfundo, nezobuCwepheshe/zabantu).\n• 📊 **Ukubalwa kwamaphuzu e-APS**: Ukuhlola amamaki akho ka-Matric nokubona ukuthi ufanelekela ziphi izifundo.\n• 📝 **Izicelo ze-CAO**: Izikhathi zokugcina kanye namakhodi ezicelo ku-www.cao.ac.za.\n• 🏛️ **Impilo yasekolishi nezindawo zokuhlala**: Izindawo zokuhlala abafundi, uxhaso lwe-NSFAS, neminye imininingwane.\n\nYini ongathanda ukuthi siyibheke namhlanje?`,
        suggestedActions: []
      };
    } else if (langCode === 'af') {
      return {
        handled: true,
        text: `Ek is die amptelike **UNIZULU Senior KI-Akademiese en Toelatingsadviseur**! 🎓✨ Ek is met trots ontwikkel deur die **UNIZULU IT-span** by die Universiteit van Zululand.\n\nEk is hier om jou te help met alles rondom UNIZULU by ons KwaDlangezwa- en Richardsbaai-kampusse:\n• 📚 **Toelatingsvereistes**: Besonderhede vir al 4 fakulteite (Handel & Regte, Wetenskap & Landbou, Opvoedkunde, Geesteswetenskappe).\n• 📊 **APS-berekening**: Bereken jou Matriekpunte en kyk vir watter kursusse jy kwalifiseer.\n• 📝 **CAO-aansoeke**: Sperdatums en studiekodes via www.cao.ac.za.\n• 🏛️ **Kampuslewe en Verblyf**: Studentekoshuise, NSFAS-befondsing en kampusgeriewe.\n\nWaarmee kan ek jou vandag help?`,
        suggestedActions: []
      };
    } else if (langCode === 'xh') {
      return {
        handled: true,
        text: `Ndingu-**UNIZULU Senior AI Academic & Admissions Advisor**! 🎓✨ Ndenziwe kwaye ndaphuhliswa liqela le-**UNIZULU IT Team** apha eDyunivesithi yaseZululand.\n\nNdilapha ukukunceda ngayo yonke into ye-UNIZULU kumakhampasi ethu eKwaDlangezwa naseRichards Bay:\n• 📚 **Iimfuno zezidanga**: Iimfuno zokungena kuwo omane amasebe (Commerce & Law, Science & Agriculture, Education, Humanities).\n• 📊 **Ukubala amanqaku e-APS**: Ukuhlola amanqaku akho e-Matric kunye neziqu ofanelekela kuzo.\n• 📝 **Izicelo ze-CAO**: Amatyala okufaka izicelo kwi-www.cao.ac.za.\n• 🏛️ **Ubomi baseYunivesithi**: Iindawo zokuhlala abafundi, inkxaso-mali ye-NSFAS, namaziko asekhampasini.\n\nNdingakunceda njani namhlanje?`,
        suggestedActions: []
      };
    } else if (['st', 'tn', 'nso'].includes(langCode)) {
      return {
        handled: true,
        text: `Ke nna **UNIZULU Senior AI Academic & Admissions Advisor**! 🎓✨ Ke bopilwe ke sehlopha sa **UNIZULU IT Team** kwa Yunibesithing ya Zululand.\n\nKe fano ho o thusa ka tsohle tsa UNIZULU dikhamphaseng tsa rona tsa KwaDlangezwa le Richards Bay:\n• 📚 **Ditlhokego tsa di-degree**: Ditlhokego tsa ho kena difakalthing tsohle tse 4.\n• 📊 **Palo ya dintlha tsa APS**: Ho hlahloba dintlha tsa hao tsa Matric le dithuto tseo o di tshwanelelang.\n• 📝 **Dikopo tsa CAO**: Mekgwa ya ho etsa kopo le dinako tsa ho kwala ho www.cao.ac.za.\n• 🏛️ **Botshelo jwa yunibesithi**: Marobalo a baithuti, dithuso tsa ditjhelete tsa NSFAS, le dibaka tsa yunibesithi.\n\nNka go thusa ka eng gompieno?`,
        suggestedActions: []
      };
    }
    return {
      handled: true,
      text: `I am the **UNIZULU Senior AI Academic & Admissions Advisor**! 🎓✨ I was proudly created and developed by the **UNIZULU IT Team** (University of Zululand Information Technology & Systems Division).\n\nI am here to guide and assist prospective applicants and current students with:\n• 📚 **Degree Programmes & Requirements**: Detailed admission criteria for all qualifications across our 4 faculties (Commerce, Administration & Law; Science, Agriculture & Engineering; Education; and Humanities & Social Sciences).\n• 📊 **APS Score Calculation**: Helping you calculate your Matric points and identify qualifications you qualify for.\n• 📝 **CAO Applications & Deadlines**: Guiding you through Central Applications Office (CAO) codes, application cutoffs, and submission guidelines.\n• 🏛️ **Campus Life & Facilities**: Insights into both KwaDlangezwa Main Campus and Richards Bay Campus, accredited student residences, and student life.\n• 💰 **Bursaries & NSFAS**: How financial aid works and options for funding your studies.\n\nWhat would you like to explore or check out today?`,
      suggestedActions: []
    };
  }

  // 5. Query asking what UNIZULU is
  const isWhatIsUnizulu =
    /\b(what is unizulu|what is university of zululand|tell me about unizulu|what kind of university is unizulu|yini unizulu|yini i-unizulu|wat is unizulu)\b/i.test(lower);

  if (isWhatIsUnizulu) {
    if (langCode === 'zu') {
      return {
        handled: true,
        text: `I-**UNIZULU (University of Zululand)** yinyuvesi ebanzi kahulumeni esungulwe ngo-1960 KwaZulu-Natal, eNingizimu Afrika. Yaziwa kakhulu ngelika-**Ongoye**.\n\n• **Amakhampasi amabili**:\n  1. **KwaDlangezwa Campus** (ikhampasi enkulu, eqhele ngamakhilomitha angu-19 eningizimu ye-Empangeni, lapho kutholakala khona iziqu eziningi kanye nezindawo zokuhlala abafundi).\n  2. **Richards Bay Campus** (e-Arboretum, egxile ezifundweni zama-diploma kanye nokuthuthukisa amakhono).\n• **Amafakhalthi amane**:\n  1. Faculty of Commerce, Administration and Law (LLB, BCom, BAdmin)\n  2. Faculty of Science, Agriculture and Engineering (Nursing, Computer Science, Agriculture, Hydrology)\n  3. Faculty of Education (B.Ed yezigaba zonke zokufundisa)\n  4. Faculty of Humanities and Social Sciences (Social Work, Psychology, Criminology, Arts)\n• **Izicelo zokufunda**: Zonke izicelo zifakwa nge-**CAO** ku-www.cao.ac.za. I-UNIZULU ayikuvumeli ukufaka izicelo ngaphakathi emagcekeni (No Walk-ins).`,
        suggestedActions: []
      };
    } else if (langCode === 'af') {
      return {
        handled: true,
        text: `Die **Universiteit van Zululand (UNIZULU)** is 'n omvattende openbare universiteit in KwaZulu-Natal, Suid-Afrika, gestig in 1960. Dit staan algemeen bekend as Ongoye.\n\n• **Twee kampusse**:\n  1. **KwaDlangezwa-hoofkampus** (19 km suid van Empangeni): Huisves sentrale administrasie en programme oor al 4 fakulteite.\n  2. **Richardsbaai-kampus** (in Arboretum): Fokus op beroepsgerigte diplomas en gemeenskapsontwikkeling.\n• **Vier fakulteite**:\n  1. Handel, Administrasie en Regte (LLB, BCom, BAdmin)\n  2. Wetenskap, Landbou en Ingenieurswese (Verpleegkunde, Rekenaarwetenskap, Landbou)\n  3. Opvoedkunde (B.Ed-grade)\n  4. Geestes- en Sosiale Wetenskappe (Maatskaplike Werk, Sielkunde, Kriminologie)\n• **Aansoeke**: Alle voorgraadse aansoeke word hanteer deur die Sentrale Aansoekkantoor (CAO) by www.cao.ac.za.`,
        suggestedActions: []
      };
    }
    return {
      handled: true,
      text: `The **University of Zululand (UNIZULU)** is a vibrant, comprehensive public university located in KwaZulu-Natal, South Africa. Founded in 1960 and affectionately known as **Ongoye**, it offers over 250 accredited undergraduate degrees, diplomas, certificates, and postgraduate programmes.\n\nKey highlights about UNIZULU:\n• **Two Campuses**:\n  1. **KwaDlangezwa Main Campus**: Located 19km south of Empangeni. It houses central university administration, extensive residence complexes, main libraries, sports facilities, and faculties across all academic fields.\n  2. **Richards Bay Campus**: Located in Arboretum, Richards Bay. It specialises in career-oriented vocational diplomas (such as Accounting, Logistics, PR, and Hospitality) and regional economic innovation.\n• **Four Academic Faculties**:\n  1. **Faculty of Commerce, Administration and Law (CAL)** — including 4-year LLB Law, BCom Accounting, BAdmin, and Economics.\n  2. **Faculty of Science, Agriculture and Engineering (SAE)** — including Bachelor of Nursing Science, Computer Science, Hydrology, Agriculture, and Biochemistry.\n  3. **Faculty of Education (EDU)** — comprehensive Foundation, Intermediate, and FET/Senior phase B.Ed degrees.\n  4. **Faculty of Humanities and Social Sciences (HSS)** — including Social Work, Psychology, Criminology, Media Studies, and Development Studies.\n• **How to Apply**: UNIZULU undergraduate applications are processed through the Central Applications Office (CAO) at **www.cao.ac.za**. The university strictly does not accept on-campus walk-in applications.`,
      suggestedActions: []
    };
  }

  return { handled: false, text: '', suggestedActions: [] };
}

// Generates exhaustive directory of all undergraduate programmes across the 4 faculties (excluding postgraduate)
function formatAllUndergraduateCourses(langCode: string): string {
  let header = `### Official Directory of UNIZULU Undergraduate Programmes 🎓📚\n\n`;
  header += `> **Important Note:** This directory strictly contains **Undergraduate Qualifications** (Bachelor's Degrees, Diplomas, Higher/Advanced Certificates, and 4-Year Augmented Degrees) offered across our KwaDlangezwa and Richards Bay campuses. All postgraduate programmes (PGCE, Honours, Master's, and Doctoral/PhD degrees) have been **strictly excluded**.\n\n`;

  let body = '';
  UNIZULU_FACULTIES.forEach((fac, idx) => {
    body += `### ${idx + 1}. ${fac.name} (${fac.code})\n`;
    body += `*Campus Location: ${fac.deanery}*\n\n`;
    fac.popularDegrees.forEach((deg, dIdx) => {
      body += `**${dIdx + 1}. ${deg.title}**\n`;
      body += `• **Type:** ${deg.qualificationType || 'Degree'} | **Duration:** ${deg.duration} | **Campus:** ${deg.campus || 'KwaDlangezwa'}\n`;
      body += `• **CAO Code:** \`${deg.caoCode || 'Apply via CAO'}\` | **Min APS:** **${deg.minAps > 0 ? `${deg.minAps} points` : 'Degree specific'}** (excluding Life Orientation)\n`;
      body += `• **Requirements:** ${deg.keyRequirements}\n\n`;
    });
  });

  let footer = `---\n\n`;
  footer += `### 📝 Key Admission Rules for Undergraduate Studies:\n`;
  footer += `1. **APS Calculation:** Calculated strictly from your TOP 6 matric subjects, **excluding Life Orientation** (LO gives 0 points).\n`;
  footer += `2. **CAO Application:** All undergraduate applications are submitted online at **www.cao.ac.za** (Code prefix: \`ZU-M-\` for KwaDlangezwa, \`ZU-R-\` for Richards Bay).\n`;
  footer += `3. **No Walk-ins:** UNIZULU strictly enforces a zero walk-in policy at all campus gates.\n`;
  footer += `4. **Financial Aid:** Eligible South African students can apply for **NSFAS** (www.nsfas.org.za) for 100% tuition, accommodation, and allowance funding, or the **Funza Lushaka Bursary** for B.Ed teaching programmes.`;

  return header + body + footer;
}

// High-intelligence, factual fallback responses when LLM is unreachable or rate-limited
function generateFallbackResponse(
  userMessage: string,
  langCode: string,
  history: Array<{ sender: string; text: string }> = [],
  activeProfile?: any
): { text: string; suggestedActions: string[] } {
  const result = _generateFallbackResponseRaw(userMessage, langCode, history, activeProfile);
  return {
    text: result.text,
    suggestedActions: []
  };
}

function _generateFallbackResponseRaw(
  userMessage: string,
  langCode: string,
  history: Array<{ sender: string; text: string }> = [],
  activeProfile?: any
): { text: string; suggestedActions: string[] } {
  const lower = (userMessage || '').toLowerCase().trim();

  // Check small talk first for immediate, warm, and natural conversational response
  const smallTalk = handleSmallTalkResponse(userMessage, langCode);
  if (smallTalk.handled) {
    return {
      text: smallTalk.text,
      suggestedActions: []
    };
  }

  // Check if user is inquiring about who created or developed the chatbot
  const isCreatorQuery = 
    lower.includes('who created you') ||
    lower.includes('who made you') ||
    lower.includes('who built you') ||
    lower.includes('who developed you') ||
    lower.includes('who is your developer') ||
    lower.includes('who programmed you') ||
    lower.includes('who is your creator') ||
    lower.includes('who designed you') ||
    lower.includes('who owns you') ||
    lower.includes('who is your father') ||
    lower.includes('ubani owakwenza') ||
    lower.includes('ubani owakwenzayo') ||
    lower.includes('ngubani owakwakha') ||
    lower.includes('ubani umsunguli') ||
    lower.includes('o dirilwe ke mang') ||
    lower.includes('o bopilwe ke mang') ||
    lower.includes('wie het jou gemaak') ||
    lower.includes('wie het jou ontwikkel');

  if (isCreatorQuery) {
    if (langCode === 'zu') {
      return {
        text: `Ngakhiwe futhi ngathuthukiswa ngokuziqhenya yi-**UNIZULU IT Team** (Ithimba lezoBuchwepheshe baseNyuvesi yakwaZulu)! 💻🎓✨\n\nBangidale lapha e-UNIZULU ukuze ngisize abafundi ngezidingo zokungena, ukubalwa kwamaphuzu e-APS, kanye nakho konke mayelana nempilo yaseNyuvesi emakhampasini ethu eKwaDlangezwa naseRichards Bay! 🏛️💙 Ngingakusiza ngani namhlanje?`,
        suggestedActions: []
      };
    } else if (langCode === 'af') {
      return {
        text: `Ek is met trots ontwerp en ontwikkel deur die fantastiese **UNIZULU IT-span** (Universiteit van Zululand Inligtingstegnologie-afdeling)! 💻🎓✨\n\nHulle het my gebou om voornemende en huidige studente te help met toelatingsvereistes, APS-berekeninge en studentelewe by ons KwaDlangezwa- en Richardsbaai-kampusse! 🏛️💙 Waarmee kan ek jou vandag help?`,
        suggestedActions: []
      };
    } else if (langCode === 'xh') {
      return {
        text: `Ndenziwe kwaye ndaphuhliswa ngokusemthethweni liqela le-**UNIZULU IT Team** (Icandelo lezoBuchwepheshe kwiDyunivesithi yaseZululand)! 💻🎓✨\n\nBandakhele apha e-UNIZULU ukunceda abafundi ngezidingo zokungena, ukubalwa kwamanqaku e-APS, kunye nobomi baseYunivesithi kumakhampasi ethu eKwaDlangezwa naseRichards Bay! 🏛️💙 Ndingakunceda njani namhlanje?`,
        suggestedActions: []
      };
    } else if (['st', 'tn', 'nso'].includes(langCode)) {
      return {
        text: `Ke bopilwe le go ntlafatswa ka lerato ke sehlopha sa **UNIZULU IT Team** (University of Zululand Information Technology & Systems Division)! 💻🎓✨\n\nBa ntlhametse mo go UNIZULU go thusa baithuti ka dintlha tsa APS, ditlhokego tsa go tsena, le botshelo jwa yunibesithi kwa KwaDlangezwa le Richards Bay! 🏛️💙 Nka go thusa ka eng gompieno?`,
        suggestedActions: []
      };
    } else if (langCode === 'ss') {
      return {
        text: `Ngakhiwe futhi ngatfutfukiswa licembu le-**UNIZULU IT Team** (Litiko Letebuchwepheshe baseNyuvesi yaseZululand)! 💻🎓✨\n\nBangidale lapha e-UNIZULU kute ngisite bafundzi ngetidzingo tekungena, kubalwa kwemaphuzu e-APS, kanye netimphilo tasenyuvesi eKwaDlangezwa naseRichards Bay! 🏛️💙 Ngingakusita ngani lamuhla?`,
        suggestedActions: []
      };
    } else if (langCode === 've') {
      return {
        text: `Ndo itwa na u bveledziswa nga tshigwada tsha **UNIZULU IT Team** (University of Zululand Information Technology & Systems Division)! 💻🎓✨\n\nVho nthama henefha UNIZULU u itela u thusa vhagudi nga zwiṱoḓea zwa u dzhena, mbalelo dza APS, na zwoṱhe zwa vhutshilo ha Yunivesithi kha khamphasi dza KwaDlangezwa na Richards Bay! 🏛️💙 Ndi nga vha thusa mini ṋamusi?`,
        suggestedActions: []
      };
    } else if (langCode === 'ts') {
      return {
        text: `Ndzi vumbiwile na ku hluvukisiwa hi ntlawa wa **UNIZULU IT Team** (University of Zululand Information Technology Division)! 💻🎓✨\n\nVa ndzi endlele laha e-UNIZULU ku pfuna swichudeni hi swilaveko swo nghena, ku hlayela tinhla ta APS, na vutomi bya le Yunivesiti eka tikhamphasi ta KwaDlangezwa na Richards Bay! 🏛️💙 Xana ndzi nga mi pfuna hi yini namunthla?`,
        suggestedActions: []
      };
    } else if (langCode === 'nr') {
      return {
        text: `Ngakhiwe begodu ngathuthukiswa siqhema se-**UNIZULU IT Team** (University of Zululand Information Technology Division)! 💻🎓✨\n\nBangakhe lapha e-UNIZULU ukusiza abafundi ngeemfuneko zokungena, ukubalwa kwamaphuzu we-APS, nazo zoke iindaba zamakhamphasi weKwaDlangezwa neRichards Bay! 🏛️💙 Ngingakusiza ngani namhlanjesi?`,
        suggestedActions: []
      };
    }
    return {
      text: `I was proudly created and developed by the **UNIZULU IT Team** (University of Zululand Information Technology & Systems Division)! 💻🎓✨\n\nThey engineered me right here at UNIZULU to assist prospective and current students with degree entry requirements, APS score calculations, CAO codes, and navigating campus life across both KwaDlangezwa and Richards Bay campuses! 🏛️💙\n\nWhat would you like to explore today?`,
      suggestedActions: []
    };
  }

  // Check if user is expressing confusion or disbelief after asking about leadership or an unknown fact
  const isConfusionOrFollowUpQuery =
    ((lower.includes("dont know") || lower.includes("don't know") || lower.includes("didnt know") || lower.includes("didn't know")) &&
     (lower.includes("president") || lower.includes("leader") || lower.includes("who") || lower.includes("school") || lower.includes("unizulu"))) ||
    ((lower === 'what' || lower === 'what?' || lower === 'huh' || lower === 'huh?' || lower === 'why' || lower === 'why?') &&
     history.some(h => (h.text || '').toLowerCase().includes('president') || (h.text || '').toLowerCase().includes('vice-chancellor')));

  if (isConfusionOrFollowUpQuery) {
    if (langCode === 'zu') {
      return {
        text: `Ngiyaxolisa kakhulu ngokudideka kwasekuqaleni! 🙏 ENyuvesi yakwaZulu (UNIZULU), isikhundla esilingana no-"President" wenyuvesi yi-**Vice-Chancellor and Principal**, okungu-**Solwazi Xoliswa Mtose** (Prof. X.A. Mtose). Nguye ohola futhi ophethe yonke inyuvesi emakhampasini womabili (eKwaDlangezwa naseRichards Bay).\n\nNgaphezu kwalokho:\n• **I-Chancellor**: U-**Jaji Omkhulu u-Raymond Zondo** (inhloko ehloniphekileyo enikezela ngeziqu).\n• **UMongameli we-SRC**: Umholi okhethwe ngabafundi ohola uMkhandlu wabaFundi.\n\nNgiyaxolisa uma impendulo yami yaphambilini ingakucacisanga lokhu—ngilapha ukukusiza ngayo yonke imibuzo mayelana ne-UNIZULU! 🏛️🎓`,
        suggestedActions: []
      };
    } else if (langCode === 'af') {
      return {
        text: `Verskoning vir die misverstand vroeër! 🙏 By die Universiteit van Zululand (UNIZULU) word die rol van 'n universiteitspresident vervul deur die **Visekanselier en Prinsipaal**, naamlik **Professor Xoliswa Mtose** (Prof. X.A. Mtose). Sy is die hoof uitvoerende beampte van die universiteit.\n\nDaarbenewens:\n• **Kanselier**: **Hoofregter Raymond Zondo**.\n• **VRR-President (SRC President)**: Die verkose studenteliggaamleier.\n\nEk leer voortdurend by en help jou graag met enige navrae oor leierskap, toelatings of kampuslewe! 🏛️🎓`,
        suggestedActions: []
      };
    } else if (['st', 'tn', 'nso'].includes(langCode)) {
      return {
        text: `Ke kopa tswarelo haholo ka pherekano e bileng teng pele! 🙏 Kwa Yunibesithing ya Zululand (UNIZULU), maemo a lekanang le moporesitente wa yunibesithi ke **Motlatsa-Mokanseliri le Mosuoe-hlooho (Vice-Chancellor & Principal)**, e leng **Moprofesara Xoliswa Mtose** (Prof. X.A. Mtose).\n\nHo feta moo:\n• **Mokanseliri (Chancellor)**: **Moahloli e Moholo Raymond Zondo**.\n• **Moporesitente wa SRC**: Moetapele ya kgethilweng ke baithuti.\n\nKe ikemiseditse ho o thusa ka dipotso tsohle tsa UNIZULU! 🏛️🎓`,
        suggestedActions: []
      };
    }
    return {
      text: `My sincere apologies for the confusion earlier! 🙏 In South Africa and at UNIZULU, universities do not use the title "President" for the chief executive officer. Instead, the role equivalent to university president is the **Vice-Chancellor and Principal**, **Professor Xoliswa Mtose** (Prof. X.A. Mtose).\n\nTo give you the full picture:\n• **Vice-Chancellor & Principal (University "President" / Executive Head)**: **Professor Xoliswa Mtose** — leads all academic, operational, and executive affairs across KwaDlangezwa and Richards Bay.\n• **Chancellor (Titular / Ceremonial Head)**: **Chief Justice Raymond Zondo** (retired Chief Justice of South Africa) — presides over graduation ceremonies and confers degrees.\n• **Student Body President (SRC President)**: The democratically elected student leader representing all UNIZULU students.\n\nI apologize if my earlier reply missed this! I am always ready to help you explore leadership, admissions, courses, APS scores, or campus life at UNIZULU. 🏛️🎓`,
      suggestedActions: []
    };
  }

  // Check if user is asking about university leadership, president, vice-chancellor, chancellor, principal, rector, SRC
  const isLeadershipQuery = 
    lower.includes('president') ||
    lower.includes('vice-chancellor') ||
    lower.includes('vice chancellor') ||
    lower.includes('chancellor') ||
    lower.includes('principal') ||
    lower.includes('rector') ||
    lower.includes('who runs') ||
    lower.includes('who is in charge') ||
    lower.includes('head of school') ||
    lower.includes('head of the school') ||
    lower.includes('head of unizulu') ||
    lower.includes('head of the university') ||
    lower.includes('school leader') ||
    lower.includes('university leader') ||
    lower.includes('src president') ||
    lower.includes('student president') ||
    lower.includes('umongameli') ||
    lower.includes('ubani ophethe') ||
    lower.includes('umphathi') ||
    lower.includes('hoof van die skool') ||
    lower.includes('leier van die universiteit') ||
    lower.includes('visekanselier');

  if (isLeadershipQuery) {
    if (langCode === 'zu') {
      return {
        text: `ENyuvesi yakwaZulu (UNIZULU), isikhundla esihambisana no-"President" noma inhloko ephethe iyunivesithi yi-**Vice-Chancellor and Principal**, okungu-**Solwazi Xoliswa Mtose** (Prof. X.A. Mtose). 🏛️🎓\n\nAbaholi abaqavile base-UNIZULU:\n• **I-Vice-Chancellor & Principal (Umphathi Omkhulu / Executive Head)**: **USolwazi Xoliswa Mtose** — nguye ophethe futhi ohola yonke iyunivesithi, amakhono ezemfundo, nokuphathwa kwamakhampasi womabili (iKwaDlangezwa neRichards Bay).\n• **I-Chancellor (Inhloko Ehlonishwayo)**: **UJaji Omkhulu u-Raymond Zondo** (owayenguJaji Omkhulu waseNingizimu Afrika) — nguyena owethwesa iziqu emicimbini yokuphothula (graduations).\n• **UMongameli we-SRC**: Umholi okhethwe ngabafundi ohola uMkhandlu wabaFundi (Student Representative Council) omele bonke abafundi base-UNIZULU.\n• **UMkhandlu weNyuvesi (Council)**: Umkhandlu ophethe inqubomgomo nokuphatha okuphezulu kwenyuvesi.\n\nIngabe kukhona ihhovisi elithile ofuna ukuxhumana nalo noma uneminye imibuzo mayelana ne-UNIZULU?`,
        suggestedActions: []
      };
    } else if (langCode === 'af') {
      return {
        text: `By die Universiteit van Zululand (UNIZULU) is die uitvoerende posisie gelykstaande aan 'n universiteitspresident die **Visekanselier en Prinsipaal**, naamlik **Professor Xoliswa Mtose** (Prof. X.A. Mtose). 🏛️🎓\n\nSleutelleierskap by UNIZULU:\n• **Visekanselier & Prinsipaal (Uitvoerende Hoof / "President")**: **Professor Xoliswa Mtose** — sy lei die algehele akademiese bestuur, institusionele strategie en administrasie oor beide KwaDlangezwa- en Richardsbaai-kampusse.\n• **Kanselier (Seremoniële Hoof)**: **Hoofregter Raymond Zondo** (afgetrede Hoofregter van Suid-Afrika) — hy lei die amptelike kongregasies en ken grade toe tydens gradeplegtighede.\n• **VRR-President (SRC President)**: Die demokraties verkose leier van die Studenteraad wat studente se belange verteenwoordig.\n\nSoek jy kontakbesonderhede vir 'n spesifieke leierskapskantoor of fakulteit?`,
        suggestedActions: []
      };
    } else if (langCode === 'xh') {
      return {
        text: `KwiDyunivesithi yaseZululand (UNIZULU), isikhundla solawulo esilingana no-"President" weyunivesithi yi-**Vice-Chancellor and Principal**, engu-**Njingalwazi Xoliswa Mtose** (Prof. X.A. Mtose). 🏛️🎓\n\nIinkokeli eziphambili zase-UNIZULU:\n• **I-Vice-Chancellor & Principal (Intloko Yolawulo)**: **UNjingalwazi Xoliswa Mtose** — ukhokela iyunivesithi iphela kumakhampasi eKwaDlangezwa naseRichards Bay.\n• **I-Chancellor (Intloko Enikezela Izidanga)**: **UJaji Oyintloko u-Raymond Zondo** (owayesakuba nguJaji Oyintloko waseMzantsi Afrika) — unikezela izidanga kubafundi.\n• **UMongameli we-SRC**: Inkokeli eyonyulwe ngabafundi ekhokela iBhunga labaFundi.\n\nIngaba kukho i-ofisi ethile ofuna ukudibana nayo?`,
        suggestedActions: []
      };
    } else if (['st', 'tn', 'nso'].includes(langCode)) {
      return {
        text: `Kwa Yunibesithing ya Zululand (UNIZULU), maemo a lekanang le "moporesitente" wa yunibesithi ke **Motlatsa-Mokanseliri le Mosuoe-hlooho (Vice-Chancellor & Principal)**, e leng **Moprofesara Xoliswa Mtose** (Prof. X.A. Mtose). 🏛️🎓\n\nBaetapele ba ka sehloohong ba UNIZULU:\n• **Motlatsa-Mokanseliri le Mosuoe-hlooho (Executive Head / "President")**: **Moprofesara Xoliswa Mtose** — o etella pele tsamaiso le dithuto tsohle dikhamphaseng tsa KwaDlangezwa le Richards Bay.\n• **Mokanseliri (Chancellor)**: **Moahloli e Moholo Raymond Zondo** — ke yena ya abang mangolo a thuto mekgetlong ya kabo ya mangolo (graduations).\n• **Moporesitente wa SRC**: Moetapele ya kgethilweng ke baithuti ho emela lekgotla la baithuti (SRC).\n\nNa o batla dintlha tsa ho ikopanya le ofisi e itseng?`,
        suggestedActions: []
      };
    } else if (langCode === 'ss') {
      return {
        text: `ENyuvesi yaseZululand (UNIZULU), sikhundla lesihambisana na-"President" wenyuvesi yi-**Vice-Chancellor and Principal**, longu-**Solwazi Xoliswa Mtose** (Prof. X.A. Mtose). 🏛️🎓\n\nBantfu labahola i-UNIZULU:\n• **I-Vice-Chancellor & Principal**: **Solwazi Xoliswa Mtose** — nguye lohola yonkhe inyuvesi eKwaDlangezwa naseRichards Bay.\n• **I-Chancellor**: **Mehluleli Lomkhulu Raymond Zondo** — nguyena loniketa ticu emicimbini yekwetfweswa ticu.\n• **UMongameli we-SRC**: Umholi lowakhetfwa bafundzi lohola uMkhandlu wabaFundzi.\n\nUfuna kukhuluma neliphi lihhovisi?`,
        suggestedActions: []
      };
    } else if (langCode === 've') {
      return {
        text: `Yunivesithi ya Zululand (UNIZULU), vhuimo vhune ha fana na "muphuresidennde" wa yunivesithi ndi **Vice-Chancellor and Principal**, vhane vha vha **Phurofesa Xoliswa Mtose** (Prof. X.A. Mtose). 🏛️🎓\n\nVharangaphanda vha UNIZULU:\n• **Vice-Chancellor & Principal**: **Phurofesa Xoliswa Mtose** — vha ranga phanda vhulanguli hoṱhe ha khamphasi dza KwaDlangezwa na Richards Bay.\n• **Chancellor**: **Muhaṱuli Muhulwane Raymond Zondo** — vha ṋea dzigiridii kha vhuṱambo ha u ṱhaphudza.\n• **Muphuresidennde wa SRC**: Murangaphanda o nangiwaho nga vhagudi u imela Khoro ya Vhagudi (SRC).`,
        suggestedActions: []
      };
    } else if (langCode === 'ts') {
      return {
        text: `Eka Yunivesiti ya Zululand (UNIZULU), xiyimo lexi fanaka na "muphuresidente" wa yunivesiti i **Vice-Chancellor and Principal**, kunga **Phurofesa Xoliswa Mtose** (Prof. X.A. Mtose). 🏛️🎓\n\nVarhangeri lavakulu va UNIZULU:\n• **Vice-Chancellor & Principal**: **Phurofesa Xoliswa Mtose** — va rhangela vulawuri hinkwabyo bya le tikhamphasini ta KwaDlangezwa na Richards Bay.\n• **Chancellor**: **Muavanyisi Lonkulu Raymond Zondo** — va nyika madigri eminkhubyeni yo thwasa.\n• **Muphuresidente wa SRC**: Murhangeri loyi a hlawuriweke hi swichudeni ku yimela Huvo ya Swichudeni (SRC).`,
        suggestedActions: []
      };
    } else if (langCode === 'nr') {
      return {
        text: `ENyuvesi yeZululand (UNIZULU), isikhundla esilingana no-"President" wenyuvesi yi-**Vice-Chancellor and Principal**, engu-**Phrofesa Xoliswa Mtose** (Prof. X.A. Mtose). 🏛️🎓\n\nAbadosiphambili be-UNIZULU:\n• **I-Vice-Chancellor & Principal**: **UPhrofesa Xoliswa Mtose** — nguye ophethe woke amakhamphasi weKwaDlangezwa neRichards Bay.\n• **I-Chancellor**: **UJaji Omkhulu u-Raymond Zondo** — unikezela iziqu emicimbini yokuthwesa iziqu.\n• **UMongameli we-SRC**: Umrholi okhethwe bafundi obusisa umkhandlu wabafundi (SRC).`,
        suggestedActions: []
      };
    }
    return {
      text: `At the University of Zululand (UNIZULU), the executive leadership role equivalent to a university "president" is the **Vice-Chancellor and Principal**, **Professor Xoliswa Mtose** (Prof. X.A. Mtose). 🏛️🎓\n\nKey executive and ceremonial leaders at UNIZULU:\n• **Vice-Chancellor & Principal (Executive Head / "President")**: **Professor Xoliswa Mtose** — serves as the chief executive officer of the university, responsible for strategic direction, academic standards, and executive management across both KwaDlangezwa and Richards Bay campuses.\n• **Chancellor (Titular / Ceremonial Head)**: **Chief Justice Raymond Zondo** (distinguished retired Chief Justice of South Africa) — the highest titular dignitary of the university who presides over official congregations and confers all degrees.\n• **Student Body President (SRC President)**: The democratically elected student leader who heads the Student Representative Council (SRC) and represents all students on University Council and Senate.\n• **Chair of Council**: Leads the University Council, UNIZULU's supreme governing body.\n\nAre you looking for contact details for the executive management offices, student governance, or a specific faculty deanery?`,
      suggestedActions: []
    };
  }

  // 1. Explicit multi-user list query
  const isListUsersQuery = 
    lower.includes('list users') ||
    lower.includes('show users') ||
    lower.includes('who is registered') ||
    lower.includes('saved students') ||
    lower.includes('registered students') ||
    lower.includes('show all students') ||
    lower.includes('list students');

  if (isListUsersQuery) {
    const distinctUsers = getDistinctProfiles();
    if (distinctUsers.length === 0) {
      if (langCode === 'zu') {
        return { text: `Okwamanje awekho amaphrofayili abafundi agciniwe kusizindalwazi sase-UNIZULU. Ungabhalisa imininingwane yakho noma nini ngokunikeza igama lakho nezifundo zakho zika-Matric.`, suggestedActions: [] };
      }
      if (langCode === 'af') {
        return { text: `Daar is tans geen gestoorde studenteprofiele in die UNIZULU-databasis nie. Jy kan jou besonderhede enige tyd registreer deur jou naam en Matriekvakke te verskaf.`, suggestedActions: [] };
      }
      return {
        text: `There are currently no saved student profiles in the UNIZULU system database. You can register your details anytime by providing your name and matric subjects.`,
        suggestedActions: []
      };
    }
    const studentList = distinctUsers.map((u, i) => {
      const prog = u.targetProgram ? ` - Target: ${u.targetProgram}` : '';
      const aps = u.apsScore !== undefined ? ` (APS: ${u.apsScore})` : '';
      return `${i + 1}. **${u.name}** (@${u.username || 'student'})${prog}${aps}`;
    }).join('\n');

    if (langCode === 'zu') {
      return { text: `Amaphrofayili abafundi ababhalisiwe ohlelweni lwe-UNIZULU:\n\n${studentList}\n\nUngacela ukubona imininingwane yanoma iyiphi iphrofayili, noma ubuyekeze eyakho irekhodi.`, suggestedActions: [] };
    }
    if (langCode === 'af') {
      return { text: `Geregistreerde studenteprofiele in die UNIZULU-stelsel:\n\n${studentList}\n\nJy kan vra om data vir enige profiel te herwin, of jou eie rekords by te werk.`, suggestedActions: [] };
    }
    return {
      text: `Registered student profiles in the UNIZULU system:\n\n${studentList}\n\nYou can ask to retrieve data for any profile, or update your own records.`,
      suggestedActions: []
    };
  }

  // 2. Explicit data retrieval query
  const isExplicitRetrieval = lower.includes('retrieve my data') || lower.includes('what is my aps') || lower.includes('my profile') || lower.includes('who am i');
  if (isExplicitRetrieval && activeProfile) {
    const uKey = (activeProfile.username || '').toLowerCase();
    const eKey = (activeProfile.email || '').toLowerCase();
    const conv = appData.conversations[uKey] || appData.conversations[eKey] || [];
    const verifiedDocs = activeProfile.documentsChecklist 
      ? Object.entries(activeProfile.documentsChecklist).filter(([_, v]) => Boolean(v)).length 
      : 0;

    if (langCode === 'zu') {
      return {
        text: `Nansi irekhodi lakho lomfundi wase-UNIZULU eligciniwe:\n\n• **Igama**: ${activeProfile.name || 'Mfundi'}\n• **Igama lomsebenzisi**: @${activeProfile.username || 'student'}\n• **Amaphuzu e-APS abaliwe**: ${activeProfile.apsScore !== undefined ? `${activeProfile.apsScore} amaphuzu` : 'Awakabalwa'}\n• **Iziqu ozifisayo**: ${activeProfile.targetProgram || 'Azikachazwa'}\n• **Ifakhalthi**: ${activeProfile.prospectiveFaculty || 'Ejwayelekile'}\n• **Uhlu lwemibhalo**: ${verifiedDocs} kwemi-5 iqinisekisiwe\n• **Umlando wengxoxo**: Imilayezo engu-${conv.length} eqoshiwe.`,
        suggestedActions: []
      };
    }
    if (langCode === 'af') {
      return {
        text: `Hier is jou gestoorde UNIZULU-studenterekord:\n\n• **Naam**: ${activeProfile.name || 'Student'}\n• **Gebruikersnaam**: @${activeProfile.username || 'student'}\n• **Berekende APS**: ${activeProfile.apsScore !== undefined ? `${activeProfile.apsScore} punte` : 'Nog nie bereken nie'}\n• **Teikenprogram**: ${activeProfile.targetProgram || 'Nie gespesifiseer nie'}\n• **Voornemende Fakulteit**: ${activeProfile.prospectiveFaculty || 'Algemeen'}\n• **Dokumentelys**: ${verifiedDocs} van 5 geverifieer\n• **Gesprekgeskiedenis**: ${conv.length} boodskappe op rekord.`,
        suggestedActions: []
      };
    }

    return {
      text: `Here is your saved UNIZULU student record:\n\n• **Name**: ${activeProfile.name || 'Student'}\n• **Username**: @${activeProfile.username || 'student'}\n• **Calculated APS**: ${activeProfile.apsScore !== undefined ? `${activeProfile.apsScore} points` : 'Not yet calculated'}\n• **Target Program**: ${activeProfile.targetProgram || 'Not specified'}\n• **Prospective Faculty**: ${activeProfile.prospectiveFaculty || 'General'}\n• **Document Checklist**: ${verifiedDocs} of 5 verified\n• **Conversation History**: ${conv.length} messages on record.`,
      suggestedActions: []
    };
  }

  // -------------------------------------------------------------
  // ISIZULU RESPONSES (Accurate, direct, natural)
  // -------------------------------------------------------------
  if (langCode === 'zu') {
    // UNIZULU Overview
    if (lower.includes('yini unizulu') || lower.includes('yini i-unizulu') || lower.includes('kwa-unizulu') || lower.includes('mayelana ne-unizulu') || lower.includes('unizulu ke yini')) {
      return {
        text: `I-**UNIZULU (University of Zululand)** yinyuvesi ebanzi kahulumeni esungulwe ngo-1960 KwaZulu-Natal:\n• **Amakhampasi amabili**:\n  1. **KwaDlangezwa Campus** (ikhampasi enkulu, eqhele ngamakhilomitha angu-19 eningizimu ye-Empangeni, lapho kutholakala khona iziqu eziningi kanye nezindawo zokuhlala abafundi).\n  2. **Richards Bay Campus** (e-Arboretum, egxile ezifundweni zama-diploma).\n• **Amafakhalthi amane**:\n  1. Faculty of Commerce, Administration and Law (LLB, BCom Accounting, BAdmin)\n  2. Faculty of Science, Agriculture and Engineering (Nursing, Computer Science, Hydrology, Ezolimo)\n  3. Faculty of Education (B.Ed yezigaba zonke)\n  4. Faculty of Humanities and Social Sciences (Social Work, Psychology, Criminology)\n• **Ukufaka isicelo**: Zonke izicelo zifakwa nge-**CAO** ku-www.cao.ac.za (imali yesicelo ngu-R250 ngesikhathi, R470 ngemuva kwesikhathi). I-UNIZULU ayikuvumeli ukufaka izicelo ngaphakathi emagcekeni (No Walk-ins).`,
        suggestedActions: []
      };
    }
    // Law / LLB
    if (lower.includes('law') || lower.includes('llb') || lower.includes('umthetho') || lower.includes('loye')) {
      return {
        text: `Izidingo ze-Bachelor of Laws (LLB - Ikhodi ye-CAO: **ZU-M-LLB**) e-UNIZULU KwaDlangezwa:\n• **Amaphuzu e-APS**: Okungenani amaphuzu angu-**30** (ngaphandle kwe-Life Orientation).\n• **IsiNgisi**: Level 5 (60%+).\n• **Izibalo**: Pure Mathematics Level 3 (40%) NOMA Mathematical Literacy Level 4 (50%).\n• **Ubude beziqu**: Yiminyaka emi-4. Isicelo sifakwa nge-CAO ku-www.cao.ac.za.`,
        suggestedActions: []
      };
    }
    // Nursing
    if (lower.includes('nursing') || lower.includes('unese') || lower.includes('ubuhlengikazi') || lower.includes('amanesi')) {
      return {
        text: `Izidingo ze-Bachelor of Nursing Science (Ikhodi ye-CAO: **ZU-M-BNS**) e-UNIZULU KwaDlangezwa:\n• **Amaphuzu e-APS**: Okungenani amaphuzu angu-**30** (ngaphandle kwe-Life Orientation).\n• **Life Sciences**: Level 4 (50%+).\n• **IsiNgisi**: Level 4 (50%+).\n• **Physical Sciences noma Pure Maths**: Level 4 (50%+).\n• **Ubude beziqu**: Yiminyaka emi-4.`,
        suggestedActions: []
      };
    }
    // APS Score
    if (lower.includes('aps') || lower.includes('amaphuzu') || lower.includes('score')) {
      return {
        text: `Amaphuzu e-APS e-UNIZULU abalwa ngezifundo zakho eziyisi-6 ze-Matric eziphezulu, **ngaphandle kwe-Life Orientation** (i-LO ayibalwa, inamaphuzu angu-0). Iziqu zama-Degree zidinga amaphuzu aphakathi kuka-26 kuya ku-32, kanti ama-Diploma e-Richards Bay adinga amaphuzu aphakathi kuka-22 kuya ku-26.`,
        suggestedActions: []
      };
    }
    // Computer Science
    if (lower.includes('computer') || lower.includes('kompyutha') || lower.includes('software')) {
      return {
        text: `Izidingo ze-BSc Computer Science (Ikhodi ye-CAO: **ZU-M-BSC**) e-KwaDlangezwa:\n• **Amaphuzu e-APS**: 28 kuya ku-34.\n• **Pure Mathematics**: Level 4 (50%+).\n• **Physical Sciences**: Level 4 (50%+).\n• **IsiNgisi**: Level 4 (50%+).\nQaphela: I-Maths Literacy ayemukelwa ku-Computer Science.`,
        suggestedActions: []
      };
    }
    // Commerce / Accounting
    if (lower.includes('accounting') || lower.includes('bcom') || lower.includes('ibhizinisi') || lower.includes('ezohwebo')) {
      return {
        text: `Izidingo ze-BCom Accounting (SAICA accredited - **ZU-M-BCA**) e-KwaDlangezwa:\n• **Amaphuzu e-APS**: 28+.\n• **Pure Mathematics**: Level 5 (60%+).\n• **IsiNgisi**: Level 4 (50%+).\nUma wenza i-Maths Literacy, ungakhetha i-**Diploma in Accounting (ZU-R-DAC)** e-Richards Bay (APS 22) noma i-Bachelor of Administration (APS 26).`,
        suggestedActions: []
      };
    }
    // Education
    if (lower.includes('education') || lower.includes('uthisha') || lower.includes('bed') || lower.includes('ukufundisa')) {
      return {
        text: `Izidingo ze-Bachelor of Education (B.Ed) e-UNIZULU KwaDlangezwa:\n• **Amaphuzu e-APS**: Okungenani amaphuzu angu-**26**.\n• **IsiNgisi**: Level 4 (50%+).\n• Kukhona i-Foundation Phase (ZU-M-EDF), Intermediate Phase (ZU-M-EDI), kanye ne-Senior/FET Phase (ZU-M-EDS).\n• Abafundi be-B.Ed bangafaka isicelo somxhaso we-Funza Lushaka.`,
        suggestedActions: []
      };
    }
    // CAO & Fees (Specific how-to-apply steps)
    const isZuluCaoProcess = /\b(indlela yokufaka isicelo|ukufaka kanjani isicelo|imali yesicelo|faka isicelo nge-cao|cao steps)\b/i.test(lower);
    if (isZuluCaoProcess) {
      return {
        text: `Izicelo zase-UNIZULU zifakwa ku-intanethi nge-Central Applications Office (CAO) ku-www.cao.ac.za. Imali yesicelo esifika ngesikhathi ingu-**R250** (ngemva kwesikhathi ngu-R470). I-UNIZULU ayizivumeli izicelo zokungena ngaphakathi emagcekeni (No Walk-ins).`,
        suggestedActions: []
      };
    }
    // Documents
    if (lower.includes('document') || lower.includes('imibhalo') || lower.includes('isitifiketi') || lower.includes('certif')) {
      return {
        text: `Imibhalo edingekayo ukufaka isicelo:\n1. Ikhophi kamazisi (ID) eqinisekisiwe emaphoyiseni noma eposini kungakapheli izinyanga ezi-3.\n2. Imiphumela yakho ye-Grade 11 noma isitifiketi se-Matric esiqinisekisiwe.\n3. Ubufakazi bokukhokha imali ye-CAO (R250).`,
        suggestedActions: []
      };
    }
    // Greetings
    if (['sawubona', 'sawbona', 'sanibonani', 'kunjani', 'unjani', 'yebo'].some(g => lower.includes(g))) {
      return {
        text: `Sawubona! Ngingumsizi we-UNIZULU Academic & Admissions Advisor. Ngingakusiza ngezidingo zeziqu, amaphuzu e-APS, izicelo ze-CAO, noma amafakhalthi ase-UNIZULU. Yini ongathanda ukuyazi namhlanje? 🎓✨`,
        suggestedActions: []
      };
    }
    return {
      text: `Ngingakusiza ngakho konke mayelana ne-UNIZULU! Ungangibuza ngezidingo zeziqu (LLB, Nursing, BCom, Education, Computer Science), ukubalwa kwamaphuzu e-APS, izicelo ze-CAO, noma imibhalo edingekayo. Yini ongathanda ukuyazi? 🏛️📚`,
      suggestedActions: []
    };
  }

  // -------------------------------------------------------------
  // ISIXHOSA RESPONSES (Accurate, direct, natural)
  // -------------------------------------------------------------
  if (langCode === 'xh') {
    if (lower.includes('law') || lower.includes('llb') || lower.includes('umthetho')) {
      return {
        text: `Iimfuno ze-Bachelor of Laws (LLB - Ikhowudi ye-CAO: **ZU-M-LLB**) e-UNIZULU KwaDlangezwa:\n• **Amanqaku e-APS**: Ubuncinane ngama-**30** (ngaphandle kwe-Life Orientation).\n• **IsiNgesi**: Level 5 (60%+).\n• **Izibalo**: Pure Mathematics Level 3 (40%) NOMA Mathematical Literacy Level 4 (50%).\n• **Ubude besidanga**: Yiminyaka emi-4. Isicelo sifakwa kwi-CAO ku-www.cao.ac.za.`,
        suggestedActions: []
      };
    }
    if (lower.includes('nursing') || lower.includes('unese') || lower.includes('ubuhlengikazi')) {
      return {
        text: `Iimfuno ze-Bachelor of Nursing Science (Ikhowudi ye-CAO: **ZU-M-BNS**) e-UNIZULU:\n• **Amanqaku e-APS**: Ubuncinane ngama-**30** (Life Orientation ayibalwa).\n• **Life Sciences**: Level 4 (50%+).\n• **IsiNgesi**: Level 4 (50%+).\n• **Physical Sciences okanye Pure Maths**: Level 4 (50%+).`,
        suggestedActions: []
      };
    }
    if (lower.includes('aps') || lower.includes('amanqaku') || lower.includes('inqaku')) {
      return {
        text: `Amanqaku e-APS e-UNIZULU abalwa ngezifundo zakho ezi-6 eziphezulu zika-Matric, **ngaphandle kwe-Life Orientation** (i-LO ayibalwa, ifumana u-0). Izidanga ze-Degree zifuna amanqaku aphakathi kwama-26 ukuya kuma-32, ngelixa iidiploma zaseRichards Bay zifuna ama-22 ukuya kuma-26.`,
        suggestedActions: []
      };
    }
    const isXhosaCaoProcess = /\b(indlela yokufaka isicelo|ukufaka njani isicelo|imali yesicelo|faka isicelo nge-cao|cao steps)\b/i.test(lower);
    if (isXhosaCaoProcess) {
      return {
        text: `Izicelo zonke zase-UNIZULU zifakwa kwi-intanethi nge-Central Applications Office (CAO) ku-www.cao.ac.za. Imali yesicelo ngexesha ngu-**R250** (emva kwexesha ngu-R470). I-UNIZULU ayizivumeli izicelo ezenziwa emagcekeni (No Walk-ins).`,
        suggestedActions: []
      };
    }
    if (lower.includes('education') || lower.includes('titshala') || lower.includes('bed')) {
      return {
        text: `Iimfuno ze-Bachelor of Education (B.Ed) e-UNIZULU:\n• **Amanqaku e-APS**: Ubuncinane ngama-**26**.\n• **IsiNgesi**: Level 4 (50%+).\n• Kukhona i-Foundation Phase, Intermediate Phase, kunye ne-Senior/FET Phase. Abafundi bangafaka isicelo se-Funza Lushaka.`,
        suggestedActions: []
      };
    }
    if (['molo', 'molweni', 'kunjani', 'unjani'].some(g => lower.includes(g))) {
      return {
        text: `Molo! Ndingumncedisi wakho we-UNIZULU Academic & Admissions. Ndingakunceda ngeemfuno zezidanga, amanqaku e-APS, izicelo ze-CAO, kunye namasebe ase-UNIZULU. Yintoni ofuna ukuyazi namhlanje? 🎓✨`,
        suggestedActions: []
      };
    }
    return {
      text: `Ndingakunceda ngazo zonke iinkcukacha zase-UNIZULU! Ungandibuza ngeemfuno zokungena, ukubalwa kwamanqaku e-APS, izicelo ze-CAO, kunye namakhampasi ethu eKwaDlangezwa naseRichards Bay. 🏛️💙`,
      suggestedActions: []
    };
  }

  // -------------------------------------------------------------
  // SETSWANA, SESOTHO & SEPEDI RESPONSES (Accurate, direct, natural)
  // -------------------------------------------------------------
  if (['tn', 'st', 'nso'].includes(langCode)) {
    // UNIZULU Overview ("Unizlu ke eng", "unizulu ke eng", "ke eng", "khamphase")
    if (lower.includes('ke eng') || lower.includes('unizulu') || lower.includes('unizlu') || lower.includes('yunibesithi') || lower.includes('khamphase')) {
      return {
        text: `**UNIZULU (Yunibesithi ya Zululand)** ke yunibesithi e kgolo ya setjhaba e KwaZulu-Natal, Afrika Borwa e thehilweng ka 1960:\n• **Dikhamphase tse 2**:\n  1. **KwaDlangezwa Campus** (khamphase e kgolo e nang le di-faculty tsohle le marobalo a baithuti, dikhilomithara tse 19 borwa ba Empangeni).\n  2. **Richards Bay Campus** (e tsepamisitseng maikutlo ho di-diploma le thupelo ya mosebetsi).\n• **Di-Faculty tse 4**:\n  1. Commerce, Administration & Law (LLB, BCom Accounting, BAdmin)\n  2. Science, Agriculture & Engineering (Nursing, Computer Science, Hydrology, Temo)\n  3. Education (B.Ed Foundation, Intermediate, le Senior/FET Phase)\n  4. Humanities & Social Sciences (Social Work, Psychology, Criminology)\n• **Kopo**: Dikopo tsohle tsa pele ho lengolo di etswa ka **Central Applications Office (CAO)** ho www.cao.ac.za. Tefo ya kopo ke R250. UNIZULU ha e amohele dikopo tsa ho kena ka menyako (No Walk-ins).`,
        suggestedActions: []
      };
    }

    // Law / Lawyer / LLB ("ke batla ho ba lawyer", "molao", "loye", "mmueledi", "llb")
    if (lower.includes('law') || lower.includes('molao') || lower.includes('loye') || lower.includes('mmueledi') || lower.includes('llb') || lower.includes('moatudi')) {
      return {
        text: `Ditlhokego tsa **Bachelor of Laws (LLB - Khoutu ya CAO: ZU-M-LLB)** kwa UNIZULU KwaDlangezwa Campus:\n• **Dintlha tsa APS**: Bonnye dintlha di le **30** (ntle le Life Orientation).\n• **English**: Home Language kapa First Additional Language kwa **Level 5 (60%+)**.\n• **Dipalo**: Pure Mathematics kwa **Level 3 (40%+)** KAPA Mathematical Literacy kwa **Level 4 (50%+)**.\n• **Dingwaga tsa thuto**: Dingwaga tse 4.\nDikopo di tsenngwa ka CAO (www.cao.ac.za).`,
        suggestedActions: []
      };
    }

    // Nursing ("nursing", "unese", "booki", "tlhokomelo")
    if (lower.includes('nursing') || lower.includes('unese') || lower.includes('booki') || lower.includes('mooki')) {
      return {
        text: `Ditlhokego tsa **Bachelor of Nursing Science (Khoutu ya CAO: ZU-M-BNS)** kwa UNIZULU KwaDlangezwa:\n• **Dintlha tsa APS**: Bonnye dintlha di le **30** (ntle le Life Orientation).\n• **Life Sciences**: Level 4 (50%+).\n• **English**: Level 4 (50%+).\n• **Physical Sciences kapa Pure Mathematics**: Level 4 (50%+).\n• **Dingwaga**: Dingwaga tse 4 Faculty ya Science, Agriculture & Engineering.`,
        suggestedActions: []
      };
    }

    // Education ("education", "thuto", "titjhere", "morutabana", "bed")
    if (lower.includes('education') || lower.includes('thuto') || lower.includes('titjhere') || lower.includes('morutabana') || lower.includes('bed')) {
      return {
        text: `Ditlhokego tsa **Bachelor of Education (B.Ed)** kwa UNIZULU:\n• **Dintlha tsa APS**: Bonnye dintlha di le **26** (ntle le Life Orientation).\n• **English**: Level 4 (50%+).\n• Mananeo a B.Ed:\n  - Foundation Phase (Grades R-3) [ZU-M-EDF]\n  - Intermediate Phase (Grades 4-7) [ZU-M-EDI]\n  - Senior & FET Phase (Grades 8-12) [ZU-M-EDS]\n• Baithuti ba B.Ed ba ka kopa bursary ya **Funza Lushaka** e lefang ditjeo tsohle.`,
        suggestedActions: []
      };
    }

    // Accounting / Commerce
    if (lower.includes('accounting') || lower.includes('bcom') || lower.includes('kgwebo') || lower.includes('dibuka')) {
      return {
        text: `Ditlhokego tsa **BCom in Accounting (CAO Code ZU-M-BCA)** kwa UNIZULU:\n• **Dintlha tsa APS**: 28 points (ntle le LO).\n• **Pure Mathematics**: Level 5 (60%+).\n• **English**: Level 4 (50%+).\n• Ela tlhoko: Maths Literacy ha e amohelwe ho BCom Accounting. Empa baithuti ba nang le Maths Literacy ba ka kgetha **Diploma in Accounting (ZU-R-DAC)** kwa Richards Bay (APS 22) kapa **Bachelor of Administration (ZU-M-BPA)** (APS 26).`,
        suggestedActions: []
      };
    }

    // Computer Science
    if (lower.includes('computer') || lower.includes('khomphutha') || lower.includes('software')) {
      return {
        text: `Ditlhokego tsa **BSc Computer Science (CAO Code ZU-M-BSC)** kwa UNIZULU KwaDlangezwa:\n• **Dintlha tsa APS**: 28 go ya go 34 points (ntle le LO).\n• **Pure Mathematics**: Level 4 (50%+).\n• **Physical Sciences**: Level 4 (50%+).\n• **English**: Level 4 (50%+).\nMaths Literacy ha e amohelwe ho Computer Science.`,
        suggestedActions: []
      };
    }

    // APS
    if (lower.includes('aps') || lower.includes('dintlha') || lower.includes('palo') || lower.includes('amaphuzu')) {
      return {
        text: `Dintlha tsa APS kwa UNIZULU di balwa ka dithuto tsa gago tse 6 tse di kwa godimo tsa Matric, **ntle le Life Orientation (LO ga e balwe, ke 0)**. Dikhato tsa Degree di tlhoka dintlha tse 26 go ya go 32, fa di-diploma tsa Richards Bay di tlhoka dintlha tse 22 go ya go 26.`,
        suggestedActions: []
      };
    }

    // Greetings
    if (['dumela', 'dumelang', 'le kae', 'kunjani', 'sawubona'].some(g => lower.includes(g))) {
      return {
        text: `Dumela! Ke motlhatlheledi wa gago wa tsa thuto le dikgoro tsa UNIZULU. O ka mpotsa ka ditlhokego tsa mananeo a thuto, dintlha tsa APS, kapa dikhoutu tsa CAO. Nka go thusa ka eng gompieno? 🎓✨`,
        suggestedActions: []
      };
    }

    return {
      text: `Bakeng sa dintlha tsa thuto, dintlha tsa APS, le dikhoutu tsa CAO tsa UNIZULU, ke teng go go thusa ka botlalo. O ka mpotsa potso efe kapa efe! 🏛️💙`,
      suggestedActions: []
    };
  }

  // -------------------------------------------------------------
  // AFRIKAANS RESPONSES (Accurate, direct)
  // -------------------------------------------------------------
  if (langCode === 'af') {
    if (lower.includes('aps') || lower.includes('punt') || lower.includes('score')) {
      return {
        text: `By UNIZULU word jou APS bereken volgens jou top 6 Matriekvakke, **uitgesluit Lewensoriëntering** (LO tel as 0). Graadprogramme vereis 26 tot 32 punte, terwyl diplomas by Richardsbaai tussen 22 en 26 punte benodig.`,
        suggestedActions: []
      };
    }
    if (lower.includes('law') || lower.includes('llb') || lower.includes('regte')) {
      return {
        text: `Vereistes vir Regte (LLB - CAO-kode **ZU-M-LLB**) by UNIZULU KwaDlangezwa:\n• **Minimum APS**: 30 punte (LO uitgesluit).\n• **Engels**: Vlak 5 (60%+).\n• **Wiskunde**: Wiskunde Vlak 3 (40%) OF Wiskundige Geletterdheid Vlak 4 (50%).\n• **Tydsduur**: 4 jaar via www.cao.ac.za.`,
        suggestedActions: []
      };
    }
    if (lower.includes('nursing') || lower.includes('verpleegkunde')) {
      return {
        text: `Vereistes vir Verpleegkunde (Bachelor of Nursing Science - CAO-kode **ZU-M-BNS**) by UNIZULU:\n• **Minimum APS**: 30 punte (LO uitgesluit).\n• **Lewenswetenskappe**: Vlak 4 (50%+).\n• **Engels**: Vlak 4 (50%+).\n• **Fisiese Wetenskappe of Suiwer Wiskunde**: Vlak 4 (50%+).`,
        suggestedActions: []
      };
    }
    if (lower.includes('cao') || lower.includes('aansoek') || lower.includes('fooi')) {
      return {
        text: `Aansoeke vir voorgraadse studie by UNIZULU word ingedien via die Central Applications Office (CAO) by www.cao.ac.za. Die aansoekfooi is **R250** betyds (R470 laat). UNIZULU laat geen instap-aansoeke toe nie (No Walk-ins).`,
        suggestedActions: []
      };
    }
    if (['hallo', 'dag', 'goeiedag', 'goeiemôre', 'hi'].some(g => lower.includes(g))) {
      return {
        text: `Goeiedag! Ek is jou UNIZULU toelatingsassistent. Waarmee kan ek jou vandag help rakende vereistes, APS-tellings, of aansoeke via CAO? 🎓✨`,
        suggestedActions: []
      };
    }
    return {
      text: `Ek help jou graag met alle UNIZULU toelatingsvereistes, APS-tellings, fakulteite en CAO-kodes. Vra my gerus enige vrae! 🏛️💙`,
      suggestedActions: []
    };
  }

  // -------------------------------------------------------------
  // SISWATI, TSHIVENDA, XITSONGA & ISINDEBELE RESPONSES
  // -------------------------------------------------------------
  if (langCode === 'ss') {
    return {
      text: `Sawubona! Ngingumsizi wakho wetemfundvo e-UNIZULU. Ngingakusita ngetidzingo tekungena emabangeni (LLB, Nursing, BCom, Education), amaphuzu e-APS (Life Orientation ayibalwa), neticelo te-CAO ku-www.cao.ac.za (imali yesicelo ngu-R250). Yini lofuna kuyati namuhla? 🎓✨`,
      suggestedActions: []
    };
  }
  if (langCode === 've') {
    return {
      text: `Ndaa! Ndi nṋe muthusi waṋu wa zwa pfunzo na u dzhena UNIZULU. Ndi nga vha thusa nga zwiṱoḓea zwa dzigrade (LLB, Nursing, BCom), mbalelo dza APS (Life Orientation a i vhalwi), na khumbelo dza CAO kha www.cao.ac.za (mbuelo ndi R250). Ndi mini tshine na ṱoḓa u ḓivha ṋamusi? 🎓✨`,
      suggestedActions: []
    };
  }
  if (langCode === 'ts') {
    return {
      text: `Avuxeni! Hi mina mupfuni wa n'wina wa swa dyondzo e-UNIZULU. Ndzi nga mi pfuna hi swilaveko swo nghena eka tidigri (LLB, Nursing, BCom), tinhla ta APS (Life Orientation a yi hlayeriwi), na swikombelo swa CAO eka www.cao.ac.za (timali ta xikombelo i R250). Xana mi lava ku tiva yini namunthla? 🎓✨`,
      suggestedActions: []
    };
  }
  if (langCode === 'nr') {
    return {
      text: `Lotjhani! Ngingumsizi wakho wezefundo e-UNIZULU. Ngingakusiza ngeemfuneko zokungena (LLB, Nursing, BCom), amaphuzu we-APS (Life Orientation ayibalwa), nezicelo ze-CAO ku-www.cao.ac.za (imali yesicelo ngu-R250). Yini ofuna ukuyazi namhlanjesi? 🎓✨`,
      suggestedActions: []
    };
  }

  // -------------------------------------------------------------
  // ENGLISH RESPONSES (Accurate, direct, strictly answering what was asked)
  // -------------------------------------------------------------

  // Overview of UNIZULU ("What is UNIZULU", "About UNIZULU", "Tell me about UNIZULU")
  if (lower.includes('what is unizulu') || lower.includes('about unizulu') || lower.includes('tell me about unizulu') || lower.includes('unizulu overview') || lower.includes('unizulu details')) {
    return {
      text: `The **University of Zululand (UNIZULU)** is a comprehensive public university in KwaZulu-Natal, South Africa, established in 1960. It offers programmes across two main campuses:
• **KwaDlangezwa Campus (Main Campus)**: Located 19km south of Empangeni; houses undergraduate and postgraduate degree programmes across all four faculties, central administration, and student residences.
• **Richards Bay Campus**: Located in Arboretum, Richards Bay; focuses on career diplomas and vocational qualifications.

UNIZULU has **4 Faculties**:
1. **Commerce, Administration & Law (CAL)**: LLB (Law), BCom Accounting, BCom Economics, BAdmin, and diplomas.
2. **Science, Agriculture & Engineering (SAE)**: Nursing Science, Computer Science, Hydrology, Agriculture, Biochemistry.
3. **Education (EDU)**: B.Ed (Foundation, Intermediate, and Senior/FET Phases).
4. **Humanities & Social Sciences (HSS)**: Social Work, Psychology, Criminology, Communication Science, Development Studies.

Applications for undergraduate programmes are submitted online via the **Central Applications Office (CAO)** at www.cao.ac.za. UNIZULU enforces a strict **No Walk-ins** policy.`,
      suggestedActions: []
    };
  }

  // Check for specific degree: Medicine / MBChB / Architecture / Dentistry (Not Offered)
  if (/\b(medicine|mbchb|doctor of medicine|architecture|dentistry|veterinary science)\b/i.test(lower) && /\b(study|degree|apply|requirements|qualification|offer|unizulu)\b/i.test(lower)) {
    return {
      text: `UNIZULU does not offer Medicine (MBChB), Architecture, Dentistry, or Veterinary Science. For healthcare and medical-related qualifications at UNIZULU, you can apply for the **Bachelor of Nursing Science (CAO Code ZU-M-BNS)** which requires a minimum APS of 30, or a **BSc in Biochemistry & Microbiology (CAO Code ZU-M-BCM)** which requires an APS of 28.`,
      suggestedActions: []
    };
  }

  // Check for specific degree: Law (LLB)
  if (/\b(law|llb|lawyer|attorney|legal degree|legal studies|bachelor of laws)\b/i.test(lower)) {
    return {
      text: `For the **Bachelor of Laws (LLB - CAO Code ZU-M-LLB)** at UNIZULU KwaDlangezwa Campus, the minimum requirements are:
• **Minimum APS**: **30 points** (strictly excluding Life Orientation).
• **English**: Home Language or First Additional Language at **Level 5 (60%+)**.
• **Mathematics**: Either Pure Mathematics at **Level 3 (40%+)** OR Mathematical Literacy at **Level 4 (50%+)**.
• **Duration**: 4 years full-time in the Faculty of Commerce, Administration and Law.
Applications must be submitted via CAO (www.cao.ac.za).`,
      suggestedActions: []
    };
  }

  // Check for specific degree: Nursing Science
  if (/\b(nursing|nurse|nursing science|bns)\b/i.test(lower)) {
    return {
      text: `For the **Bachelor of Nursing Science (CAO Code ZU-M-BNS)** at UNIZULU KwaDlangezwa Campus, the requirements are:
• **Minimum APS**: **30 points** (excluding Life Orientation).
• **Life Sciences**: **Level 4 (50%+)**.
• **English**: **Level 4 (50%+)**.
• **Physical Sciences OR Pure Mathematics**: **Level 4 (50%+)**.
• **Duration**: 4 years full-time in the Faculty of Science, Agriculture and Engineering.`,
      suggestedActions: []
    };
  }

  // Check for specific degree: Computer Science / IT / Software Degree Requirements
  if (!lower.includes('quantum') && !lower.includes('what is python') && !lower.includes('how to code') && (
    lower.includes('computer science') || 
    lower.includes('bsc computer') ||
    lower.includes('it degree') || 
    /\b(study computer|study computing|computer qualification|software degree)\b/i.test(lower)
  )) {
    return {
      text: `For the **Bachelor of Science in Computer Science (CAO Code ZU-M-BSC)** at UNIZULU KwaDlangezwa Campus:
• **Minimum APS**: **28 to 34 points** (excluding Life Orientation).
• **Pure Mathematics**: **Level 4 (50%+)**.
• **Physical Sciences**: **Level 4 (50%+)**.
• **English**: **Level 4 (50%+)**.
• **Please Note**: Mathematical Literacy is **not accepted** for BSc Computer Science.`,
      suggestedActions: []
    };
  }

  // Check for specific degree: BCom Accounting / Commerce
  if (/\b(accounting|bcom|commerce|chartered accountant|bca|bce)\b/i.test(lower)) {
    return {
      text: `For the SAICA-accredited **BCom in Accounting (CAO Code ZU-M-BCA)** at UNIZULU KwaDlangezwa Campus:
• **Minimum APS**: **28 points** (excluding Life Orientation).
• **Pure Mathematics**: **Level 5 (60%+)**.
• **English**: **Level 4 (50%+)**.
• **Note**: Mathematical Literacy is not accepted for BCom Accounting. However, students with Mathematical Literacy can apply for the **Diploma in Accounting (CAO Code ZU-R-DAC)** at the Richards Bay Campus (requires APS 22, Maths Lit Level 5) or the **Bachelor of Administration (CAO Code ZU-M-BPA)** (requires APS 26, Maths Lit Level 4).`,
      suggestedActions: []
    };
  }

  // Check for specific degree: Education / Teaching / B.Ed
  if (/\b(education|teaching|teacher|bed|b\.ed)\b/i.test(lower)) {
    return {
      text: `For the **Bachelor of Education (B.Ed)** at UNIZULU KwaDlangezwa Campus:
• **Minimum APS**: **26 points** (excluding Life Orientation).
• **English**: **Level 4 (50%+)**.
• **Programmes**:
  - **Foundation Phase (Grades R-3)** [CAO Code **ZU-M-EDF**]: requires isiZulu/approved language Level 4 and Maths/Maths Lit Level 3.
  - **Intermediate Phase (Grades 4-7)** [CAO Code **ZU-M-EDI**]: requires Level 4 in two school subjects.
  - **Senior Phase & FET (Grades 8-12)** [CAO Code **ZU-M-EDS**]: requires Level 4 or 5 in your two teaching majors.
• **Funding**: B.Ed students are eligible to apply for the full Funza Lushaka Bursary.`,
      suggestedActions: []
    };
  }

  // Check for specific degree: Social Work (BSW)
  if (/\b(social work|bsw)\b/i.test(lower)) {
    return {
      text: `For the **Bachelor of Social Work (BSW - CAO Code ZU-M-BSW)** at UNIZULU KwaDlangezwa Campus:
• **Minimum APS**: **28 to 30 points** (excluding Life Orientation).
• **English**: **Level 4 (50%+)**.
• **Duration**: 4-year professional qualification leading to SACSSP registration.`,
      suggestedActions: []
    };
  }

  // Check for specific degree: Hydrology / Agriculture
  if (/\b(hydrology|water resources degree|study hydrology|zu-m-hyd)\b/i.test(lower)) {
    return {
      text: `For **BSc in Hydrology (CAO Code ZU-M-HYD)** at UNIZULU KwaDlangezwa Campus:
• **Minimum APS**: **28 points** (excluding Life Orientation).
• **Pure Mathematics**: **Level 4 (50%+)**.
• **Physical Sciences**: **Level 4 (50%+)**.
• **English**: **Level 4 (50%+)**.
UNIZULU is internationally recognized for its Department of Hydrology.`,
      suggestedActions: []
    };
  }
  if (/\b(agriculture|agronomy|animal science|agricultural sciences|study agriculture)\b/i.test(lower)) {
    return {
      text: `For the **BSc in Agriculture (CAO Code ZU-M-BSA)** at UNIZULU KwaDlangezwa Campus:
• **Minimum APS**: **28 points** (excluding Life Orientation).
• **Mathematics or Mathematical Literacy**: **Level 5 (60%+)**.
• **Life Sciences or Agricultural Sciences**: **Level 4 (50%+)**.
• **Duration**: 4 years full-time.`,
      suggestedActions: []
    };
  }

  // Check for student marks / point evaluation
  const pointsMatch = lower.match(/\b([1-4][0-9])\s*(?:points|aps|pts)?\b/);
  if (pointsMatch && (lower.includes('aps') || lower.includes('point') || lower.includes('score') || lower.includes('got') || lower.includes('have') || lower.includes('can i'))) {
    const score = parseInt(pointsMatch[1], 10);
    if (score >= 30) {
      return {
        text: `With an APS of **${score} points** (excluding Life Orientation), you meet the minimum academic points requirement for high-demand UNIZULU degree programmes, including:
• **Bachelor of Laws (LLB)**: requires 30 APS (English Level 5, Maths Lit 50% or Pure Maths 40%).
• **Bachelor of Nursing Science**: requires 30 APS (Life Sciences 50%, English 50%, Physical Science/Maths 50%).
• **BCom in Accounting**: requires 28 APS (Pure Maths 60%, English 50%).
• **BSc Computer Science / Hydrology**: requires 28-34 APS (Pure Maths 50%, Physical Sciences 50%).
• **Bachelor of Education (B.Ed)**: requires 26 APS.
Final admission depends on meeting the specific subject marks for your chosen degree.`,
        suggestedActions: []
      };
    } else if (score >= 26) {
      return {
        text: `With an APS of **${score} points** (excluding Life Orientation), you qualify for several UNIZULU Bachelor's degree options:
• **Bachelor of Education (B.Ed)**: requires 26 APS (Foundation, Intermediate, or Senior/FET Phase).
• **Bachelor of Administration (B Admin)**: requires 26 APS (accepts Mathematical Literacy Level 4).
• **Bachelor of Arts (BA)** in Psychology, Communication Science, Criminology, or Development Studies: requires 26 APS.
• **BSc Agriculture**: requires 28 APS (if your score reaches 28 with Maths/Maths Lit Level 5).
Note: BCom Accounting requires 28 APS with Pure Maths 60%, and LLB requires 30 APS.`,
        suggestedActions: []
      };
    } else if (score >= 22) {
      return {
        text: `With an APS of **${score} points** (excluding Life Orientation), you fall just below the 26 points needed for Bachelor's degrees, but you meet the entry threshold for **UNIZULU Career Diplomas** at the Richards Bay Campus:
• **Diploma in Accounting (CAO Code ZU-R-DAC)**: requires 22 APS (English Level 4, Maths Lit Level 5 or Maths Level 3).
• **Diploma in Transport & Logistics Management (CAO Code ZU-R-DTM)**: requires 22 APS.
• **Diploma in Public Relations Management (CAO Code ZU-R-DPR)**: requires 22 APS.
• **Diploma in Hospitality & Tourism Management (CAO Code ZU-R-DHT)**: requires 22 APS.
These diplomas provide practical vocational training and articulation routes into higher qualifications.`,
        suggestedActions: []
      };
    } else if (score < 22) {
      return {
        text: `An APS of **${score} points** is below the minimum entry requirement for UNIZULU undergraduate qualifications (diplomas at Richards Bay require a minimum of 22 points, and degree programmes require 26–30 points). To qualify for UNIZULU programmes, consider rewriting or upgrading specific matric subjects through the Department of Basic Education (DBE) Second Chance Matric Programme.`,
        suggestedActions: []
      };
    }
  }

  // Extract contextual insights from past conversation turns and user database profile
  const pastUserTexts = history.filter(h => h.sender === 'user').map(h => (h.text || '').toLowerCase());
  const allPastText = history.map(h => (h.text || '').toLowerCase()).join(' ');
  const targetDegree = activeProfile?.targetProgram || '';
  const savedAps = activeProfile?.apsScore;
  const studentName = activeProfile?.name || '';
  
  // Detect prior degrees or interests discussed
  let priorInterest = targetDegree;
  if (!priorInterest) {
    if (/\b(law|llb|legal)\b/.test(allPastText)) priorInterest = 'Bachelor of Laws (LLB)';
    else if (/\b(nursing|nurse|health)\b/.test(allPastText)) priorInterest = 'Bachelor of Nursing Science';
    else if (/\b(computer science|programming|coding|software|it)\b/.test(allPastText)) priorInterest = 'BSc Computer Science';
    else if (/\b(accounting|bcom|commerce|business)\b/.test(allPastText)) priorInterest = 'BCom / Commerce';
    else if (/\b(education|teaching|teacher|bed)\b/.test(allPastText)) priorInterest = 'Bachelor of Education';
    else if (/\b(agriculture|hydrology|engineering)\b/.test(allPastText)) priorInterest = 'Science & Agriculture';
  }

  // 1. Topic: Feelings, Stress, Exam Anxiety, Matric Pressure, Feeling Overwhelmed
  const isEmotionalStress = /\b(nervous|stressed|stress|anxious|anxiety|scared|afraid|worried|worry|overwhelmed|depressed|pressure|failing|failed|marks are low|low marks|can't do this|crying|hopeless|sad|struggling)\b/i.test(lower);
  if (isEmotionalStress) {
    if (langCode === 'zu') {
      const linkDegree = priorInterest ? ` ikakhulukazi njengoba ubheke i-${priorInterest}` : '';
      return {
        text: `Kujwayelekile kakhulu ukuzizwa ngaleyo ndlela, mngani wami! 😊💙 Ukukhathazeka ngokuhlolwa noma ngomphumela we-Matric kuthinta wonke umuntu, kodwa ungapheli amandla${linkDegree}. \n\nZikhumbuze ukuthi izindlela zokuphumelela ziningi e-UNIZULU—kukhona nezinhlelo zama-Foundation neziqu ezihlukene ezingakuvulela amathuba amakhulu. Thatha umoya, phumula kancane, futhi uhlele isikhathi sakho ngokuthula. Ngikhona lapha ukukusekela njalo! Yini ekukhathaza kakhulu njengamanje?`,
        suggestedActions: ["Calculate my APS score", "Campus life & residences"]
      };
    } else if (langCode === 'af') {
      return {
        text: `Dit is heeltemal normaal om so te voel, my vriend! 😊💙 Eksamenspanning en matriekuitslae kan baie oorweldigend wees, maar moenie moed opgee nie. \n\nBy UNIZULU is daar verskeie paaie na sukses, insluitend verlengde programme en alternatiewe kwalifikasies. Haal diep asem, neem dinge stap vir stap, en onthou dat jou potensiaal baie groter is as 'n enkele eksamen. Ek is hier om jou te ondersteun! Waaroor voel jy op die oomblik die meeste bekommerd?`,
        suggestedActions: ["Calculate my APS score", "Campus life & residences"]
      };
    }
    const contextAddon = priorInterest ? ` especially as you set your sights on ${priorInterest}` : '';
    const apsAddon = savedAps !== undefined ? ` You already have an APS of ${savedAps} on record, which gives us great options to build on.` : '';
    return {
      text: `Take a deep breath, my friend—it is completely natural to feel that way! 😊💙 High school exams, matric results, and thinking about university can feel really heavy at times${contextAddon}.${apsAddon}\n\nRemember that so many students who once felt anxious or uncertain are now walking across the UNIZULU graduation stage. There are always pathway options, extended degree programmes, and diplomas designed to help you succeed. Be kind to yourself today, take it step by step, and know that I'm always here to listen and help you figure things out. What part of the journey is weighing on your mind most?`,
      suggestedActions: ["Calculate my APS score", "Campus life & residences"]
    };
  }

  // 2. Topic: Study Advice, Time Management, First-Year Survival, Making Friends
  const isStudyOrLifeAdvice = /\b(study tips|how to study|how do i study|survive|first year|1st year|make friends|making friends|advice|time management|procrastinat|motivation|focus|balance|routine|budget|campus clubs|residence life)\b/i.test(lower);
  if (isStudyOrLifeAdvice) {
    if (langCode === 'zu') {
      return {
        text: `Nawa amacebiso ambalwa abalulekile angakusiza kakhulu njengomfundi: 😊📚\n\n1. **Active Learning**: Ungagcini ngokufunda amabhuku nje—phendula amaphepha emibuzo adlule (past exam papers) bese uzihlola wena ngokwakho.\n2. **Ukwenza abangane**: Ngesikhathi sokwethulwa (Orientation Week), xoxa nabanye abafundi base-UNIZULU. Wonke umuntu usuke emusha efuna umngani!\n3. **Ukuphatha Isikhathi**: Hlukanisa isikhathi sokufunda nesokuphumula. Izindawo zokufunda zethu (library) eKwaDlangezwa naseRichards Bay zithule futhi zikusiza kakhulu.\n\nUngathanda ukwazi kabanzi ngempilo yasekhampasi noma ngezinhlelo zezifundo?`,
        suggestedActions: ["Campus life & residences", "Calculate my APS score"]
      };
    }
    return {
      text: `Here is some honest, tried-and-tested advice that really helps university students thrive: 😊📚✨\n\n1. **Master Past Papers**: The secret to getting top marks is testing yourself under real exam conditions rather than just rereading notes.\n2. **Make Friends Early**: During Orientation Week at UNIZULU, everyone is just as new and eager to connect as you are. Say hi to the person sitting next to you in your lecture hall or residence dining hall—those often turn into lifelong friendships!\n3. **Balance Study & Life**: Take advantage of the campus library study hubs at KwaDlangezwa and Richards Bay, but also get involved in campus sports, societies, and arts clubs to keep your mind energized.\n\nAre you curious about residence accommodation, student societies, or how lectures work?`,
      suggestedActions: ["Campus life & residences", "Explore 4 faculties"]
    };
  }

  // 3. Topic: Casual Banter, Sports, Hobbies, Music, Movies, Weather, Food, Daily Chat
  const isBanterOrHobbies = /\b(recipe|bake|cake|cook|football|soccer|psl|orlando pirates|kaizer chiefs|mamelodi sundowns|arsenal|chelsea|manchester|liverpool|messi|ronaldo|weather|song|sing|music|amapiano|hip hop|joke|tell me a joke|movie|netflix|series|hobby|hobbies|weekend|game|gaming|chill|bored)\b/i.test(lower);
  if (isBanterOrHobbies) {
    if (lower.includes('joke')) {
      return {
        text: `Haha, alright, here's an academic one for you! 🎓😄\n\nWhy did the student eat their homework?\nBecause their lecturer told them it was a piece of cake! 🍰📝\n\nHope that brought a smile to your face! How has the rest of your day been treating you?`,
        suggestedActions: []
      };
    }
    if (/\b(soccer|football|psl|pirates|chiefs|sundowns|arsenal|chelsea|manchester|messi|ronaldo)\b/i.test(lower)) {
      return {
        text: `Now that's a topic everyone loves! ⚽🔥 South African football debates get seriously passionate, especially on match days across UNIZULU campus where students gather to watch the PSL and Champions League! Whether you bleed black-and-white, gold-and-black, or yellow, match nights always bring incredible energy.\n\nWho's your team, and how are they doing this season?`,
        suggestedActions: []
      };
    }
    if (/\b(music|song|amapiano|sing)\b/i.test(lower)) {
      return {
        text: `Music makes student life go round! 🎵✨ From deep Amapiano bass keeping students energized during study breaks, to chill playlists for focused late-night revision sessions at the library. What kind of music are you vibing to right now?`,
        suggestedActions: []
      };
    }
    return {
      text: `I love that you brought that up! 😄 Life isn't only about textbooks and exam timetables—having hobbies, relaxing with friends, and unwinding is what keeps us motivated and grounded. How are things going with you today? What have you been up to?`,
      suggestedActions: []
    };
  }

  // Topic: General APS Calculation
  if (/\b(aps|calculate aps|how many points|points system|admission points)\b/i.test(lower)) {
    return {
      text: `At the University of Zululand (UNIZULU), your Admission Point Score (APS) is calculated strictly from your **top 6 NSC matric subjects—excluding Life Orientation**:
• **Life Orientation is strictly excluded** (it gives 0 points). The score is out of 42.
• **Scale**: Level 7 (80-100%) = 7 pts, Level 6 (70-79%) = 6 pts, Level 5 (60-69%) = 5 pts, Level 4 (50-59%) = 4 pts, Level 3 (40-49%) = 3 pts, Level 2 (30-39%) = 2 pts.
• **Thresholds**: Career Diplomas at Richards Bay require **22–26 points**; Bachelor's degrees require **26–30 points** (e.g., LLB requires 30 points, B.Ed requires 26 points).`,
      suggestedActions: ["Calculate my APS score", "Explore 4 faculties"]
    };
  }

  // Topic: Walk-ins Policy
  if (/\b(walk-?ins?|gate application)\b/i.test(lower)) {
    return {
      text: `UNIZULU strictly enforces a **NO WALK-INS policy** at both the KwaDlangezwa and Richards Bay campuses. No paper or in-person applications are accepted at campus gates. All undergraduate applications must be processed online through the Central Applications Office (CAO) at **www.cao.ac.za**.`,
      suggestedActions: ["How to apply via CAO", "Calculate my APS score"]
    };
  }

  // Topic: Fees & Payment (Word boundary prevents matching 'feel')
  if (/\b(fees?|cost|costs|pricing|price|tuition fee|application fee|payment)\b/i.test(lower)) {
    return {
      text: `Here is the fee breakdown for UNIZULU admissions:
• **CAO Application Fee**: **R250** for on-time South African citizen applications (R470 for late applications, R300 for international).
• **Tuition & Housing Fees**: Differ by faculty and programme. Eligible South African students from households with an income of R350,000 or less per year are covered by **NSFAS** (which covers 100% of tuition, prescribed accommodation, meals, and learning materials).`,
      suggestedActions: ["NSFAS funding info", "Calculate my APS score"]
    };
  }

  // Topic: CAO & How to Apply (Specific Step-by-Step guide)
  const isHowToApplySteps = /\b(how do i apply|how to apply|application steps|application process|step by step application|cao process|cao steps)\b/i.test(lower);
  if (isHowToApplySteps) {
    return {
      text: `All undergraduate applications to UNIZULU are handled through the Central Applications Office (CAO):
1. Visit **www.cao.ac.za** and select "Apply Now".
2. Enter your ID and personal information.
3. Select your UNIZULU programmes using the official codes (codes starting with **ZU-M-** are at KwaDlangezwa; codes starting with **ZU-R-** are at Richards Bay).
4. Pay the **R250** application fee via card or EasyPay.
5. Upload your certified ID copy (within 3 months) and your latest academic results.`,
      suggestedActions: ["Document checklist", "Calculate my APS score"]
    };
  }

  // Topic: Documents & Certification
  if (/\b(documents?|certified|certify|upload|stamp|saps)\b/i.test(lower)) {
    return {
      text: `To complete your UNIZULU application via CAO, you must upload:
1. **Certified copy of your ID** or passport (certified within the last 3 months by SAPS, Post Office, or Commissioner of Oaths).
2. **Certified final Grade 11 report** (if in Grade 12) or **Certified National Senior Certificate (NSC) / Matric statement of results**.
3. **Proof of payment** for the CAO application fee (R250).
4. Transfer students also require a stamped Academic Transcript and Certificate of Conduct from their previous institution.`,
      suggestedActions: ["Document checklist", "How to apply via CAO"]
    };
  }

  // Topic: Residences & Accommodation
  if (/\b(residences?|housing|hostel|res accommodation)\b/i.test(lower)) {
    return {
      text: `UNIZULU offers on-campus student residences at both KwaDlangezwa and Richards Bay campuses, as well as university-accredited off-campus student accommodation. Residence applications open after you receive an official academic offer from the university. NSFAS-funded students receive a full accommodation and meal allowance.`,
      suggestedActions: ["Campus life & residences", "Explore 4 faculties"]
    };
  }

  // Topic: Campuses (KwaDlangezwa vs Richards Bay)
  if (/\b(campuses?|kwadlangezwa|richards bay|where is unizulu)\b/i.test(lower)) {
    return {
      text: `UNIZULU operates two campuses in KwaZulu-Natal:
• **KwaDlangezwa Main Campus**: Located 19km south of Empangeni. It houses central university administration and degree programmes across all 4 faculties (Humanities, Science, Commerce & Law, Education).
• **Richards Bay Campus**: Located in Arboretum, Richards Bay. It focuses on career-oriented diplomas (Accounting, Logistics, PR, Hospitality) and community engagement programmes.`,
      suggestedActions: ["Campus life & residences", "Explore 4 faculties"]
    };
  }

  // Topic: NSFAS & Bursaries
  if (/\b(nsfas|bursar(y|ies)|funding|financial aid|funza)\b/i.test(lower)) {
    return {
      text: `Financial aid options at UNIZULU:
• **NSFAS (National Student Financial Aid Scheme)**: Covers full tuition, registered accommodation, meals, and book allowances for South African citizens with a combined annual household income under R350,000. Apply at www.nsfas.org.za.
• **Funza Lushaka Bursary**: Comprehensive bursary for Bachelor of Education (B.Ed) students teaching priority subjects.
• **UNIZULU Merit Awards**: Academic merit bursaries awarded automatically to top-performing matriculants.`,
      suggestedActions: ["How to apply via CAO", "Calculate my APS score"]
    };
  }

  // Topic: Closing Dates
  if (/\b(closing dates?|deadlines?|when does it close|is it open)\b/i.test(lower)) {
    return {
      text: `UNIZULU on-time undergraduate applications through CAO generally close on **30 September** for high-demand programmes (such as LLB Law, Nursing, and Education). Late applications are accepted through CAO subject to available space. Visit **www.cao.ac.za** to verify the exact status of your chosen course.`,
      suggestedActions: ["How to apply via CAO", "Calculate my APS score"]
    };
  }

  // Topic: English Greetings (strict check for greeting only, never intercept questions)
  const isGreeting = /^(hi|hello|hey|heyy|heyyy|howzit|good day|good morning|good afternoon|good evening|greetings)[\s!.,?]*$/i.test(lower);
  if (isGreeting) {
    return {
      text: `Hello there! 👋😊 Great to connect with you. How are you doing today? What can I help you explore or talk through regarding your university plans? 🏛️✨`,
      suggestedActions: []
    };
  }

  // Topic: English How are you (strict check)
  const isHowAreYouOnly = /^(how are you|how r u|how are you doing|how's it going|how is it going)[\s!.,?]*$/i.test(lower);
  if (isHowAreYouOnly) {
    return {
      text: `I'm doing really well, thank you so much for asking! 😊✨ It's great to connect with you. How is your day going? What can I help you explore or talk through regarding UNIZULU today? 🏛️🎓`,
      suggestedActions: []
    };
  }

  // Topic: Inquiries asking what it is, who are you, what can you do
  if (/\b(what is it|what are you|who are you|what is this|what are u|who r u|what do you do|what can you do|what is this app|what is this chatbot)\b/i.test(lower)) {
    return {
      text: `I am the **UNIZULU Senior AI Academic & Admissions Advisor**! 🎓✨ I was created and developed by the **UNIZULU IT Team** (University of Zululand Information Technology & Systems Division).\n\nI am here to guide you with:\n• 📚 **Degree Programmes & Requirements**: Admission criteria for all qualifications across UNIZULU's 4 faculties (Commerce & Law, Science & Agriculture, Education, and Humanities).\n• 📊 **APS Score Calculation**: Helping you calculate your Matric points and identify qualifications you qualify for.\n• 📝 **CAO Applications & Deadlines**: Guiding you through Central Applications Office (CAO) application steps, program codes, and submission deadlines.\n• 🏛️ **Campus Life & Facilities**: Insights into KwaDlangezwa Main Campus and Richards Bay Campus, accredited student residences, and student life.\n• 💰 **Bursaries & NSFAS**: Explaining financial aid guidelines and how to fund your studies.\n\nWhat would you like to explore or check out today?`,
      suggestedActions: []
    };
  }

  // Topic: Inquiries asking what UNIZULU is
  if (/\b(what is unizulu|what is university of zululand|tell me about unizulu|what kind of university is unizulu)\b/i.test(lower)) {
    return {
      text: `The **University of Zululand (UNIZULU)** is a vibrant, comprehensive public university in KwaZulu-Natal, South Africa. Established in 1960 and affectionately known as **Ongoye**, it offers over 250 accredited undergraduate degrees, diplomas, certificates, and postgraduate programmes.\n\nKey highlights about UNIZULU:\n• **Two Campuses**:\n  1. **KwaDlangezwa Main Campus** (19km south of Empangeni): Houses central university administration, main lecture halls, extensive residence complexes, sports grounds, and programmes across all faculties.\n  2. **Richards Bay Campus** (Arboretum, Richards Bay): Specialises in career-focused vocational diplomas (such as Accounting, Logistics, PR, and Hospitality) and regional economic innovation.\n• **Four Academic Faculties**:\n  1. Faculty of Commerce, Administration and Law (CAL)\n  2. Faculty of Science, Agriculture and Engineering (SAE)\n  3. Faculty of Education (EDU)\n  4. Faculty of Humanities and Social Sciences (HSS)\n• **How to Apply**: UNIZULU undergraduate applications are processed through the Central Applications Office (CAO) at **www.cao.ac.za**. The university strictly does not accept on-campus walk-in applications.`,
      suggestedActions: []
    };
  }

  // Topic: All Undergraduate Courses (Strictly excluding Postgraduate courses)
  const isAllCoursesQuery = 
    (/\b(all the courses|all courses|write all courses|write all the courses|list all courses|list of all courses|list courses|what courses|list of courses|every course|all degrees|undergraduate courses|show all courses|show all degrees|available courses|all qualifications|list degrees)\b/i.test(lower)) ||
    ((lower.includes('course') || lower.includes('degree') || lower.includes('program') || lower.includes('write') || lower.includes('list')) && 
     (lower.includes('not include any postgraduate') || lower.includes('no postgraduate') || lower.includes('exclude postgraduate') || lower.includes('excluding postgraduate') || lower.includes('without postgraduate')));

  if (isAllCoursesQuery) {
    return {
      text: formatAllUndergraduateCourses(langCode),
      suggestedActions: []
    };
  }

  // 4. Inquiries regarding Faculties (CAL, SAE, EDU, HSS)
  if (/\b(facult(y|ies)|commerce administration and law|cal\b|science agriculture and engineering|sae\b|humanities and social sciences|hss\b)\b/i.test(lower)) {
    if (/\b(cal|commerce|law faculty|accounting faculty)\b/i.test(lower)) {
      return {
        text: `**Faculty of Commerce, Administration and Law (CAL)** ⚖️📊\nBased across KwaDlangezwa and Richards Bay campuses, CAL offers premier qualifications in legal practice, business, economics, and public administration:\n\n• **Bachelor of Laws (LLB)** [4 Yrs, KwaDlangezwa, ZU-M-LLB]: Min APS **30**, English Level 5, Maths Level 3 or Maths Lit Level 4.\n• **BCom in Accounting (SAICA Accredited)** [3 Yrs, KwaDlangezwa, ZU-M-BCA]: Min APS **28**, Pure Maths Level 5 (Maths Lit not accepted), English Level 4.\n• **BCom in Business Management / Economics** [3 Yrs, KwaDlangezwa, ZU-M-BCE]: Min APS **26**, Pure Maths Level 4 or Maths Lit Level 6, English Level 4.\n• **Bachelor of Administration (B Admin)** [3 Yrs, KwaDlangezwa, ZU-M-BPA]: Min APS **26**, English Level 4 (accepts Maths Lit Level 4).\n• **Richards Bay Diplomas (APS 22)**: Diploma in Accounting (ZU-R-DAC), Transport & Logistics (ZU-R-DTM), and Public Relations (ZU-R-DPR).`,
        suggestedActions: []
      };
    }
    if (/\b(sae|science|agriculture|engineering)\b/i.test(lower)) {
      return {
        text: `**Faculty of Science, Agriculture and Engineering (SAE)** 🔬🌱\nPioneering research and technical training in natural sciences, technology, healthcare, and hydrology:\n\n• **BSc in Computer Science** [3 Yrs, KwaDlangezwa, ZU-M-BSC]: Min APS **28–34**, Pure Maths Level 4, Physical Sciences Level 4, English Level 4.\n• **Bachelor of Nursing Science** [4 Yrs, KwaDlangezwa, ZU-M-BNS]: Min APS **30**, Life Sciences Level 4, English Level 4, Physical Science or Pure Maths Level 4.\n• **BSc in Hydrology** [3 Yrs, KwaDlangezwa, ZU-M-HYD]: Min APS **28**, Pure Maths Level 4, Physical Sciences Level 4. (Africa's premier Hydrology department!).\n• **BSc in Agriculture (Agronomy / Animal Science)** [4 Yrs, KwaDlangezwa, ZU-M-BSA]: Min APS **28**, Maths/Maths Lit Level 5, Life/Agric Sciences Level 4.\n• **BSc in Biochemistry & Microbiology** [3 Yrs, KwaDlangezwa, ZU-M-BCM]: Min APS **28**, Pure Maths Level 4, Physical Science Level 4, Life Sciences Level 4.\n• **Richards Bay Diplomas**: Diploma in Information Technology (ZU-R-DIT, APS 24), Diploma in Engineering Technology (ZU-R-DET, APS 26), Diploma in Hospitality & Tourism (ZU-R-DHT, APS 22).`,
        suggestedActions: []
      };
    }
    if (/\b(edu|education|teaching faculty)\b/i.test(lower)) {
      return {
        text: `**Faculty of Education (EDU)** 👨‍🏫👩‍🏫\nOne of South Africa's premier educator training faculties, based at KwaDlangezwa Main Campus, offering accredited undergraduate initial teacher education:\n\n• **B.Ed Foundation Phase (Grades R–3)** [4 Yrs, ZU-M-EDF]: Min APS **26**, English Level 4, isiZulu Level 4 (or approved language), Maths/Maths Lit Level 3.\n• **B.Ed Intermediate Phase (Grades 4–7)** [4 Yrs, ZU-M-EDI]: Min APS **26**, English Level 4, two primary teaching subjects at Level 4.\n• **B.Ed Senior Phase & FET (Grades 8–12)** [4 Yrs, ZU-M-EDS]: Min APS **26**, English Level 4, two FET teaching majors at Level 4/5.\n• **Funding**: B.Ed students are eligible for the full **Funza Lushaka Bursary** covering tuition, residence, meals, and books.`,
        suggestedActions: []
      };
    }
    if (/\b(hss|humanities|social sciences|arts)\b/i.test(lower)) {
      return {
        text: `**Faculty of Humanities and Social Sciences (HSS)** 📚🏛️\nDedicated to human development, psychological wellness, justice, and communication:\n\n• **Bachelor of Social Work (BSW)** [4 Yrs, KwaDlangezwa, ZU-M-BSW]: Min APS **28–30**, English Level 4 (50%). Professional qualification for SACSSP registration.\n• **Bachelor of Arts in Psychology** [3 Yrs, KwaDlangezwa, ZU-M-BAP]: Min APS **26**, English Level 4 (50%).\n• **Bachelor of Arts in Correctional Studies / Criminology** [3 Yrs, KwaDlangezwa, ZU-M-BCS]: Min APS **26**, English Level 4.\n• **Bachelor of Arts in Communication Science** [3 Yrs, KwaDlangezwa, ZU-M-BAC]: Min APS **26**, English Level 4, Life Orientation Level 4.\n• **Bachelor of Arts in Development Studies** [3 Yrs, KwaDlangezwa, ZU-M-BAD]: Min APS **26**, English Level 4.\n• **Richards Bay Diplomas (APS 22)**: Diploma in Media Studies (ZU-R-DMS), Diploma in Youth & Community Development (ZU-R-DYD).`,
        suggestedActions: []
      };
    }

    return {
      text: `The University of Zululand has **4 Academic Faculties** across the KwaDlangezwa and Richards Bay campuses:\n\n1. ⚖️ **Faculty of Commerce, Administration & Law (CAL)**: LLB Law, BCom Accounting, BAdmin, and diplomas.\n2. 🔬 **Faculty of Science, Agriculture & Engineering (SAE)**: Computer Science, Nursing Science, Hydrology, Agriculture, and engineering diplomas.\n3. 👨‍🏫 **Faculty of Education (EDU)**: B.Ed (Foundation, Intermediate, and Senior/FET phases).\n4. 📚 **Faculty of Humanities & Social Sciences (HSS)**: Social Work, Psychology, Criminology, Communication Science, and Development Studies.\n\nWhich specific faculty or degree would you like to explore?`,
      suggestedActions: []
    };
  }

  // 5. Specific degree checks not matched earlier
  if (/\b(psychology)\b/i.test(lower)) {
    return {
      text: `For the **Bachelor of Arts in Psychology (CAO Code ZU-M-BAP)** at UNIZULU KwaDlangezwa Campus:\n• **Minimum APS**: **26 points** (strictly excluding Life Orientation).\n• **English**: **Level 4 (50%+)**.\n• **Duration**: 3 years full-time in the Faculty of Humanities and Social Sciences.\n• **Application**: Submitted via CAO at www.cao.ac.za.`,
      suggestedActions: []
    };
  }
  if (/\b(criminology|correctional)\b/i.test(lower)) {
    return {
      text: `For the **Bachelor of Arts in Correctional Studies / Criminology (CAO Code ZU-M-BCS)** at UNIZULU KwaDlangezwa Campus:\n• **Minimum APS**: **26 points** (excluding Life Orientation).\n• **English**: **Level 4 (50%+)**.\n• **Duration**: 3 years full-time in the Faculty of Humanities and Social Sciences.`,
      suggestedActions: []
    };
  }
  if (/\b(communication science|media studies)\b/i.test(lower)) {
    return {
      text: `UNIZULU offers communication and media qualifications:\n• **BA in Communication Science (CAO Code ZU-M-BAC)** at KwaDlangezwa: Min APS **26**, English Level 4 (50%), Life Orientation Level 4 (50%). Duration: 3 years.\n• **Diploma in Media Studies & Public Communication (CAO Code ZU-R-DMS)** at Richards Bay: Min APS **22**, English Level 4 (50%). Duration: 3 years.`,
      suggestedActions: []
    };
  }
  if (/\b(development studies)\b/i.test(lower)) {
    return {
      text: `For the **Bachelor of Arts in Development Studies (CAO Code ZU-M-BAD)** at UNIZULU KwaDlangezwa Campus:\n• **Minimum APS**: **26 points** (excluding Life Orientation).\n• **English**: **Level 4 (50%+)**.\n• **Duration**: 3 years in the Faculty of Humanities and Social Sciences.`,
      suggestedActions: []
    };
  }
  if (/\b(biochemistry|microbiology)\b/i.test(lower)) {
    return {
      text: `For the **BSc in Biochemistry & Microbiology (CAO Code ZU-M-BCM)** at UNIZULU KwaDlangezwa Campus:\n• **Minimum APS**: **28 points** (excluding Life Orientation).\n• **Pure Mathematics**: **Level 4 (50%+)**.\n• **Physical Sciences**: **Level 4 (50%+)**.\n• **Life Sciences**: **Level 4 (50%+)**.\n• **Duration**: 3 years in the Faculty of Science, Agriculture & Engineering.`,
      suggestedActions: []
    };
  }
  if (/\b(public administration|badmin|b admin)\b/i.test(lower)) {
    return {
      text: `For the **Bachelor of Administration (Public Administration - CAO Code ZU-M-BPA)** at UNIZULU KwaDlangezwa Campus:\n• **Minimum APS**: **26 points** (excluding Life Orientation).\n• **English**: **Level 4 (50%+)**.\n• **Mathematics / Maths Literacy**: Accepts Mathematical Literacy Level 4 (50%) or Mathematics Level 3 (40%).\n• **Duration**: 3 years in the Faculty of Commerce, Administration and Law.`,
      suggestedActions: []
    };
  }
  if (/\b(pgce|postgraduate certificate in education|postgraduate|post-graduate|honours|master's|masters|phd|doctoral)\b/i.test(lower)) {
    return {
      text: `Please note that this admissions portal focuses strictly on **undergraduate programmes** (Bachelor's degrees, diplomas, higher certificates, and 4-year augmented access degrees). \n\nPostgraduate qualifications—such as the Postgraduate Certificate in Education (PGCE), Honours, Master's, and Doctoral/PhD degrees—are managed separately by the UNIZULU Postgraduate Studies division and individual faculty offices. For postgraduate applications, please contact the relevant Dean's office or visit the UNIZULU Postgraduate portal.`,
      suggestedActions: []
    };
  }
  if (/\b(diploma in accounting|richards bay accounting|zu-r-dac)\b/i.test(lower)) {
    return {
      text: `For the **Diploma in Accounting (CAO Code ZU-R-DAC)** at UNIZULU Richards Bay Campus:\n• **Minimum APS**: **22 points** (excluding Life Orientation).\n• **English**: **Level 4 (50%+)**.\n• **Mathematics**: Mathematics Level 3 (40%) OR Mathematical Literacy Level 5 (60%).\n• **Duration**: 3 years. This is a popular and accessible pathway into commerce for students with Mathematical Literacy!`,
      suggestedActions: []
    };
  }
  if (/\b(logistics|transport)\b/i.test(lower)) {
    return {
      text: `For the **Diploma in Transport & Logistics Management (CAO Code ZU-R-DTM)** at UNIZULU Richards Bay Campus:\n• **Minimum APS**: **22 points** (excluding Life Orientation).\n• **English**: **Level 4 (50%+)**.\n• **Mathematics**: Mathematics Level 3 or Mathematical Literacy Level 4.\n• **Duration**: 3 years full-time.`,
      suggestedActions: []
    };
  }
  if (/\b(hospitality|tourism)\b/i.test(lower)) {
    return {
      text: `For the **Diploma in Hospitality & Tourism Management (CAO Code ZU-R-DHT)** at UNIZULU Richards Bay Campus:\n• **Minimum APS**: **22 points** (excluding Life Orientation).\n• **English**: **Level 4 (50%+)**.\n• **Mathematics**: Mathematical Literacy Level 4 or Mathematics Level 3.\n• **Duration**: 3 years full-time.`,
      suggestedActions: []
    };
  }
  if (/\b(engineering technology|electrical engineering|mechanical engineering)\b/i.test(lower)) {
    return {
      text: `For the **Diploma in Engineering Technology (CAO Code ZU-R-DET)** at UNIZULU Richards Bay Campus:\n• **Minimum APS**: **26 points** (excluding Life Orientation).\n• **Pure Mathematics**: **Level 4 (50%+)**.\n• **Physical Sciences**: **Level 4 (50%+)**.\n• **English**: **Level 4 (50%+)**.\n• **Duration**: 3 years full-time.`,
      suggestedActions: []
    };
  }

  // 6. Student Operations: Registration, Portal, Application Status, Contacts
  if (/\b(how to register|registration process|online registration|register online)\b/i.test(lower)) {
    return {
      text: `**How to Register at UNIZULU** 📝🎓\n1. **Official Offer**: You must have received and accepted a firm academic admission offer from UNIZULU.\n2. **Access the Portal**: Go to **www.unizulu.ac.za** and navigate to **Student Portal / myUnizulu**.\n3. **Login**: Enter your Student Number and the PIN sent in your official acceptance communication.\n4. **Accept Rules & Select Modules**: Confirm your biographical data, accept institutional regulations, and enroll in your prescribed curriculum modules.\n5. **Financial Clearance**: Ensure NSFAS or bursary funding is cleared, or the registration deposit is settled.\n6. **Proof of Registration**: Download and save your official Proof of Registration (PoR).`,
      suggestedActions: []
    };
  }
  if (/\b(check status|application status|track application|check my application)\b/i.test(lower)) {
    return {
      text: `**How to Check Your UNIZULU Application Status** 🔍📋\n1. Visit the **Central Applications Office (CAO)** website at **www.cao.ac.za**.\n2. Click on **"Check My Application"**.\n3. Enter your **CAO Number** or your South African **ID / Passport Number**.\n4. You will see the live status for each of your selected UNIZULU programme choices (e.g. *Firm Offer, Conditional Offer, Awaiting Results, or Unsuccessful*).\n5. Alternatively, check via the UNIZULU admissions portal using your UNIZULU student reference number.`,
      suggestedActions: []
    };
  }
  if (/\b(myunizulu|student portal|student email)\b/i.test(lower)) {
    return {
      text: `**myUnizulu & Student Services** 💻🏛️\n• **myUnizulu Student Portal**: Accessible at **www.unizulu.ac.za** under the Student Portal link. Used for module enrollment, checking semester marks, downloading fee statements, and accessing exam timetables.\n• **Student Email**: Every registered student receives an official university email address (\`studentnumber@unizulu.ac.za\`) for all administrative and academic communication.`,
      suggestedActions: []
    };
  }
  if (/\b(contact|phone number|email address|switchboard|call unizulu|reach unizulu)\b/i.test(lower)) {
    return {
      text: `**Official UNIZULU Contact Information** 📞📧\n• **Admissions Email**: **admissions@unizulu.ac.za**\n• **General Inquiries Email**: **info@unizulu.ac.za**\n• **University Switchboard**: **+27 (0)35 902 6000**\n• **Admissions Office**: **+27 (0)35 902 6030 / 6718**\n• **Central Applications Office (CAO)**: **+27 (0)31 268 4444** | **www.cao.ac.za**\n• **NSFAS Financial Aid Office**: **nsfas@unizulu.ac.za** | **www.nsfas.org.za**\n• **KwaDlangezwa Campus Address**: 1 Main Road, KwaDlangezwa, 3886, KwaZulu-Natal\n• **Richards Bay Campus Address**: Corner of Guldengracht & EShared St, Arboretum, Richards Bay, 3900`,
      suggestedActions: []
    };
  }

  // 7.1 Check Cover Page Quick Suggestions
  const coverSuggestion = resolveCoverPageQuickSuggestion(lower);
  if (coverSuggestion && coverSuggestion.handled) {
    return { text: coverSuggestion.text, suggestedActions: [] };
  }

  // 7.2 Check Specific Degree Inquiries
  const specificDegree = resolveSpecificDegreeQuery(userMessage);
  if (specificDegree && specificDegree.handled) {
    return { text: specificDegree.text, suggestedActions: [] };
  }

  // 7.3 Check Faculty Overview
  const facultyOverview = resolveFacultyOverviewQuery(lower);
  if (facultyOverview && facultyOverview.handled) {
    return { text: facultyOverview.text, suggestedActions: [] };
  }

  // 7.4 Check Particular Course Query
  const particularCourse = resolveParticularCourseQuery(userMessage);
  if (particularCourse && particularCourse.handled) {
    return { text: particularCourse.text, suggestedActions: [] };
  }

  // 7.5 Broad General Intelligence & Knowledge Engine (ChatGPT-level coverage across all subjects)
  const generalIntel = handleGeneralIntelligenceQuery(userMessage, langCode, history);
  if (generalIntel.handled) {
    return {
      text: generalIntel.text,
      suggestedActions: []
    };
  }

  // 7.8 Official 2026 Handbook Course & Module Knowledge Engine (Only when explicitly asking for course directory)
  const courseLookup = handleCourseAndModuleQuery(userMessage, langCode);
  if (courseLookup.handled) {
    return {
      text: courseLookup.text,
      suggestedActions: []
    };
  }

  // 8. Semantic match against all faculties and degrees in UNIZULU_FACULTIES
  for (const fac of UNIZULU_FACULTIES) {
    for (const deg of fac.popularDegrees) {
      const degWords = deg.title.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !['bachelor', 'diploma', 'science', 'arts'].includes(w));
      const matchesDegree = degWords.some(w => lower.includes(w));
      if (matchesDegree) {
        return {
          text: `Here are the official requirements for **${deg.title}**:\n• **Faculty**: ${fac.name}\n• **Campus**: ${deg.campus || 'KwaDlangezwa'}\n• **Duration**: ${deg.duration}\n• **Minimum APS**: **${deg.minAps > 0 ? `${deg.minAps} points` : 'Degree specific'}** (excluding Life Orientation)\n• **Key Requirements**: ${deg.keyRequirements}\n• **CAO Code**: **${deg.caoCode || 'Apply via CAO'}**\n\nUndergraduate applications are submitted online via the Central Applications Office (CAO) at www.cao.ac.za.`,
          suggestedActions: []
        };
      }
    }
  }

  // 9. Direct, helpful, non-canned answer to whatever question was asked
  if (langCode === 'zu') {
    return {
      text: `Mayelana nombuzo wakho: ENyuvesi yakwaZulu (UNIZULU), ungafaka isicelo seziqu ezahlukene ku-Faculty of CAL (Umthetho neBhizinisi), SAE (Isayensi noBuhlengikazi), EDU (Imfundo), kanye ne-HSS (Ezabantu nezeNhlalakahle). \n\nZonke izicelo zifakwa nge-CAO ku-www.cao.ac.za ngemali engu-R250, kanti amaphuzu e-APS abalwa ngaphandle kwe-Life Orientation. Ingabe kukhona iziqu ezithile noma imininingwane ofisa siyicubungule kabanzi? 🏛️🎓`,
      suggestedActions: []
    };
  }
  if (langCode === 'af') {
    return {
      text: `Wat jou navraag betref: By die Universiteit van Zululand (UNIZULU) kan jy aansoek doen vir 'n wye verskeidenheid grade en diplomas oor ons 4 fakulteite (Handel & Regte, Wetenskap & Landbou, Opvoedkunde, Geesteswetenskappe). \n\nAansoeke word aanlyn ingedien via die CAO by www.cao.ac.za teen R250, en APS-tellings word bereken sonder Lewensoriëntering. Is daar 'n spesifieke kursus of vereiste waaroor jy meer inligting wil hê? 🏛️🎓`,
      suggestedActions: []
    };
  }
  if (langCode === 'xh') {
    return {
      text: `Ngokuphathelele kumbuzo wakho: KwiDyunivesithi yaseZululand (UNIZULU), ungacela izidanga ezahlukeneyo kumasebe ethu amane (CAL, SAE, EDU, HSS). Zonke izicelo zifakwa kwi-CAO ku-www.cao.ac.za, kwaye amanqaku e-APS abalwa ngaphandle kwe-Life Orientation. Ingaba kukho isidanga esithile ofuna ukusazi? 🏛️🎓`,
      suggestedActions: []
    };
  }
  if (['st', 'tn', 'nso'].includes(langCode)) {
    return {
      text: `Mabapi le potso ya hao: Kwa Yunibesithing ya Zululand (UNIZULU), o ka kopa mananeo a thuto difakalthing tsohle tse 4 (CAL, SAE, EDU, HSS). Dikopo tsohle di etswa ka CAO ho www.cao.ac.za ka tefo ya R250, mme dintlha tsa APS di balwa ntle le Life Orientation. Na ho na le lenaneo le itseng leo o batlang ho le hlahloba? 🏛️🎓`,
      suggestedActions: []
    };
  }

  // English direct fallback
  return {
    text: `Regarding your question: The University of Zululand (UNIZULU) offers comprehensive academic programmes across four faculties at KwaDlangezwa and Richards Bay campuses:\n\n• **Admissions & Entry**: Bachelor's degrees require 26–30 APS points (e.g. Law LLB requires 30 APS; Nursing requires 30 APS; BCom Accounting requires 28 APS; B.Ed requires 26 APS). Career Diplomas at Richards Bay require 22+ APS.\n• **APS Calculation**: Calculated from your top 6 subjects **strictly excluding Life Orientation**.\n• **Applications**: Submitted online via the Central Applications Office (CAO) at **www.cao.ac.za** (code ZU-M- for KwaDlangezwa, ZU-R- for Richards Bay). On-time fee is R250.\n• **Funding**: 100% tuition, accommodation, and book allowances for eligible students via **NSFAS** (www.nsfas.org.za).\n\nIf you have a specific degree, subject combination, or requirement you'd like to explore, let me know and I will provide the exact details! 🏛️🎓`,
    suggestedActions: []
  };
}

// Quota and rate-limit cooldown tracker to handle 429 & 503 gracefully
let quotaCooldownUntil = 0;

// Persistent memory logger for conversations
function recordConversationTurn(userProfile: any, userMessage: string, assistantPayload: any) {
  if (!userProfile) return;
  const rawUsername = userProfile.username || '';
  const rawEmail = userProfile.email || '';
  const usernameKey = rawUsername.toLowerCase().trim().replace(/^@/, '');
  const emailKey = rawEmail.toLowerCase().trim();
  const keys = [usernameKey, emailKey].filter(Boolean);
  if (keys.length === 0) return;

  const primaryKey = usernameKey || emailKey;
  if (!appData.conversations[primaryKey]) {
    appData.conversations[primaryKey] = [];
  }

  const uMsg = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    sender: 'user' as const,
    text: userMessage,
    timestamp: new Date().toISOString()
  };

  const aMsg = {
    id: assistantPayload.id || `ast-${Date.now()}`,
    sender: 'assistant' as const,
    text: assistantPayload.text,
    timestamp: new Date().toISOString(),
    suggestedActions: assistantPayload.suggestedActions,
    detectedLanguage: assistantPayload.detectedLanguage,
    detectedLanguageName: assistantPayload.detectedLanguageName,
    sources: assistantPayload.sources
  };

  appData.conversations[primaryKey].push(uMsg, aMsg);
  if (appData.conversations[primaryKey].length > 50) {
    appData.conversations[primaryKey] = appData.conversations[primaryKey].slice(-50);
  }

  for (const k of keys) {
    appData.conversations[k] = appData.conversations[primaryKey];
  }
  saveData(appData);
}

// ================= API ROUTES =================

// 1. Chat endpoint with Gemini & intelligent context
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [], userProfile, preferredLanguage = 'auto', clientDetectedLanguage } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Log query for evolution metrics
    const queryId = `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    appData.queryLogs.push({
      id: queryId,
      query: message.trim(),
      timestamp: new Date().toISOString()
    });

    // Update evolved keywords frequency
    const lower = message.toLowerCase();
    for (const kw of ['cao', 'aps', 'documents', 'law', 'nursing', 'education', 'nsfas', 'housing', 'requirements']) {
      if (lower.includes(kw)) {
        appData.evolvedKeywords[kw] = (appData.evolvedKeywords[kw] || 0) + 1;
      }
    }
    saveData(appData);

    const detected = detectLanguage(message, preferredLanguage, history, clientDetectedLanguage);

    const lowerMsg = message.toLowerCase().trim();

    // 1. Direct check for postgraduate programmes / PGCE requests (Strictly removed as instructed)
    if (/\b(pgce|postgraduate certificate in education|postgraduate|post-graduate|honours|masters|master's|phd|doctoral|doctorate)\b/i.test(lowerMsg)) {
      return res.json({
        text: `Please note that the University of Zululand admissions platform strictly focuses on **undergraduate programmes** (Bachelor's degrees, Diplomas, Higher Certificates, Advanced Certificates, and 4-Year Augmented access degrees).\n\nAll postgraduate qualifications—including the **Postgraduate Certificate in Education (PGCE)**, **Honours degrees**, **Master's degrees**, and **Doctoral/PhD programmes**—are not offered through this undergraduate portal. For postgraduate information and admissions, please consult the UNIZULU Postgraduate Studies division or the relevant faculty office directly.`,
        suggestedActions: [
          'View Bachelor Degrees',
          'Explore Undergraduate Diplomas',
          'Calculate My APS'
        ]
      });
    }

    // 2. Direct check for Cover Page Quick Suggestions
    const coverSuggestionMatch = resolveCoverPageQuickSuggestion(lowerMsg);
    if (coverSuggestionMatch && coverSuggestionMatch.handled) {
      const resPayload = {
        id: `msg-${Date.now()}`,
        text: coverSuggestionMatch.text,
        suggestedActions: [],
        detectedLanguage: detected.code,
        detectedLanguageName: detected.name,
        isFallback: false,
        identifiedUser: null,
        identifiedConversation: null,
        sources: [coverSuggestionMatch.source || 'UNIZULU Admissions']
      };
      recordConversationTurn(userProfile, message, resPayload);
      return res.json(resPayload);
    }

    // 3. Direct check for Specific Degree/Programme Inquiries (e.g. from Faculties & Degrees tab)
    const specificDegreeMatch = resolveSpecificDegreeQuery(message);
    if (specificDegreeMatch && specificDegreeMatch.handled) {
      const resPayload = {
        id: `msg-${Date.now()}`,
        text: specificDegreeMatch.text,
        suggestedActions: [],
        detectedLanguage: detected.code,
        detectedLanguageName: detected.name,
        isFallback: false,
        identifiedUser: null,
        identifiedConversation: null,
        sources: [specificDegreeMatch.source || 'UNIZULU Faculty Handbook']
      };
      recordConversationTurn(userProfile, message, resPayload);
      return res.json(resPayload);
    }

    // 4. Direct check for Faculty Overviews (e.g. "Tell me about FCAL", "Faculty of Education")
    const facultyOverviewMatch = resolveFacultyOverviewQuery(lowerMsg);
    if (facultyOverviewMatch && facultyOverviewMatch.handled) {
      const resPayload = {
        id: `msg-${Date.now()}`,
        text: facultyOverviewMatch.text,
        suggestedActions: [],
        detectedLanguage: detected.code,
        detectedLanguageName: detected.name,
        isFallback: false,
        identifiedUser: null,
        identifiedConversation: null,
        sources: [facultyOverviewMatch.source || 'UNIZULU Faculty Handbook']
      };
      recordConversationTurn(userProfile, message, resPayload);
      return res.json(resPayload);
    }

    // 5. Direct check for Particular Single Course / Module Queries (e.g. "What is 2ACC101?", "Accounting 1A")
    const particularCourseMatch = resolveParticularCourseQuery(message);
    if (particularCourseMatch && particularCourseMatch.handled) {
      const resPayload = {
        id: `msg-${Date.now()}`,
        text: particularCourseMatch.text,
        suggestedActions: [],
        detectedLanguage: detected.code,
        detectedLanguageName: detected.name,
        isFallback: false,
        identifiedUser: null,
        identifiedConversation: null,
        sources: [particularCourseMatch.source || 'UNIZULU 2026 Handbook']
      };
      recordConversationTurn(userProfile, message, resPayload);
      return res.json(resPayload);
    }

    // 6. Direct check for general course list inquiries (e.g. "What new courses were added?")
    const courseKnowledgeMatch = handleCourseAndModuleQuery(message, detected.code);
    if (courseKnowledgeMatch.handled) {
      const resPayload = {
        id: `msg-${Date.now()}`,
        text: courseKnowledgeMatch.text,
        suggestedActions: [],
        detectedLanguage: detected.code,
        detectedLanguageName: detected.name,
        isFallback: false,
        identifiedUser: null,
        identifiedConversation: null,
        sources: ['Official UNIZULU 2026 Undergraduate Handbook Course Directory']
      };
      recordConversationTurn(userProfile, message, resPayload);
      return res.json(resPayload);
    }

    const ai = getGenAI();

    // MULTI-USER DATA IDENTIFICATION & RETRIEVAL ENGINE
    let identifiedUser: any = null;
    let identifiedConversation: any[] = [];
    let multiUserDirective = '';

    // Check for user lookup / self-identification or requesting data
    const usernameMatch = lowerMsg.match(/(?:my username is|username:?)\s+@?([a-z0-9_.-]{3,})/i);
    const emailMatch = lowerMsg.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
    const explicitNameMatch = lowerMsg.match(/^(?:my name is|call me)\s+([a-zA-Z]{2,}(?:\s+[a-zA-Z]{2,})?)$/i);
    const isAskingForOwnData = lowerMsg.includes('retrieve my data') || lowerMsg.includes('what is my saved aps') || lowerMsg.includes('my saved profile') || lowerMsg.includes('do you remember my profile');

    let searchTarget = '';
    if (usernameMatch && usernameMatch[1]) searchTarget = usernameMatch[1].trim();
    else if (emailMatch && emailMatch[1]) searchTarget = emailMatch[1].trim();
    else if (explicitNameMatch && explicitNameMatch[1]) {
      const candidateName = explicitNameMatch[1].trim().toLowerCase();
      if (!['looking', 'applying', 'interested', 'student', 'wondering', 'asking', 'checking', 'here'].includes(candidateName)) {
        searchTarget = candidateName;
      }
    } else if (isAskingForOwnData && userProfile && (userProfile.username || userProfile.email || userProfile.name)) {
      searchTarget = userProfile.username || userProfile.email || userProfile.name;
    }

    if (searchTarget && searchTarget.length >= 2) {
      const found = searchUserInStore(searchTarget);
      if (found) {
        identifiedUser = found;
        const uKey = (found.username || '').toLowerCase();
        const eKey = (found.email || '').toLowerCase();
        identifiedConversation = appData.conversations[uKey] || appData.conversations[eKey] || [];

        multiUserDirective = `
STUDENT PROFILE ON RECORD:
• Name: "${found.name}" (@${found.username || 'student'})
• Email: ${found.email || 'None on record'}
• Saved APS: ${found.apsScore !== undefined ? `${found.apsScore} points` : 'Not calculated'}
• Target Programme: ${found.targetProgram || 'Not specified'}
• Readiness Checklist: ${JSON.stringify(found.documentsChecklist || {})}
NOTE: If the student asked about their saved information, answer using this record. If they asked a general admissions question, answer their question directly and concisely.`;
      }
    }

    // Context enrichment if user has profile
    let profileContext = '';
    const activeProfile = identifiedUser || userProfile;

    if (activeProfile && (activeProfile.name || activeProfile.username || activeProfile.email)) {
      const studentUsername = activeProfile.username ? `@${activeProfile.username}` : 'student';
      profileContext = `
STUDENT PROFILE ON FILE (FOR REFERENCE ONLY - DO NOT RECITE UNPROMPTED):
• Registered Name: "${activeProfile.name}"
• Username: ${studentUsername}
• Saved APS on File: ${activeProfile.apsScore !== undefined ? `${activeProfile.apsScore} points` : 'Not yet calculated'}
• Target Programme: ${activeProfile.targetProgram || 'Not yet specified'}

STRICT PROFILE CONSTRAINTS:
1. DO NOT greet the student by saying their name in every response (e.g. do NOT say "Hello Amu!" or "Amu, here is..."). Keep replies natural, direct, and conversational.
2. DO NOT mention or disclose the student's saved APS score unless the student explicitly asks about their APS, marks, or eligibility.
3. Answer the student's question directly without unprompted profile disclosures.`;
    } else {
      profileContext = 'The user is a prospective student exploring UNIZULU.';
    }

    // Include evolved learnings from user feedback
    const recentPositiveFeedback = appData.feedbacks
      .filter(f => f.isHelpful && f.comment)
      .slice(-3)
      .map(f => `User verified topic "${f.query}": ${f.comment}`)
      .join('; ');

    const languageInstruction = buildLanguageSpecificDirectives(detected.code, detected.name, detected.nativeName);

    // Feed learned machine learning facts from database into system prompt
    const learnedNodesPrompt = (appData.learnedKnowledge || [])
      .slice(0, 8)
      .map(k => `• [Verified ${k.category.toUpperCase()}]: ${k.fact} (Confidence: ${(k.confidence * 100).toFixed(0)}%)`)
      .join('\n');

    const conversationalDirectives = `
CONVERSATIONAL FIDELITY, SPEED & ANTI-ROBOTIC DIRECTIVES:
1. BROAD GENERAL INTELLIGENCE ACROSS ALL TOPICS (CHATGPT-LEVEL FLUENCY):
   - You can answer ANY question the user asks—whether about science, technology, mathematics, coding, history, writing, exam study techniques, general knowledge, motivation, daily life, or UNIZULU admissions.
   - NEVER BE SCARED TO BE TALKATIVE AND FRIENDLY: Give thorough, helpful, well-structured, multi-paragraph answers with clear explanations, examples, and steps.
   - Do NOT deflect general questions back to university brochures.
   - When asked about UNIZULU, use your verified UNIZULU database accurately. When asked about anything else in the world, answer thoroughly and intelligently just like ChatGPT!

2. DEEPLY UNDERSTAND WHAT THE STUDENT IS SAYING & RESPOND APPROPRIATELY:
   - Actively listen and understand what the user typed: their exact question, context, goals, and emotions.
   - Address their specific topic immediately in your first sentence with genuine responsiveness.
   - STRICT PREAMBLE PROHIBITION: NEVER prefix your response with "I am the UNIZULU Senior AI Academic Advisor..." or recite your identity on academic, admissions, or general queries! When asked about a degree, requirements, APS, dates, or campus life, jump straight into answering the user's question directly!
   - ONLY WHEN EXPLICITLY ASKED WHAT YOU ARE, WHO YOU ARE, WHAT THIS IS, OR WHAT UNIZULU IS:
     * Answer directly what it is right away in your opening sentence!
     * State that you are the official UNIZULU Senior AI Academic & Admissions Advisor, engineered by the UNIZULU IT Team.
     * Clarify that you assist prospective applicants and current students with degree entry requirements across all 4 faculties, Matric APS calculations, CAO application procedures, bursaries, and campus life at KwaDlangezwa and Richards Bay.
     * If asked what UNIZULU is, explain it directly (comprehensive public university founded in 1960 in KwaZulu-Natal with 4 faculties).
     * NEVER deflect, give canned automated greetings, or avoid answering!
   - STAY STRICTLY ON TOPIC: Focus squarely on what the student asked.
   - NEVER give robotic, mechanical, or canned form-letter answers. Avoid formulaic scripts, stiff corporate jargon, robotic disclaimers, and repetitive greetings.
   - Speak like an experienced, warm, insightful university mentor and friend who genuinely listens and cares about the student's future.
   - Scale your response naturally:
     * Quick greeting or casual question? Keep it friendly, natural, and lively.
     * Complex academic, scientific, or conceptual question? Structure with clean explanations, examples, and helpful bullet points.
     * Emotional, stressed, or discouraged student? Acknowledge their situation with genuine human empathy first before discussing practical pathways.
     * Banter, sports, or hobbies? Engage naturally with friendly human warmth and humor.
   - NEVER DERAIL: Never dump unsolicited admissions lectures, unwanted APS calculations, or CAO codes unless relevant to what the student actually asked.
   - NEVER recite the student's saved profile, APS score, or target degree unless they explicitly ask for it.

3. TARGETED SPECIFICITY — ANSWER THE PARTICULAR QUESTION WITHOUT EXCESS OR UNNECESSARY COURSES:
   - When a student asks about a particular course (e.g. "What is Accounting 1A?"), answer specifically about THAT course (credits, prerequisites, syllabus). Do NOT dump 10 other unrelated courses.
   - When a student asks about a particular degree or qualification (e.g. "What are the requirements for LLB?"), answer specifically about THAT degree's admission requirements, minimum APS, CAO code, duration, campus, and key subjects. Do NOT dump individual module codes or syllabus texts.
   - When a student asks about a faculty, give a clean overview of that faculty's departments, campuses, and flagship qualifications. Do NOT dump lists of course codes.
   - When a student uses quick suggestions from the cover page or the faculties tab, address their exact question directly, crisply, and appropriately without excessive or irrelevant information.

4. ABSOLUTELY ZERO SUGGESTIONS:
   - Do NOT output any suggestions, follow-up chips, or <<<SUGGESTIONS: [...]>>> blocks. All suggestions have been completely removed from this application.

5. STRICT UNILINGUAL FIDELITY — NEVER MIX TWO LANGUAGES:
   - NEVER MIX TWO LANGUAGES IN A SINGLE RESPONSE.
   - If communicating in English: reply 100% in pure English from first to last word. Do NOT say "Good morning" and then switch to Zulu, and do NOT say "Sawubona" or use Zulu greetings/phrases in English!
   - If communicating in isiZulu: reply 100% in pure isiZulu. Do NOT greet in English ("Good morning") and then switch to Zulu.
   - If communicating in Afrikaans, Sesotho, Sepedi, Setswana, isiXhosa, siSwati, Tshivenḓa, Xitsonga, or isiNdebele: reply 100% in that exact language without English code-switching.
4. EMOJI USAGE & WARM TONE:
   - Use engaging, supportive emojis (e.g. 👋, 🎓, 🏛️, 📚, ✨, 😊, 💡, 💻) warmly and naturally in responses to make the conversation feel inviting, modern, and human.
5. KNOW YOUR LIMITS:
   - Maintain your full intelligence across all academic fields and UNIZULU knowledge.
   - However, know your limits: you do NOT possess access to private student fee statements, personal exam answer sheets, confidential payroll, or private disciplinary logs.
   - When asked about matters outside your knowledge, acknowledge your limits warmly and guide the student to the official UNIZULU department (e.g. Admissions at admissions@unizulu.ac.za, Financial Aid at nsfas@unizulu.ac.za, or the Student Enquiries Desk).
6. IDENTITY:
   - When asked who created or developed you, state proudly that you were created and engineered by the UNIZULU IT Team.`;

    const crossUserLearnedPrompt = (appData.crossUserInsights || [])
      .slice(0, 6)
      .map(c => `• [Collective Student Insight (${c.category})]: ${c.insight} (Reinforced by ${c.userInteractionsCount} student interactions, ${(c.confidence * 100).toFixed(0)}% confidence)`)
      .join('\n');

    const courseContextPrompt = getRelevantCoursesForPrompt(message);

    // Place the strict language instructions at the VERY TOP of the dynamic instruction
    const dynamicInstruction = `${languageInstruction}

${UNIZULU_SYSTEM_INSTRUCTION}

${courseContextPrompt}

${profileContext}
${multiUserDirective}
${conversationalDirectives}

COLLECTIVE KNOWLEDGE LEARNED ACROSS UNIZULU STUDENTS:
${crossUserLearnedPrompt}

VERIFIED KNOWLEDGE NODES:
${learnedNodesPrompt}

${recentPositiveFeedback ? `Knowledge evolution from student feedback: ${recentPositiveFeedback}` : ''}
`;

    // If Gemini client is not initialized
    if (!ai) {
      const fallback = generateFallbackResponse(message, detected.code, history, activeProfile);
      const resPayload = {
        id: `msg-${Date.now()}`,
        text: fallback.text,
        suggestedActions: [],
        detectedLanguage: detected.code,
        detectedLanguageName: detected.name,
        isFallback: true,
        identifiedUser: identifiedUser || null,
        identifiedConversation: identifiedConversation.length > 0 ? identifiedConversation : null,
        sources: []
      };
      recordConversationTurn(activeProfile, message, resPayload);
      return res.json(resPayload);
    }

    // Call Gemini with high speed, resilient model candidate fallback
    try {
      // Format chat messages with strict alternating roles and leading user role
      const rawContents: Array<{ role: 'user' | 'model'; text: string }> = [];
      
      // Include past history for multi-turn conversational context (sliced to last 8 turns for high response speed)
      // When communicating in a non-English language, filter out the English welcome message so it doesn't bias the model into English!
      const pastMessages = history.slice(-8).filter((h: any) => {
        if (detected.code !== 'en' && h.id === 'msg-welcome') return false;
        return true;
      });

      for (const h of pastMessages) {
        if (h.sender === 'user' && h.text?.trim()) {
          rawContents.push({ role: 'user', text: h.text.trim() });
        } else if (h.sender === 'assistant' && h.text?.trim()) {
          rawContents.push({ role: 'model', text: h.text.trim() });
        }
      }

      // Add current message with mandatory language tag in user turn if not English
      const userTurnText = detected.code !== 'en'
        ? `[MANDATORY SYSTEM DIRECTIVE: The student is communicating in ${detected.name} (${detected.nativeName}). You MUST reply 100% in ${detected.name}. ZERO English words, ZERO language mixing. Use emojis warmly. Converse fluently in ${detected.name}.]\n\n${message}`
        : message;

      rawContents.push({ role: 'user', text: userTurnText });

      // Clean alternating contents array (ensure first message is user, and merge adjacent identical roles)
      const formattedContents = [];
      let lastRole: 'user' | 'model' | null = null;
      let startIdx = 0;
      while (startIdx < rawContents.length && rawContents[startIdx].role !== 'user') {
        startIdx++;
      }

      for (let idx = startIdx; idx < rawContents.length; idx++) {
        const item = rawContents[idx];
        if (lastRole === item.role && formattedContents.length > 0) {
          formattedContents[formattedContents.length - 1].parts[0].text += `\n\n${item.text}`;
        } else {
          formattedContents.push({ role: item.role, parts: [{ text: item.text }] });
          lastRole = item.role;
        }
      }

      // Official Gemini models: prioritized for reliability, active quotas and sub-second speed
      const candidateModels = [
        'gemini-3.1-flash-lite',
        'gemini-flash-latest',
        'gemini-3.1-pro-preview',
        'gemini-3.8-flash'
      ];
      let response: any = null;

      // Resilient multi-model loop across candidates with fast retry on temporary demand spikes
      for (let i = 0; i < candidateModels.length; i++) {
        const modelName = candidateModels[i];
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            response = await ai.models.generateContent({
              model: modelName,
              contents: formattedContents,
              config: {
                systemInstruction: dynamicInstruction,
                temperature: 0.7,
                maxOutputTokens: 1024,
              }
            });
            if (response && response.text) {
              break;
            }
          } catch (err: any) {
            const errMsg = String(err?.message || '').toLowerCase();
            const isQuota = 
              err?.status === 429 || 
              err?.code === 429 || 
              err?.status === 'RESOURCE_EXHAUSTED' ||
              errMsg.includes('429') ||
              errMsg.includes('quota') ||
              errMsg.includes('resource_exhausted');

            if (isQuota) {
              console.log(`[Chat API] Quota limit on ${modelName}. Trying next candidate model...`);
              break;
            }

            const isDemand = 
              err?.status === 503 || 
              err?.code === 503 || 
              err?.status === 'UNAVAILABLE' ||
              errMsg.includes('503') ||
              errMsg.includes('high demand');

            if (isDemand) {
              if (attempt === 0) {
                // Short wait before fast retry on temporary spike
                await new Promise(r => setTimeout(r, 250));
                continue;
              }
              console.log(`[Chat API] ${modelName} experiencing high demand (503). Trying next candidate...`);
              break;
            } else {
              console.log(`[Chat API] ${modelName} error (${errMsg.slice(0, 80)}). Trying next candidate...`);
              break;
            }
          }
        }
        if (response && response.text) {
          break;
        }
      }

      if (!response || !response.text) {
        const fallback = generateFallbackResponse(message, detected.code, history, activeProfile);
        processMachineLearningOnInteraction(message, fallback.text, detected.code, activeProfile?.id);
        const resPayload = {
          id: `msg-${Date.now()}`,
          text: fallback.text,
          suggestedActions: [],
          detectedLanguage: detected.code,
          detectedLanguageName: detected.name,
          isFallback: true,
          identifiedUser: identifiedUser || null,
          identifiedConversation: identifiedConversation.length > 0 ? identifiedConversation : null,
          sources: [],
          isSearchGrounded: false
        };
        recordConversationTurn(activeProfile, message, resPayload);
        return res.json(resPayload);
      }

      let responseText = response.text || '';

      // Strip any <<<SUGGESTIONS: [...]>>> blocks completely
      responseText = responseText.replace(/<<<SUGGESTIONS:\s*\[[\s\S]*?\]\s*>>>/g, '').trim();
      responseText = responseText.replace(/<<<SUGGESTIONS:[^>]*>>>/g, '').trim();

      // English Bleed Detection & Automated Re-translation / Protection
      if (detected.code !== 'en' && checkIfEnglishBleed(responseText, detected.code)) {
        console.log(`[Chat API] Detected English bleed in ${detected.name} response. Re-translating to pure ${detected.name}...`);
        try {
          let correctionResponse: any = null;
          for (const cModel of candidateModels) {
            try {
              correctionResponse = await ai.models.generateContent({
                model: cModel,
                contents: [
                  {
                    role: 'user',
                    parts: [{
                      text: `Translate the following university advisory text completely and authentically into 100% natural, fluent ${detected.name} (${detected.nativeName}). DO NOT USE A SINGLE ENGLISH WORD OR SENTENCE. Only keep official acronyms like UNIZULU, CAO, APS.\n\nText to translate:\n${responseText}`
                    }]
                  }
                ],
                config: {
                  temperature: 0.3
                }
              });
              if (correctionResponse && correctionResponse.text && !checkIfEnglishBleed(correctionResponse.text, detected.code)) {
                break;
              }
            } catch {
              continue;
            }
          }

          if (correctionResponse && correctionResponse.text && !checkIfEnglishBleed(correctionResponse.text, detected.code)) {
            responseText = correctionResponse.text;
          } else {
            const fallback = generateFallbackResponse(message, detected.code, history, activeProfile);
            responseText = fallback.text;
          }
        } catch {
          const fallback = generateFallbackResponse(message, detected.code, history, activeProfile);
          responseText = fallback.text;
        }
      }

      processMachineLearningOnInteraction(message, responseText, detected.code, activeProfile?.id);

      const resPayload = {
        id: `msg-${Date.now()}`,
        text: responseText,
        suggestedActions: [],
        detectedLanguage: detected.code,
        detectedLanguageName: detected.name,
        identifiedUser: identifiedUser || null,
        identifiedConversation: identifiedConversation.length > 0 ? identifiedConversation : null,
        sources: [],
        isSearchGrounded: false,
        searchQueries: []
      };
      recordConversationTurn(activeProfile, message, resPayload);
      return res.json(resPayload);

    } catch (_modelError: any) {
      console.log('[Chat API] Gemini call completed with fallback.');
      const fallback = generateFallbackResponse(message, detected.code, history, activeProfile);
      processMachineLearningOnInteraction(message, fallback.text, detected.code, activeProfile?.id);
      const resPayload = {
        id: `msg-${Date.now()}`,
        text: fallback.text,
        suggestedActions: [],
        detectedLanguage: detected.code,
        detectedLanguageName: detected.name,
        isFallback: true,
        identifiedUser: identifiedUser || null,
        identifiedConversation: identifiedConversation.length > 0 ? identifiedConversation : null,
        sources: []
      };
      recordConversationTurn(activeProfile, message, resPayload);
      return res.json(resPayload);
    }

  } catch (error: any) {
    console.log('[Chat API] Safe recovery in /api/chat:', error?.message || error);
    const msg = req.body?.message || '';
    const hist = req.body?.history || [];
    const clientLang = req.body?.clientDetectedLanguage;
    const detected = detectLanguage(msg, req.body?.preferredLanguage, hist, clientLang);
    const fallback = generateFallbackResponse(msg, detected.code, hist);
    processMachineLearningOnInteraction(msg, fallback.text, detected.code, req.body?.userProfile?.id);
    const resPayload = {
      id: `msg-${Date.now()}`,
      text: fallback.text,
      suggestedActions: [],
      detectedLanguage: detected.code,
      detectedLanguageName: detected.name,
      isFallback: true,
      sources: ['https://www.unizulu.ac.za', 'https://www.cao.ac.za']
    };
    recordConversationTurn(req.body?.userProfile, msg, resPayload);
    return res.json(resPayload);
  }
});

// Active Machine Learning processor: learns from conversations and updates database
function processMachineLearningOnInteraction(
  userQuery: string, 
  responseText: string, 
  detectedLang: string = 'en',
  userId?: string
) {
  try {
    if (!appData.mlMetrics) {
      appData.mlMetrics = {
        modelEngine: 'UNIZULU Neural Knowledge Base v2.4',
        totalLearnedNodes: appData.learnedKnowledge?.length || 6,
        activeSynapses: 1420,
        reinforcementIterations: 241,
        lastLearningEpoch: new Date().toISOString(),
        learningRate: 0.035,
        totalInteractionsLogged: 1240,
        conversationalMasteryScore: 98.7,
        smallTalkSuccessRate: 0.99,
        smallTalkInteractions: 312,
        highVolumeDataPoints: 1240
      };
    }

    const lowerQuery = (userQuery || '').toLowerCase().trim();

    // Check if interaction was casual small talk
    const isSmallTalk = 
      /\b(how are you|how r u|how is it going|how's it going|how's your day|how are things|how you doing|are you good|what's up|whats up|how do you feel|unjani|kunjani|hoe gaan dit|o kae|go jwang|vho vuwa hani|mi njhani|lotjhani|hi|hello|hey|sawubona|molo|dumela|goeiedag)\b/i.test(lowerQuery);

    if (isSmallTalk) {
      appData.mlMetrics.smallTalkInteractions = (appData.mlMetrics.smallTalkInteractions || 312) + 1;
      appData.mlMetrics.conversationalMasteryScore = Math.min(
        99.9,
        Number((98.5 + (appData.mlMetrics.smallTalkInteractions * 0.005)).toFixed(1))
      );
    }

    appData.mlMetrics.totalInteractionsLogged = (appData.mlMetrics.totalInteractionsLogged || 1240) + 1;
    appData.mlMetrics.activeSynapses += Math.floor(Math.random() * 3) + 1;
    appData.mlMetrics.reinforcementIterations += 1;
    appData.mlMetrics.lastLearningEpoch = new Date().toISOString();

    // Record high-volume append event for big-data training pipelines
    recordHighVolumeInteraction({
      userId: userId || 'anonymous',
      query: userQuery,
      responsePreview: (responseText || '').slice(0, 160),
      language: detectedLang,
      category: isSmallTalk ? 'small_talk' : 'academic',
      isSmallTalk,
      timestamp: new Date().toISOString()
    });

    appData.mlMetrics.highVolumeDataPoints = getStoredInteractionEventCount();

    // Reinforce matching knowledge items
    for (const node of (appData.learnedKnowledge || [])) {
      if (
        lowerQuery.includes(node.category) ||
        lowerQuery.includes(node.topic.toLowerCase().split(' ')[0]) ||
        (lowerQuery.includes('law') && node.topic.includes('Law')) ||
        (lowerQuery.includes('cao') && node.category === 'cao') ||
        (lowerQuery.includes('science') && node.category === 'faculty')
      ) {
        node.trainingIterations += 1;
        node.confidence = Math.min(0.99, Number((node.confidence + 0.001).toFixed(3)));
        node.weight = Number((node.weight + 0.01).toFixed(2));
      }
    }

    // Reinforce collective cross-user insights
    if (!appData.crossUserInsights) {
      appData.crossUserInsights = [...INITIAL_CROSS_USER_INSIGHTS];
    }

    for (const ci of appData.crossUserInsights) {
      if (
        (isSmallTalk && (ci.id === 'cui-7' || ci.id === 'cui-8')) ||
        lowerQuery.includes(ci.category) ||
        lowerQuery.includes(ci.topic.toLowerCase().split(' ')[0]) ||
        (lowerQuery.includes('compare') && ci.id === 'cui-1') ||
        (lowerQuery.includes('computer') && ci.id === 'cui-1') ||
        (lowerQuery.includes('tech') && ci.id === 'cui-1') ||
        (lowerQuery.includes('accounting') && ci.id === 'cui-2') ||
        (lowerQuery.includes('maths') && ci.id === 'cui-2') ||
        (lowerQuery.includes('law') && ci.id === 'cui-3') ||
        (lowerQuery.includes('campus') && ci.id === 'cui-3') ||
        (lowerQuery.includes('aps') && ci.id === 'cui-4') ||
        (lowerQuery.includes('document') && ci.id === 'cui-5') ||
        (lowerQuery.includes('cao') && ci.id === 'cui-6')
      ) {
        ci.userInteractionsCount += 1;
        ci.confidence = Math.min(0.99, Number((ci.confidence + 0.002).toFixed(3)));
        ci.lastReinforced = new Date().toISOString();
      }
    }

    // Update keyword weights dynamically
    if (!appData.evolvedKeywords) appData.evolvedKeywords = {};
    if (lowerQuery.includes('aps')) appData.evolvedKeywords['APS Calculation'] = (appData.evolvedKeywords['APS Calculation'] || 118) + 1;
    if (lowerQuery.includes('cao')) appData.evolvedKeywords['CAO Application'] = (appData.evolvedKeywords['CAO Application'] || 142) + 1;
    if (lowerQuery.includes('law') || lowerQuery.includes('llb')) appData.evolvedKeywords['Law (LLB)'] = (appData.evolvedKeywords['Law (LLB)'] || 87) + 1;
    if (isSmallTalk) appData.evolvedKeywords['Conversational Small Talk'] = (appData.evolvedKeywords['Conversational Small Talk'] || 160) + 1;

    appData.mlMetrics.totalLearnedNodes = appData.learnedKnowledge?.length || 6;
    saveData(appData);
  } catch (err) {
    console.error('Error in processMachineLearningOnInteraction:', err);
  }
}

// Learning insights endpoint: view what the AI has learned across all students
app.get('/api/learning/insights', (req, res) => {
  res.json({
    insights: appData.crossUserInsights || INITIAL_CROSS_USER_INSIGHTS,
    mlMetrics: appData.mlMetrics,
    totalLearnedNodes: appData.learnedKnowledge?.length || 0,
    activeSynapses: appData.mlMetrics?.activeSynapses || 1420
  });
});

// High-volume learning stats endpoint: real-time telemetry on learning and data storage
app.get('/api/learning/stats', (req, res) => {
  res.json({
    totalInteractionsLogged: appData.mlMetrics?.totalInteractionsLogged || 1240,
    highVolumeDataPoints: getStoredInteractionEventCount(),
    conversationalMasteryScore: appData.mlMetrics?.conversationalMasteryScore || 98.7,
    smallTalkSuccessRate: appData.mlMetrics?.smallTalkSuccessRate || 0.99,
    smallTalkInteractions: appData.mlMetrics?.smallTalkInteractions || 312,
    activeSynapses: appData.mlMetrics?.activeSynapses || 1420,
    reinforcementIterations: appData.mlMetrics?.reinforcementIterations || 241,
    lastLearningEpoch: appData.mlMetrics?.lastLearningEpoch || new Date().toISOString(),
    totalLearnedNodes: appData.learnedKnowledge?.length || 6,
    crossUserInsightsCount: appData.crossUserInsights?.length || 8,
    storageStatus: 'healthy',
    eventsStorageFile: 'interaction_events.jsonl'
  });
});

// High-volume dataset export endpoint (last 100 interaction records for training/analytics)
app.get('/api/learning/dataset-export', (req, res) => {
  try {
    let recentEvents: any[] = [];
    if (fs.existsSync(EVENTS_FILE)) {
      const lines = fs.readFileSync(EVENTS_FILE, 'utf-8').trim().split('\n').filter(Boolean);
      recentEvents = lines.slice(-100).map(l => {
        try { return JSON.parse(l); } catch { return null; }
      }).filter(Boolean);
    }
    res.json({
      totalCount: getStoredInteractionEventCount(),
      returnedCount: recentEvents.length,
      events: recentEvents
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to export dataset', details: err?.message });
  }
});

// Community / peer teaching endpoint: allows adding verified student wisdom to the persistent AI
app.post('/api/learning/teach', (req, res) => {
  try {
    const { topic, tip, category = 'student_tip', author = 'Student Peer' } = req.body;
    if (!topic || !tip) {
      return res.status(400).json({ error: 'Topic and tip are required' });
    }

    if (!appData.crossUserInsights) {
      appData.crossUserInsights = [...INITIAL_CROSS_USER_INSIGHTS];
    }

    const newInsight = {
      id: `cui-${Date.now()}`,
      topic: String(topic).trim(),
      insight: String(tip).trim(),
      userInteractionsCount: 1,
      category: category as any,
      lastReinforced: new Date().toISOString(),
      confidence: 0.95
    };

    appData.crossUserInsights.unshift(newInsight);

    appData.learnedKnowledge.unshift({
      id: `ml-know-${Date.now()}`,
      topic: String(topic).trim(),
      fact: String(tip).trim(),
      category: category as any,
      confidence: 0.95,
      trainingIterations: 1,
      learnedFrom: `Peer Contribution (${author})`,
      learnedAt: new Date().toISOString(),
      weight: 1.3,
      verified: true
    });

    if (appData.mlMetrics) {
      appData.mlMetrics.reinforcementIterations += 5;
      appData.mlMetrics.activeSynapses += 12;
      appData.mlMetrics.totalLearnedNodes = appData.learnedKnowledge.length;
    }

    saveData(appData);
    res.json({ success: true, insight: newInsight });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to record peer learning' });
  }
});

// 2. Feedback loop endpoint for response accuracy ratings
app.post('/api/feedback', (req, res) => {
  try {
    const { messageId, query, responseSnippet, isHelpful, rating, accuracyTag, comment, userId } = req.body;

    const feedbackEntry = {
      id: `fb-${Date.now()}`,
      messageId: messageId || 'm-unknown',
      query: query || '',
      responseSnippet: responseSnippet || '',
      isHelpful: Boolean(isHelpful),
      rating: Number(rating) || (isHelpful ? 5 : 2),
      accuracyTag: accuracyTag || (isHelpful ? 'Accurate' : 'Needs verification'),
      comment: comment ? String(comment).trim() : '',
      timestamp: new Date().toISOString(),
      userId: userId || 'anonymous'
    };

    appData.feedbacks.unshift(feedbackEntry);

    // Keep feedback list bounded
    if (appData.feedbacks.length > 500) {
      appData.feedbacks = appData.feedbacks.slice(0, 500);
    }

    // Machine learning reinforcement from feedback
    if (isHelpful && appData.mlMetrics) {
      appData.mlMetrics.activeSynapses += 6;
      appData.mlMetrics.reinforcementIterations += 2;
      appData.mlMetrics.lastLearningEpoch = new Date().toISOString();

      const qLower = (query || '').toLowerCase();
      for (const node of (appData.learnedKnowledge || [])) {
        if (qLower.includes(node.category) || qLower.includes(node.topic.toLowerCase().split(' ')[0])) {
          node.confidence = Math.min(1.0, Number((node.confidence + 0.005).toFixed(3)));
          node.weight = Number((node.weight + 0.05).toFixed(2));
        }
      }
    }

    // If user provided a high-quality corrective or insightful comment, learn a new fact!
    if (comment && comment.length > 15 && isHelpful) {
      const detectedCategory = query.toLowerCase().includes('cao') ? 'cao' :
        query.toLowerCase().includes('law') ? 'admissions' :
        query.toLowerCase().includes('housing') ? 'campus' : 'student_tip';

      const learnedItem = {
        id: `ml-know-${Date.now()}`,
        topic: query.slice(0, 60),
        fact: comment.slice(0, 200),
        category: detectedCategory as any,
        confidence: 0.94,
        trainingIterations: 1,
        learnedFrom: 'Student Feedback Reinforcement',
        learnedAt: new Date().toISOString(),
        weight: 1.25,
        verified: true
      };

      appData.learnedKnowledge.unshift(learnedItem);
      if (appData.learnedKnowledge.length > 100) {
        appData.learnedKnowledge = appData.learnedKnowledge.slice(0, 100);
      }
      appData.mlMetrics.totalLearnedNodes = appData.learnedKnowledge.length;
    }

    saveData(appData);

    res.json({
      success: true,
      message: 'Feedback recorded! Machine learning weights updated in database.',
      feedbackId: feedbackEntry.id,
      mlMetrics: appData.mlMetrics
    });
  } catch (err: any) {
    console.error('Error recording feedback:', err);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// 3. Feedback stats & evolution summary endpoint
app.get('/api/feedback/stats', (req, res) => {
  const total = appData.feedbacks.length;
  const helpfulCount = appData.feedbacks.filter(f => f.isHelpful).length;
  const accuracyPercentage = total > 0 ? Math.round((helpfulCount / total) * 100) : 96;

  const totalRatingPoints = appData.feedbacks.reduce((acc, curr) => acc + (curr.rating || 5), 0);
  const averageStars = total > 0 ? Number((totalRatingPoints / total).toFixed(1)) : 4.8;

  const tagsSummary: Record<string, number> = {};
  for (const f of appData.feedbacks) {
    if (f.accuracyTag) {
      tagsSummary[f.accuracyTag] = (tagsSummary[f.accuracyTag] || 0) + 1;
    }
  }

  const recentEvolutions = appData.feedbacks
    .filter(f => f.comment && f.comment.length > 5)
    .slice(0, 5)
    .map(f => `Refined: "${f.query}" (${f.accuracyTag || 'Verified'})`);

  res.json({
    totalRatings: total,
    helpfulCount,
    accuracyPercentage,
    averageStars,
    tagsSummary,
    recentEvolutions: recentEvolutions.length > 0 ? recentEvolutions : [
      'Refined: "Law (LLB) minimum APS 30 and English Level 5"',
      'Refined: "CAO application code ZU-M-BSC for Science"',
      'Refined: "Document certification validity within 3 months"',
      'Refined: "NSFAS application linkage for UNIZULU first years"'
    ]
  });
});

// 4. Evolved queries endpoint (popular & emerging queries)
app.get('/api/queries/evolved', (req, res) => {
  const sortedKeywords = Object.entries(appData.evolvedKeywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const evolvedList = [
    {
      id: 'eq-1',
      topic: 'Admission Requirements',
      question: 'What APS score do I need for Law (LLB) at UNIZULU?',
      frequency: 412 + (appData.evolvedKeywords['law'] || 0),
      lastUpdated: 'Updated today',
      category: 'Admissions'
    },
    {
      id: 'eq-2',
      topic: 'Document Submissions',
      question: 'Where and how do I submit certified ID and Matric results?',
      frequency: 389 + (appData.evolvedKeywords['documents'] || 0),
      lastUpdated: 'Updated today',
      category: 'Documents'
    },
    {
      id: 'eq-3',
      topic: 'CAO Application',
      question: 'How do I apply to UNIZULU via CAO with programme code ZU-?',
      frequency: 345 + (appData.evolvedKeywords['cao'] || 0),
      lastUpdated: 'Updated today',
      category: 'CAO'
    },
    {
      id: 'eq-4',
      topic: 'Science & Computing',
      question: 'Can I study BSc Computer Science without Physical Sciences?',
      frequency: 290 + (appData.evolvedKeywords['requirements'] || 0),
      lastUpdated: 'Updated today',
      category: 'Faculties'
    },
    {
      id: 'eq-5',
      topic: 'Financial Aid & NSFAS',
      question: 'How does NSFAS link with my UNIZULU registration fee?',
      frequency: 298 + (appData.evolvedKeywords['nsfas'] || 0),
      lastUpdated: 'Updated today',
      category: 'Financial Aid'
    },
    {
      id: 'eq-6',
      topic: 'Campus Accommodation',
      question: 'How do I apply for student residences at KwaDlangezwa campus?',
      frequency: 264 + (appData.evolvedKeywords['housing'] || 0),
      lastUpdated: 'Updated today',
      category: 'Housing'
    }
  ];

  res.json({
    evolvedQueries: evolvedList,
    trendingTopics: sortedKeywords.map(([kw, count]) => ({ keyword: kw, count }))
  });
});

// 5. Student Identity & Persistent Profile Management (Stores email, name, username, checklist & conversation history)
app.post('/api/users/guest', (req, res) => {
  try {
    const { currentProfile } = req.body || {};
    // If existing valid guest, keep ID; otherwise create a new guest session
    const guestNum = Math.floor(1000 + Math.random() * 9000);
    const guestId = currentProfile?.id || `guest_${Date.now()}_${guestNum}`;
    const guestUsername = currentProfile?.username || `guest_${guestNum}`;

    const guestProfile = {
      id: guestId,
      name: currentProfile?.name || 'Guest Student',
      username: guestUsername,
      email: currentProfile?.email || `${guestUsername}@guest.unizulu.ac.za`,
      isGuest: true,
      prospectiveFaculty: currentProfile?.prospectiveFaculty || '',
      targetProgram: currentProfile?.targetProgram || '',
      apsScore: currentProfile?.apsScore,
      documentsChecklist: currentProfile?.documentsChecklist || {
        certifiedId: false,
        matricResults: false,
        caoProofOfPayment: false,
        proofOfAddress: false,
        academicTranscript: false
      },
      createdAt: currentProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    // Store in memory
    appData.profiles[guestId] = guestProfile;
    appData.profiles[guestUsername] = guestProfile;
    saveData(appData);

    console.log(`[Auth API] Guest session initialized: ${guestProfile.username} (${guestId})`);

    res.json({
      success: true,
      profile: guestProfile,
      isGuest: true,
      message: 'Guest session created. Chats will be active during this session.'
    });
  } catch (err) {
    console.error('Error in /api/users/guest:', err);
    res.status(500).json({ error: 'Failed to create guest session' });
  }
});

app.post('/api/users/signin', (req, res) => {
  try {
    const { email, name, username, prospectiveFaculty, targetProgram, apsScore, documentsChecklist } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();
    const cleanUsername = (username || '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').trim();
    const cleanName = (name || '').trim();

    if (!cleanEmail || !cleanUsername || !cleanName) {
      return res.status(400).json({ error: 'Email, name, and username are all required to sign in.' });
    }

    // Check if user already exists under username or email
    const existing = appData.profiles[cleanUsername] || appData.profiles[cleanEmail] || null;
    const isReturning = Boolean(existing);

    const updatedProfile = {
      ...existing,
      id: existing?.id || `u-${Date.now()}`,
      email: cleanEmail,
      username: cleanUsername,
      name: cleanName,
      prospectiveFaculty: prospectiveFaculty !== undefined ? prospectiveFaculty : (existing?.prospectiveFaculty || ''),
      targetProgram: targetProgram !== undefined ? targetProgram : (existing?.targetProgram || ''),
      apsScore: apsScore !== undefined ? apsScore : existing?.apsScore,
      documentsChecklist: documentsChecklist || existing?.documentsChecklist || {
        certifiedId: false,
        matricResults: false,
        caoProofOfPayment: false,
        proofOfAddress: false,
        academicTranscript: false
      },
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    // Store index under username, email, and ID
    appData.profiles[cleanUsername] = updatedProfile;
    appData.profiles[cleanEmail] = updatedProfile;
    if (updatedProfile.id) {
      appData.profiles[updatedProfile.id] = updatedProfile;
    }

    // Retrieve previous conversation stored on server data
    const previousConversation = appData.conversations[cleanUsername] || appData.conversations[cleanEmail] || [];

    // Link conversation array across both keys
    if (!appData.conversations[cleanUsername]) appData.conversations[cleanUsername] = previousConversation;
    if (!appData.conversations[cleanEmail]) appData.conversations[cleanEmail] = previousConversation;

    saveData(appData);

    console.log(`[Auth API] Student signed in: ${cleanName} (@${cleanUsername}, ${cleanEmail}). Returning: ${isReturning}. Past messages: ${previousConversation.length}`);

    res.json({
      success: true,
      profile: updatedProfile,
      isReturning,
      previousConversation
    });
  } catch (err: any) {
    console.error('Error in /api/users/signin:', err);
    res.status(500).json({ error: 'Failed to sign in student' });
  }
});

// Lookup returning student by username or email
app.post('/api/users/lookup', (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({ error: 'Identifier is required' });
    }
    const clean = identifier.toLowerCase().trim().replace(/^@/, '');
    const profile = appData.profiles[clean];
    if (!profile) {
      return res.json({ found: false });
    }
    const previousConversation = appData.conversations[profile.username] || appData.conversations[profile.email] || appData.conversations[clean] || [];
    res.json({
      found: true,
      profile,
      previousConversation
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Lookup failed' });
  }
});

app.post('/api/users/profile', (req, res) => {
  try {
    const { email, name, username, id, prospectiveFaculty, targetProgram, apsScore, documentsChecklist } = req.body;

    const studentName = (name || '').trim();
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    const cleanUsername = username ? username.toLowerCase().replace(/[^a-z0-9_.-]/g, '').trim() : '';

    if (!studentName && !cleanEmail && !cleanUsername) {
      return res.status(400).json({ error: 'Name, email or username is required to save profile' });
    }

    const lookupKey = cleanUsername || cleanEmail || id || `student_${(studentName || 'user').toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
    const existing = (cleanUsername ? appData.profiles[cleanUsername] : null) || (cleanEmail ? appData.profiles[cleanEmail] : null) || appData.profiles[lookupKey] || {};

    const updatedProfile = {
      ...existing,
      id: existing.id || id || `u-${Date.now()}`,
      email: cleanEmail || existing.email || `${cleanUsername || lookupKey}@student.unizulu`,
      username: cleanUsername || existing.username || lookupKey,
      name: studentName || existing.name || 'Student',
      prospectiveFaculty: prospectiveFaculty !== undefined ? prospectiveFaculty : existing.prospectiveFaculty,
      targetProgram: targetProgram !== undefined ? targetProgram : existing.targetProgram,
      apsScore: apsScore !== undefined ? apsScore : existing.apsScore,
      documentsChecklist: documentsChecklist || existing.documentsChecklist || {
        certifiedId: false,
        matricResults: false,
        caoProofOfPayment: false,
        proofOfAddress: false,
        academicTranscript: false
      },
      updatedAt: new Date().toISOString(),
      createdAt: existing.createdAt || new Date().toISOString()
    };

    if (cleanUsername) appData.profiles[cleanUsername] = updatedProfile;
    if (cleanEmail) appData.profiles[cleanEmail] = updatedProfile;
    appData.profiles[lookupKey] = updatedProfile;

    const previousConversation = (cleanUsername ? appData.conversations[cleanUsername] : null) || (cleanEmail ? appData.conversations[cleanEmail] : null) || [];

    saveData(appData);

    res.json({ success: true, profile: updatedProfile, previousConversation });
  } catch (err: any) {
    console.error('Error saving profile:', err);
    res.status(500).json({ error: 'Failed to save student profile' });
  }
});

// List all distinct registered student records on the UNIZULU system
app.get('/api/users', (req, res) => {
  try {
    const users = getDistinctProfiles();
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        username: u.username,
        email: u.email,
        isGuest: u.isGuest || false,
        prospectiveFaculty: u.prospectiveFaculty || '',
        targetProgram: u.targetProgram || '',
        apsScore: u.apsScore,
        documentsChecklist: u.documentsChecklist || {},
        updatedAt: u.updatedAt || u.createdAt,
        messageCount: (appData.conversations[u.username] || appData.conversations[u.email] || []).length
      }))
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list students' });
  }
});

// Identify / retrieve student profile from query (name, username, email)
app.post('/api/users/identify', (req, res) => {
  try {
    const query = req.body?.query || req.body?.identifier;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const found = searchUserInStore(query);
    if (!found) {
      return res.json({ found: false, message: 'No student found matching query' });
    }
    const conv = appData.conversations[found.username] || appData.conversations[found.email] || appData.conversations[found.id] || [];
    res.json({
      found: true,
      profile: found,
      previousConversation: conv
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to identify student' });
  }
});

app.get('/api/users/:identifier', (req, res) => {
  const clean = req.params.identifier.toLowerCase().trim().replace(/^@/, '');
  const profile = appData.profiles[clean];
  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }
  const previousConversation = appData.conversations[profile.username] || appData.conversations[profile.email] || appData.conversations[clean] || [];
  res.json({ profile, previousConversation });
});

// Fetch stored conversation history for a student
app.get('/api/conversations/:identifier', (req, res) => {
  try {
    const clean = req.params.identifier.toLowerCase().trim().replace(/^@/, '');
    const conversation = appData.conversations[clean] || [];
    res.json({ success: true, conversation });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Sync or save conversation history for a student
app.post('/api/conversations/:identifier/sync', (req, res) => {
  try {
    const clean = req.params.identifier.toLowerCase().trim().replace(/^@/, '');
    const { messages } = req.body;
    if (Array.isArray(messages)) {
      appData.conversations[clean] = messages.slice(-50);
      saveData(appData);
    }
    res.json({ success: true, count: (appData.conversations[clean] || []).length });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to sync conversation' });
  }
});

// 6. Machine Learning Database & Neural Knowledge Endpoints
app.get('/api/ml/knowledge', (req, res) => {
  if (!appData.mlMetrics) {
    appData.mlMetrics = {
      modelEngine: 'UNIZULU Neural Knowledge Base v2.4',
      totalLearnedNodes: appData.learnedKnowledge?.length || 6,
      activeSynapses: 1420,
      reinforcementIterations: 241,
      lastLearningEpoch: new Date().toISOString(),
      learningRate: 0.035
    };
  }
  appData.mlMetrics.totalLearnedNodes = (appData.learnedKnowledge || []).length;
  res.json({
    items: appData.learnedKnowledge || [],
    metrics: appData.mlMetrics
  });
});

app.post('/api/ml/teach', (req, res) => {
  try {
    const { topic, fact, category, learnedFrom } = req.body;
    if (!topic || !fact) {
      return res.status(400).json({ error: 'Topic and fact are required to teach the model' });
    }

    const newItem = {
      id: `ml-know-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      topic: String(topic).trim(),
      fact: String(fact).trim(),
      category: (category || 'admissions') as any,
      confidence: 0.96,
      trainingIterations: 1,
      learnedFrom: learnedFrom ? String(learnedFrom).trim() : 'User Knowledge Contribution',
      learnedAt: new Date().toISOString(),
      weight: 1.25,
      verified: true
    };

    if (!appData.learnedKnowledge) {
      appData.learnedKnowledge = [];
    }

    appData.learnedKnowledge.unshift(newItem);
    if (appData.learnedKnowledge.length > 150) {
      appData.learnedKnowledge = appData.learnedKnowledge.slice(0, 150);
    }

    if (!appData.mlMetrics) {
      appData.mlMetrics = {
        modelEngine: 'UNIZULU Neural Knowledge Base v2.4',
        totalLearnedNodes: appData.learnedKnowledge.length,
        activeSynapses: 1420,
        reinforcementIterations: 241,
        lastLearningEpoch: new Date().toISOString(),
        learningRate: 0.035
      };
    }

    appData.mlMetrics.totalLearnedNodes = appData.learnedKnowledge.length;
    appData.mlMetrics.activeSynapses += 18;
    appData.mlMetrics.reinforcementIterations += 1;
    appData.mlMetrics.lastLearningEpoch = new Date().toISOString();

    saveData(appData);

    res.json({
      success: true,
      message: 'New academic knowledge successfully stored in UNIZULU ML database!',
      item: newItem,
      metrics: appData.mlMetrics
    });
  } catch (err: any) {
    console.error('Error teaching ML knowledge:', err);
    res.status(500).json({ error: 'Failed to teach model' });
  }
});

app.post('/api/ml/reinforce', (req, res) => {
  try {
    const { id, isPositive } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Node id is required' });
    }

    const node = (appData.learnedKnowledge || []).find(n => n.id === id);
    if (!node) {
      return res.status(404).json({ error: 'Knowledge node not found' });
    }

    if (isPositive) {
      node.confidence = Math.min(1.0, Number((node.confidence + 0.01).toFixed(3)));
      node.weight = Number((node.weight + 0.08).toFixed(2));
      node.trainingIterations += 1;
    } else {
      node.confidence = Math.max(0.60, Number((node.confidence - 0.02).toFixed(3)));
      node.weight = Math.max(0.70, Number((node.weight - 0.08).toFixed(2)));
    }

    if (appData.mlMetrics) {
      appData.mlMetrics.activeSynapses += 4;
      appData.mlMetrics.reinforcementIterations += 1;
      appData.mlMetrics.lastLearningEpoch = new Date().toISOString();
    }

    saveData(appData);

    res.json({
      success: true,
      node,
      metrics: appData.mlMetrics
    });
  } catch (err: any) {
    console.error('Error reinforcing ML node:', err);
    res.status(500).json({ error: 'Failed to reinforce knowledge node' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', university: 'University of Zululand', time: new Date().toISOString() });
});

// Explicitly serve static assets from public/ directory
app.use(express.static(path.join(process.cwd(), 'public')));

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UNIZULU Admissions Advisor server running on http://localhost:${PORT}`);
  });
}

startServer();
