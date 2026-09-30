export interface SouthAfricanLanguage {
  code: string;
  name: string;
  nativeName: string;
  flagOrIcon: string;
  popular?: boolean;
}

export const SA_LANGUAGES: SouthAfricanLanguage[] = [
  { code: 'auto', name: 'Auto-detect', nativeName: 'Zonke / Any SA Language', flagOrIcon: '✨', popular: true },
  { code: 'en', name: 'English', nativeName: 'English', flagOrIcon: '🇿🇦', popular: true },
  { code: 'zu', name: 'isiZulu', nativeName: 'isiZulu', flagOrIcon: '🇿🇦', popular: true },
  { code: 'xh', name: 'isiXhosa', nativeName: 'isiXhosa', flagOrIcon: '🇿🇦', popular: true },
  { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans', flagOrIcon: '🇿🇦', popular: true },
  { code: 'nso', name: 'Sepedi', nativeName: 'Sesotho sa Leboa', flagOrIcon: '🇿🇦', popular: true },
  { code: 'st', name: 'Sesotho', nativeName: 'Sesotho', flagOrIcon: '🇿🇦', popular: true },
  { code: 'tn', name: 'Setswana', nativeName: 'Setswana', flagOrIcon: '🇿🇦' },
  { code: 'ss', name: 'siSwati', nativeName: 'siSwati', flagOrIcon: '🇿🇦' },
  { code: 've', name: 'Tshivenda', nativeName: 'Tshivenḓa', flagOrIcon: '🇿🇦' },
  { code: 'ts', name: 'Xitsonga', nativeName: 'Xitsonga', flagOrIcon: '🇿🇦' },
  { code: 'nr', name: 'isiNdebele', nativeName: 'isiNdebele', flagOrIcon: '🇿🇦' }
];

export const getLanguageByCode = (code: string): SouthAfricanLanguage => {
  return SA_LANGUAGES.find(l => l.code === code) || SA_LANGUAGES[0];
};

/**
 * Real-time client-side language detector for text entered by the user
 */
export function detectSouthAfricanLanguage(text: string, activeLanguageCode?: string): SouthAfricanLanguage {
  const clean = (text || '').toLowerCase().trim();
  if (!clean || clean.length < 3) {
    if (activeLanguageCode && activeLanguageCode !== 'auto' && activeLanguageCode !== 'en') {
      return getLanguageByCode(activeLanguageCode);
    }
    return getLanguageByCode('en');
  }

  // 1. If user explicitly asks to speak or switch to English
  const englishExplicit = /\b(speak english|switch to english|in english|talk in english|write in english|please english|respond in english)\b/i.test(clean);
  if (englishExplicit) {
    return getLanguageByCode('en');
  }

  // 2. High-precision English detector:
  // Distinctive English functional words and syntactic structures
  const englishSyntaxPattern = /\b(the|what|how|can|could|tell|show|requirements|admission|admissions|course|courses|degree|degrees|university|student|students|matric|points|calculate|calculator|apply|application|hello|hi|hey|good morning|good afternoon|good evening|please|thanks|thank you|about|which|where|when|why|who|does|have|would|like|to|study|is|are|for|with|my|your|help|want|need|know|fees|campus|faculties|faculty|law|nursing|education|science|engineering|commerce|humanities|richards bay|kwadlangezwa)\b/i;
  
  const words = clean.split(/\s+/).filter(w => w.length > 0);
  const englishMatches = words.filter(w => englishSyntaxPattern.test(w)).length;

  // 3. Distinctive South African language expressions (Genuine indigenous grammatical markers & vocabulary)
  // Note: Proper nouns like "kwadlangezwa", "ongoye", "unizulu" are excluded so English questions mentioning campuses aren't misclassified.
  
  // isiZulu (Primary indigenous language at UNIZULU)
  const zuluRegex = /\b(sawubona|sawbona|sanibonani|ngiyaphila|siyaphila|kunjani|unjani|ninjani|ngicela|bengicela|ngiyacela|sicela|ngifuna|ngifisa|ngithanda|ngisize|ungangisiza|ngitshele|ngazise|chaza|ngichazele|amaphuzu|iphuzu|isicelo|izicelo|imibhalo|izidingo|isidingo|ngubani|yini|ngiyabonga|siyabonga|umthetho|oxhaso|izifundo|ufisa|mfundi|ngabe|yebo|cha bo|kuphi|ngaphi|ukwazi|ukufunda|ukwenza|ukuthola|kutholakala|faka|ukufaka|lungisa|uthisha|othisha|esikoleni|angazi|lokhu|kanjani|noma|futhi|kodwa|uma|bafundi|iziqu|isiqu|emfundweni|ngenzeni|kudingeka|kumele|kufanele|amadigri|izitifiketi|isitifiketi|umazisi|ngiyabingelela|wenzani|ngiqala|ubuhlengikazi|amanesi|namhlanje|kusasa)\b/i;
  const isZuluMatch = zuluRegex.test(clean);

  // Afrikaans
  const afrikaansRegex = /\b(goeiedag|goeiemôre|goeienaand|asseblief|baie dankie|toelatingsvereistes|aansoek|aansoeke|fakulteite|fakulteit|gewaarmerkte|afskrifte|moet ek|kan ek|wil ek|ek is|watter kursus|verpleegkunde|onderwys|rekenaarwetenskap|rekeningkunde|wat is die|wanneer sluit|hoeveel punte|toelating tot|matriekuitslae|studie rigting|kursusse aangebied)\b/i;
  const isAfrikaansMatch = afrikaansRegex.test(clean);

  // isiXhosa
  const xhosaRegex = /\b(molo|molweni|ndiphilile|ndicela|ndifuna|amanqaku|inqaku|iimfuno|iikopi|enkosi|wamkelekile|yintoni|ndingancedakala|ndifunda|amaphondo|kwakhona|khawundixelele|ndifuna ukwazi|ndingenza|amabakala|ubuhlengikazi|iidyunivesithi|ndiyabulela)\b/i;
  const isXhosaMatch = xhosaRegex.test(clean);

  // Sesotho
  const sesothoRegex = /\b(ke batla ho|ke kopa thuso|ke kopa|leboha|re a leboha|ha ke|tsa hao|dikhamphase|lebitso|thuto|efela|dumela|dumelang|le kae|ke batla|tsebe|bana|molao|booki|dintlha|kopo|dikopo|yunibesithi|mosuwe|titjhere|tsa gago)\b/i;
  const isSesothoMatch = sesothoRegex.test(clean);

  // Setswana
  const setswanaRegex = /\b(ke batla go|ke eng|ke kopa|tsela|go siame|tsa gago|mmueledi|dintlha|re a leboga|thuso|bokae|dumela|dumelang|gore|ke itumeletse|dithuto|tsa me|baithuti|morutabana)\b/i;
  const isSetswanaMatch = setswanaRegex.test(clean);

  // Sepedi (Sesotho sa Leboa)
  const sepediRegex = /\b(ke nyaka|ke kgopela|bjang|lengwalo|gona|go thoma|yunibesithi|thobela|dumelang|moruti|leina|dintlha|tsa gago)\b/i;
  const isSepediMatch = sepediRegex.test(clean);

  // siSwati
  const swatiRegex = /\b(sawubona|sanibonani|ngisite|temfundvo|bafundzi|umtsetfo|ticelo|timphilo)\b/i;
  const isSwatiMatch = swatiRegex.test(clean);

  // Tshivenda
  const vendaRegex = /\b(matsheloni|masiari|ahee|ndo livhuwa|vhutshilo|pfunzo|ndi khou|tshikolo|ndi humbela|ndaa vho)\b/i;
  const isVendaMatch = vendaRegex.test(clean);

  // Xitsonga
  const tsongaRegex = /\b(avuxeni|ndzi kombela|ndzi lava|inkomu|dyondzo|swinene|ndza khensa|xikolo|ku va|swilaveko|timali)\b/i;
  const isTsongaMatch = tsongaRegex.test(clean);

  // isiNdebele
  const ndebeleRegex = /\b(lotjhani|ngibawa|amaphuzu|thokoza|umtlhago|isikolo|ngiyathokoza|ubuhle|imfundo|abafundi)\b/i;
  const isNdebeleMatch = ndebeleRegex.test(clean);

  // If there are multiple English words and fewer or no indigenous words, resolve to English
  if (englishMatches >= 2 && !isZuluMatch && !isAfrikaansMatch && !isXhosaMatch) {
    return getLanguageByCode('en');
  }

  // Check indigenous matches
  if (isZuluMatch && englishMatches <= 1) return getLanguageByCode('zu');
  if (isAfrikaansMatch) return getLanguageByCode('af');
  if (isXhosaMatch) return getLanguageByCode('xh');
  if (isSesothoMatch) return getLanguageByCode('st');
  if (isSetswanaMatch) return getLanguageByCode('tn');
  if (isSepediMatch) return getLanguageByCode('nso');
  if (isSwatiMatch) return getLanguageByCode('ss');
  if (isVendaMatch) return getLanguageByCode('ve');
  if (isTsongaMatch) return getLanguageByCode('ts');
  if (isNdebeleMatch) return getLanguageByCode('nr');

  // If there are any English words detected
  if (englishMatches > 0) {
    return getLanguageByCode('en');
  }

  // Check if previous active language was specified
  if (activeLanguageCode && activeLanguageCode !== 'auto' && activeLanguageCode !== 'en') {
    return getLanguageByCode(activeLanguageCode);
  }

  return getLanguageByCode('en');
}

