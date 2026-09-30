/**
 * General Intelligence & Comprehensive Knowledge Engine
 * Provides talkative, articulate, friendly, and structured responses across:
 * - Mathematics & Calculations (with step-by-step arithmetic/algebra)
 * - Science, Physics, Chemistry, Biology & Earth Sciences
 * - Computer Science, Coding, Web Development & Artificial Intelligence
 * - High School & Matric Exam Preparation, Study Techniques & Motivation
 * - English, Essay Writing, Grammar & Communication
 * - South African & World History, Geography & Capitals
 * - Career Guidance, Personal Development & Life Advice
 * - Jokes, Riddles & Engaging Friendly Banter
 * - Dynamic Subject Analysis & Multi-Paragraph Answers for any question
 */

export interface GeneralQueryResponse {
  handled: boolean;
  text: string;
}

/**
 * Evaluates safe basic math expressions like "25 * 14", "15% of 300", "sqrt of 144", etc.
 */
function tryMathCalculation(clean: string): string | null {
  // Percentage: "15% of 300"
  const pctMatch = clean.match(/(\d+(?:\.\d+)?)\s*%\s*(?:of)\s*(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const p = parseFloat(pctMatch[1]);
    const total = parseFloat(pctMatch[2]);
    const result = (p / 100) * total;
    return `**Calculation Result: ${p}% of ${total} = ${result}** 🔢✨\n\n**Here is how we calculate it:**\n1. Convert the percentage to a decimal or fraction: ${p}% = ${p} / 100 = ${(p / 100).toFixed(4).replace(/\.?0+$/, '')}\n2. Multiply by the total number: ${(p / 100).toFixed(4).replace(/\.?0+$/, '')} × ${total} = **${result}**\n\nIf you have any other math or formula questions, feel free to ask! 📐💡`;
  }

  // Square root: "sqrt of 144", "square root of 81"
  const sqrtMatch = clean.match(/(?:square root of|sqrt of|sqrt)\s*(\d+(?:\.\d+)?)/i);
  if (sqrtMatch) {
    const val = parseFloat(sqrtMatch[1]);
    const result = Math.sqrt(val);
    return `**Calculation Result: √${val} = ${result}** 🔢✨\n\nThe square root of **${val}** is **${result}** (because ${result} × ${result} = ${val}).\n\nNeed help with quadratic formulas, algebra, or calculus? Let me know! 📐💡`;
  }

  // Basic arithmetic: "45 * 12", "1200 / 4", "55 + 75", "150 - 45"
  const arithMatch = clean.match(/^(\d+(?:\.\d+)?)\s*([\+\-\*\/xX]|times|plus|minus|divided by)\s*(\d+(?:\.\d+)?)$/i) ||
    clean.match(/(?:what is|calculate|solve|how much is)\s*(\d+(?:\.\d+)?)\s*([\+\-\*\/xX]|times|plus|minus|divided by)\s*(\d+(?:\.\d+)?)/i);

  if (arithMatch) {
    const a = parseFloat(arithMatch[1]);
    const opRaw = arithMatch[2].toLowerCase().trim();
    const b = parseFloat(arithMatch[3]);
    let result = 0;
    let opSymbol = '';
    let explanation = '';

    if (opRaw === '+' || opRaw === 'plus') {
      result = a + b;
      opSymbol = '+';
      explanation = `Adding ${a} and ${b} gives **${result}**.`;
    } else if (opRaw === '-' || opRaw === 'minus') {
      result = a - b;
      opSymbol = '-';
      explanation = `Subtracting ${b} from ${a} gives **${result}**.`;
    } else if (opRaw === '*' || opRaw === 'x' || opRaw === 'times') {
      result = a * b;
      opSymbol = '×';
      explanation = `Multiplying ${a} by ${b} gives **${result}**.`;
    } else if (opRaw === '/' || opRaw === 'divided by') {
      if (b === 0) {
        return `Division by zero is mathematically **undefined**! 🚫 In arithmetic, you cannot divide a number by 0 because no number multiplied by 0 equals a non-zero number.`;
      }
      result = a / b;
      opSymbol = '÷';
      explanation = `Dividing ${a} by ${b} gives **${result}**.`;
    }

    return `**Calculation Result: ${a} ${opSymbol} ${b} = ${result}** 🔢✨\n\n${explanation}\n\nDo you have another equation, algebraic problem, or word problem you'd like to work through? I'm always happy to help! 📐📊`;
  }

  return null;
}

/**
 * Master General Intelligence Knowledge Handler
 */
export function handleGeneralIntelligenceQuery(
  userMessage: string,
  langCode: string,
  history: Array<{ sender: string; text: string }> = []
): GeneralQueryResponse {
  const lower = (userMessage || '').toLowerCase().trim();

  // 1. Check for Math / Calculation
  const mathResult = tryMathCalculation(lower);
  if (mathResult) {
    return { handled: true, text: mathResult };
  }

  // 2. Science & Biology
  // Topic: Photosynthesis
  if (/\b(photosynthesis|how do plants make food|photophosphorylation|chloroplast|calvin cycle)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**Photosynthesis: How Plants Power Life on Earth** 🌿☀️

**Photosynthesis** is the biological process by which green plants, algae, and certain bacteria convert light energy (sunlight) into chemical energy stored in glucose (sugar).

### 1. The Chemical Equation:
$$\\text{6CO}_2 + \\text{6H}_2\\text{O} + \\text{Light Energy} \\longrightarrow \\text{C}_6\\text{H}_{12}\\text{O}_6 + \\text{6O}_2$$
*(Carbon Dioxide + Water + Sunlight $\\rightarrow$ Glucose + Oxygen)*

### 2. The Two Stages:
1. **Light-Dependent Reactions** (takes place in the *thylakoids* of chloroplasts):
   • Chlorophyll absorbs sunlight and splits water molecules ($H_2O$).
   • Oxygen ($O_2$) is released as a vital byproduct into the air we breathe!
   • Energy carriers ATP and NADPH are synthesized.
2. **Light-Independent Reactions (The Calvin Cycle)** (takes place in the *stroma*):
   • Carbon dioxide ($CO_2$) is fixed and combined using the ATP and NADPH energy.
   • Glucose ($C_6H_{12}O_6$) is produced, providing food, starches, and cellular fuel for the plant.

### 3. Why It Matters:
• It produces the oxygen required by nearly all aerobic life on Earth.
• It forms the primary base of global food chains and absorbs atmospheric carbon dioxide!

Would you like to explore cellular respiration, plant cellular biology, or another biology topic? 🔬🌱`
    };
  }

  // Topic: Cells, DNA & Genetics
  if (/\b(what is dna|how does dna work|dna structure|genes|mitochondria|cell structure|animal cell|plant cell|genetics)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**Cellular Biology & Genetics Explained** 🧬🔬

Every living organism is made of microscopic building blocks called **cells**, and the blueprint of life inside those cells is **DNA** (Deoxyribonucleic Acid).

### 1. What is DNA?
• **The Structure**: DNA is shaped like a twisted ladder, known as a **double helix**, discovered by James Watson, Francis Crick, and Rosalind Franklin.
• **The Genetic Code**: The "rungs" of the ladder are made of four chemical bases:
  - **A** (Adenine) pairs strictly with **T** (Thymine)
  - **C** (Cytosine) pairs strictly with **G** (Guanine)
• The precise sequence of these letters spells out instructions to make proteins that determine eye color, blood type, height, and biological functions!

### 2. Key Organelles in a Cell:
• **Nucleus**: The command center housing DNA.
• **Mitochondria**: The "powerhouse of the cell", producing cellular energy (ATP) through cellular respiration.
• **Ribosomes**: Protein factories that translate genetic codes into functional proteins.
• **Cell Membrane**: The selective barrier controlling what enters and exits the cell.
• *(Plant cells also possess **Chloroplasts** for photosynthesis and a rigid **Cellulose Cell Wall**!)*

Are you studying for a Life Sciences / Biology exam, or curious about genetic engineering and heredity? Feel free to ask! 🧬✨`
    };
  }

  // Topic: Human Body & Anatomy
  if (/\b(how does the heart work|human heart|how do lungs work|immune system|circulatory system|nervous system|digestive system)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**The Marvel of Human Anatomy & Physiology** 🫀🧠

The human body is an extraordinarily synchronized biological machine comprised of interconnected organ systems:

### 1. The Circulatory System (The Heart & Blood):
• The heart is a muscular organ with **four chambers** (Right Atrium, Right Ventricle, Left Atrium, Left Ventricle).
• **Deoxygenated blood** enters the right side and is pumped to the lungs to pick up oxygen.
• **Oxygen-rich blood** returns to the left side and is pumped through the **Aorta** to fuel every organ and muscle in your body!
• An average heart beats around 70-100 times per minute—over 100,000 times every day!

### 2. Other Core Body Systems:
• **The Nervous System (Brain & Nerves)**: Controls thoughts, memory, movement, and reflexes via electrical impulses transmitted across neurons.
• **The Respiratory System (Lungs)**: Takes in oxygen through alveoli air sacs and expels carbon dioxide.
• **The Immune System**: Protects you from pathogens using white blood cells (B-cells make antibodies; T-cells destroy infected cells).
• **The Digestive System**: Breaks down food into nutrients using stomach acids and enzymes in the small intestine.

Which body system or organ would you like to explore deeper? 🩺💡`
    };
  }

  // Topic: Physics - Gravity & Space
  if (/\b(what is gravity|how does gravity work|why is the sky blue|solar system|black hole|newton's laws|speed of light)\b/i.test(lower)) {
    if (lower.includes('sky blue')) {
      return {
        handled: true,
        text: `**Why is the Sky Blue? (Rayleigh Scattering Explained)** ☀️🌤️

The sky is blue because of a physical phenomenon called **Rayleigh Scattering**:

1. **Sunlight is White Light**: The light coming from the Sun may look white or yellow, but it actually contains all the colors of the rainbow combined!
2. **Wavelengths of Light**: Light travels in waves. Red and yellow light have longer, lazier wavelengths, while blue and violet light have shorter, smaller wavelengths.
3. **The Atmosphere Acts as a Prism**: When sunlight strikes Earth's atmosphere, it collides with gas molecules (mostly nitrogen and oxygen).
4. **Scattering**: Because blue light travels in shorter, smaller waves, it collides and scatters in all directions across the atmosphere far more than red light. When you look up, your eyes perceive this scattered blue light!

*(Bonus: At sunset, sunlight passes through much more atmosphere to reach your eyes, scattering away the blue light and letting the longer red and orange wavelengths pass straight through to create vibrant sunsets! 🌅)*`
      };
    }

    return {
      handled: true,
      text: `**Physics & Gravity: The Invisible Glue of the Universe** 🌌🪐

### 1. What is Gravity?
Gravity is one of the four fundamental forces of nature. It is the natural phenomenon by which all things with mass or energy are attracted toward one another:
• **Sir Isaac Newton's View**: Every object exerts a gravitational pull on every other object. The greater the mass, the stronger the pull; the greater the distance, the weaker the pull. On Earth, gravity accelerates falling objects at roughly **$9.8 \\text{ m/s}^2$**.
• **Albert Einstein's General Relativity**: Einstein revolutionized our understanding by showing that gravity is actually the curvature of **spacetime** caused by mass! Heavy objects like the Sun bend the fabric of space, causing planets like Earth to roll along that curve in an orbit.

### 2. Fascinating Space Facts:
• **The Solar System**: 8 planets (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune). Jupiter is so massive that more than 1,300 Earths could fit inside it!
• **Black Holes**: Regions of space where gravity is so intense that nothing—not even light—can escape its event horizon.
• **The Speed of Light**: The cosmic speed limit is approximately **$300,000 \\text{ km/s}$** ($3 \\times 10^8 \\text{ m/s}$). Light from the Sun takes about 8 minutes and 20 seconds to reach Earth!

Would you like to discuss relativity, planetary physics, or Newton's laws of motion? 🚀🔭`
    };
  }

  // Topic: Chemistry - Atoms & Periodic Table
  if (/\b(what is an atom|periodic table|acids and bases|chemical reaction|ph scale|elements in chemistry|what is water made of)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**Chemistry: The Building Blocks of Matter** ⚗️🧪

Chemistry is the study of matter, its properties, how substances combine or separate, and how they interact with energy.

### 1. Anatomy of an Atom:
All matter in the universe is constructed from **atoms**, which contain:
• **Protons**: Positively charged particles in the center (nucleus). The number of protons defines what element it is!
• **Neutrons**: Neutral particles in the nucleus that provide stability.
• **Electrons**: Tiny negatively charged particles orbiting in clouds around the nucleus, responsible for chemical bonds.

### 2. The Periodic Table:
• Organized by increasing atomic number (number of protons).
• **Periods** (horizontal rows) represent electron shells.
• **Groups** (vertical columns) share similar chemical properties (e.g. Group 1 Alkali Metals, Group 17 Halogens, Group 18 Noble Gases).
• Common elements: Hydrogen (H, #1), Carbon (C, #6), Nitrogen (N, #7), Oxygen (O, #8), Gold (Au, #79).

### 3. Acids, Bases & the pH Scale:
• The **pH scale** runs from 0 to 14:
  - **pH 0 - 6.9**: Acidic (vinegar, lemon juice, stomach acid; release $H^+$ ions)
  - **pH 7.0**: Neutral (pure distilled water)
  - **pH 7.1 - 14**: Basic / Alkaline (soap, bleach, baking soda; release $OH^-$ ions)

Are you working on Physical Sciences chemistry problems or stoichiometry? Tell me what you're working on! 🧪💡`
    };
  }

  // 3. Computer Science & Coding
  // Topic: Programming / Python / Coding
  if (/\b(python|javascript|coding|programming|how to code|learn programming|what is software|html|css|web development|artificial intelligence|machine learning|what is an algorithm)\b/i.test(lower)) {
    if (lower.includes('python')) {
      return {
        handled: true,
        text: `**Python Programming: The World's Most Popular Language** 🐍💻

**Python** is a high-level, interpreted programming language created by Guido van Rossum in 1991. It is renowned for its clean, English-like syntax that makes it intuitive for beginners yet powerful enough for Google, NASA, and Netflix.

### 1. Why Python is Number One:
• **Readability**: Code looks almost like plain English without cumbersome curly brackets or semicolons.
• **Versatile**: Used for Machine Learning, Data Science, Web Backends (Django/FastAPI), and Automation scripts.
• **Vast Libraries**: PyTorch & TensorFlow (Deep Learning), Pandas & NumPy (Data Analysis), Requests (APIs).

### 2. A Quick Python Example:
\`\`\`python
# Simple Python script to greet and calculate
def welcome_student(name, target_score):
    print(f"Sawubona {name}! Welcome to coding! 🚀")
    if target_score >= 30:
        return "You're aiming for top bachelor degrees! 🎓"
    else:
        return "Keep pushing—every point counts! 💪"

result = welcome_student("Aphiwe", 32)
print(result)
\`\`\`

### 3. Best Way to Learn:
1. Start with basics: Variables, Data Types (strings, integers, lists, dictionaries).
2. Learn Control Flow: \`if/else\` conditions and \`for/while\` loops.
3. Build micro-projects: Calculators, text games, or web scrapers!

Would you like help writing a specific Python script or understanding loops, functions, or object-oriented programming? 💻✨`
      };
    }

    if (lower.includes('machine learning') || lower.includes('data science') || lower.includes('neural network')) {
      return {
        handled: true,
        text: `**Machine Learning (ML) & Computational Intelligence Explained** 🤖🧠

**Computational Intelligence** refers to computer systems engineered to simulate human intelligence—performing tasks such as visual perception, speech recognition, decision-making, and natural language understanding.

### 1. How Computational Systems Work:
• **Traditional Programming**: Humans write explicit \`if/then\` rules for computers to follow.
• **Machine Learning (ML)**: Instead of hand-writing rules, we feed massive datasets into mathematical algorithms (neural networks) that discover patterns on their own!
• **Deep Learning**: Uses multi-layered artificial neural networks inspired by the human brain's interconnected neurons.
• **Large Language Models (LLMs)**: Trained on vast libraries of human literature and code using the *Transformer architecture* to predict the most contextually relevant words and thoughts.

### 2. Major Applications:
• **Healthcare**: Detecting tumors on X-rays earlier than the human eye.
• **Automotive**: Self-driving navigation and sensor fusion.
• **Language & Education**: Real-time translation, conversational advisors, and personalized tutoring.

Are you interested in how to start studying machine learning, computer science, or data engineering? Let's talk through it! 🚀💡`
      };
    }

    return {
      handled: true,
      text: `**Getting Started with Coding & Software Development** 💻🚀

Coding is the art of giving instructions to computers to solve real-world problems, build applications, or automate tasks.

### 1. Which Language Should You Learn First?
• **Python**: Best overall starting language. Clean syntax, supreme in Data Science, Machine Learning, and scripting.
• **JavaScript**: The undisputed language of the web. Essential if you want to build websites, mobile apps, or frontend user interfaces.
• **HTML & CSS**: The building blocks of the web (HTML provides the skeleton; CSS provides the visual styling and colors).
• **Java or C++**: Great for learning core computer science fundamentals, memory management, and enterprise systems.

### 2. Key Programming Concepts in Every Language:
1. **Variables**: Containers for storing data (e.g. \`age = 18\`).
2. **Data Types**: Numbers, Strings (text), Booleans (true/false), and Arrays/Lists.
3. **Conditionals**: Making decisions (\`if score >= 30: admit()\`).
4. **Loops**: Repeating tasks without repeating code (\`for student in students: greet()\`).
5. **Functions**: Reusable blocks of code that take inputs and produce outputs.

What would you like to build—a website, a mobile app, or a smart automated tool? I can guide you step-by-step! 💡👨‍💻`
    };
  }

  // 4. Matric & Exam Study Mastery
  if (/\b(how to study|study tips|how do i study|how to pass|study timetable|exam stress|exam tips|matric tips|pomodoro|active recall|spaced repetition|feynman technique)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**The Proven High-Performance Study Method (How to Pass with Distinctions)** 📚🏆

Studying longer doesn't always mean studying better. Cognitive science proves that **active, strategic learning** yields far higher exam marks than hours of passive re-reading!

### 1. The 4 Most Powerful Study Techniques:
1. **Active Recall (The #1 Method)**:
   • Close your textbook and force your brain to retrieve the information from memory.
   • Write down summaries, draw diagrams from scratch, or test yourself with flashcards.
2. **Spaced Repetition**:
   • Review new topics on Day 1, Day 3, Day 7, and Day 14. This prevents the brain's natural "forgetting curve" and cements facts into long-term memory.
3. **The Pomodoro Technique (Beating Procrastination)**:
   • Study with 100% focus for **25 minutes** (phone completely away).
   • Take a mandatory **5-minute break** (stretch, drink water).
   • After 4 cycles, take a longer 20-30 minute break.
4. **The Feynman Technique**:
   • Try explaining the concept out loud in simple terms as if you were teaching a Grade 8 student. Wherever you stumble is where your knowledge gap is!

### 2. The Past Papers Secret:
• 80% of exam success comes from practicing past papers under strict timed conditions.
• Always mark your papers using the official memo to understand exactly what examiners award marks for!

### 3. Taking Care of Your Mind:
• Aim for 7-8 hours of sleep—your brain consolidates memories while you sleep!
• Stay hydrated and take brisk walks to clear mental fatigue.

Which subject are you preparing for right now? Let me know and I can share specific tips for that subject! 🎓💪`
    };
  }

  // 5. English & Writing
  if (/\b(how to write an essay|essay structure|write a letter|how to write a cv|resume|thesis statement|formal email)\b/i.test(lower)) {
    if (lower.includes('cv') || lower.includes('resume')) {
      return {
        handled: true,
        text: `**How to Write an Impressive Student CV (Curriculum Vitae)** 📄✨

Even without years of formal work experience, a well-structured CV highlights your potential, discipline, and reliability to universities, bursary committees, and employers!

### Essential Sections of a Winning CV:
1. **Header**: Full Name, Professional Email, Cell Number, City/Province, and LinkedIn/Portfolio link (if available).
2. **Personal Profile / Summary** (3-4 sentences): Who you are, your academic strengths, and your ambition (e.g. *"Dedicated Grade 12 student with strong analytical skills in Pure Mathematics and Science, seeking to study Engineering..."*).
3. **Education**: School Name, expected Matric year, major subjects, and academic achievements/merits.
4. **Leadership & Extracurriculars**: Prefect, RCL member, debate club, sports teams, church leadership, or community volunteer work.
5. **Key Skills**: Computer literacy (Word, Excel), communication, teamwork, time management, languages spoken.
6. **References**: 1-2 teachers, school principal, or community mentors who can vouch for your character.

Keep it clean, proofread for zero typos, and keep it under 2 pages! Would you like help drafting any specific section? 📝💼`
      };
    }

    return {
      handled: true,
      text: `**The Complete Guide to Writing a High-Scoring Essay** ✍️📖

Whether writing for English, History, or Life Orientation, a compelling essay follows a clear, logical structure:

### 1. Introduction (10% of essay):
• **The Hook**: An engaging opening sentence that grabs the reader's attention.
• **Background Context**: 1-2 sentences outlining the topic or debate.
• **Thesis Statement**: The most important sentence! State clearly what your argument or stance is.

### 2. Body Paragraphs (80% of essay) — Use the **PEEL** Formula:
• **P - Point**: Topic sentence introducing the main idea of this paragraph.
• **E - Explanation**: Elaborate and explain the reasoning behind your point.
• **E - Evidence / Example**: Provide concrete facts, quotes, historical examples, or data.
• **L - Link**: Connect back to your central thesis statement.

### 3. Conclusion (10% of essay):
• Restate your thesis statement in fresh, compelling words.
• Synthesize your main supporting arguments.
• End with a powerful final thought or broader takeaway.

### Top Writing Tips:
• Use smooth transition words (*Furthermore, Consequently, In contrast, Nonetheless*).
• Avoid slang and maintain formal academic tone.
• Always proofread out loud to catch awkward sentences!

What topic or essay prompt are you working on? Share it with me and we can brainstorm an outline together! 📝💡`
    };
  }

  // 6. South African & World History
  if (/\b(nelson mandela|apartheid|soweto uprising|shaka zulu|provinces of south africa|south african history|who was mandela)\b/i.test(lower)) {
    if (lower.includes('nelson mandela') || lower.includes('mandela')) {
      return {
        handled: true,
        text: `**Nelson Rolihlahla Mandela: The Father of the Nation** 🇿🇦🕊️

**Nelson Mandela** (18 July 1918 – 5 December 2013), affectionately known by his clan name **Madiba**, was a global icon of peace, resilience, and human dignity.

### 1. Key Milestones:
• **Early Life & Law**: Born in Mvezo, Eastern Cape. He co-founded South Africa's first black law firm with Oliver Tambo in Johannesburg.
• **The Struggle Against Apartheid**: As a leader in the African National Congress (ANC) and Umkhonto we Sizwe, he fought relentlessly against institutionalized racial segregation.
• **The Rivonia Trial (1964)**: Sentenced to life imprisonment for his opposition to the apartheid regime. His famous statement from the dock declared: *"I have cherished the ideal of a democratic and free society... It is an ideal for which I am prepared to die."*
• **27 Years in Prison**: Spent 18 of those years on Robben Island, emerging in 1990 without bitterness, committed to peaceful reconciliation.
• **1993 Nobel Peace Prize**: Awarded jointly with F.W. de Klerk for their work in peacefully ending apartheid.
• **First Democratic President (1994)**: On 10 May 1994, Mandela was inaugurated as South Africa's first democratically elected black president, uniting the "Rainbow Nation".

Madiba's legacy reminds us: *"Education is the most powerful weapon which you can use to change the world."* 🌟✨`
      };
    }

    if (lower.includes('provinces')) {
      return {
        handled: true,
        text: `**The 9 Provinces of South Africa & Their Capitals** 🇿🇦🗺️

South Africa is divided into 9 diverse provinces, each with its own provincial capital:

1. **KwaZulu-Natal (KZN)** — Capital: **Pietermaritzburg** (Largest city: Durban) *(Home to UNIZULU!)*
2. **Gauteng** — Capital: **Johannesburg** *(South Africa's economic hub; Pretoria in Gauteng is the national Administrative Capital)*
3. **Western Cape** — Capital: **Cape Town** *(National Legislative Capital)*
4. **Eastern Cape** — Capital: **Bhisho** (Largest city: Gqeberha / Port Elizabeth)
5. **Free State** — Capital: **Bloemfontein** *(National Judicial Capital)*
6. **Limpopo** — Capital: **Polokwane**
7. **Mpumalanga** — Capital: **Mbombela** (Nelspruit)
8. **North West** — Capital: **Mahikeng**
9. **Northern Cape** — Capital: **Kimberley** *(The largest province by land area!)*

South Africa has 12 official languages (including South African Sign Language) and three national capital cities! 🇿🇦✨`
      };
    }
  }

  // 7. Life, Careers & Motivation
  if (/\b(how to choose a career|what career should i choose|feeling lost|feeling anxious|overcome procrastination|how to be successful|motivation|stay motivated)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**How to Find Your Direction & Build a Meaningful Career** 🧭🌟

It's completely normal to feel uncertain about the future—most people do! The most fulfilling and successful careers happen at the intersection of **three circles (The Ikigai Framework)**:

### 1. The 3 Circles Framework:
1. **What You Genuinely Enjoy (Your Passions)**: What subjects, problems, or activities make you lose track of time?
2. **What You Are Naturally Good At (Your Strengths)**: Are you strong with numbers, writing, empathy and listening, hands-on building, or leadership?
3. **What Society & the Economy Needs (Market Demand)**: What careers offer strong employment prospects, good income, and growth over the next 10-20 years? (e.g. Healthcare, Technology/Software, Law, Teaching, Commerce/Finance, Renewable Energy, Engineering).

### 2. Overcoming Procrastination & Anxiety:
• **The 2-Minute Rule**: If a task takes less than two minutes, do it immediately. If it's a huge project, commit to doing just 5 minutes of work today. Action creates motivation, not the other way around!
• **Focus on What You Can Control**: You can't control final exam papers, but you CAN control how many hours you study today, what you eat, and how you prepare.
• **Failure is Just Data**: A low test score or temporary setback is not your identity—it is simply feedback showing you where to adjust your study habits.

Tell me a little about what you enjoy doing or your favorite subjects, and we can explore career paths suited to you! 💡🤝`
    };
  }

  // 8. Fun, Jokes & Casual Banter
  if (/\b(tell me a joke|make me laugh|say a joke|tell a joke|tell me a riddle|riddle me this|are you real|meaning of life)\b/i.test(lower)) {
    if (lower.includes('joke')) {
      const jokes = [
        `Here's a good one for you! 😄\n\n**Why did the student eat their homework?**\n...Because their teacher told them it was a piece of cake! 🍰📚`,
        `How about this one! 😂\n\n**Why can't you trust atoms?**\n...Because they make up everything! ⚛️🔬`,
        `Here is a math classic! 📐😄\n\n**Why was the math book always sad?**\n...Because it had too many problems! 📘➕`,
        `A tech favorite! 💻😂\n\n**Why do programmers prefer dark mode?**\n...Because light attracts bugs! 🐛✨`
      ];
      const picked = jokes[Math.floor(Math.random() * jokes.length)];
      return {
        handled: true,
        text: `${picked}\n\nNeed another joke, or would you like to talk about study tricks or university life? 😊🎉`
      };
    }

    if (lower.includes('riddle')) {
      return {
        handled: true,
        text: `**Here's a riddle for you!** 🤔✨\n\n*I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?*\n\n*(Think about it... scroll down when you're ready!)*\n\n.\n.\n.\n**Answer:** An **Echo**! 🗣️💨\n\nWant another riddle, or have a question you'd like to ask? 😊`
      };
    }

    if (lower.includes('meaning of life')) {
      return {
        handled: true,
        text: `**What is the Meaning of Life?** 🌌💭\n\nPhilosophers, scientists, and thinkers have pondered this for thousands of years! Here are the most inspiring perspectives:\n\n• **Creating Your Own Purpose (Existentialism)**: The meaning of life isn't something hidden waiting to be found—it is something you actively create through what you care about, who you love, and the goals you pursue.\n• **Contribution & Service**: Helping others, lifting your community, and leaving the world a little kinder and wiser than you found it.\n• **Growth & Learning**: Continuous curiosity—learning new skills, overcoming challenges, and becoming the best version of yourself.\n• **Enjoying the Journey**: Finding joy in simple moments, good conversations, laughs with friends, and nature.\n\nWhat brings you the most purpose and excitement in your life right now? 🌟🌱`
      };
    }
  }

  // 9. Technology & Advanced Computing Concepts
  if (/\b(quantum computing|quantum computer|qubit|superposition|entanglement)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**Quantum Computing Explained** ⚛️💻

Quantum computing is a revolutionary field of computer science that harnesses the counterintuitive principles of **quantum mechanics** to solve complex calculations that would take classical supercomputers thousands of years to complete!

### 1. Classical Bits vs. Quantum Qubits:
• **Classical Bits**: Everyday computers process information in binary bits (**0** or **1**)—like a light switch that is either OFF or ON.
• **Qubits (Quantum Bits)**: Unlike bits, qubits can exist in a state of **Superposition**—meaning they can represent **0**, **1**, or any simultaneous combination of both at the same time!

### 2. Key Quantum Principles:
1. **Superposition**: Allows a quantum computer to evaluate millions of potential solutions simultaneously rather than checking them one by one.
2. **Entanglement**: Two qubits become inextricably linked so that the state of one instantly dictates the state of another, regardless of distance. Albert Einstein famously referred to this as *"spooky action at a distance"*.
3. **Quantum Interference**: Manipulates the probabilities of qubits so that incorrect answers cancel each other out and the correct answer is amplified.

### 3. Real-World Applications:
• **Medicine & Drug Discovery**: Simulating complex molecular interactions and protein folding to develop life-saving drugs.
• **Cryptography & Security**: Creating unbreakable encryption algorithms (and developing quantum-safe protocols).
• **Logistics & Clean Energy**: Optimizing global flight paths, supply chains, and battery chemistry for electric vehicles.

Would you like to explore how quantum algorithms like Shor's or Grover's algorithm work? 🚀🔬`
    };
  }

  // Topic: How Computers Work & Architecture
  if (/\b(how do computers work|how does a computer work|computer architecture|cpu|ram|motherboard|transistors|binary system)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**How Computers Work: From Electricity to Software** 💻⚡

At its core, a computer is an electronic machine designed to receive input, process data at superhuman speeds, and deliver output.

### 1. The Core Hardware Components:
• **CPU (Central Processing Unit)**: The "brain" of the computer. It executes instructions billions of times per second using the *Fetch-Decode-Execute* cycle.
• **RAM (Random Access Memory)**: High-speed temporary memory where the computer keeps data it is working with right now. When you turn off the computer, RAM clears.
• **Storage (SSD / Hard Drive)**: Long-term permanent storage where your operating system, games, photos, and files remain safely stored.
• **Motherboard**: The central circuit board connecting the CPU, RAM, graphics card, and power supply together.
• **GPU (Graphics Processing Unit)**: Specializes in rendering graphics, 3D games, and accelerating neural network computations.

### 2. Binary Code: The Language of 1s and 0s:
Computers are built with microscopic **transistors**—tiny electrical switches.
• When electricity flows through a transistor, it represents a **1** (ON).
• When electricity is blocked, it represents a **0** (OFF).
• By combining billions of these microscopic switches into logic gates (AND, OR, NOT), computers perform everything from streaming 4K video to running complex computational intelligence models! 🖥️✨`
    };
  }

  // Topic: Algorithms & Data Structures
  if (/\b(what is an algorithm|data structures|binary search|sorting algorithms|big o notation|array vs linked list)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**Algorithms & Data Structures: The Heart of Computer Science** 📊⚡

### 1. What is an Algorithm?
An **algorithm** is a well-defined, step-by-step sequence of instructions designed to solve a specific problem or complete a task (like a precise recipe for computers to follow).

### 2. Essential Data Structures:
• **Array**: A contiguous block of memory holding elements of the same type. Fast random access ($O(1)$) by index.
• **Linked List**: A chain of nodes where each node contains data and a pointer to the next node. Easy to insert and delete anywhere.
• **Stack (LIFO)**: Last-In, First-Out (like a stack of cafeteria plates; \`push\` and \`pop\`).
• **Queue (FIFO)**: First-In, First-Out (like a line at the bank).
• **Hash Map / Dictionary**: Key-value pairs providing lightning-fast lookups ($O(1)$ average time) using hashing functions.
• **Trees & Graphs**: Hierarchical and networked data structures used for search algorithms, GPS mapping, and social networks.

### 3. Big O Notation (Measuring Efficiency):
• **$O(1)$ - Constant Time**: Takes the same time regardless of data size (e.g. accessing an array index).
• **$O(\\log n)$ - Logarithmic Time**: Extremely fast! Divides the search space in half each step (e.g. Binary Search).
• **$O(n)$ - Linear Time**: Time grows directly proportional to dataset size.
• **$O(n^2)$ - Quadratic Time**: Nested loops (like Bubble Sort); becomes slow on large datasets.

Are you preparing for a computer science exam or practicing coding interview challenges? Let me know what you'd like to dive into! 👨‍💻💡`
    };
  }

  // Topic: Best Schools / South African University Rankings / Comparison
  if (/\b(best schools?|best universit(y|ies)|top universit(y|ies)|school rankings?|university rankings?|which university is best|how does unizulu compare|best universities in south africa)\b/i.test(lower)) {
    return {
      handled: true,
      text: `**South African University Landscape & How UNIZULU Compares** 🏛️🇿🇦

South Africa has 26 public universities, each with distinct institutional strengths, geographic focus, and academic specialties:

### 1. Traditional Leading Research Universities:
• **University of Cape Town (UCT)**: Ranked highest in Africa on global university tables (QS & THE); renowned for medicine, commerce, and environmental science.
• **University of the Witwatersrand (Wits)**: World-renowned for mining engineering, palaeontology, medicine, and law in Johannesburg.
• **Stellenbosch University & University of Pretoria (UP)**: Strong technical, engineering, agricultural, and veterinary science hubs.
• **University of KwaZulu-Natal (UKZN)**: Premier research university in KZN known for medical science, HIV research, and engineering.

### 2. The University of Zululand (UNIZULU): Unique Strengths & Identity:
As a comprehensive public university founded in 1960 in northern KwaZulu-Natal, UNIZULU offers distinct advantages:
• **Premier Hydrology & Water Resources**: UNIZULU hosts one of Africa's leading Hydrology departments, attracting international researchers.
• **Acclaimed Faculty of Education**: Known as one of South Africa's most prolific institutions for training dedicated primary and secondary school teachers.
• **Accessible Entry Requirements**: While retaining high academic rigor (e.g. LLB Law requires 30 APS; BCom Accounting requires 28 APS), UNIZULU provides practical career diploma pathways (Richards Bay Campus) for students with 22+ APS.
• **Rich Campus Community & Affordability**: Strong NSFAS coverage, lower living costs than major metros, and vibrant campus life at KwaDlangezwa.

Are you comparing specific programmes between UNIZULU and other institutions? Tell me your target field! 🎓📚`
    };
  }

  // Topic: Algebra & Math Formulas (Linear & Quadratic)
  if (/\b(quadratic formula|pythagor(as|ean)|algebra formula|solve for x|linear equation)\b/i.test(lower)) {
    if (lower.includes('quadratic')) {
      return {
        handled: true,
        text: `**The Quadratic Formula Explained** 📐✨

For any standard quadratic equation written in the form:
$$ax^2 + bx + c = 0$$

The solutions for $x$ are calculated using the **Quadratic Formula**:
$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

### The Discriminant ($\\Delta = b^2 - 4ac$):
• If $\\Delta > 0$: Two distinct real roots (two $x$-intercepts).
• If $\\Delta = 0$: Exactly one repeated real root.
• If $\\Delta < 0$: No real roots (two complex/imaginary roots).

**Example**: Solve $x^2 - 5x + 6 = 0$ ($a = 1, b = -5, c = 6$):
$$x = \\frac{-(-5) \\pm \\sqrt{(-5)^2 - 4(1)(6)}}{2(1)} = \\frac{5 \\pm \\sqrt{25 - 24}}{2} = \\frac{5 \\pm 1}{2}$$
So **$x = 3$** or **$x = 2$**!

Do you have a specific equation you'd like us to solve step-by-step? 🔢💡`
      };
    }

    if (lower.includes('pythagor')) {
      return {
        handled: true,
        text: `**The Pythagorean Theorem** 📐🔺

In any **right-angled triangle**, the square of the hypotenuse (the longest side opposite the $90^\\circ$ angle) is equal to the sum of the squares of the other two sides:

$$a^2 + b^2 = c^2$$

*(Where $c$ is the hypotenuse, and $a$ and $b$ are the other two legs).*

**Example**: If side $a = 3$ and side $b = 4$:
$$c^2 = 3^2 + 4^2 = 9 + 16 = 25$$
$$c = \\sqrt{25} = 5$$

Do you have another geometry or trigonometry problem? Let's solve it! 📐✨`
      };
    }
  }

  return { handled: false, text: '' };
}
