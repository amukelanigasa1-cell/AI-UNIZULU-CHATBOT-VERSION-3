/**
 * Official UNIZULU 2026 Undergraduate Course Modules Directory
 * Sourced directly from:
 * 1. Faculty of Humanities and Social Sciences (HSS) Undergraduate Handbook 2026
 * 2. Faculty of Commerce, Administration and Law (FCAL) Handbook 2026
 *
 * Excludes all postgraduate modules (Honours, Masters, Doctoral, PGCE).
 */

export interface CourseModule {
  code: string;
  name: string;
  faculty: 'CAL' | 'HSS' | 'EDU' | 'SAE';
  department: string;
  nqfLevel: number;
  credits: number;
  semester?: 'Semester 1' | 'Semester 2' | 'Both' | 'Year';
  prerequisites?: string[];
  corequisites?: string[];
  description: string;
}

export const HANDBOOK_MODULES: CourseModule[] = [
  // ==========================================
  // FACULTY OF COMMERCE, ADMINISTRATION & LAW (FCAL)
  // ==========================================

  // Accounting & Auditing
  {
    code: '2ACC101',
    name: 'Accounting 1A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    corequisites: ['2ACC102'],
    description: 'Introduces accounting concepts and principles as a foundation of business language. Covers the conceptual framework, recording transactions from journal and general ledger to trial balance, and preparing annual financial statements.'
  },
  {
    code: '2ACC102',
    name: 'Accounting 1B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    corequisites: ['2ACC101'],
    description: 'Specific accounting standards for business entities including companies, partnerships, and close corporations. Analysis of annual financial statements.'
  },
  {
    code: '2ACC201',
    name: 'Accounting 2A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2ACC102'],
    corequisites: ['2ACC202'],
    description: 'Conceptual framework, presentation of financial statements, PPE, investment property, revenue, and inventory. Covers history of IFRS and IFRS for SMEs.'
  },
  {
    code: '2ACC202',
    name: 'Accounting 2B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ACC102'],
    description: 'Basic financial instruments, equity, provisions, events after balance sheet date, and basic consolidations under IFRS.'
  },
  {
    code: '2ACC301',
    name: 'Accounting 3A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2ACC202'],
    description: 'Application of accounting standards: income taxes including deferred tax, advanced PPE, leases, intangible assets, impairments, and revaluations.'
  },
  {
    code: '2ACC302',
    name: 'Accounting 3B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ACC202'],
    description: 'Advanced equity, financial instruments, earnings per share, related parties, accounting policies, changes in accounting estimates, and business combinations.'
  },

  // Accounting Science (BCom AccSci - 2ADEG3)
  {
    code: '2AFA101',
    name: 'Financial Reporting 1A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Introduces accounting concepts and principles for CA-stream students: conceptual framework, journal entries, ledger, trial balance, and annual financial statements.'
  },
  {
    code: '2AFA102',
    name: 'Financial Reporting 1B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Accounting standards for companies, partnerships, close corporations, and financial statement analysis.'
  },
  {
    code: '2AFA201',
    name: 'Financial Reporting 2A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2AFA102'],
    description: 'IFRS for SMEs: conceptual framework, PPE, investment property, revenue, and inventory with open book system.'
  },
  {
    code: '2AFA202',
    name: 'Financial Reporting 2B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2AFA102'],
    description: 'Financial instruments, equity, provisions, events after balance sheet date, and group consolidations.'
  },
  {
    code: '2AFA301',
    name: 'Financial Reporting 3A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2AFA202'],
    description: 'Advanced IFRS accounting standards: deferred taxation, leases, intangible assets, impairments, and revaluations.'
  },
  {
    code: '2AFA302',
    name: 'Financial Reporting 3B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2AFA202'],
    description: 'Complex financial instruments, EPS, revenue from contracts with customers, provisions, and group business combinations.'
  },
  {
    code: '2AFA401',
    name: 'Financial Reporting 4A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2AFA302'],
    description: 'Competencies in recording, recognition, measurement, and presentation of complex financial information in accordance with GAAP/IFRS.'
  },
  {
    code: '2AFA402',
    name: 'Financial Reporting 4B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2AFA302'],
    description: 'Advanced GAAP/IFRS reporting, group structures, joint arrangements, foreign operations, and comprehensive case evaluations.'
  },

  // Auditing
  {
    code: '2AUD202',
    name: 'Introduction to Auditing',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ACC102'],
    description: 'Nature of auditing, auditing profession, internal control concepts, basic auditing principles, and computerized business cycles.'
  },
  {
    code: '2AUD301',
    name: 'Auditing 3A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    corequisites: ['2AUD302'],
    description: 'Audit process, business cycles, weaknesses in internal controls, audit risks, and audit procedures.'
  },
  {
    code: '2AUD302',
    name: 'Auditing 3B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ACC202', '2AUD202'],
    corequisites: ['2AUD301'],
    description: 'Audit conclusions, going concern, factual insolvency, laws and regulations, subsequent events, audit reports, and corporate governance.'
  },
  {
    code: '2AUT202',
    name: 'Auditing 1B / 2B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2AFA102'],
    description: 'Internal control systems, auditing profession regulations, business cycle verification for CA-stream candidates.'
  },
  {
    code: '2AUT301',
    name: 'Auditing 3A (AccSci)',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2AUT202'],
    corequisites: ['2AUT302'],
    description: 'Detailed audit process, internal controls in complex automated business cycles, risk assessment, and substantive testing.'
  },
  {
    code: '2AUT302',
    name: 'Auditing 3B (AccSci)',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2AUT202'],
    corequisites: ['2AUT301'],
    description: 'Audit report formulation, modified audit opinions, statutory duties of auditors under the Auditing Profession Act, and King IV corporate governance.'
  },
  {
    code: '2AUT401',
    name: 'Business and Governance A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2AUT302'],
    corequisites: ['2AUT402'],
    description: 'Advanced integrated case studies in governance, risk management, internal controls, and preparing for the SAICA Initial Test of Competence (ITC).'
  },
  {
    code: '2AUT402',
    name: 'Business and Governance B (Auditing 4B)',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2AUT302'],
    corequisites: ['2AUT401'],
    description: 'Audit practice, securities exchange regulations, current developments in financial governance, and professional audit simulations.'
  },

  // Taxation
  {
    code: '2ITX301',
    name: 'Income Tax 3A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2ACC202'],
    corequisites: ['2ITX302'],
    description: 'Taxation of individuals, gross income, exempt income, allowable deductions, capital allowances, capital gains tax, and tax calculations.'
  },
  {
    code: '2ITX302',
    name: 'Income Tax 3B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ACC202'],
    corequisites: ['2ITX301'],
    description: 'Corporate taxation, dividends tax, retirement benefits, taxation of non-residents, assessed losses, and VAT.'
  },
  {
    code: '2ATA301',
    name: 'Taxation 3A (AccSci)',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    description: 'Comprehensive tax framework for individuals: gross income definition, general deductions, capital allowances, VAT Act, and court precedent analysis.'
  },
  {
    code: '2ATA302',
    name: 'Taxation 3B (AccSci)',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    description: 'Corporate tax, donations tax, dividends tax, retirement funds, international tax aspects, and double taxation agreements.'
  },
  {
    code: '2ATA401',
    name: 'Taxation 4A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2ATA302'],
    description: 'Critical analysis of complex tax scenarios in South Africa: corporate restructuring, trading stock, capital gains tax, and tax dispute resolution.'
  },
  {
    code: '2ATA402',
    name: 'Taxation 4B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ATA302'],
    description: 'Advanced tax planning and compliance: trusts, estate duty, cross-border transactions, transfer pricing, and comprehensive case integration.'
  },

  // Management Accounting & Finance
  {
    code: '2AMC201',
    name: 'Introduction to Financial Management and Costing',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2ACC102'],
    description: 'Basic management accounting principles: cost classification, costing systems, budgeting, time value of money, risk and return, project appraisal.'
  },
  {
    code: '2AMC301',
    name: 'Financial Management and Costing 3A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2ACC202'],
    description: 'Cost accumulation techniques, information gathering for decision-making, standard costing, variance analysis, and performance management.'
  },
  {
    code: '2AMC302',
    name: 'Financial Management and Costing 3B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ACC202'],
    description: 'Financial decision-making: working capital management, valuations, cost of capital, dividend decisions, and financial statement analysis.'
  },
  {
    code: '2AMA301',
    name: 'Management Accounting and Finance 3A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2AMC201'],
    description: 'Advanced cost systems (activity-based costing, target costing, lifecycle costing), short-term decision making, and operational performance measurement.'
  },
  {
    code: '2AMA302',
    name: 'Management Accounting and Finance 3B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2AMC201'],
    corequisites: ['2AMA401'],
    description: 'Corporate finance principles: valuation models, capital structure theories, risk and return, working capital, and investment appraisal.'
  },
  {
    code: '2AMA401',
    name: 'Management Accounting and Finance 4A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2AMA302'],
    description: 'Advanced strategic management accounting: transfer pricing, budgetary control, linear programming, and balanced scorecard.'
  },
  {
    code: '2AMA402',
    name: 'Management Accounting and Finance 4B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2AMA301'],
    description: 'Portfolio management, advanced corporate valuations, financial risk management with derivatives, mergers, acquisitions, and restructuring.'
  },

  // Management Information Systems
  {
    code: '2AIS101',
    name: 'Management of Information Systems 1A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Functioning of Information Systems in businesses, IT infrastructure, hardware/software, database technologies, Microsoft Visio, and project management.'
  },
  {
    code: '2AIS102',
    name: 'Management of Information Systems 1B',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Data communication, Internet, E-Commerce, Global Information Systems, enterprise systems, spreadsheets for financial applications, and web development.'
  },
  {
    code: '2AIS301',
    name: 'Systems Analysis',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2AIS102'],
    description: 'Analysis of accounting/financial information systems, data and systems flow charts, internal controls, and transaction cycles.'
  },
  {
    code: '2AIS302',
    name: 'Systems Design',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2AIS102'],
    description: 'Object-oriented design, 3-layer architecture, UML 2 in MS Visio, project management with MS Project, and conversion transaction cycles.'
  },

  // Business Management
  {
    code: '2BMG101',
    name: 'Business Management 1A',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    corequisites: ['2BMG102'],
    description: 'General principles of managing business organizations in South Africa: value chain approach, support activities, business environments, and managerial roles.'
  },
  {
    code: '2BMG102',
    name: 'Business Management 1B',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    corequisites: ['2BMG101'],
    description: 'Primary business activities across five functional areas: operations, marketing, human resources, finance, and procurement.'
  },
  {
    code: '2BMG201',
    name: 'Marketing Management',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2BMG102'],
    corequisites: ['2BMG202'],
    description: 'Marketing concepts, environmental scanning, target market selection, consumer behaviour, and formulation of a marketing plan.'
  },
  {
    code: '2BMG202',
    name: 'Financial Management',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2BMG101'],
    corequisites: ['2BMG201'],
    description: 'Financial principles for business decision-making: financial analysis, budgeting, borrowing, investing, and cash flow management.'
  },
  {
    code: '2BMG301',
    name: 'Business Management 3A',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2BMG201'],
    description: 'Evolution of management thought, strategic planning and implementation, decision-making models, and strategic environment analysis.'
  },
  {
    code: '2BMG302',
    name: 'Business Management 3B',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2BMG202'],
    description: 'Entrepreneurial theory and new venture creation: developing a full business plan, feasibility studies, and entrepreneurial leadership.'
  },
  {
    code: '2BMG311',
    name: 'Strategic Marketing 3A',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2BMG201'],
    description: 'Creation and sustainability of competitive advantage through strategic marketing theory, positioning models, and marketing as a science.'
  },
  {
    code: '2BMG312',
    name: 'Strategic Management 3B',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2BMG202'],
    description: 'Identifying and understanding sources of superior firm performance, corporate strategy, execution frameworks, and global competitiveness.'
  },

  // Banking
  {
    code: '2BBG211',
    name: 'Banking Instruments, Products and Services',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    corequisites: ['2BBG212'],
    description: 'In-depth study of the financial services sector, banking regulations, banking structure, financial statements, and measuring bank performance.'
  },
  {
    code: '2BBG212',
    name: 'Financial Systems, Institutions and Markets (Asset-Liability Management)',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    corequisites: ['2BBG211'],
    description: 'Asset-liability management (ALM), interest rate risk management, duration gap techniques, and operations of financial institutions.'
  },
  {
    code: '2BBG321',
    name: 'Bank Investment Management',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2BBG211'],
    corequisites: ['2BBG322'],
    description: 'Bank investment portfolios, yield curve analysis, liquidity management, and investment decision-making processes in commercial banking.'
  },
  {
    code: '2BBG322',
    name: 'Bank Mergers and Acquisitions',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2BBG212'],
    description: 'Institutional and regulatory frameworks for bank mergers, takeover regulations, due diligence, valuation, and post-merger integration.'
  },
  {
    code: '2BBG331',
    name: 'Bank Derivatives',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2BBG211'],
    corequisites: ['2BBG332'],
    description: 'Managing and hedging banking risk with forward contracts, futures, swaps, and options in a South African banking context.'
  },
  {
    code: '2BBG332',
    name: 'Banks Equity Capital',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2BBG212'],
    corequisites: ['2BBG331'],
    description: 'Regulatory capital requirements (Basel accords), capital adequacy ratios, risk-weighted assets, and long-term banking stability.'
  },

  // Human Resource Management
  {
    code: '2HRM201',
    name: 'Foundations and Challenges of Human Resource Management',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    corequisites: ['2HRM202'],
    description: 'Job analysis and design, recruitment, selection, employee orientation, performance management, motivation, and HR information systems.'
  },
  {
    code: '2HRM202',
    name: 'Labour Relations in South Africa',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    corequisites: ['2HRM201'],
    description: 'Employment relationship, labour legislation (LRA, BCEA), workplace discipline, collective bargaining, CCMA dispute resolution, and strikes.'
  },
  {
    code: '2HRM301',
    name: 'Theory and Practice of Human Resource Management',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2HRM202'],
    corequisites: ['2HRM302'],
    description: 'Strategic HRM, competency-based HR, international HRM, virtual work environments, talent retention, and professional ethics.'
  },
  {
    code: '2HRM302',
    name: 'Training and Development Management',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2HRM301'],
    description: 'Skills Development Act, training needs analysis, instructional design, adult learning theories, evaluation of training, and management development.'
  },
  {
    code: '2HRM321',
    name: 'Organisational Behaviour',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    corequisites: ['2HRM322'],
    description: 'Individual and group dynamics, personality in the workplace, perception, leadership styles, power, conflict, and organizational culture.'
  },
  {
    code: '2HRM322',
    name: 'Organisational Development',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    corequisites: ['2HRM321'],
    description: 'Managing organizational change, OD interventions, diagnostic models, team building, organizational transformation, and change resistance.'
  },

  // Economics
  {
    code: '2ECN101',
    name: 'Principles of Microeconomics',
    faculty: 'CAL',
    department: 'Economics',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    corequisites: ['2ECN102'],
    description: 'Foundations of economics, scarcity, opportunity cost, demand, supply, market equilibrium, elasticity, consumer choice, and market structures.'
  },
  {
    code: '2ECN102',
    name: 'Principles of Macroeconomics',
    faculty: 'CAL',
    department: 'Economics',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    corequisites: ['2ECN101'],
    description: 'Circular flow of income, macroeconomic indicators (GDP, inflation, unemployment), money and banking, central bank policy, and AD-AS model.'
  },
  {
    code: '2ECN201',
    name: 'Intermediate Microeconomics',
    faculty: 'CAL',
    department: 'Economics',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2ECN101'],
    corequisites: ['2ECN202'],
    description: 'Consumer theory, indifference curves, production theory, cost functions, perfect competition, monopoly, oligopoly, and welfare economics.'
  },
  {
    code: '2ECN202',
    name: 'Intermediate Macroeconomics',
    faculty: 'CAL',
    department: 'Economics',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ECN102'],
    description: 'National output, economic growth, IS-LM model, Mundell-Fleming model, AD-AS open economy model, and macroeconomic policy analysis.'
  },
  {
    code: '2ECN301',
    name: 'Public and Monetary Economics',
    faculty: 'CAL',
    department: 'Economics',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2ECN201'],
    description: 'Public economics (taxation policies, public goods, budget deficits, national debt) and monetary economics (transmission mechanisms, inflation targeting, central banking).'
  },
  {
    code: '2ECN302',
    name: 'Development Economics',
    faculty: 'CAL',
    department: 'Economics',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ECN202'],
    description: 'Economic challenges of developing nations, poverty, inequality, neoclassical and endogenous growth models, foreign aid, and trade policies.'
  },
  {
    code: '2ECN311',
    name: 'Labour and International Economics',
    faculty: 'CAL',
    department: 'Economics',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2ECN201'],
    description: 'Labour market analysis (wage determination, trade unions, human capital) and international economics (comparative advantage, trade barriers, exchange rates).'
  },
  {
    code: '2ECN312',
    name: 'Economic Research and Econometrics',
    faculty: 'CAL',
    department: 'Economics',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2ECN202'],
    description: 'Mathematical economics and econometrics: OLS regression, hypothesis testing, multicollinearity, heteroscedasticity, time series, and SPSS/Excel lab sessions.'
  },

  // Public Administration
  {
    code: '2PAD101',
    name: 'Introduction to Public Administration',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Legislative, executive, and judicial guidelines in public administration; administrative and managerial functions, institutional structures, and public service ethos.'
  },
  {
    code: '2PAD102',
    name: 'Introduction to Public Management',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Application of contemporary management techniques to public services, multidisciplinary public management, functions, skills, and accountability.'
  },
  {
    code: '2PAD201',
    name: 'Basic Personnel Administration',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    description: 'Public service staffing functions, merit principles, human resources deployment, monitoring, training, and evaluation of public officials.'
  },
  {
    code: '2PAD202',
    name: 'Introduction to Public Finance Management',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2PAD101'],
    description: 'How governments manage public finances: fiscal policy, revenue generation, budgeting processes (PFMA), and financial accountability.'
  },
  {
    code: '2PAD301',
    name: 'Public Service Delivery: Policy and Theory',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2PAD202'],
    description: 'Public policy making, policy cycle, implementation models, continuous improvement of public governance, and service delivery mechanisms.'
  },
  {
    code: '2PAD302',
    name: 'Issues in Public Service Delivery (Municipal Development Planning)',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2PAD301'],
    description: 'Municipal planning, Integrated Development Plans (IDP), Local Economic Development (LED), public participation, and the National Development Plan (NDP).'
  },
  {
    code: '2PAD321',
    name: 'Research Methodology (Public Admin)',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    description: 'Social science research in public administration: problem formulation, research design, qualitative and quantitative data collection, and proposal writing.'
  },
  {
    code: '2PAD322',
    name: 'Research Paper (Public Admin)',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2PAD321'],
    description: 'Independent research paper under academic supervision addressing an empirical public administration issue.'
  },

  // Local Government
  {
    code: '2PLG201',
    name: 'Municipal Structure and Administration',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    description: 'Legislative and executive authority of municipalities in SA: municipal councils, powers and duties of Mayors, Speakers, councillors, and municipal managers.'
  },
  {
    code: '2PLG202',
    name: 'Municipal Finance and Management',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    description: 'Local government finance under the MFMA: revenue sources, property rates, municipal budgeting, audit outcomes, and intergovernmental fiscal relations.'
  },
  {
    code: '2PLG311',
    name: 'Municipal Governance',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['2PLG201'],
    description: 'Statutory framework for Local Government, categories of municipalities, governance oversight, ethics, and traditional leadership partnerships.'
  },
  {
    code: '2PLG312',
    name: 'Municipal Accounting',
    faculty: 'CAL',
    department: 'Public Administration',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['2PLG202'],
    description: 'Financial administration of municipalities, annual financial statements under GRAP, cost management, and internal audit controls.'
  },

  // Law (LLB - 2LDEG1)
  {
    code: '2LPL101',
    name: 'Law of Persons',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 5,
    credits: 12,
    semester: 'Semester 1',
    description: 'Legal subjectivity, beginning and end of natural personality, status, domicile, minority, and legal capacity.'
  },
  {
    code: '2LRI101',
    name: 'Introduction to Law A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 5,
    credits: 12,
    semester: 'Semester 1',
    corequisites: ['2LRI102'],
    description: 'Origins, foundations, and sources of South African law; courts structure, legal profession, and reading case law.'
  },
  {
    code: '2LRI102',
    name: 'Introduction to Law B',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 5,
    credits: 12,
    semester: 'Semester 2',
    corequisites: ['2LRI101'],
    description: 'Branches of law: criminal law, civil procedure, public and private international law, human rights, and legal reasoning.'
  },
  {
    code: '2LCL101',
    name: 'Legal Skills A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 5,
    credits: 12,
    semester: 'Semester 1',
    description: 'Legal terminology, court etiquette, basic drafting and writing, computer-based legal research, legal ethics, and critical reasoning.'
  },
  {
    code: '2LCL102',
    name: 'Legal Skills B',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 5,
    credits: 12,
    semester: 'Semester 2',
    description: 'Fundamentals of numerical calculations and elementary accounting for legal practice, interpreting financial statements, and fee calculations.'
  },
  {
    code: '2LRD102',
    name: 'Indigenous Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 5,
    credits: 12,
    semester: 'Semester 2',
    description: 'Customary law of persons, marriage, succession, traditional leadership, and traditional courts.'
  },
  {
    code: '2LPL201',
    name: 'Law of Succession',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 6,
    credits: 12,
    semester: 'Semester 1',
    description: 'Intestate succession, testamentary succession, drafting and execution of wills, revocation, and administration of deceased estates.'
  },
  {
    code: '2LPP202',
    name: 'Law of Property',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 6,
    credits: 12,
    semester: 'Semester 2',
    description: 'Constitutional property clause, real rights, ownership, possession, servitudes, mortgages, and property transfer.'
  },
  {
    code: '2LCC201',
    name: 'Criminal Law A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 6,
    credits: 12,
    semester: 'Semester 1',
    corequisites: ['2LCC202'],
    description: 'General principles of criminal liability: legality, conduct, definitional elements, unlawfulness, and culpability.'
  },
  {
    code: '2LCC202',
    name: 'Criminal Law B',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 6,
    credits: 12,
    semester: 'Semester 2',
    corequisites: ['2LCC201'],
    description: 'Specific common law and statutory crimes: crimes against the person, property crimes, attempt, conspiracy, and incitement.'
  },
  {
    code: '2LPI201',
    name: 'Juridical Interpretation',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 6,
    credits: 12,
    semester: 'Semester 1',
    description: 'Rules and principles of statutory interpretation, constitutional values in interpretation, and common law presumptions.'
  },
  {
    code: '2LRC201',
    name: 'Constitutional Law A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 6,
    credits: 12,
    semester: 'Semester 1',
    description: 'Constitutional supremacy, rule of law, separation of powers, structure and powers of parliament, the executive, and the judiciary.'
  },
  {
    code: '2LRC202',
    name: 'Constitutional Law B (Fundamental Rights)',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 6,
    credits: 12,
    semester: 'Semester 2',
    description: 'Chapter 2 Bill of Rights: application, interpretation, limitation of rights, civil, political, and socio-economic rights jurisprudence.'
  },
  {
    code: '2LPF202',
    name: 'Family Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    description: 'Civil marriages, customary marriages, civil unions, matrimonial property regimes, divorce, maintenance, and child care.'
  },
  {
    code: '2LPB301',
    name: 'Business Entities Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 1',
    description: 'Companies Act 2008, close corporations, partnerships, business trusts, corporate governance, and directors’ duties.'
  },
  {
    code: '2LPI302',
    name: 'Insolvency and Winding Up',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 2',
    description: 'Insolvency Act 24 of 1936, voluntary surrender, compulsory sequestration, effects of sequestration, and company winding-up.'
  },
  {
    code: '2LCP301',
    name: 'Criminal Procedure A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 1',
    corequisites: ['2LCP302'],
    description: 'Pre-trial criminal procedure: prosecution of crime, arrest, search and seizure, bail applications, and constitutional rights of accused.'
  },
  {
    code: '2LCP302',
    name: 'Criminal Procedure B',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 2',
    corequisites: ['2LCP301'],
    description: 'Trial procedure: charge sheets, pleas, trial proceedings, verdict, sentencing, appeals, and review.'
  },
  {
    code: '2LCI301',
    name: 'Civil Procedure A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 1',
    corequisites: ['2LCI302'],
    description: 'Jurisdiction and rules of Magistrate’s Court and High Court litigation, action and application proceedings.'
  },
  {
    code: '2LCI302',
    name: 'Civil Procedure B',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 2',
    corequisites: ['2LCI301'],
    description: 'High Court practice: pleadings, summary judgments, discovery, trial proceedings, judgment, and enforcement orders.'
  },
  {
    code: '2LPC301',
    name: 'Law of Contract A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 1',
    corequisites: ['2LPC302'],
    description: 'Requirements for a valid contract: offer and acceptance, consensus, contractual capacity, legality, and possibility of performance.'
  },
  {
    code: '2LPC302',
    name: 'Law of Contract B',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 2',
    corequisites: ['2LPC301'],
    description: 'Breach of contract, remedies for breach, termination of contractual obligations, and specific consumer contracts.'
  },
  {
    code: '2LPD301',
    name: 'Law of Delict A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 1',
    description: 'Elements of delictual liability: conduct, wrongfulness, fault (intent and negligence), causation, and damages.'
  },
  {
    code: '2LRA302',
    name: 'Administrative Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 7,
    credits: 12,
    semester: 'Semester 2',
    description: 'Promotion of Administrative Justice Act (PAJA), lawful administrative action, procedural fairness, reasons, and judicial review.'
  },
  {
    code: '2LRR401',
    name: 'Legal Research Methods',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 30,
    semester: 'Year',
    description: 'Year-long advanced legal research project, formulating arguments, legal writing, research ethics, and thesis presentation.'
  },
  {
    code: '2LCE401',
    name: 'Law of Evidence A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 1',
    corequisites: ['2LCE402'],
    description: 'Principles of admissibility, relevance, hearsay evidence, previous consistent statements, and character evidence.'
  },
  {
    code: '2LCE402',
    name: 'Law of Evidence B',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 2',
    corequisites: ['2LCE401'],
    description: 'Privilege, unconstitutionally obtained evidence, burden and standard of proof, and assessment of evidence.'
  },
  {
    code: '2LPL401',
    name: 'Labour Law A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 1',
    corequisites: ['2LPL402'],
    description: 'Contract of employment, employee vs independent contractor, fair dismissals for misconduct, incapacity, and operational requirements.'
  },
  {
    code: '2LPL402',
    name: 'Labour Law B',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 2',
    corequisites: ['2LPL401'],
    description: 'Collective labour law, trade unions, collective bargaining, statutory strikes, lockouts, and dispute resolution.'
  },
  {
    code: '2LCL401',
    name: 'Legal Practice A',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 1',
    corequisites: ['2LCL402'],
    description: 'Management of a law firm, consultation, file management, legal ethics, and professional body compliance.'
  },
  {
    code: '2LCL402',
    name: 'Legal Practice B',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 2',
    corequisites: ['2LCL401'],
    description: 'Trial advocacy, drafting civil litigation pleadings, conveyancing basics, and Road Accident Fund (RAF) claims.'
  },
  {
    code: '2PIP402',
    name: 'Intellectual Property Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 2',
    description: 'Patents, designs, copyright, trademarks, and anti-counterfeiting laws.'
  },
  {
    code: '2LPP401',
    name: 'Public International Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 1',
    description: 'State sovereignty, treaties, UN system, international human rights law, and international dispute resolution.'
  },
  {
    code: '2LPT401',
    name: 'Tax Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 1',
    description: 'Tax system principles, taxable income, gross income, deductions, capital gains tax, and tax dispute litigation.'
  },
  {
    code: '2LMA401',
    name: 'Maritime Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 1',
    description: 'Admiralty jurisdiction, carriage of goods by sea, arrest of ships, salvage, marine insurance, and international maritime conventions.'
  },
  {
    code: '2LPG402',
    name: 'Local Government Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 2',
    description: 'Constitutional status of local government, municipal structures, bylaws, municipal finance regulation, and municipal litigation.'
  },
  {
    code: '2LPF402',
    name: 'Forensic Medicine',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 2',
    description: 'Personal injury litigation, medical jurisprudence, trauma, post-mortem findings, toxicology, and expert testimony.'
  },
  {
    code: '2LPC402',
    name: 'Competition Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 2',
    description: 'Competition Act 89 of 1998: restrictive practices, abuse of dominance, and merger control proceedings.'
  },
  {
    code: '2LCB402',
    name: 'Cyber Law',
    faculty: 'CAL',
    department: 'Law',
    nqfLevel: 8,
    credits: 12,
    semester: 'Semester 2',
    description: 'Electronic communications law, cybersecurity, cybercrimes, digital evidence, data privacy (POPIA), and online contracts.'
  },

  // FCAL Richards Bay Certificate & Diploma Modules
  {
    code: '2CAC101',
    name: 'Financial Accounting 1A (Certificate)',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Business cycle, financial recording, VAT Act requirements, cash books, and preparing financial statements.'
  },
  {
    code: '2CAC102',
    name: 'Financial Accounting 1B (Certificate)',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Disclosure of assets, liabilities, and equity in sole proprietorships and partnerships. Bank and debtor reconciliations.'
  },
  {
    code: '2ABU101',
    name: 'Business Calculations 1A',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Business arithmetic, percentages, ratios, algebra, factorisation, equation solving, straight line and exponential graphs.'
  },
  {
    code: '2ABL102',
    name: 'Business Literacy',
    faculty: 'CAL',
    department: 'Accounting and Auditing',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Communication theory, written reports, oral reporting, public speaking, and professional workplace communication.'
  },
  {
    code: '2CDH111',
    name: 'History and Principles of Co-Operatives',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Origins and development of co-operatives globally and in developing countries, co-operative principles, and business forms.'
  },
  {
    code: '2CDW212',
    name: 'Work Integrated Learning Internship (Co-operatives)',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 6,
    credits: 60,
    semester: 'Semester 2',
    description: 'Compulsory 3-month practical internship working within operational co-operatives and community enterprise bodies.'
  },
  {
    code: '2BTL101',
    name: 'Mathematics for Transport and Logistics',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Mathematical operations, statistical distributions, transport costing mathematics, and optimization models.'
  },
  {
    code: '2BTL201',
    name: 'Logistics 2A',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    description: 'Supply chain management principles, freight forwarding, inventory management, and transport operations.'
  },
  {
    code: '2BTM201',
    name: 'Transportation 2A',
    faculty: 'CAL',
    department: 'Business Management',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    description: 'Modes of transportation, transport network analysis, fleet scheduling, and passenger transport management.'
  },

  // ==========================================
  // FACULTY OF HUMANITIES AND SOCIAL SCIENCES (HSS)
  // ==========================================

  // African Languages & Culture (IsiZulu)
  {
    code: '1ZUL151',
    name: 'Sounds, Words and their Dynamics (A) (IsiZulu)',
    faculty: 'HSS',
    department: 'African Languages and Culture',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Introduction to isiZulu and isiXhosa phonetics, phonology, and word morphology based on modern linguistic analysis.'
  },
  {
    code: '1ZUL152',
    name: 'Translation, Interpretation, Traditional and Modern Literature (IsiZulu)',
    faculty: 'HSS',
    department: 'African Languages and Culture',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Principles of translation, consecutive interpreting, traditional oral folklore, and modern isiZulu prose literature.'
  },
  {
    code: '1ZUL241',
    name: 'Sounds, Words and their Dynamics (B), Terminology and Lexicography',
    faculty: 'HSS',
    department: 'African Languages and Culture',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    description: 'Advanced morphological structures, terminology development, dictionary compilation, and terminology standardization in isiZulu.'
  },
  {
    code: '1ZUL242',
    name: 'Translation, Sociolinguistics, Heritage and Literature (IsiZulu)',
    faculty: 'HSS',
    department: 'African Languages and Culture',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    description: 'Sociolinguistics in African language contexts, language contact, cultural heritage preservation, and modern literary analysis.'
  },
  {
    code: '1ZUL331',
    name: 'Sounds, Words and their Dynamics (C) and Semantics (IsiZulu)',
    faculty: 'HSS',
    department: 'African Languages and Culture',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    description: 'In-depth semantics, truth conditions, meaning relations, syntax-semantics interface in Bantu linguistic systems.'
  },
  {
    code: '1ZUL321',
    name: 'Understanding a Novel, Short Stories and Essays in IsiZulu',
    faculty: 'HSS',
    department: 'African Languages and Culture',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    description: 'Literary criticism of major isiZulu novels, structural analysis of short stories, and critical essay composition.'
  },
  {
    code: '1ZUL332',
    name: 'IsiNtu Linguistics, Heritage and Introduction to Research (IsiZulu)',
    faculty: 'HSS',
    department: 'African Languages and Culture',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    description: 'Comparative Bantu linguistics, African indigenous knowledge systems, oral archives, and research proposal drafting.'
  },
  {
    code: '1ZUL342',
    name: 'Understanding of Drama and Poetry (IsiZulu)',
    faculty: 'HSS',
    department: 'African Languages and Culture',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    description: 'Analysis of dramatic texts, performance conventions, classical praise poetry (Izibongo), and modern African poetic forms.'
  },

  // Anthropology & Development Studies
  {
    code: '1ANT111',
    name: 'Introduction to Anthropology',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Broad fields of anthropology: cultural, political, economic, and medical anthropology with ethnographic research methods.'
  },
  {
    code: '1ANT112',
    name: 'Culture and Society in Africa',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Anthropological perspectives on African social systems, race, ethnicity, nation-state, and worldviews in a changing world.'
  },
  {
    code: '1ANT211',
    name: 'Health and Socio-Cultural Context',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1ANT111'],
    description: 'Medical anthropology, social dimensions of health, disease etiology, traditional healing, and intercultural healthcare delivery.'
  },
  {
    code: '1ANT212',
    name: 'Understanding Families and Households',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1ANT112'],
    description: 'Comparative cross-cultural study of domestic life, kinship structures, marriage systems, and household authority in South Africa.'
  },
  {
    code: '1ANT311',
    name: 'Applied Anthropology: Contemporary Human',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1ANT211'],
    description: 'Application of anthropology to contemporary social problems: homelessness, marginalization, intercultural relations, and impact assessment.'
  },
  {
    code: '1ANT321',
    name: 'Anthropology of Media',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1ANT212'],
    description: 'Media as a cultural site, mass media representations of difference, digital media culture, and empowerment versus exclusion.'
  },
  {
    code: '1ANT312',
    name: 'Research Methodology PLUS Special Topic',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1ANT212'],
    description: 'Theoretical frameworks in ethnography, field research ethics, qualitative data collection, and independent research paper.'
  },
  {
    code: '1ANT322',
    name: 'The Development of Anthropological Thought',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1ANT212'],
    description: 'Historical evolution of anthropological theory from nineteenth-century evolutionism to functionalism, structuralism, and postmodernism.'
  },

  // Development Studies
  {
    code: '1DEV111',
    name: 'NGO Sector, Development and Underdevelopment',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Concepts of NGOs and civil society in development; theories of development and underdevelopment in the Global South.'
  },
  {
    code: '1DEV112',
    name: 'Community Project Development and Facilitation',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Community facilitation techniques, participatory project planning, stakeholder engagement, and community upliftment.'
  },
  {
    code: '1DEV211',
    name: 'Development Concepts: Economic and Social',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1DEV111', '1DEV112'],
    description: 'Economic and socio-political factors of development, poverty eradication strategies, and institutional development in South Africa.'
  },
  {
    code: '1DEV221',
    name: 'Integrated Local Economic Development',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1DEV111', '1DEV112'],
    description: 'Integrated Development Planning (IDP), local economic strategies, stimulating municipal economies, and job creation.'
  },
  {
    code: '1DEV212',
    name: 'Population Studies and South Africa’s Population Policy',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1DEV111', '1DEV112'],
    description: 'Demographic dynamics: fertility, mortality, migration, population projections, and South African national population policy.'
  },
  {
    code: '1DEV222',
    name: 'Integrated Rural Development',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1DEV111', '1DEV112'],
    description: 'Strategies for rural transformation, agrarian reform, sustainable rural livelihoods, and rural infrastructure access.'
  },
  {
    code: '1DEV311',
    name: 'Integrated Urban Development',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1DEV211', '1DEV221'],
    description: 'Urban housing policies, overcoming apartheid spatial segregation, urban renewal, and sustainable human settlements.'
  },
  {
    code: '1DEV321',
    name: 'Industry and Development',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1DEV211', '1DEV221'],
    description: 'Industrialisation strategies, manufacturing sectors, beneficiation, global value chains, and economic diversification.'
  },
  {
    code: '1DEV312',
    name: 'Project Management and Evaluation',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1DEV212'],
    description: 'Project planning lifecycle, monitoring and evaluation (M&E) systems, cost-benefit analysis, cash flow management, and business plan drafting.'
  },
  {
    code: '1DEV322',
    name: 'Research Methodology (Development Studies)',
    faculty: 'HSS',
    department: 'Anthropology and Development Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1DEV212', '1DEV222'],
    description: 'Qualitative and quantitative research methods in development studies, survey design, data analysis, and empirical field reports.'
  },

  // Communication Science
  {
    code: '1COM111',
    name: 'Communication Science 1',
    faculty: 'HSS',
    department: 'Communication Science',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    description: 'Scientific theories and competencies in intrapersonal, interpersonal, small-group, organizational, and mass communication.'
  },
  {
    code: '1COM112',
    name: 'Journalism 1',
    faculty: 'HSS',
    department: 'Communication Science',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    description: 'News reporting principles, journalistic ethics, interviewing techniques, news sources, and multi-platform story construction.'
  },
  {
    code: '1COM141',
    name: 'Communication Skills 1',
    faculty: 'HSS',
    department: 'Communication Science',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Core communication proficiency: academic reading, effective writing, listening comprehension, and professional public speaking.'
  },
  {
    code: '1COM151',
    name: 'Digital Communication 1',
    faculty: 'HSS',
    department: 'Communication Science',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Foundational electronic communication methods, computer applications, digital content creation, and internet tools.'
  },
  {
    code: '1CMS112',
    name: 'Media Skills 1',
    faculty: 'HSS',
    department: 'Communication Science',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Media institutions, functionalist and critical media theories, media ownership, censorship, regulation, and democratization.'
  },
  {
    code: '1CEL312',
    name: 'Experiential Learning for Media Studies 1A',
    faculty: 'HSS',
    department: 'Communication Science',
    nqfLevel: 6,
    credits: 60,
    semester: 'Semester 2',
    prerequisites: ['1CMS311', '1CJS311', '1COM351', '1COM341'],
    description: 'Compulsory semester-long Work Integrated Learning (WIL) placement in broadcast, print, or corporate media enterprises.'
  },
  {
    code: '1COM332',
    name: 'Experiential Learning 1A (Public Relations)',
    faculty: 'HSS',
    department: 'Communication Science',
    nqfLevel: 6,
    credits: 60,
    semester: 'Semester 2',
    prerequisites: ['1COM331', '1CCS311', '1COM221'],
    description: 'Compulsory semester-long Work Integrated Learning (WIL) in corporate or government PR departments.'
  },

  // Creative Arts (Drama, Theatre & Performance)
  {
    code: '1PVA111',
    name: 'Introduction to Drama & Theatre Studies',
    faculty: 'HSS',
    department: 'Creative Arts',
    nqfLevel: 5,
    credits: 15,
    semester: 'Semester 1',
    description: 'Working methods of drama, theatre, and performance as art forms; self-confidence, voice projection, and theatrical conventions.'
  },
  {
    code: '1PVA112',
    name: 'Drama and Theatre Studies 1B',
    faculty: 'HSS',
    department: 'Creative Arts',
    nqfLevel: 5,
    credits: 15,
    semester: 'Semester 2',
    description: 'Historical development of world and African theatre, major theatrical eras, dramatists, and the social role of theatre.'
  },
  {
    code: '1PVA211',
    name: 'Advanced Acting 1',
    faculty: 'HSS',
    department: 'Creative Arts',
    nqfLevel: 6,
    credits: 15,
    semester: 'Semester 1',
    description: 'Intensive actor training: voice, movement, characterization, scene studies from South African and international realist plays.'
  },
  {
    code: '1PVA212',
    name: 'Advanced Acting 2',
    faculty: 'HSS',
    department: 'Creative Arts',
    nqfLevel: 6,
    credits: 15,
    semester: 'Semester 2',
    description: 'Realist and non-realist acting methods: Stanislavski, Meisner, Brecht’s epic theatre, Grotowski Poor Theatre, and vocal projection.'
  },
  {
    code: '1PVA311',
    name: 'Theatre Performance 1',
    faculty: 'HSS',
    department: 'Creative Arts',
    nqfLevel: 7,
    credits: 15,
    semester: 'Semester 1',
    description: 'Intensive exploration of theatre production as process and product, stagecraft, and ensemble performance.'
  },
  {
    code: '1PVA321',
    name: 'Directing 3A',
    faculty: 'HSS',
    department: 'Creative Arts',
    nqfLevel: 7,
    credits: 15,
    semester: 'Semester 1',
    description: 'Art of theatre directing: text analysis, director’s concept, blocking, actor coaching, and staging short productions.'
  },

  // Criminal Justice (Correctional Studies)
  {
    code: '1COR111',
    name: 'Introduction to Criminology and Research',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Science of criminology, causes of crime, criminal justice research paradigms (Positivist, Interpretive, Constructionist, Pragmatic).'
  },
  {
    code: '1COR121',
    name: 'Introduction to Punishment',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Theories and philosophies of human criminal punishment, retributive vs restorative justice, deterrence, and historical penal forms.'
  },
  {
    code: '1COR112',
    name: 'History of the Criminal Justice System',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Evolution of police, courts, and correctional systems in South Africa and internationally from colonial era to democratic transition.'
  },
  {
    code: '1COR122',
    name: 'Introduction to Corrections',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Origins of criminal sentencing, development of correctional centres, correctional administration, and offender rehabilitation measures.'
  },
  {
    code: '1COR211',
    name: 'Crime Prevention',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1COR112', '1COR122'],
    description: 'Crime prevention strategies: community policing, evidence-led policing, situational prevention, and social crime prevention.'
  },
  {
    code: '1COR221',
    name: 'Offender Policies',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1COR112', '1COR122'],
    description: 'Correctional Services Act, White Paper on Corrections, constitutional rights of prisoners, and correctional best practices.'
  },
  {
    code: '1COR311',
    name: 'Psycho-Criminology',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1COR212', '1COR222'],
    description: 'Psychological explanations of criminal behaviour, criminal profiling, crime scene profiling, serial offenders, and terrorist psychology.'
  },
  {
    code: '1COR321',
    name: 'Correctional Management',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1COR212', '1COR222'],
    description: 'Operations management in correctional centres, unit management systems, security administration, and rehabilitation programs.'
  },
  {
    code: '1COR322',
    name: 'Administering Community Corrections: (A) Assessing Offenders',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1COR311', '1COR321'],
    description: 'Offender risk assessment, DCS assessment tools, sentence planning, and practicum preparation for correctional centres.'
  },
  {
    code: '1COR332',
    name: 'Administering Community Corrections: (B) Assessing Communities',
    faculty: 'HSS',
    department: 'Criminal Justice',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1COR311', '1COR321'],
    description: 'Parole boards, probation administration, community supervision, reintegration of offenders, and community safety partnerships.'
  },

  // English & General Linguistics
  {
    code: '1ENG111',
    name: 'English 1 Part A',
    faculty: 'HSS',
    department: 'English',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Introduction to literary genres (prose, poetry, drama) and academic language skills for university study.'
  },
  {
    code: '1ENG112',
    name: 'English 1 Part B',
    faculty: 'HSS',
    department: 'English',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Advanced literary analysis, textual interpretation, critical reading, and language structures.'
  },
  {
    code: '1ENG121',
    name: 'Practical English 1A',
    faculty: 'HSS',
    department: 'English',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Foundational English for academic purposes: paragraph structure, grammar, academic reading, vocabulary, and essay writing.'
  },
  {
    code: '1ENG122',
    name: 'Practical English 1B',
    faculty: 'HSS',
    department: 'English',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Advanced reading comprehension, argument construction, research documentation, referencing, and academic synthesis.'
  },
  {
    code: '1GEN111',
    name: 'Writing and Oral Communication Skills',
    faculty: 'HSS',
    department: 'General Linguistics and Modern Languages',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Linguistic perspectives on written and spoken discourse: essay organization, oral presentation techniques, and language competence.'
  },
  {
    code: '1GEN112',
    name: 'An Introduction to Language',
    faculty: 'HSS',
    department: 'General Linguistics and Modern Languages',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Linguistic fundamentals: phonetics, phonology, morphology, syntax, semantics, and language families in South Africa.'
  },

  // Geography & Environmental Studies
  {
    code: '4GES111',
    name: 'Introduction to Physical and Environmental Geography',
    faculty: 'HSS',
    department: 'Geography and Environmental Studies',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Geomorphology, climatology, atmospheric moisture, global air circulation, weather systems, and environmental management.'
  },
  {
    code: '4GES112',
    name: 'Introduction to Human Geography',
    faculty: 'HSS',
    department: 'Geography and Environmental Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    description: 'Cultural geography, population dynamics, spatial distribution of human activity, tourism geography, and urban settlement patterns.'
  },
  {
    code: '4GES211',
    name: 'Global Landforms and Cartography',
    faculty: 'HSS',
    department: 'Geography and Environmental Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['4GES111'],
    description: 'Landform geomorphology, tectonic and fluvial processes, map projections, cartographic design, and aerial photo interpretation.'
  },
  {
    code: '4GES212',
    name: 'Demographics, Health and Sustainable Development',
    faculty: 'HSS',
    department: 'Geography and Environmental Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['4GES112'],
    description: 'Medical geography, spatial epidemiology, environmental determinants of health, population growth, and sustainable development.'
  },
  {
    code: '4HYD222',
    name: 'Geographical Information Systems (GIS)',
    faculty: 'HSS',
    department: 'Geography and Environmental Studies',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['4GES111'],
    description: 'Principles of GIS: spatial data structures, georeferencing, vector and raster models, spatial analysis, and map outputs.'
  },
  {
    code: '4GES311',
    name: 'Urban Environment and Recreation Planning',
    faculty: 'HSS',
    department: 'Geography and Environmental Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['4GES212'],
    description: 'Apartheid spatial planning legacy, integrated urban development, city regeneration, urban green spaces, and recreation planning.'
  },
  {
    code: '4GES331',
    name: 'Land Use and Natural Resource Management',
    faculty: 'HSS',
    department: 'Geography and Environmental Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['4GES211'],
    description: 'Land evaluation systems, agricultural and urban zoning, sustainable resource management, water and mineral resources conservation.'
  },
  {
    code: '4GES312',
    name: 'Environmental Management',
    faculty: 'HSS',
    department: 'Geography and Environmental Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['4GES212'],
    description: 'Environmental impact assessment (EIA), NEMA legislation, ISO 14001 systems, climate change adaptation, and biodiversity conservation.'
  },
  {
    code: '4GES322',
    name: 'Environmental Fieldwork and Research',
    faculty: 'HSS',
    department: 'Geography and Environmental Studies',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['4GES211', '4GES212'],
    description: 'Scientific field investigation, sampling design, GIS data integration, data analysis, and professional environmental research report.'
  },

  // Psychology
  {
    code: '1PSY121',
    name: 'Introduction to Psychology A',
    faculty: 'HSS',
    department: 'Psychology',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Psychology as a science: biological bases of behaviour, sensation, perception, learning, cognition, and research paradigms.'
  },
  {
    code: '1PSY122',
    name: 'Introduction to Psychology B',
    faculty: 'HSS',
    department: 'Psychology',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Subfields of psychology: emotion, motivation, developmental stages, psychological interventions, and social behaviour.'
  },
  {
    code: '1PSY211',
    name: 'Social Psychology',
    faculty: 'HSS',
    department: 'Psychology',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Individual behaviour in social contexts: attitudes, conformity, group dynamics, prejudice, altruism, aggression, and attraction.'
  },
  {
    code: '1PSY231',
    name: 'Developmental Psychology – Early Childhood',
    faculty: 'HSS',
    department: 'Psychology',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1PSY121'],
    description: 'Physical, cognitive, linguistic, emotional, and social development from infancy through early childhood.'
  },
  {
    code: '1PSY242',
    name: 'Personality Psychology',
    faculty: 'HSS',
    department: 'Psychology',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1PSY121', '1PSY122'],
    description: 'Theories of personality: psychoanalytic, humanistic, trait, behavioural, and social-cognitive approaches.'
  },
  {
    code: '1PSY341',
    name: 'Abnormal Psychology',
    faculty: 'HSS',
    department: 'Psychology',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1PSY121', '1PSY122'],
    description: 'Psychopathology, DSM-5 classification, mood disorders, anxiety disorders, psychotic disorders, etiology, and interventions.'
  },
  {
    code: '1PSY362',
    name: 'Counselling and Psychotherapy',
    faculty: 'HSS',
    department: 'Psychology',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1PSY341'],
    description: 'Therapeutic approaches: person-centred, cognitive-behavioural, psychodynamic, multicultural counselling, and ethical standards.'
  },

  // Social Work (BSW - 1WDEG1)
  {
    code: '1SWK111',
    name: 'Introduction to Social Work',
    faculty: 'HSS',
    department: 'Social Work',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Introduction to social work as a profession, ethical values, human rights framework, and developmental social welfare.'
  },
  {
    code: '1SWK112',
    name: 'Introduction to Social Work and Practicum',
    faculty: 'HSS',
    department: 'Social Work',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Development of professional identity, observational practicum, communication with clients, and social service agencies.'
  },
  {
    code: '1SWK211',
    name: 'Social Work Intervention with Individuals (Casework)',
    faculty: 'HSS',
    department: 'Social Work',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1SWK111'],
    description: 'Casework theory, assessment, intervention phases, laboratory interviewing simulations, and individual client support.'
  },
  {
    code: '1SWK222',
    name: 'Social Work Field Practice (Casework)',
    faculty: 'HSS',
    department: 'Social Work',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1SWK112'],
    description: 'Practical casework placement in approved welfare agencies applying case management principles.'
  },
  {
    code: '1SWK311',
    name: 'Community Work Theory',
    faculty: 'HSS',
    department: 'Social Work',
    nqfLevel: 7,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1SWK211', '1SWK221'],
    description: 'Community development theory, community profiling, participatory rural appraisal, advocacy, and social action.'
  },
  {
    code: '1SWK440',
    name: 'Field Work Practicum-Block Placement (WIL)',
    faculty: 'HSS',
    department: 'Social Work',
    nqfLevel: 8,
    credits: 75,
    semester: 'Year',
    prerequisites: ['All level 3 modules passed'],
    description: 'Full-time block placement in a registered welfare organization practicing casework, group work, and community work. Requires SACSSP registration.'
  },
  {
    code: '1SWK450',
    name: 'Social Work Research Project',
    faculty: 'HSS',
    department: 'Social Work',
    nqfLevel: 8,
    credits: 30,
    semester: 'Year',
    prerequisites: ['All level 3 modules passed'],
    description: 'Independent supervised research project in empirical social work practice and developmental welfare.'
  },

  // Sociology
  {
    code: '1SGY111',
    name: 'Introduction to Sociology',
    faculty: 'HSS',
    department: 'Sociology',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Theories of society, socialization, human relationships, social institutions, culture, and sociological imagination.'
  },
  {
    code: '1SGY112',
    name: 'Industrial Societies',
    faculty: 'HSS',
    department: 'Sociology',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Capitalism, division of labour, social stratification, gender roles, and transition to post-industrial societies.'
  },
  {
    code: '1SGI211',
    name: 'Industrial Relations System',
    faculty: 'HSS',
    department: 'Sociology',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 1',
    prerequisites: ['1SGY111', '1SGY112'],
    description: 'South African industrial relations system, role of the state, trade unions, employers, and tripartite negotiations.'
  },
  {
    code: '1SGI212',
    name: 'Labour Arbitration & Conflict Resolution',
    faculty: 'HSS',
    department: 'Sociology',
    nqfLevel: 6,
    credits: 16,
    semester: 'Semester 2',
    prerequisites: ['1SGY111', '1SGY112'],
    description: 'Dispute resolution mechanisms, CCMA processes, unfair labour practices, conciliation, and labour arbitration.'
  },

  // Tourism
  {
    code: '1RTO111',
    name: 'Introduction to Tourism',
    faculty: 'HSS',
    department: 'Recreation and Tourism',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 1',
    description: 'Concept of tourism, hospitality and leisure, evolution of travel, tourism economics, and socio-environmental impacts.'
  },
  {
    code: '1RTO112',
    name: 'Business Tourism & Entrepreneurship',
    faculty: 'HSS',
    department: 'Recreation and Tourism',
    nqfLevel: 5,
    credits: 16,
    semester: 'Semester 2',
    description: 'Tourism business opportunities, venture startup, business planning, marketing strategies, and small enterprise growth.'
  },
  {
    code: '1TWL312',
    name: 'Tourism Work Integrated Learning (WIL)',
    faculty: 'HSS',
    department: 'Recreation and Tourism',
    nqfLevel: 6,
    credits: 60,
    semester: 'Semester 2',
    description: 'Six-month industry internship in a reputable tourism, resort, travel, or hospitality establishment.'
  }
];
