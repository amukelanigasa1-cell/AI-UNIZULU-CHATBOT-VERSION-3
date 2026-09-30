import { HANDBOOK_MODULES, type CourseModule } from '../data/handbookModules.ts';
import { FCAL_MODULE_COURSES } from '../data/fcalModules.ts';
import { UNIZULU_FACULTIES } from '../data/unizuluKnowledge.ts';

export interface CourseQueryMatchResult {
  handled: boolean;
  text: string;
  coursesFound?: CourseModule[];
}

/**
 * Returns clean faculty name from code
 */
function getFacultyFullName(code: string): string {
  switch (code) {
    case 'CAL':
      return 'Faculty of Commerce, Administration & Law (FCAL)';
    case 'HSS':
      return 'Faculty of Humanities & Social Sciences (HSS)';
    case 'EDU':
      return 'Faculty of Education (EDU)';
    case 'SAE':
      return 'Faculty of Science, Agriculture & Engineering (SAE)';
    default:
      return 'University of Zululand Faculty';
  }
}

/**
 * Map module code prefix to typical qualification pathways
 */
function getRelatedQualifications(moduleCode: string, department: string): string[] {
  const upper = moduleCode.toUpperCase();
  const pathways: string[] = [];

  if (upper.startsWith('2ACC') || upper.startsWith('2AUD') || upper.startsWith('2TAX') || upper.startsWith('2MAC')) {
    pathways.push('Bachelor of Commerce in Accounting Science (SAICA Accredited)');
    pathways.push('Bachelor of Commerce in Accounting (General)');
    pathways.push('BCom Business Management & Economics');
    pathways.push('Career pathways: Chartered Accountant (CA(SA)), Internal Auditor, Tax Practitioner, Chief Financial Officer');
  } else if (upper.startsWith('2LAW') || upper.startsWith('2CML') || upper.startsWith('2CPL') || upper.startsWith('2IPL') || upper.startsWith('2PBL')) {
    pathways.push('Bachelor of Laws (LLB - 4-Year Professional Legal Degree)');
    pathways.push('BA in Law & Social Sciences');
    pathways.push('BCom in Commercial Law & Business');
    pathways.push('Career pathways: Attorney, Advocate, Magistrate, Corporate Legal Advisor, State Prosecutor');
  } else if (upper.startsWith('2MGN') || upper.startsWith('2FIN') || upper.startsWith('2MKT')) {
    pathways.push('Bachelor of Commerce in Business Management');
    pathways.push('Bachelor of Commerce in Marketing');
    pathways.push('Diploma in Management Studies');
    pathways.push('Career pathways: Business Analyst, General Manager, Financial Manager, Marketing Strategist');
  } else if (upper.startsWith('2ECN') || upper.startsWith('2BNK')) {
    pathways.push('Bachelor of Commerce in Economics & Banking');
    pathways.push('BCom Economics & Business Management');
    pathways.push('Career pathways: Economist, Investment Banker, Financial Market Analyst, Reserve Bank Policy Officer');
  } else if (upper.startsWith('2PAD') || upper.startsWith('2LGM')) {
    pathways.push('Bachelor of Public Administration (BAdmin)');
    pathways.push('Diploma in Public Administration / Local Government');
    pathways.push('Career pathways: Municipal Manager, Public Policy Analyst, Government Administrator, Diplomat');
  } else if (upper.startsWith('1SWK')) {
    pathways.push('Bachelor of Social Work (BSW - 4-Year SACSSP Accredited Professional Degree)');
    pathways.push('Career pathways: Registered Social Worker, Clinical Social Worker, Community Development Specialist');
  } else if (upper.startsWith('1PSY')) {
    pathways.push('Bachelor of Arts in Psychology & Human Sciences');
    pathways.push('Bachelor of Social Sciences');
    pathways.push('Career pathways: Psychological Counsellor, HR Talent Specialist, Behavioural Researcher');
  } else {
    pathways.push(`Undergraduate programmes within the ${department}`);
  }

  return pathways;
}

/**
 * Format a single course module in rich, authoritative detail
 */
export function formatSingleCourseDetails(mod: CourseModule): string {
  const facultyName = getFacultyFullName(mod.faculty);
  const pathways = getRelatedQualifications(mod.code, mod.department);

  let text = `### 📘 Course Profile: **${mod.code} — ${mod.name}** 🎓\n\n`;
  text += `• **Official Course Code**: \`${mod.code}\`\n`;
  text += `• **Full Course Title**: **${mod.name}**\n`;
  text += `• **Faculty**: **${facultyName}**\n`;
  text += `• **Academic Department**: **${mod.department}**\n`;
  text += `• **NQF Level**: Level ${mod.nqfLevel} (${mod.nqfLevel === 5 ? 'First Year Undergraduate' : mod.nqfLevel === 6 ? 'Second Year Undergraduate' : mod.nqfLevel === 7 ? 'Third Year Undergraduate / Senior Degree' : 'Professional Honours / Level 8'})\n`;
  text += `• **SAQA Credit Value**: **${mod.credits} Credits**\n`;
  text += `• **Period / Semester**: **${mod.semester || 'Semester 1 or 2 (Consult Timetable)'}**\n`;

  // Prerequisites
  if (mod.prerequisites && mod.prerequisites.length > 0) {
    text += `• **Prerequisites**: \`${mod.prerequisites.join(', ')}\` (Must be completed & passed before enrolment)\n`;
  } else {
    text += `• **Prerequisites**: *None* (Open entry for registered students meeting degree admission criteria)\n`;
  }

  // Co-requisites
  if (mod.corequisites && mod.corequisites.length > 0) {
    text += `• **Co-requisites**: \`${mod.corequisites.join(', ')}\` (Must be taken concurrently or passed previously)\n`;
  }

  // Curriculum & Description
  text += `\n📖 **Curriculum Description & Syllabus:**\n${mod.description}\n`;

  // Related Degrees & Pathways
  text += `\n🎯 **Associated Qualifications & Pathways:**\n`;
  for (const pw of pathways) {
    text += `• ${pw}\n`;
  }

  return text;
}

/**
 * Format overview of multiple courses in a clean table or bulleted list
 */
function formatMultipleCoursesOverview(modules: CourseModule[], heading: string): string {
  let text = `### 📚 ${heading} (${modules.length} modules found)\n\n`;
  text += `Here are the official courses matching your query:\n\n`;

  for (const m of modules.slice(0, 10)) {
    text += `• **\`${m.code}\` — ${m.name}** (${m.credits} credits, Level ${m.nqfLevel}, ${m.semester || 'Semester 1'})\n`;
    text += `  *Department: ${m.department} | Faculty: ${m.faculty === 'CAL' ? 'FCAL' : m.faculty}*\n`;
    text += `  *${m.description.slice(0, 140)}${m.description.length > 140 ? '...' : ''}*\n\n`;
  }

  if (modules.length > 10) {
    text += `*...and ${modules.length - 10} more modules available in this category.*\n\n`;
  }

  text += `💡 *Tip: Type any specific course code (e.g. \`${modules[0].code}\`) or course title for full syllabus, prerequisites, and credit rules!*`;
  return text;
}

/**
 * Comprehensive Overview of ALL New Courses Added across the 2026 Handbook
 */
export function formatAllNewCoursesOverview(): string {
  const fcalCount = FCAL_MODULE_COURSES.length;
  const totalCount = HANDBOOK_MODULES.length;

  return `### 🎓 Official UNIZULU Undergraduate Course Modules Directory 📚✨

The chatbot now contains the **official 2026 UNIZULU Undergraduate Handbooks Course Directory**, featuring **${totalCount}+ accredited course modules** with complete syllabi, credit weighting, NQF levels, prerequisites, and course descriptions!

Here is an overview of the key undergraduate courses across our faculties:

---

#### 🏛️ 1. Faculty of Commerce, Administration and Law (FCAL) — ${fcalCount} Course Modules
Home to the SAICA-accredited BCom Accounting Science, 4-Year Bachelor of Laws (LLB), BAdmin, and BCom double majors:

• **Accounting & Auditing (SAICA Pathway)**:
  - \`2ACC101\` (Accounting 1A, 16cr) & \`2ACC102\` (Accounting 1B, 16cr)
  - \`2ACC201\` (Accounting 2A, 16cr) & \`2ACC202\` (Accounting 2B, 16cr)
  - \`2ACC301\` / \`2ACC302\` (Financial Accounting 3A & 3B, 32cr each)
  - \`2AUD201\` / \`2AUD202\` (Auditing 2A & 2B) & \`2AUD301\` / \`2AUD302\` (Auditing 3A & 3B)
  - \`2TAX301\` & \`2TAX302\` (Taxation 3A & 3B)
  - \`2MAC201\` & \`2MAC301\` (Management Accounting & Finance)

• **Business Management & Finance**:
  - \`2MGN101\` (Business Management 1A, 16cr) & \`2MGN102\` (Business Management 1B, 16cr)
  - \`2MGN201\` & \`2MGN202\` (General & Operations Management)
  - \`2FIN201\` & \`2FIN301\` (Financial Management)
  - \`2MKT201\` & \`2MKT301\` (Marketing Management)

• **Economics & Banking**:
  - \`2ECN101\` (Economics 1A: Microeconomics, 16cr)
  - \`2ECN102\` (Economics 1B: Macroeconomics, 16cr)
  - \`2ECN201\` & \`2ECN202\` (Intermediate Micro & Macroeconomics)
  - \`2BNK201\` & \`2BNK301\` (Commercial Banking & Financial Markets)

• **Law (LLB & Legal Studies)**:
  - \`2LAW101\` (Introduction to Law)
  - \`2CML101\` & \`2CML102\` (Commercial Law 1A & 1B)
  - \`2CPL101\` (Constitutional Law)
  - \`2IPL101\` & \`2IPL102\` (Criminal Law 1A & 1B)
  - Law of Contract, Family Law, Law of Delict, Labour Law, Civil Procedure, Criminal Procedure, Interpretation of Statutes, Human Rights Law, African Customary Law

• **Public Administration & Local Government**:
  - \`2PAD101\` & \`2PAD102\` (Public Administration 1A & 1B)
  - \`2PAD201\`, \`2PAD202\`, \`2PAD301\`, \`2PAD302\`
  - \`2LGM201\` (Local Government Management)

---

#### 🏛️ 2. Faculty of Humanities & Social Sciences (HSS)
• **Social Work (SACSSP Accredited)**:
  - \`1SWK111\` (Introduction to Social Work 1A) & \`1SWK112\` (Social Work 1B)
  - \`1SWK211\`, \`1SWK212\`, \`1SWK311\`, \`1SWK411\` (Fieldwork Practicum & Casework)

• **Psychology & Human Sciences**:
  - \`1PSY111\` (Introduction to Psychology 1A) & \`1PSY112\` (Psychology 1B)
  - \`1PSY211\` (Developmental Psychology), \`1PSY311\` (Abnormal Psychology & Assessment)

• **Communication Science, Sociology, History & Languages**:
  - \`1COMS11\` / \`1CMS111\` (Communication Science 1A)
  - Development Studies, English Literature, isiZulu Studies, Political Science, Anthropology

---

💡 **Ask me for full info on ANY course!**
Try asking:
• *"Tell me about 2ACC101"*
• *"What do we study in Constitutional Law?"*
• *"What are the prerequisites for Auditing 2A?"*
• *"Tell me about Business Management 1A"*
• *"What courses are in the Accounting department?"*`;
}

/**
 * Searches the handbook for course matches
 */
export function searchHandbookCourses(query: string): CourseModule[] {
  const lower = query.toLowerCase().trim();
  const cleanTerms = lower
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2 && !['course', 'courses', 'module', 'modules', 'tell', 'about', 'what', 'info', 'information', 'unizulu', 'added', 'new', 'offer', 'full', 'please', 'the', 'and', 'for', 'with', 'you', 'learn', 'can'].includes(w));

  if (cleanTerms.length === 0) return [];

  // 1. Direct code search (e.g. 2ACC101, 2LRC201)
  const codeMatch = lower.match(/\b([1-4][a-z]{3}[0-9]{3}[a-z]?)\b/i);
  if (codeMatch) {
    const targetCode = codeMatch[1].toUpperCase();
    const exact = HANDBOOK_MODULES.find(m => m.code.toUpperCase() === targetCode);
    if (exact) return [exact];
  }

  // 2. Direct exact or partial name match
  const fullPhrase = cleanTerms.join(' ');
  const directPhraseMatches = HANDBOOK_MODULES.filter(m => {
    const mName = m.name.toLowerCase();
    const mCode = m.code.toLowerCase();
    return mName.includes(fullPhrase) || fullPhrase.includes(mName) || mCode === fullPhrase;
  });
  if (directPhraseMatches.length > 0) {
    return directPhraseMatches;
  }

  // 3. Multi-term match: all clean terms present in name
  const allTermsInName = HANDBOOK_MODULES.filter(m => {
    const mName = m.name.toLowerCase();
    return cleanTerms.every(term => mName.includes(term));
  });
  if (allTermsInName.length > 0) {
    return allTermsInName;
  }

  // 4. Keyword scoring
  const scored = HANDBOOK_MODULES.map(m => {
    let score = 0;
    const mCode = m.code.toLowerCase();
    const mName = m.name.toLowerCase();
    const mDept = m.department.toLowerCase();
    const mDesc = m.description.toLowerCase();

    for (const term of cleanTerms) {
      if (mCode.includes(term)) score += 10;
      if (mName.includes(term)) score += 8;
      if (mDept.includes(term)) score += 4;
      if (mDesc.includes(term)) score += 2;
    }
    return { module: m, score };
  }).filter(item => item.score > 0);

  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.module);
}

/**
 * Master Course and Module Query Handler
 */
export function handleCourseAndModuleQuery(
  userMessage: string,
  langCode: string = 'en'
): CourseQueryMatchResult {
  const lower = (userMessage || '').toLowerCase().trim();

  // Guard against degree / faculty / admissions queries to prevent dumping unnecessary courses
  const isAdmissionsOrDegreeQuery = (
    lower.includes('bachelor') ||
    lower.includes('diploma in') ||
    lower.includes('degree') ||
    lower.includes('admission requirements') ||
    lower.includes('minimum aps') ||
    lower.includes('cao code') ||
    lower.includes('faculty of') ||
    lower.includes('what can i study') ||
    lower.includes('how do i apply') ||
    lower.includes('recommend') ||
    lower.includes('across all faculties') ||
    lower.includes('what are the general admission')
  );
  if (isAdmissionsOrDegreeQuery) {
    return { handled: false, text: '' };
  }

  // 1. Inquiries about "new courses added", "courses added", "what courses were added", etc.
  const isAskingAboutNewCourses = (
    /\b(new\s+courses?(\s+added)?|courses?(\s+(we|you|have\s+been|were)\s+added|added\s+courses?)|what\s+courses\s+(are|were)\s+added|list\s+(the\s+)?new\s+courses|modules?\s+added|what\s+modules\s+(do\s+you\s+have|are\s+added|are\s+available))\b/i.test(lower) ||
    ((lower.includes('course') || lower.includes('module')) && (lower.includes('added') || lower.includes('new') || lower.includes('recognize')))
  );

  if (isAskingAboutNewCourses) {
    return {
      handled: true,
      text: formatAllNewCoursesOverview(),
      coursesFound: HANDBOOK_MODULES
    };
  }

  // 2. Direct code pattern: e.g. 2ACC101, 2LAW101, 1SWK111
  const codeMatch = lower.match(/\b([1-4][a-z]{3}[0-9]{3}[a-z]?)\b/i);
  if (codeMatch) {
    const targetCode = codeMatch[1].toUpperCase();
    const foundModule = HANDBOOK_MODULES.find(m => m.code.toUpperCase() === targetCode);
    if (foundModule) {
      return {
        handled: true,
        text: formatSingleCourseDetails(foundModule),
        coursesFound: [foundModule]
      };
    }
  }

  // 3. Search for matches using searchHandbookCourses ONLY if query explicitly asks about a course/module/syllabus
  const isExplicitCourseQuery = (
    lower.includes('course') || 
    lower.includes('module') || 
    lower.includes('syllabus') || 
    lower.includes('prerequisite') ||
    lower.includes('curriculum')
  );

  if (isExplicitCourseQuery) {
    // 4. Department / Field Inquiries (e.g., "Accounting modules", "Law courses", "Economics courses")
    if (/\b(accounting\s+(modules?|courses?)|modules?\s+in\s+accounting)\b/i.test(lower)) {
      const accModules = HANDBOOK_MODULES.filter(m => m.department.toLowerCase().includes('accounting'));
      return {
        handled: true,
        text: formatMultipleCoursesOverview(accModules, 'Department of Accounting and Auditing Course Modules'),
        coursesFound: accModules
      };
    }

    if (/\b(law\s+(modules?|courses?)|modules?\s+in\s+law|llb\s+modules?)\b/i.test(lower)) {
      const lawModules = HANDBOOK_MODULES.filter(m => m.department.toLowerCase().includes('law') || m.code.startsWith('2L') || m.code.startsWith('2C'));
      return {
        handled: true,
        text: formatMultipleCoursesOverview(lawModules, 'Department of Law (LLB) Course Modules'),
        coursesFound: lawModules
      };
    }

    if (/\b(business\s+management\s+(modules?|courses?)|management\s+(modules?|courses?))\b/i.test(lower)) {
      const mgmtModules = HANDBOOK_MODULES.filter(m => m.department.toLowerCase().includes('management') || m.code.startsWith('2M'));
      return {
        handled: true,
        text: formatMultipleCoursesOverview(mgmtModules, 'Department of Business Management Course Modules'),
        coursesFound: mgmtModules
      };
    }

    if (/\b(economics\s+(modules?|courses?)|banking\s+(modules?|courses?))\b/i.test(lower)) {
      const econModules = HANDBOOK_MODULES.filter(m => m.department.toLowerCase().includes('economics') || m.code.startsWith('2E') || m.code.startsWith('2B'));
      return {
        handled: true,
        text: formatMultipleCoursesOverview(econModules, 'Department of Economics & Banking Course Modules'),
        coursesFound: econModules
      };
    }

    const matches = searchHandbookCourses(userMessage);
    if (matches.length === 1) {
      return {
        handled: true,
        text: formatSingleCourseDetails(matches[0]),
        coursesFound: matches
      };
    } else if (matches.length >= 2 && matches.length <= 4) {
      return {
        handled: true,
        text: formatMultipleCoursesOverview(matches, `Matching Courses in UNIZULU Handbook`),
        coursesFound: matches
      };
    }
  }

  return { handled: false, text: '' };
}

/**
 * Extracts relevant course modules to inject into the system instruction
 */
export function getRelevantCoursesForPrompt(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  // Do not inject course modules if asking about degree requirements, general admissions, or faculty overviews
  if (
    lower.includes('admission requirements') || 
    lower.includes('minimum aps') || 
    lower.includes('cao code') || 
    lower.includes('what can i study') || 
    lower.includes('how do i apply') ||
    lower.includes('recommend') ||
    lower.includes('faculty of')
  ) {
    return '';
  }

  const matches = searchHandbookCourses(userMessage);
  if (!matches || matches.length === 0) return '';

  const topMatches = matches.slice(0, 3);
  let promptText = `\nOFFICIAL UNIZULU 2026 COURSE & MODULE DIRECTORY (RELEVANT MATCHES):\n`;

  for (const m of topMatches) {
    promptText += `• Module: ${m.code} (${m.name}) | Faculty: ${m.faculty} | Dept: ${m.department} | Credits: ${m.credits} | Level: ${m.nqfLevel} | Semester: ${m.semester || 'N/A'}\n`;
    promptText += `  Prerequisites: ${m.prerequisites && m.prerequisites.length > 0 ? m.prerequisites.join(', ') : 'None'}\n`;
    promptText += `  Description: ${m.description}\n\n`;
  }

  promptText += `DIRECTIVE: Only refer to these course modules if the student specifically asked about this individual course curriculum. DO NOT dump or list these courses unsolicited when answering questions about degrees, admission requirements, or faculties.\n`;
  return promptText;
}
