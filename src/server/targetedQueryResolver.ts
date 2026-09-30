import { UNIZULU_FACULTIES, type FacultyDetail, type FacultyDegree } from '../data/unizuluKnowledge.ts';
import { HANDBOOK_MODULES, type CourseModule } from '../data/handbookModules.ts';
import { formatSingleCourseDetails } from './courseKnowledge.ts';

export interface TargetedQueryResult {
  handled: boolean;
  text: string;
  source?: string;
}

/**
 * Normalizes text for robust comparison
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

/**
 * 1. Resolves Quick Suggestion Prompts from the Cover Page
 */
export function resolveCoverPageQuickSuggestion(lowerMsg: string): TargetedQueryResult | null {
  // Quick Prompt 1: What undergraduate qualifications can I study across all faculties?
  if (
    lowerMsg.includes('what undergraduate qualifications can i study') ||
    (lowerMsg.includes('what can i study') && lowerMsg.includes('unizulu')) ||
    (lowerMsg.includes('qualifications') && lowerMsg.includes('all faculties'))
  ) {
    return {
      handled: true,
      source: 'UNIZULU 2026 Academic Catalog',
      text: `### 🎓 Undergraduate Qualifications at the University of Zululand (UNIZULU) 🏛️✨

UNIZULU offers a wide range of accredited undergraduate programmes across **4 academic faculties**, structured to prepare you for impactful careers in industry, government, and society:

---

#### ⚖️ 1. Faculty of Commerce, Administration and Law (FCAL)
*Campuses: KwaDlangezwa & Richards Bay*
• **Flagship Degrees**: 
  - **Bachelor of Laws (LLB)** (4 Years, APS 30)
  - **BCom in Accounting Science** (SAICA Accredited, APS 28)
  - **BCom Degrees**: Accounting, Business Management, Economics, Banking, Management Information Systems (APS 28)
  - **Bachelor of Public Administration (BAdmin)** (APS 24)
• **Career-Focused Diplomas**: Diploma in Management Studies, Public Relations, and Logistics Management (Richards Bay Campus).

---

#### 🔬 2. Faculty of Science, Agriculture and Engineering (SAE)
*Campuses: KwaDlangezwa & Richards Bay*
• **Science & Technology**: BSc in Computer Science, Biochemistry, Microbiology, Hydrology, Physics, Chemistry, and Mathematics (APS 28–30).
• **Agriculture**: BSc in Agriculture (Agronomy, Animal Science, Agribusiness) (APS 28).
• **Engineering**: Diplomas and Bachelor of Engineering Technology programmes.
• **Health Sciences**: Bachelor of Nursing Science (APS 30).

---

#### 🌍 3. Faculty of Humanities and Social Sciences (HSS)
*Campus: KwaDlangezwa*
• **Social Work**: **Bachelor of Social Work (BSW)** (4 Years, SACSSP Accredited, APS 28).
• **Humanities & Arts**: BA in Psychology, Communication Science, Development Studies, English, isiZulu, Sociology, History, and Performing Arts (APS 26–28).

---

#### 📚 4. Faculty of Education (EDU)
*Campus: KwaDlangezwa*
• **Teaching Qualifications**: **Bachelor of Education (BEd)** across 3 phases:
  - BEd in Foundation Phase Teaching (Grades R–3) (APS 26)
  - BEd in Intermediate Phase Teaching (Grades 4–7) (APS 26)
  - BEd in Senior Phase & FET Teaching (Grades 8–12) (APS 26)

---

💡 *Which field or qualification would you like to explore further? You can ask me for the exact APS requirements, CAO codes, or subjects for any specific degree!*`
    };
  }

  // Quick Prompt 2: General admission requirements and minimum APS scores
  if (
    lowerMsg.includes('general admission requirements and minimum aps scores') ||
    (lowerMsg.includes('admission requirements') && lowerMsg.includes('minimum aps') && lowerMsg.includes('general')) ||
    lowerMsg.includes('check requirements')
  ) {
    return {
      handled: true,
      source: 'UNIZULU Admissions Policy 2026',
      text: `### 📋 UNIZULU General Admission Requirements & APS Benchmarks 🎯✨

Admission into the University of Zululand requires a National Senior Certificate (NSC) or equivalent with the relevant qualification endorsement:

---

#### 1. General Admission Benchmarks by Qualification Type:
• **Bachelor's Degrees (e.g. LLB, BCom, BSc, BEd, BSW)**:
  - **Endorsement**: NSC with Bachelor's Degree pass.
  - **APS Score Range**: Typically **26 to 32 points** (depending on programme competition).
  - **English Requirement**: English Home Language or First Additional Language (FAL) at **Level 4 (50–59%)** minimum.
  - **Mathematics**: Pure Mathematics Level 4 (50%+) for Science/Engineering/Accounting; or Maths Lit Level 4–6 for Law, Humanities, and Education.

• **National Diplomas (e.g. Management, Public Relations, Transport)**:
  - **Endorsement**: NSC with Diploma pass.
  - **APS Score Range**: Minimum **22 to 26 points**.
  - **English Requirement**: English Level 3 (40%) or Level 4 (50%).

• **Higher Certificates**:
  - **Endorsement**: NSC with Higher Certificate pass.
  - **APS Score Range**: Minimum **19 to 22 points**.

---

#### 2. Key Subject Notes:
• **Life Orientation (LO)** is generally excluded when calculating the APS for admission ranking at UNIZULU.
• Meeting the minimum requirements ensures your application is considered, but high-demand programmes (such as Law, Nursing, and Accounting Science) select applicants based on competitive ranking.

💡 *Would you like to calculate your exact APS score or check requirements for a specific degree?*`
    };
  }

  // Quick Prompt 3: Course Recommendation based on subject performance and interests
  if (
    lowerMsg.includes('recommend degrees and diplomas at unizulu based on my subject performance') ||
    (lowerMsg.includes('recommend') && (lowerMsg.includes('performance') || lowerMsg.includes('marks') || lowerMsg.includes('interest')))
  ) {
    return {
      handled: true,
      source: 'UNIZULU Academic Advising Framework',
      text: `### 🎯 Personalized Academic Programme Recommendation 💡✨

I would love to help you find the best undergraduate programmes tailored to your academic strengths and future career ambitions!

To give you the most accurate recommendations, please tell me:

1. **What subjects are you taking in Grade 11 or Matric?**
2. **Did you take Pure Mathematics or Mathematical Literacy?** (And what is your approximate percentage or level?)
3. **What is your estimated APS score?** (If you haven't calculated it yet, you can use our **APS Calculator** tab on the left!)
4. **What career fields interest you most?**
   - ⚖️ Legal, Governance & Public Policy (e.g. Law, Public Administration)
   - 💼 Commerce, Business & Finance (e.g. Accounting, Economics, Banking, Management)
   - 💻 Technology, Science & Agriculture (e.g. Computer Science, Hydrology, Agronomy)
   - 🩺 Healthcare & Community Support (e.g. Nursing, Social Work, Psychology)
   - 🍎 Education & Teaching (e.g. Foundation, Intermediate, or High School Teaching)

Reply with your subjects or interests, and I will recommend the top UNIZULU degrees that match your profile!`
    };
  }

  // Quick Prompt 4: Apply via CAO step by step
  if (
    lowerMsg.includes('apply to the university of zululand through the central applications office') ||
    lowerMsg.includes('cao step by step') ||
    (lowerMsg.includes('apply') && lowerMsg.includes('cao') && lowerMsg.includes('how'))
  ) {
    return {
      handled: true,
      source: 'Central Applications Office (CAO) & UNIZULU Admissions',
      text: `### 📝 Step-by-Step Guide: Applying to UNIZULU via CAO 🌐✨

All prospective undergraduate students must apply through the **Central Applications Office (CAO)**. Follow these 5 clear steps:

---

#### **Step 1: Visit the CAO Portal**
• Go to the official website: **[www.cao.ac.za](https://www.cao.ac.za)**.
• Click on **"Apply Now"** to begin a new application.

#### **Step 2: Enter Your Personal & Academic Information**
• Enter your South African ID Number (or Passport Number for international applicants).
• Provide your Grade 11 final marks (if currently in Matric) or your National Senior Certificate (NSC) results (if already completed).

#### **Step 3: Select Your UNIZULU Programme Choices**
• You can choose up to **6 study choices** on your CAO form across universities in KwaZulu-Natal.
• Look for UNIZULU programmes using the official **'ZU-' codes**:
  - \`ZU-M-...\` = **KwaDlangezwa Main Campus** (e.g., \`ZU-M-LLB\` for Bachelor of Laws).
  - \`ZU-R-...\` = **Richards Bay Campus** (e.g., \`ZU-R-NDM\` for Diploma in Management).

#### **Step 4: Pay the CAO Application Fee**
• **South African Citizens**: **R250** (On-time application fee).
• Payment can be made online via debit/credit card, or at EasyPay outlets (Pick n Pay, Checkers, Shoprite) using your CAO payment slip.

#### **Step 5: Upload Supporting Documents**
• Certified copy of your **Identity Document (ID)**.
• Certified copy of your **Grade 11 final report** or **Matric Statement of Results**.
• Proof of payment (if not paid online).
• Upload these on the CAO website under **"Upload My Documents"**.

---

💡 *Need the specific CAO code for a particular qualification? Just ask me!*`
    };
  }

  return null;
}

/**
 * 2. Resolves Faculty-Level Questions (e.g. "Tell me about FCAL", "Faculty of Education", etc.)
 */
export function resolveFacultyOverviewQuery(lowerMsg: string): TargetedQueryResult | null {
  // Only trigger if asking specifically about a faculty in general, NOT about a specific degree or module code
  const isFacultyQuery = (
    lowerMsg.includes('faculty of') ||
    lowerMsg.includes('tell me about the faculty') ||
    lowerMsg.includes('overview of the faculty') ||
    (lowerMsg.includes('faculty') && (lowerMsg.includes('commerce') || lowerMsg.includes('science') || lowerMsg.includes('education') || lowerMsg.includes('humanities') || lowerMsg.includes('fcal') || lowerMsg.includes('sae') || lowerMsg.includes('hss')))
  );

  // If asking about a specific degree, do NOT treat as faculty overview
  if (lowerMsg.includes('bachelor of') || lowerMsg.includes('llb') || lowerMsg.includes('cao code') || lowerMsg.includes('minimum aps for') || lowerMsg.includes('requirements for')) {
    return null;
  }

  if (!isFacultyQuery) return null;

  // Faculty of Commerce, Administration and Law
  if (lowerMsg.includes('commerce') || lowerMsg.includes('cal') || lowerMsg.includes('fcal') || lowerMsg.includes('law')) {
    const fcal = UNIZULU_FACULTIES.find(f => f.code === 'CAL');
    return {
      handled: true,
      source: 'Faculty of Commerce, Administration and Law (FCAL) 2026 Handbook',
      text: `### ⚖️ Faculty of Commerce, Administration and Law (FCAL) 🏛️✨

• **Campuses**: **KwaDlangezwa Main Campus** (D-Block) & **Richards Bay Coastal Campus**.
• **Accreditation**: Fully accredited by the Council on Higher Education (CHE), SAQA, and the South African Institute of Chartered Accountants (SAICA).

#### 🎯 Key Academic Departments & Schools:
1. **Accounting & Auditing**: Delivers SAICA-accredited CA(SA) training and accounting programmes.
2. **Law (Private, Public, Criminal & Procedural Law)**: Offers the premier 4-Year Bachelor of Laws (LLB).
3. **Business Management & Marketing**: General management, financial management, and entrepreneurship.
4. **Economics & Banking**: Microeconomics, macroeconomics, banking operations, and financial markets.
5. **Public Administration**: Public policy, local government administration, and governance.

#### 🎓 Flagship Undergraduate Degrees & Minimum APS:
• **Bachelor of Laws (LLB)**: 4 Years • Minimum APS: **30 Points** (Pure Maths 40% OR Maths Lit 50%, English 50%) • CAO: \`ZU-M-LLB\`
• **BCom Accounting Science (SAICA)**: 4 Years • Minimum APS: **28 Points** (Pure Maths 50%, English 50%) • CAO: \`ZU-M-BCA\`
• **BCom (General / Double Majors)**: 3 Years • Minimum APS: **28 Points** • CAO: \`ZU-M-BCE\`
• **Bachelor of Public Administration (BAdmin)**: 3 Years • Minimum APS: **24 Points** • CAO: \`ZU-M-PAD\`
• **Diploma in Management Studies**: 3 Years (Richards Bay) • Minimum APS: **22 Points** • CAO: \`ZU-R-NDM\`

💡 *Would you like detailed admission requirements for a specific degree in this faculty?*`
    };
  }

  // Faculty of Science, Agriculture and Engineering
  if (lowerMsg.includes('science') || lowerMsg.includes('sae') || lowerMsg.includes('agriculture') || lowerMsg.includes('engineering')) {
    const sae = UNIZULU_FACULTIES.find(f => f.code === 'SAE');
    return {
      handled: true,
      source: 'Faculty of Science, Agriculture & Engineering (SAE) 2026 Calendar',
      text: `### 🔬 Faculty of Science, Agriculture and Engineering (SAE) 🌾✨

• **Campuses**: **KwaDlangezwa Main Campus** (Natural Sciences & Agriculture) & **Richards Bay Campus** (Engineering & Technology).
• **Overview**: Known for world-class research facilities, the UNIZULU Science Centre, agricultural research farms, and high-impact STEM training.

#### 🎯 Key Academic Disciplines:
1. **Mathematical & Computer Sciences**: Computer Science, Applied Mathematics, Statistics.
2. **Physical & Chemical Sciences**: Physics, Chemistry, Hydrology, Geography, Environmental Science.
3. **Life Sciences & Biotechnology**: Biochemistry, Microbiology, Botany, Zoology.
4. **Agriculture & Consumer Sciences**: Agronomy, Animal Science, Agribusiness, Food & Nutrition.
5. **Engineering & Technology**: Bachelor of Engineering Technology (Richards Bay).
6. **Health Sciences**: Nursing Science (Clinical nursing, midwifery, and community health).

#### 🎓 Flagship Undergraduate Programmes & Minimum APS:
• **Bachelor of Nursing Science**: 4 Years • Minimum APS: **30 Points** (English 50%, Life Sciences 50%, Pure Maths/Maths Lit)
• **BSc in Computer Science (Double Majors)**: 3 Years • Minimum APS: **28 Points** (Pure Maths 50%, English 50%)
• **BSc in Agriculture (Agronomy / Animal Science)**: 4 Years • Minimum APS: **28 Points** (Pure Maths 50%, Physical Sciences / Life Sciences)
• **BSc in Biochemistry & Microbiology**: 3 Years • Minimum APS: **28 Points**
• **Diploma in Sport & Exercise Science**: 3 Years • Minimum APS: **24 Points**

💡 *Ask me about any specific science, engineering, or agriculture degree to see its subject breakdown!*`
    };
  }

  // Faculty of Humanities and Social Sciences
  if (lowerMsg.includes('humanities') || lowerMsg.includes('hss') || lowerMsg.includes('social sciences')) {
    const hss = UNIZULU_FACULTIES.find(f => f.code === 'HSS');
    return {
      handled: true,
      source: 'Faculty of Humanities & Social Sciences (HSS) 2026 Handbook',
      text: `### 🌍 Faculty of Humanities and Social Sciences (HSS) 📚✨

• **Campus**: **KwaDlangezwa Main Campus**.
• **Overview**: Fosters critical thinking, social justice, cultural heritage, and human service professions with professional accreditation from the SACSSP.

#### 🎯 Key Academic Departments:
1. **Social Work**: Professional 4-Year Bachelor of Social Work (BSW) with integrated clinical fieldwork.
2. **Psychology**: Psychological theory, developmental psychology, psychopathology, and counselling.
3. **Communication Science**: Media studies, corporate communication, public relations, and journalism.
4. **Sociology & Development Studies**: Community development, social research, and policy analysis.
5. **Languages & Arts**: English, isiZulu, History, Philosophy, and Creative Arts.

#### 🎓 Flagship Undergraduate Programmes & Minimum APS:
• **Bachelor of Social Work (BSW)**: 4 Years • Minimum APS: **28 Points** (English 50%, SACSSP accredited) • CAO: \`ZU-M-SWK\`
• **BA in Psychology & Human Sciences**: 3 Years • Minimum APS: **26–28 Points** • CAO: \`ZU-M-BAP\`
• **BA in Communication Science**: 3 Years • Minimum APS: **26 Points** • CAO: \`ZU-M-BAC\`
• **BA in Development Studies**: 3 Years • Minimum APS: **26 Points** • CAO: \`ZU-M-BAD\`

💡 *Would you like to know more about the Social Work interview process or Psychology pathways?*`
    };
  }

  // Faculty of Education
  if (lowerMsg.includes('education') || lowerMsg.includes('edu') || lowerMsg.includes('teaching')) {
    const edu = UNIZULU_FACULTIES.find(f => f.code === 'EDU');
    return {
      handled: true,
      source: 'Faculty of Education (EDU) 2026 Prospectus',
      text: `### 🍎 Faculty of Education (EDU) 🏫✨

• **Campus**: **KwaDlangezwa Main Campus**.
• **Overview**: One of South Africa's foremost teacher training faculties, preparing knowledgeable, ethical, and inspiring educators for classrooms nationwide.

#### 🎯 Teaching Phases Offered:
1. **Foundation Phase Teaching (Grades R–3)**: Focuses on early childhood literacy, numeracy, life skills, and mother-tongue teaching.
2. **Intermediate Phase Teaching (Grades 4–7)**: Specializes in teaching mathematics, science, languages, and social sciences to young learners.
3. **Senior Phase & FET Teaching (Grades 8–12)**: Specializes in secondary school subject majors (e.g. Accounting, Business Studies, History, Geography, Mathematics, Physical Sciences, Life Sciences, English, isiZulu).

#### 🎓 Flagship Teacher Education Programmes & Minimum APS:
• **BEd in Foundation Phase Teaching**: 4 Years • Minimum APS: **26 Points** (English 50%, Maths Lit 50% or Pure Maths 40%) • CAO: \`ZU-M-EDF\`
• **BEd in Intermediate Phase Teaching**: 4 Years • Minimum APS: **26 Points** • CAO: \`ZU-M-EDI\`
• **BEd in Senior Phase & FET Teaching**: 4 Years • Minimum APS: **26 Points** (plus subject major prerequisites) • CAO: \`ZU-M-EDS\`

💡 *Note: The Postgraduate Certificate in Education (PGCE) is a postgraduate diploma; our undergraduate portal covers the 4-Year BEd degrees.*`
    };
  }

  return null;
}

/**
 * 3. Resolves Specific Degree / Programme Queries (e.g. triggered from Faculties & Degrees tab)
 */
export function resolveSpecificDegreeQuery(userMessage: string): TargetedQueryResult | null {
  const lowerMsg = userMessage.toLowerCase().trim();

  // Check if user is asking for admission requirements / APS / CAO of a specific degree
  const isDegreeQuery = (
    lowerMsg.includes('what are the detailed admission requirements') ||
    lowerMsg.includes('admission requirements') ||
    lowerMsg.includes('minimum aps') ||
    lowerMsg.includes('cao code') ||
    lowerMsg.includes('requirements for') ||
    lowerMsg.includes('tell me about bachelor') ||
    lowerMsg.includes('tell me about diploma') ||
    lowerMsg.includes('tell me about the degree') ||
    lowerMsg.includes('tell me about the llb') ||
    lowerMsg.includes('how to get into')
  );

  // Flatten all degrees with their parent faculty
  const allDegrees: Array<{ deg: FacultyDegree; faculty: FacultyDetail }> = [];
  UNIZULU_FACULTIES.forEach(fac => {
    fac.popularDegrees.forEach(deg => {
      allDegrees.push({ deg, faculty: fac });
    });
  });

  // 1. Exact or near-exact title match
  for (const { deg, faculty } of allDegrees) {
    const degTitleLower = deg.title.toLowerCase();
    // Clean brackets
    const cleanTitle = degTitleLower.replace(/\(.*?\)/g, '').trim();

    if (lowerMsg.includes(degTitleLower) || lowerMsg.includes(cleanTitle)) {
      return {
        handled: true,
        source: `${faculty.name} Official 2026 Handbook`,
        text: formatSpecificDegreeResponse(deg, faculty)
      };
    }
  }

  // 2. Acronym / key term matching
  if (lowerMsg.includes('llb') || lowerMsg.includes('bachelor of laws') || lowerMsg.includes('law degree')) {
    const llb = allDegrees.find(d => d.deg.title.includes('Bachelor of Laws (LLB)'));
    if (llb) return { handled: true, source: 'Faculty of Commerce, Administration and Law 2026', text: formatSpecificDegreeResponse(llb.deg, llb.faculty) };
  }

  if (lowerMsg.includes('accounting science') || lowerMsg.includes('saica') || lowerMsg.includes('ca(sa)')) {
    const accSci = allDegrees.find(d => d.deg.title.includes('Accounting Science'));
    if (accSci) return { handled: true, source: 'FCAL Accounting Department 2026', text: formatSpecificDegreeResponse(accSci.deg, accSci.faculty) };
  }

  if (lowerMsg.includes('social work') || lowerMsg.includes('bsw')) {
    const swk = allDegrees.find(d => d.deg.title.includes('Social Work'));
    if (swk) return { handled: true, source: 'HSS Social Work Department 2026', text: formatSpecificDegreeResponse(swk.deg, swk.faculty) };
  }

  if (lowerMsg.includes('nursing') || lowerMsg.includes('nursing science')) {
    const nursing = allDegrees.find(d => d.deg.title.includes('Nursing'));
    if (nursing) return { handled: true, source: 'SAE Nursing Department 2026', text: formatSpecificDegreeResponse(nursing.deg, nursing.faculty) };
  }

  if (lowerMsg.includes('computer science')) {
    const cs = allDegrees.find(d => d.deg.title.includes('Computer Science'));
    if (cs) return { handled: true, source: 'SAE Computer Science Department 2026', text: formatSpecificDegreeResponse(cs.deg, cs.faculty) };
  }

  if (lowerMsg.includes('badmin') || lowerMsg.includes('public administration degree')) {
    const badmin = allDegrees.find(d => d.deg.title.includes('Public Administration'));
    if (badmin) return { handled: true, source: 'FCAL Public Administration Department 2026', text: formatSpecificDegreeResponse(badmin.deg, badmin.faculty) };
  }

  return null;
}

/**
 * Format a single degree into a clean, dedicated response with zero unnecessary course dumps
 */
function formatSpecificDegreeResponse(deg: FacultyDegree, faculty: FacultyDetail): string {
  const campus = deg.campus || (deg.title.includes('Richards Bay') || (deg.caoCode && deg.caoCode.includes('-R-')) ? 'Richards Bay Campus' : 'KwaDlangezwa Main Campus');
  const qualType = deg.qualificationType || (deg.title.toLowerCase().includes('diploma') ? 'National Diploma' : deg.title.toLowerCase().includes('certificate') ? 'Certificate' : 'Bachelor\'s Degree');

  let text = `### 🎓 **${deg.title}** 🏛️✨\n\n`;
  text += `• **Faculty**: **${faculty.name}**\n`;
  text += `• **Campus**: **${campus}**\n`;
  text += `• **Qualification Type**: **${qualType}** (NQF Level ${deg.nqfLevel || (qualType.includes('Degree') ? '7/8' : '6')})\n`;
  text += `• **Minimum Duration**: **${deg.duration}** (Full-Time)\n`;
  text += `• **Minimum Required APS Score**: **${deg.minAps} Points**\n\n`;

  text += `📋 **Detailed Admission Requirements & Criteria:**\n`;
  text += `${deg.keyRequirements}\n\n`;

  text += `🏷️ **Application & Institutional Identifiers:**\n`;
  if (deg.caoCode) {
    text += `• **Central Applications Office (CAO) Code**: \`${deg.caoCode}\` (Select this code on www.cao.ac.za)\n`;
  }
  if (deg.unizuluCode) {
    text += `• **UNIZULU Internal Code**: \`${deg.unizuluCode}\`\n`;
  }
  if (deg.saqaId) {
    text += `• **SAQA Registration ID**: \`${deg.saqaId}\`\n`;
  }
  if (deg.totalCredits) {
    text += `• **Total SAQA Credits**: **${deg.totalCredits} Credits**\n`;
  }

  text += `\n💡 *Ready to apply? Applications are submitted via CAO at **www.cao.ac.za**. If you'd like to check your points against this degree, use our APS Calculator tab!*`;
  return text;
}

/**
 * 4. Resolves Particular Course / Module Queries (ONLY when explicitly asking for a single course or course code)
 */
export function resolveParticularCourseQuery(userMessage: string): TargetedQueryResult | null {
  const lower = userMessage.toLowerCase().trim();

  // If the query is actually about a degree or general admissions, DO NOT intercept here!
  if (
    lower.includes('bachelor of') ||
    lower.includes('diploma in') ||
    lower.includes('admission requirements') ||
    lower.includes('minimum aps') ||
    lower.includes('cao code') ||
    lower.includes('what can i study') ||
    lower.includes('how do i apply')
  ) {
    return null;
  }

  // 1. Direct Course Code (e.g. 2ACC101, 2LRC201, 2MGN101, 1SWK111)
  const codeMatch = lower.match(/\b([1-4][a-z]{3}[0-9]{3}[a-z]?)\b/i);
  if (codeMatch) {
    const targetCode = codeMatch[1].toUpperCase();
    const foundModule = HANDBOOK_MODULES.find(m => m.code.toUpperCase() === targetCode);
    if (foundModule) {
      return {
        handled: true,
        source: `Official UNIZULU 2026 Handbook (${foundModule.code})`,
        text: formatSingleCourseDetails(foundModule)
      };
    }
  }

  // 2. Specific Course by Name (e.g. "What is Accounting 1A?", "Tell me about Constitutional Law A", "Business Management 1B")
  const isAskingSpecificCourse = (
    lower.includes('what is') ||
    lower.includes('tell me about') ||
    lower.includes('syllabus for') ||
    lower.includes('prerequisites for') ||
    lower.includes('course info for') ||
    lower.includes('what do we learn in') ||
    lower.includes('information on')
  );

  if (isAskingSpecificCourse) {
    // Search exact module names
    for (const m of HANDBOOK_MODULES) {
      const mNameLower = m.name.toLowerCase();
      // Only match if at least 2 distinct words match or exact course title
      if (lower.includes(mNameLower) && mNameLower.length > 5) {
        return {
          handled: true,
          source: `Official UNIZULU 2026 Handbook (${m.code})`,
          text: formatSingleCourseDetails(m)
        };
      }
    }
  }

  return null;
}
