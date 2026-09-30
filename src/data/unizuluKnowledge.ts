/**
 * Comprehensive Knowledge Base for University of Zululand (UNIZULU)
 * Grounded strictly in official 2026 Faculty Handbooks:
 * - Faculty of Humanities and Social Sciences (HSS) Undergraduate Handbook 2026
 * - Faculty of Commerce, Administration and Law (FCAL) Handbook 2026
 * - Faculty of Education (EDU) Undergraduate Programmes
 * - Faculty of Science, Agriculture and Engineering (SAE) Undergraduate Programmes
 *
 * NOTE: Strictly includes UNDERGRADUATE qualifications (Degrees, Diplomas, Certificates, Augmented streams).
 * All postgraduate programmes (PGCE, Honours, Masters, Doctoral/PhD) have been removed.
 */

export interface FacultyDegree {
  title: string;
  minAps: number;
  duration: string;
  keyRequirements: string;
  caoCode?: string;
  unizuluCode?: string;
  saqaId?: string;
  campus?: 'KwaDlangezwa' | 'Richards Bay' | 'Both';
  qualificationType?: 'Degree' | 'Diploma' | 'Certificate';
  overview?: string;
  streamName?: string;
  nqfLevel?: number;
  totalCredits?: number;
}

export interface FacultyDetail {
  name: string;
  code: string;
  deanery: string;
  popularDegrees: FacultyDegree[];
  overview: string;
}

export const UNIZULU_FACULTIES: FacultyDetail[] = [
  {
    name: 'Faculty of Commerce, Administration and Law (CAL)',
    code: 'CAL',
    deanery: 'KwaDlangezwa (4 Main Road, D-Block) & Richards Bay Campuses',
    overview: 'Accredited by the Council on Higher Education (CHE) and SAQA, offering career-focused undergraduate degrees, 4-year augmented access programmes, diplomas, and certificates across accounting, law, management, economics, banking, and public administration.',
    popularDegrees: [
      {
        title: 'Bachelor of Laws (LLB)',
        minAps: 30,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 30 APS; English Home Language or First Additional Language (FAL) Level 4 (50-59%) (or SG C / HG D); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%). Total credits: 480. Prerequisite for entry into legal practice (Advocate or Attorney), judiciary, and corporate counsel.',
        caoCode: 'ZU-M-LLB',
        unizuluCode: '2LDEG1',
        saqaId: '19170',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Commerce in Accounting Science (SAICA Accredited)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%) (or SG C / HG D); Pure Mathematics Level 4 (50-59%) (SG C / HG D). Mathematical Literacy is NOT accepted. Prepares students for CTA / Postgraduate Diploma in Accounting Science and the SAICA Initial Test of Competence (ITC) for Chartered Accountant CA(SA) training.',
        caoCode: 'ZU-M-BCA',
        unizuluCode: '2ADEG3',
        saqaId: '98845',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 360
      },
      {
        title: 'Bachelor of Commerce in Accounting',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%); Pure Mathematics Level 4 (50-59%). Mathematical Literacy is NOT accepted. Comprehensive underlying core in financial accounting, auditing, taxation, and financial management.',
        caoCode: 'ZU-M-BCA',
        unizuluCode: '2ADEG1',
        saqaId: '115215',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Commerce in Management Information Systems (BCom MIS)',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%); Pure Mathematics Level 4 (50-59%). Mathematical Literacy is NOT accepted. Collaborative programme with Faculty of Science and Agriculture combining MIS with Computer Science fundamentals.',
        caoCode: 'ZU-M-MIS',
        unizuluCode: '2ADEG2',
        saqaId: '115275',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Commerce: Accounting and Economics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 6 (70%). Double major in Accounting and Economics.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2DEGAE',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Commerce: Business Management and Accounting',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 6 (70%). Double major in Business Management and Accounting.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2DEGMA',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Commerce: Business Management and Economics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 6 (70%). Double major in Business Management and Economics.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2DEGME',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Commerce: Banking and Business Management',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 6 (70%). Double major in Banking and Business Management.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2DEGBM',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Commerce: Economics and Banking',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 6 (70%). Double major in Economics and Banking.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2DEGEB',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Commerce: Economics and Human Resources Management',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 6 (70%). Double major in Economics and HR Management.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2DEGEH',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Commerce: HR Management and Business Management',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 6 (70%). Double major in HR Management and Business Management.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2DEGHM',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BCom 4-Year Augmented: Accounting and Auditing',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'Alternative access degree: NSC Degree endorsement with minimum 26 APS; English Level 3 (40-49%) or SG D / HG E; Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%). First two years include foundational modules (2AAC100, 2ABM100, 2AEC100, 2FLX001, 2FLX002).',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2ADEG0',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BCom 4-Year Augmented: Accounting and Economics',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'Alternative access degree: NSC Degree endorsement with minimum 26 APS; English Level 3; Pure Maths Level 3 (40%) OR Mathematical Literacy Level 4 (50%).',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2AEGAE',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BCom 4-Year Augmented: Business Management and Accounting',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'Alternative access degree: NSC Degree endorsement with minimum 26 APS; English Level 3; Pure Maths Level 3 OR Mathematical Literacy Level 4.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2AEGMA',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BCom 4-Year Augmented: Business Management and Economics',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'Alternative access degree: NSC Degree endorsement with minimum 26 APS; English Level 3; Pure Maths Level 3 OR Mathematical Literacy Level 4.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2AEGME',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BCom 4-Year Augmented: Banking and Business Management',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'Alternative access degree: NSC Degree endorsement with minimum 26 APS; English Level 3; Pure Maths Level 3 OR Mathematical Literacy Level 4.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2AEGBM',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BCom 4-Year Augmented: Economics and Banking',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'Alternative access degree: NSC Degree endorsement with minimum 26 APS; English Level 3; Pure Maths Level 3 OR Mathematical Literacy Level 4.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2AEGEB',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BCom 4-Year Augmented: Economics and HR Management',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'Alternative access degree: NSC Degree endorsement with minimum 26 APS; English Level 3; Pure Maths Level 3 OR Mathematical Literacy Level 4.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2AEGEH',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BCom 4-Year Augmented: HR Management and Business Management',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'Alternative access degree: NSC Degree endorsement with minimum 26 APS; English Level 3; Pure Maths Level 3 OR Mathematical Literacy Level 4.',
        caoCode: 'ZU-M-BCE',
        unizuluCode: '2AEGHB',
        saqaId: '94058',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Public Administration: Public Administration and Political Science',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50-59%) or SG D / HG E; Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%). Total credits: 408.',
        caoCode: 'ZU-M-BPA',
        unizuluCode: '2GDEPS',
        saqaId: '115558',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 408
      },
      {
        title: 'Bachelor of Public Administration: Public Administration and Human Resources',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4; Pure Mathematics Level 3 OR Mathematical Literacy Level 4.',
        caoCode: 'ZU-M-BPA',
        unizuluCode: '2GDEHR',
        saqaId: '115558',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 408
      },
      {
        title: 'Bachelor of Public Administration: Public Administration and Economics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4; Pure Mathematics Level 3 OR Mathematical Literacy Level 4.',
        caoCode: 'ZU-M-BPA',
        unizuluCode: '2GEGEC',
        saqaId: '115558',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 408
      },
      {
        title: 'Bachelor of Public Administration: Public Administration and Business Management',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4; Pure Mathematics Level 3 OR Mathematical Literacy Level 4.',
        caoCode: 'ZU-M-BPA',
        unizuluCode: '2GDEBM',
        saqaId: '115558',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 408
      },
      {
        title: 'Higher Certificate in Accountancy',
        minAps: 22,
        duration: '1 Year',
        keyRequirements: 'NSC with Higher Certificate endorsement with minimum 22 APS; English Level 3 (40-49%) or SG D / HG E; Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%). Total credits: 120. Articulates into Advanced Certificate in Accountancy or BCom.',
        caoCode: 'ZU-R-HCA',
        unizuluCode: '2AHCR1',
        saqaId: '99552',
        campus: 'Richards Bay',
        qualificationType: 'Certificate',
        nqfLevel: 5,
        totalCredits: 120
      },
      {
        title: 'Advanced Certificate in Accountancy',
        minAps: 22,
        duration: '1 Year',
        keyRequirements: 'Successful completion of Higher Certificate in Accountancy (NQF Level 5). Consists of 9 modules (120 credits). Articulates into BCom at KwaDlangezwa Campus.',
        caoCode: 'ZU-R-ACA',
        unizuluCode: '2AACR1',
        saqaId: '101812',
        campus: 'Richards Bay',
        qualificationType: 'Certificate',
        nqfLevel: 6,
        totalCredits: 120
      },
      {
        title: 'Diploma in Management of Co-operatives',
        minAps: 24,
        duration: '3 Years',
        keyRequirements: 'NSC with Diploma endorsement with minimum 24 APS; English Level 3 (40-49%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%). Total credits: 360. Includes 3-month Work Integrated Learning (WIL) internship (2CDW212 - 60 credits).',
        caoCode: 'ZU-R-DCM',
        unizuluCode: '2CODP1',
        saqaId: '84126',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 360
      },
      {
        title: 'Diploma in Logistics Management',
        minAps: 24,
        duration: '3 Years',
        keyRequirements: 'NSC with Diploma endorsement with minimum 24 APS; English Level 3 (40-49%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%). Total credits: 384. Covers supply chain, inventory control, procurement, warehousing, and practical logistics.',
        caoCode: 'ZU-R-DLM',
        unizuluCode: '2BLM01',
        saqaId: '2BLM01',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 384
      },
      {
        title: 'Diploma in Transport Management',
        minAps: 24,
        duration: '3 Years',
        keyRequirements: 'NSC with Diploma endorsement with minimum 24 APS; English Level 3 (40-49%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%). Total credits: 384. Covers road transport operations, municipal transport management, fleet logistics, and transport field specialization.',
        caoCode: 'ZU-R-DTM',
        unizuluCode: '2BTM01',
        saqaId: '2BTM01',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 384
      },
      {
        title: 'Diploma in Accounting',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC with Diploma endorsement with minimum 22 APS; English Level 4 (50-59%); Pure Mathematics Level 3 (40%) OR Mathematical Literacy Level 5 (60%). Highly popular commerce pathway for students with Mathematical Literacy.',
        caoCode: 'ZU-R-DAC',
        unizuluCode: '2DAC01',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 360
      },
      {
        title: 'Diploma in Public Administration',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC with Diploma endorsement with minimum 22 APS; English Level 4 (50-59%); Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%). Practical training in public sector governance, municipal management, and administration.',
        caoCode: 'ZU-R-DPA',
        unizuluCode: '2DPA01',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 360
      }
    ]
  },
  {
    name: 'Faculty of Humanities and Social Sciences (HSS)',
    code: 'HSS',
    deanery: 'KwaDlangezwa (Upper Ground Floor, Inkanyiso Building) & Richards Bay Campuses',
    overview: 'Offers premier undergraduate qualifications across social work, psychology, communication science, journalism, criminal justice, languages, creative arts, development studies, and sociology.',
    popularDegrees: [
      {
        title: 'Bachelor of Social Work (BSW)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; achievement rating of 4 (50-59%) or higher in 5 recognized subjects; English Level 4 (or FAL Level 5). Selection interview. Compulsory student registration with SACSSP from Year 2 to 4. Total credits: 522. Includes 75-credit Field Work Practicum-Block Placement (1SWK440) and 30-credit Research Project (1SWK450).',
        caoCode: 'ZU-M-BSW',
        unizuluCode: '1WDEG1',
        saqaId: '117923',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 522
      },
      {
        title: 'Bachelor of Arts in Psychology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; rating of 4 (50-59%) in English (FAL 5 and above); rating of 4 and above in any African Language or Social Science. Selection interview for suitability. Total credits: 384.',
        caoCode: 'ZU-M-BAP',
        unizuluCode: '1YDEG1',
        saqaId: '62497',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts in Intercultural Communication',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement (matric exemption) with minimum 26 APS; rating of 4 (50-59%) in 5 recognized subjects; English FAL or HL rating 4 (50-59%). Total credits: 384. Prepares for careers in journalism, PR, broadcasting, and corporate communications.',
        caoCode: 'ZU-M-BAC',
        unizuluCode: '1CDEG1',
        saqaId: '62512',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts in Development Studies',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; rating of 4 (50-59%) in 5 recognized subjects; English rating 4 (50-59%) HL/FAL. Maths SG Level E or Maths Literacy Level 4 required for Economics electives. Total credits: 384.',
        caoCode: 'ZU-M-BAD',
        unizuluCode: '1DDEG1',
        saqaId: '62462',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts in Correctional Studies',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; rating of 4 (50-59%) or better in 5 subjects; English HL rating 5 (60-69%). Total credits: 384. Specialist training in criminology, criminal punishment, offender policies, and correctional management.',
        caoCode: 'ZU-M-BCS',
        unizuluCode: '1JDEG2',
        saqaId: '62479',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts in Environmental Planning and Development',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; English Level 4 (50%+); Geography Level 4 (50%+). Total credits: 384. Covers physical geography, human geography, urban planning, environmental management, and GIS (4HYD222).',
        caoCode: 'ZU-M-GEP',
        unizuluCode: '1GBA01',
        saqaId: '62487',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts in Drama, Theatre and Performance',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; rating of 4 in 5 recognized subjects; English HL rating 4 (50-59%); Visual Arts or Dramatic Arts rating 4 (50-59%). Audition and interview process for final acceptance. Total credits: 362.',
        caoCode: 'ZU-M-DTP',
        unizuluCode: '1UDEG2',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 362
      },
      {
        title: 'Bachelor of Arts in Information Science',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; rating of 4 in 5 recognized subjects; English HL rating 4 (50-59%) or English FAL rating 5 (60-69%). Total credits: 384. Includes 4-week Work Integrated Learning (WIL).',
        caoCode: 'ZU-M-BIS',
        unizuluCode: '1IDEG1',
        saqaId: '62464',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Library and Information Science (BLIS)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; rating of 4 in 5 recognized subjects; English HL rating 4 (50-59%) or English FAL rating 5 (60-69%). Total credits: 512. 4-year professional qualification in cataloguing, classification, and library management. Requires 4-week public library WIL and 120-hour academic library WIL.',
        caoCode: 'ZU-M-BLS',
        unizuluCode: '1IDEG2',
        saqaId: '62464',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 512
      },
      {
        title: 'Bachelor of Social Science in Political and International Studies (BSocSci)',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS (achievement rating of 30 points recommended); English Level 5, Geography Level 5, History Level 5, Economics or Mathematical Literacy Level 4. Total credits: 384.',
        caoCode: 'ZU-M-POL',
        unizuluCode: '1PDEG1',
        saqaId: '111459',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Tourism Studies (B. Tourism)',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4 and Geography or Tourism Level 4. Total credits: 384. Includes 6-month Work Integrated Learning (WIL) in the tourism industry during Year 3 Semester 2.',
        caoCode: 'ZU-M-BTS',
        unizuluCode: '1RDEG1',
        saqaId: '62460',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts in Sociology',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; rating of 4 in 5 recognized subjects; English Level 4 HL/FAL. Total credits: 364 (384 curriculum). Focuses on sociological theory, social policy, rural development, democracy, and research methodology.',
        caoCode: 'ZU-M-BSG',
        unizuluCode: '1SDEG1',
        saqaId: '62484',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 364
      },
      {
        title: 'Bachelor of Arts in Industrial Sociology',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; rating of 4 in 5 recognized subjects; English Level 4 HL/FAL. Total credits: 364 (384 curriculum). Focuses on sociology of work, labour markets, industrial relations systems, CCMA arbitration, and organizational change.',
        caoCode: 'ZU-M-BIS',
        unizuluCode: '1SDEG2',
        saqaId: '62490',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 364
      },
      {
        title: 'Bachelor of Arts (Dual Major): Anthropology & History',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; History in Matric. Dual major combining Anthropology and History.',
        caoCode: 'ZU-M-BA1',
        unizuluCode: '1BDEG2',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Linguistics & English',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; 50% in English 1st Additional Subject in NSC. Dual major in General Linguistics and English Literature.',
        caoCode: 'ZU-M-BA2',
        unizuluCode: '1BDEG3',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Geography & History',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Geography Level 4; History in Matric.',
        caoCode: 'ZU-M-BA3',
        unizuluCode: '1BDEG4',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Geography & Tourism',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Geography or Tourism Level 4.',
        caoCode: 'ZU-M-BA4',
        unizuluCode: '1BDEG5',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): History & IsiZulu',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; History in Matric; isiZulu in Matric; English Level 4.',
        caoCode: 'ZU-M-BA5',
        unizuluCode: '1BDEG6',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Philosophy & Psychology',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4. Dual major in Philosophy (Applied Philosophical Reasoning, Political Philosophy, Phenomenology) and Psychology.',
        caoCode: 'ZU-M-BA6',
        unizuluCode: '1BDEG7',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Anthropology & English',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4 (50%+); Level 4 in 5 recognized matric subjects. Dual major in Anthropology and English.',
        caoCode: 'ZU-M-BA1',
        unizuluCode: '1BDEAE',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Anthropology & IsiZulu',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; isiZulu Level 4; English Level 4. Dual major in Anthropology and isiZulu.',
        caoCode: 'ZU-M-BA1',
        unizuluCode: '1BDEAZ',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Anthropology & Philosophy',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4. Dual major in Anthropology and Philosophy.',
        caoCode: 'ZU-M-BA1',
        unizuluCode: '1BDEAP',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Anthropology & Political Studies',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; History or Social Science Level 4. Dual major in Anthropology and Political Studies.',
        caoCode: 'ZU-M-BA1',
        unizuluCode: '1BDEPS',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Anthropology & Sociology',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4. Dual major in Anthropology and Sociology.',
        caoCode: 'ZU-M-BA1',
        unizuluCode: '1BDEAS',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Linguistics & IsiZulu',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; isiZulu Level 4. Dual major in General Linguistics and isiZulu.',
        caoCode: 'ZU-M-BA2',
        unizuluCode: '1BDELZ',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Linguistics & Drama',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Dramatic Arts or audition. Dual major in Linguistics and Drama.',
        caoCode: 'ZU-M-BA2',
        unizuluCode: '1BDELD',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Geography & Sociology',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; Geography Level 4; English Level 4. Dual major in Geography and Sociology.',
        caoCode: 'ZU-M-BA3',
        unizuluCode: '1BDEGS',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): History & Political Studies',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; History Level 4; English Level 4. Dual major in History and Political Studies.',
        caoCode: 'ZU-M-BA5',
        unizuluCode: '1BDEHP',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Philosophy & Political Studies',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4. Dual major in Philosophy and Political Studies.',
        caoCode: 'ZU-M-BA6',
        unizuluCode: '1BDEPP',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Psychology & Sociology',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Social Science Level 4. Dual major in Psychology and Sociology.',
        caoCode: 'ZU-M-BAP',
        unizuluCode: '1BDEPS2',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Psychology & English',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4. Dual major in Psychology and English Literature.',
        caoCode: 'ZU-M-BAP',
        unizuluCode: '1BDEPE',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Psychology & IsiZulu',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; isiZulu Level 4. Dual major in Psychology and isiZulu.',
        caoCode: 'ZU-M-BAP',
        unizuluCode: '1BDEPZ',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Drama & English',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Dramatic Arts Level 4 or audition. Dual major in Drama and English.',
        caoCode: 'ZU-M-DTP',
        unizuluCode: '1BDEDE',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): Drama & IsiZulu',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; isiZulu Level 4; audition. Dual major in Drama and isiZulu.',
        caoCode: 'ZU-M-DTP',
        unizuluCode: '1BDEDZ',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Arts (Dual Major): English & IsiZulu',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; isiZulu Level 4. Dual major in English Literature and isiZulu.',
        caoCode: 'ZU-M-BA2',
        unizuluCode: '1BDEEZ',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Diploma in Media Studies',
        minAps: 24,
        duration: '3 Years',
        keyRequirements: 'NSC with Diploma endorsement with minimum 24 APS; rating of 4 (50-59%) in 5 recognized subjects; English FAL or HL rating 4 (50-59%). Total credits: 365. Includes 60-credit Work Integrated Learning (1CEL312). Offered only at Richards Bay Campus.',
        caoCode: 'ZU-R-DMS',
        unizuluCode: '1CMDP1',
        saqaId: '94552',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 365
      },
      {
        title: 'Diploma in Public Relations Management',
        minAps: 24,
        duration: '3 Years',
        keyRequirements: 'NSC with Diploma endorsement with minimum 24 APS; rating of 4 (50-59%) in 5 recognized subjects; English HL rating 4 (50-59%). Total credits: 367. Includes 60-credit Work Integrated Learning (1COM332). Offered only at Richards Bay Campus.',
        caoCode: 'ZU-R-DPR',
        unizuluCode: '1CPDP1',
        saqaId: '101140',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 367
      },
      {
        title: 'Advanced Diploma in Communication Science',
        minAps: 24,
        duration: '1 Year',
        keyRequirements: 'Successful completion of an appropriate Diploma at NQF Level 6 or Bachelor’s degree at NQF Level 7. Total credits: 120. Offered at KwaDlangezwa Campus.',
        caoCode: 'ZU-M-ADC',
        unizuluCode: '1CADP1',
        saqaId: '101994',
        campus: 'KwaDlangezwa',
        qualificationType: 'Diploma',
        nqfLevel: 7,
        totalCredits: 120
      },
      {
        title: 'Diploma in Tourism Management',
        minAps: 24,
        duration: '3 Years',
        keyRequirements: 'NSC with Diploma endorsement with minimum 24 APS; Level 4 or "D" (HG) for English; at least level 4 in any four: Language, Maths Lit/Maths, Tourism, Geography, Hospitality, Business Studies. Total credits: 378. Includes 6-month Work Integrated Learning (1TWL312 - 60 credits). Offered only at Richards Bay Campus.',
        caoCode: 'ZU-R-DTM',
        unizuluCode: '1DPTM1',
        saqaId: '79266',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 378
      }
    ]
  },
  {
    name: 'Faculty of Education (EDU)',
    code: 'EDU',
    deanery: 'First Floor, New Education Building, KwaDlangezwa Campus',
    overview: 'Dedicated to undergraduate initial teacher education, preparing highly skilled professional educators across all primary and secondary schooling phases with full eligibility for Funza Lushaka bursaries.',
    popularDegrees: [
      {
        title: 'Bachelor of Education (B.Ed) Foundation Phase (Grades R-3)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4 (50%+); isiZulu Level 4 (or approved indigenous language); Mathematics or Mathematical Literacy Level 3 (40%+). Total credits: 480. Prepares specialist teachers for early grade literacy, numeracy, and life skills.',
        caoCode: 'ZU-M-EDF',
        unizuluCode: 'EDF001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Foundation Phase: isiZulu Home Language Stream',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; isiZulu Home Language Level 4 (50%+); English Level 4; Maths/Maths Lit Level 3. Early grade literacy and numeracy in mother-tongue.',
        caoCode: 'ZU-M-EDF',
        unizuluCode: 'EDFZ01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Foundation Phase: English Home Language Stream',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Home Language Level 4 (50%+); First Additional Language Level 4; Maths/Maths Lit Level 3.',
        caoCode: 'ZU-M-EDF',
        unizuluCode: 'EDFE01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Intermediate Phase (Grades 4-7)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4 (50%+); two primary teaching subjects at Level 4 (50%+). Total credits: 480. Specialist educator training for primary education grades 4 to 7.',
        caoCode: 'ZU-M-EDI',
        unizuluCode: 'EDI001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Intermediate Phase: Mathematics, Science & Technology',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Mathematics Level 4 (50%) OR Maths Lit Level 5 (60%); Natural Sciences Level 4.',
        caoCode: 'ZU-M-EDI',
        unizuluCode: 'EDIM01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Intermediate Phase: Languages, Humanities & Life Skills',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; isiZulu or Second Language Level 4; Social Sciences Level 4.',
        caoCode: 'ZU-M-EDI',
        unizuluCode: 'EDIL01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Senior Phase & FET (Grades 8-12)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4 (50%+); two FET teaching major subjects (e.g. Accounting, Business Studies, Economics, History, Geography, Physical Science, Mathematics, Life Sciences, isiZulu) at Level 4 or 5. Total credits: 480.',
        caoCode: 'ZU-M-EDS',
        unizuluCode: 'EDS001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Senior Phase & FET: EMS (Accounting & Business Management)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Accounting Level 4 (50%+); Business Studies Level 4 (50%+). Prepares high school commercial educators.',
        caoCode: 'ZU-M-EDS',
        unizuluCode: 'EDSAB1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Senior Phase & FET: EMS (Business Management & Economics)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Business Studies Level 4; Economics Level 4.',
        caoCode: 'ZU-M-EDS',
        unizuluCode: 'EDSBE1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Senior Phase & FET: Mathematics & Physical Sciences',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+). Priority STEM educator stream eligible for Funza Lushaka.',
        caoCode: 'ZU-M-EDS',
        unizuluCode: 'EDSMP1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Senior Phase & FET: Mathematics & Life Sciences',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Pure Mathematics Level 4; Life Sciences Level 4.',
        caoCode: 'ZU-M-EDS',
        unizuluCode: 'EDSML1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Senior Phase & FET: Life Sciences & Agricultural Sciences',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Life Sciences Level 4; Agricultural Sciences Level 4.',
        caoCode: 'ZU-M-EDS',
        unizuluCode: 'EDSLA1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Senior Phase & FET: Humanities (History & Geography)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; History Level 4; Geography Level 4.',
        caoCode: 'ZU-M-EDS',
        unizuluCode: 'EDSHG1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Education (B.Ed) Senior Phase & FET: Languages (English & IsiZulu)',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; isiZulu Level 4.',
        caoCode: 'ZU-M-EDS',
        unizuluCode: 'EDSEZ1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 480
      }
    ]
  },
  {
    name: 'Faculty of Science, Agriculture and Engineering (SAE)',
    code: 'SAE',
    deanery: 'KwaDlangezwa & Richards Bay Campuses',
    overview: 'Provides career-focused scientific, agricultural, technological, and health science undergraduate degrees and technical diplomas.',
    popularDegrees: [
      {
        title: 'Bachelor of Science in Computer Science',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with 28 to 34 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); English Level 4 (50%+). Mathematical Literacy is strictly NOT accepted. Software development, systems programming, and algorithms.',
        caoCode: 'ZU-M-BSC',
        unizuluCode: 'SBSC01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science in Hydrology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); English Level 4 (50%+). Offered in UNIZULU’s internationally recognized Department of Hydrology.',
        caoCode: 'ZU-M-HYD',
        unizuluCode: 'SHYD01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science in Agriculture (Agronomy / Animal Science)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Mathematics or Mathematical Literacy Level 5 (60%+); Life Sciences or Agricultural Sciences Level 4 (50%+). Total credits: 480.',
        caoCode: 'ZU-M-BSA',
        unizuluCode: 'SBSA01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Science in Biochemistry & Microbiology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4 (50%+); Physical Science Level 4 (50%+); Life Sciences Level 4 (50%+). Total credits: 384.',
        caoCode: 'ZU-M-BCM',
        unizuluCode: 'SBCM01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Nursing Science',
        minAps: 30,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 30 APS; Life Sciences Level 4 (50%+); English Level 4 (50%+); Physical Science OR Pure Mathematics Level 4 (50%+). Total credits: 480. Leads to professional nurse registration with the South African Nursing Council (SANC).',
        caoCode: 'ZU-M-BNS',
        unizuluCode: 'SBNS01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      },
      {
        title: 'Diploma in Information Technology',
        minAps: 24,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement with minimum 24 APS; English Level 4 (50%+); Mathematics Level 4 (50%+) OR Mathematical Literacy Level 6 (70%+). Total credits: 360. Offered at Richards Bay Campus.',
        caoCode: 'ZU-R-DIT',
        unizuluCode: 'SDIT01',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 360
      },
      {
        title: 'Diploma in Engineering Technology (Electrical / Mechanical)',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement with minimum 26 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); English Level 4 (50%+). Total credits: 360. Offered at Richards Bay Campus.',
        caoCode: 'ZU-R-DET',
        unizuluCode: 'SDET01',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 360
      },
      {
        title: 'Diploma in Engineering Technology: Electrical Engineering',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement with minimum 26 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); English Level 4 (50%+). Practical electrical machines, power systems, and circuit design.',
        caoCode: 'ZU-R-DET',
        unizuluCode: 'SDETE1',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 360
      },
      {
        title: 'Diploma in Engineering Technology: Mechanical Engineering',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement with minimum 26 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); English Level 4 (50%+). Fluid mechanics, thermodynamics, strength of materials, and CAD drafting.',
        caoCode: 'ZU-R-DET',
        unizuluCode: 'SDETM1',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 360
      },
      {
        title: 'Diploma in Hospitality & Tourism Management',
        minAps: 22,
        duration: '3 Years',
        keyRequirements: 'NSC Diploma endorsement with minimum 22 APS; English Level 4 (50%+); Mathematical Literacy Level 4 (50%+) OR Mathematics Level 3 (40%+). Total credits: 360. Offered at Richards Bay Campus.',
        caoCode: 'ZU-R-DHT',
        unizuluCode: 'SDHT01',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 360
      },
      {
        title: 'Bachelor of Science: Computer Science and Mathematics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 5 (60%+); Physical Sciences Level 4 (50%+); English Level 4. Double major in Computer Science and Mathematics.',
        caoCode: 'ZU-M-BSC',
        unizuluCode: 'SBSC02',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Computer Science and Statistics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4 (50%+); English Level 4. Double major in Computer Science and Statistics.',
        caoCode: 'ZU-M-BSC',
        unizuluCode: 'SBSC03',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Computer Science and Physics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); English Level 4. Double major in Computer Science and Physics.',
        caoCode: 'ZU-M-BSC',
        unizuluCode: 'SBSC04',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Computer Science and Hydrology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); English Level 4. Double major in Computer Science and Hydrology.',
        caoCode: 'ZU-M-BSC',
        unizuluCode: 'SBSC05',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Hydrology and Geography',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4; Physical Sciences Level 4 or Geography Level 4; English Level 4.',
        caoCode: 'ZU-M-HYD',
        unizuluCode: 'SHYD02',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Hydrology and Chemistry',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4; Physical Sciences Level 4; English Level 4.',
        caoCode: 'ZU-M-HYD',
        unizuluCode: 'SHYD03',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Hydrology and Physics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4; Physical Sciences Level 4; English Level 4.',
        caoCode: 'ZU-M-HYD',
        unizuluCode: 'SHYD04',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Chemistry and Physics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4; Physical Sciences Level 4; English Level 4. Double major in Chemistry and Physics.',
        caoCode: 'ZU-M-SPC',
        unizuluCode: 'SSPC02',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Chemistry and Mathematics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 5 (60%+); Physical Sciences Level 4; English Level 4.',
        caoCode: 'ZU-M-SCB',
        unizuluCode: 'SSCM01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Mathematics and Statistics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 5 (60%+); English Level 4. Pure Maths focused analytical double major.',
        caoCode: 'ZU-M-SAM',
        unizuluCode: 'SSMS01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Botany and Chemistry',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Life Sciences Level 4; Physical Sciences Level 4; English Level 4; Pure Maths Level 4.',
        caoCode: 'ZU-M-SBZ',
        unizuluCode: 'SSBC01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Zoology and Chemistry',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Life Sciences Level 4; Physical Sciences Level 4; English Level 4; Pure Maths Level 4.',
        caoCode: 'ZU-M-SBZ',
        unizuluCode: 'SSZC01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Human Movement Science & Physics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Life Sciences Level 4; Physical Sciences Level 4; Pure Mathematics Level 4.',
        caoCode: 'ZU-M-SHM',
        unizuluCode: 'SSHMP1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Human Movement Science & Chemistry',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Life Sciences Level 4; Physical Sciences Level 4; Mathematics Level 3 OR Maths Lit Level 5.',
        caoCode: 'ZU-M-SHM',
        unizuluCode: 'SSHMC1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Human Movement Science & Zoology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Life Sciences Level 4; English Level 4; Mathematics Level 3 OR Maths Lit Level 5.',
        caoCode: 'ZU-M-SHM',
        unizuluCode: 'SSHMZ1',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science in Agriculture (Agronomy Stream)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Mathematics or Maths Lit Level 5; Agricultural Sciences or Life Sciences Level 4. Crop production, soil fertility, and agricultural management.',
        caoCode: 'ZU-M-BSA',
        unizuluCode: 'SBSA02',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Science in Agriculture (Animal Science Stream)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Mathematics or Maths Lit Level 5; Agricultural Sciences or Life Sciences Level 4. Livestock breeding, nutrition, pastoral ecology, and physiology.',
        caoCode: 'ZU-M-BSA',
        unizuluCode: 'SBSA03',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Science in Agriculture (Agribusiness Stream)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Mathematics Level 4 OR Maths Lit Level 5; Agricultural Sciences Level 4. Agricultural value chains, farm management, and commerce.',
        caoCode: 'ZU-M-BAE',
        unizuluCode: 'SBAE02',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Science in Agriculture (Agricultural Economics Stream)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Mathematics Level 4 OR Maths Lit Level 5; Agricultural Sciences Level 4. Agricultural macroeconomics, econometrics, and policy.',
        caoCode: 'ZU-M-BAE',
        unizuluCode: 'SBAE03',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Science in Agriculture (Agricultural Extension and Rural Resource Management)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Mathematics or Maths Lit Level 5; Agricultural Sciences Level 4; English Level 4. Rural development and farmer support.',
        caoCode: 'ZU-M-BAE',
        unizuluCode: 'SBAE04',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      },
      {
        title: 'Bachelor of Science in Consumer Science (Food & Nutrition Stream)',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Life Sciences or Physical Sciences Level 4; Maths Level 3 OR Maths Lit Level 5. Community nutrition and food science.',
        caoCode: 'ZU-M-BCS',
        unizuluCode: 'SBCS02',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science in Consumer Science (Hospitality & Tourism Stream)',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Consumer Studies, Hospitality or Tourism Level 4; Maths Level 3 OR Maths Lit Level 5.',
        caoCode: 'ZU-M-BCS',
        unizuluCode: 'SBCS03',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Mathematics and Applied Mathematics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 5 (60%+); English Level 4 (50%+). Mathematical Literacy is strictly NOT accepted. Total credits: 384.',
        caoCode: 'ZU-M-SAM',
        unizuluCode: 'SSAM01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Mathematics and Physics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 5 (60%+); Physical Sciences Level 4 (50%+); English Level 4 (50%+). Mathematical Literacy is NOT accepted. Total credits: 384.',
        caoCode: 'ZU-M-SMP',
        unizuluCode: 'SSMP01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Physics and Chemistry',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); English Level 4 (50%+). Mathematical Literacy is NOT accepted. Total credits: 384.',
        caoCode: 'ZU-M-SPC',
        unizuluCode: 'SSPC01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Chemistry and Biochemistry',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); Life Sciences Level 4 (50%+); English Level 4 (50%+). Total credits: 384.',
        caoCode: 'ZU-M-SCB',
        unizuluCode: 'SSCB01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Botany and Zoology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Life Sciences Level 4 (50%+); English Level 4 (50%+); Pure Mathematics Level 4 (50%+) OR Mathematical Literacy Level 6 (70%+). Total credits: 384.',
        caoCode: 'ZU-M-SBZ',
        unizuluCode: 'SSBZ01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Human Movement Science',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Life Sciences Level 4 (50%+); English Level 4 (50%+); Mathematics Level 3 (40%) OR Mathematical Literacy Level 5 (60%). Total credits: 384.',
        caoCode: 'ZU-M-SHM',
        unizuluCode: 'SSHM01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science in Consumer Science (Food & Nutrition / Hospitality)',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4 (50%+); Life Sciences or Physical Sciences Level 4 (50%+); Mathematics Level 3 (40%) OR Mathematical Literacy Level 5 (60%). Total credits: 384.',
        caoCode: 'ZU-M-BCS',
        unizuluCode: 'SBCS01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science in Agriculture (Agribusiness / Agricultural Economics)',
        minAps: 28,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Mathematics Level 4 (50%) OR Mathematical Literacy Level 5 (60%); Agricultural Sciences or Life Sciences Level 4 (50%); English Level 4. Total credits: 480.',
        caoCode: 'ZU-M-BAE',
        unizuluCode: 'SBAE01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      },
      {
        title: 'Diploma in Sport and Exercise Technology',
        minAps: 24,
        duration: '3 Years',
        keyRequirements: 'NSC with Diploma endorsement with minimum 24 APS; English Level 4 (50%+); Life Sciences Level 4 (50%+); Mathematics Level 3 (40%) OR Mathematical Literacy Level 4 (50%). Total credits: 360.',
        caoCode: 'ZU-R-DST',
        unizuluCode: 'SDST01',
        campus: 'Richards Bay',
        qualificationType: 'Diploma',
        nqfLevel: 6,
        totalCredits: 360
      },
      {
        title: 'Bachelor of Science: Microbiology and Chemistry',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4 (50%+); Physical Sciences Level 4 (50%+); Life Sciences Level 4 (50%+); English Level 4. Industrial fermentation, bio-processing, and chemical synthesis.',
        caoCode: 'ZU-M-BCM',
        unizuluCode: 'SMC001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Microbiology and Botany',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Life Sciences Level 4; Physical Sciences Level 4; Pure Mathematics Level 4; English Level 4. Plant pathology, phytomedicine, and microbial ecology.',
        caoCode: 'ZU-M-SBZ',
        unizuluCode: 'SMB001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Zoology and Hydrology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Life Sciences Level 4; Pure Mathematics Level 4; Physical Sciences Level 4; English Level 4. Aquatic ecosystem dynamics, limnology, and freshwater fauna.',
        caoCode: 'ZU-M-HYD',
        unizuluCode: 'SZH001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Applied Mathematics and Physics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 5 (60%+); Physical Sciences Level 4 (50%+); English Level 4. Mathematical physics, dynamical systems, and computational mechanics.',
        caoCode: 'ZU-M-SAM',
        unizuluCode: 'SAP001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Applied Mathematics and Statistics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 5 (60%+); English Level 4. Stochastic modeling, computational optimization, and data science.',
        caoCode: 'ZU-M-SAM',
        unizuluCode: 'SAS001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Hydrology and Microbiology',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4; Physical Sciences Level 4; Life Sciences Level 4; English Level 4. Water quality, aquatic pathogens, and eco-hydrology.',
        caoCode: 'ZU-M-HYD',
        unizuluCode: 'SHM001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Geography and Physics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4; Physical Sciences Level 4; Geography Level 4; English Level 4. Geophysics, remote sensing, and atmospheric science.',
        caoCode: 'ZU-M-SPC',
        unizuluCode: 'SGP001',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science: Human Movement Science & Mathematics',
        minAps: 28,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 28 APS; Pure Mathematics Level 4; Life Sciences Level 4; English Level 4. Sports biomechanics and mathematical performance modeling.',
        caoCode: 'ZU-M-SHM',
        unizuluCode: 'SHMM01',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'Bachelor of Science in Consumer Science: Extension and Rural Development',
        minAps: 26,
        duration: '3 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; English Level 4; Life Sciences or Agricultural Sciences Level 4; Maths Level 3 OR Maths Lit Level 5. Household food security and rural enterprise.',
        caoCode: 'ZU-M-BCS',
        unizuluCode: 'SBCS04',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BSc 4-Year Augmented: Life Sciences Foundation Stream',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; Pure Mathematics Level 3 (40%) OR Maths Lit Level 5 (60%); Life Sciences Level 3 (40%); English Level 3. Foundational academic science bridging in Year 1 & 2 leading to standard BSc.',
        caoCode: 'ZU-M-BSC',
        unizuluCode: 'SBSCAL',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BSc 4-Year Augmented: Physical & Mathematical Sciences Foundation Stream',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; Pure Mathematics Level 3 (40%); Physical Sciences Level 3 (40%); English Level 3. Foundational physics, chemistry, and calculus bridging leading to standard BSc.',
        caoCode: 'ZU-M-BSC',
        unizuluCode: 'SBSCAP',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 7,
        totalCredits: 384
      },
      {
        title: 'BSc 4-Year Augmented: Agriculture Foundation Stream',
        minAps: 26,
        duration: '4 Years',
        keyRequirements: 'NSC Degree endorsement with minimum 26 APS; Mathematics Level 3 OR Maths Lit Level 5; Agricultural Sciences or Life Sciences Level 3; English Level 3. Foundational agricultural bridging leading to BSc in Agriculture.',
        caoCode: 'ZU-M-BSA',
        unizuluCode: 'SBSAAG',
        campus: 'KwaDlangezwa',
        qualificationType: 'Degree',
        nqfLevel: 8,
        totalCredits: 480
      }
    ]
  }
];

export const UNIZULU_CONTACTS = {
  website: 'https://www.unizulu.ac.za',
  admissionsEmail: 'admissions@unizulu.ac.za',
  generalEmail: 'info@unizulu.ac.za',
  switchboard: '+27 (0)35 902 6000',
  admissionsOfficePhone: '+27 (0)35 902 6030 / 6718',
  caoWebsite: 'https://www.cao.ac.za',
  caoPhone: '+27 (0)31 268 4444',
  nsfasWebsite: 'https://www.nsfas.org.za',
  kwaDlangezwaAddress: '1 Main Road, KwaDlangezwa, 3886, KwaZulu-Natal, South Africa',
  richardsBayAddress: 'Corner of Guldengracht & EShared Street, Arboretum, Richards Bay, 3900',
  facultyOffices: {
    cal: {
      dean: 'Prof. M.F. Vezi-Magigaba (Executive Dean)',
      secretary: 'Mr L Buthelzi-Samuels',
      phone: '035 902 6121 / 6123',
      email: 'ButheleziL@unizulu.ac.za',
      location: '4 Main Road, D-Block, KwaDlangezwa'
    },
    hss: {
      dean: 'Prof AL Nkosi-Shokane (Dean)',
      secretary: 'Ms SM Khanyile',
      phone: '035 902 6660 / 6087',
      email: 'KhanyileSM@unizulu.ac.za',
      location: 'Upper Ground Floor, Inkanyiso Building, KwaDlangezwa'
    },
    edu: {
      dean: 'Prof SS Ntombela (Dean)',
      secretary: 'Ms SM Gumede',
      phone: '035 902 6348',
      email: 'GumedeSA@unizulu.ac.za',
      location: 'First Floor, New Education Building, KwaDlangezwa'
    },
    sae: {
      dean: 'Prof K Lehloenya (Dean)',
      phone: '035 902 6000',
      location: 'KwaDlangezwa Campus'
    }
  }
};

export const DOCUMENT_SUBMISSION_STEPS = [
  {
    step: 1,
    title: 'Certified Copy of Identity Document (ID)',
    description: 'A clear copy of your South African ID card/book (or valid Passport with study permit for international students). Must be certified by SAPS, Post Office, or a Commissioner of Oaths within the last 3 months.',
    tip: 'Ensure the certification date stamp and signature are clearly visible.'
  },
  {
    step: 2,
    title: 'Grade 11 Final Report or Matric / NSC Certificate',
    description: 'If you are currently in Grade 12, provide your official final Grade 11 end-of-year report. If you have completed Matric, provide your certified National Senior Certificate (NSC) or Statement of Results.',
    tip: 'Make sure your examination number and all subject achievement percentages are legible.'
  },
  {
    step: 3,
    title: 'CAO Application Fee Proof of Payment',
    description: 'UNIZULU undergraduate applications are submitted via CAO (Central Applications Office). Standard fee is R250 for on-time South African applicants, R470 for late applications, or R300 for international applicants.',
    tip: 'Pay via EasyPay at Shoprite/Checkers/Pick n Pay, or directly via credit card on www.cao.ac.za.'
  },
  {
    step: 4,
    title: 'Academic Records & Certificate of Conduct (Transfer Students)',
    description: 'If you studied previously at another university, TVET college, or higher education institution, submit an official stamped academic record and certificate of good conduct.',
    tip: 'Must be issued on official institutional letterhead.'
  },
  {
    step: 5,
    title: 'Proof of Residential Address (For Housing)',
    description: 'Utility bill, stamped letter from tribal authority / local ward councillor, or municipal account showing your home address if applying for student residences at KwaDlangezwa or Richards Bay.',
    tip: 'Needed for on-campus student housing allocation preference.'
  }
];

export const CAO_APPLICATION_GUIDE = [
  {
    phase: 'Step 1: Check Minimum Requirements',
    detail: 'Calculate your Admission Point Score (APS) and verify program-specific subject requirements (e.g. Pure Maths for BSc/BCom vs Math Lit for Humanities).'
  },
  {
    phase: 'Step 2: Visit CAO Portal',
    detail: 'Navigate to www.cao.ac.za and click "Apply Now". Create your profile or enter your existing CAO number if you previously registered.'
  },
  {
    phase: 'Step 3: Select UNIZULU Choices',
    detail: 'Search for UNIZULU programmes using the code prefix "ZU-" (e.g., ZU-M-LLB for LLB, ZU-M-BSC for Science, ZU-R- for Richards Bay). You can select multiple choices in order of preference.'
  },
  {
    phase: 'Step 4: Upload Required Documents',
    detail: 'Scan your certified ID, Grade 11/12 results, and submit them through the CAO upload portal in PDF or JPEG format (under 2MB per document).'
  },
  {
    phase: 'Step 5: Pay Fee and Track Status',
    detail: 'Use your CAO number as reference to pay the application fee. Track your admission decision online using the CAO tracking portal.'
  }
];

export const INITIAL_EVOLVED_QUERIES = [
  {
    id: 'eq-1',
    topic: 'Admission Requirements',
    question: 'What APS score do I need for Law (LLB) at UNIZULU?',
    frequency: 412,
    lastUpdated: 'Recently updated',
    category: 'Admissions' as const
  },
  {
    id: 'eq-2',
    topic: 'Document Submissions',
    question: 'How do I submit certified documents if I only have a smartphone scan?',
    frequency: 389,
    lastUpdated: 'Recently updated',
    category: 'Documents' as const
  },
  {
    id: 'eq-3',
    topic: 'CAO Process',
    question: 'How do I apply to UNIZULU through CAO with code ZU-?',
    frequency: 345,
    lastUpdated: 'Recently updated',
    category: 'CAO' as const
  },
  {
    id: 'eq-4',
    topic: 'Financial Aid',
    question: 'How does NSFAS link with my UNIZULU registration?',
    frequency: 298,
    lastUpdated: 'Recently updated',
    category: 'Financial Aid' as const
  },
  {
    id: 'eq-5',
    topic: 'Accommodation',
    question: 'When does UNIZULU residence application open for first years?',
    frequency: 264,
    lastUpdated: 'Recently updated',
    category: 'Housing' as const
  }
];
