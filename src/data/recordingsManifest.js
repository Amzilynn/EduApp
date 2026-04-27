/**
 * Recording manifest - all phrases that need audio recordings
 * Format: { text: string, category: string, lang: 'fr' | 'ar', voice: 'girl' | 'boy' }
 */

export const recordingsManifest = {
  // Welcome messages
  welcome: [
    { text: "Qu'est-ce qu'on veut apprendre aujourd'hui ?", lang: 'fr', category: 'welcome' },
    { text: 'ماذا نريد أن نتعلم اليوم؟', lang: 'ar', category: 'welcome' },
  ],

  // Instructions
  instructions: [
    { text: 'Glisse le mot vers le bon personnage !', lang: 'fr', category: 'instruction' },
    { text: 'اسحب الكلمة إلى الشخص الصحيح!', lang: 'ar', category: 'instruction' },
    { text: 'Glisse le mot vers la bonne couleur !', lang: 'fr', category: 'instruction' },
    { text: 'اسحب الكلمة إلى اللون الصحيح!', lang: 'ar', category: 'instruction' },
    { text: 'Glisse le mot vers la bonne forme !', lang: 'fr', category: 'instruction' },
    { text: 'اسحب الكلمة إلى الشكل الصحيح!', lang: 'ar', category: 'instruction' },
    { text: 'Réponds aux questions suivantes', lang: 'fr', category: 'instruction' },
    { text: 'أجب على الأسئلة التالية', lang: 'ar', category: 'instruction' },
    { text: 'Mets les lettres dans le bon ordre pour former le mot !', lang: 'fr', category: 'instruction' },
    { text: 'رتّب الحروف لتكوين الكلمة!', lang: 'ar', category: 'instruction' },
    { text: 'Mélange les couleurs pour trouver le résultat !', lang: 'fr', category: 'instruction' },
    { text: 'امزج الألوان لتجد النتيجة!', lang: 'ar', category: 'instruction' },
  ],

  // Family words
  family: [
    { text: 'La mère', lang: 'fr', category: 'family' },
    { text: 'Le père', lang: 'fr', category: 'family' },
    { text: 'Le frère', lang: 'fr', category: 'family' },
    { text: 'La sœur', lang: 'fr', category: 'family' },
    { text: 'La grand-mère', lang: 'fr', category: 'family' },
    { text: 'Le grand-père', lang: 'fr', category: 'family' },
    { text: 'الأم', lang: 'ar', category: 'family' },
    { text: 'الأب', lang: 'ar', category: 'family' },
    { text: 'الأخ', lang: 'ar', category: 'family' },
    { text: 'الأخت', lang: 'ar', category: 'family' },
    { text: 'الجدة', lang: 'ar', category: 'family' },
    { text: 'الجد', lang: 'ar', category: 'family' },
  ],

  // Colors
  colors: [
    { text: 'Rouge', lang: 'fr', category: 'color' },
    { text: 'Bleu', lang: 'fr', category: 'color' },
    { text: 'Jaune', lang: 'fr', category: 'color' },
    { text: 'Noir', lang: 'fr', category: 'color' },
    { text: 'Blanc', lang: 'fr', category: 'color' },
    { text: 'Vert', lang: 'fr', category: 'color' },
    { text: 'Orange', lang: 'fr', category: 'color' },
    { text: 'Rose', lang: 'fr', category: 'color' },
    { text: 'Violet', lang: 'fr', category: 'color' },
    { text: 'Gris', lang: 'fr', category: 'color' },
    { text: 'أحمر', lang: 'ar', category: 'color' },
    { text: 'أزرق', lang: 'ar', category: 'color' },
    { text: 'أصفر', lang: 'ar', category: 'color' },
    { text: 'أسود', lang: 'ar', category: 'color' },
    { text: 'أبيض', lang: 'ar', category: 'color' },
    { text: 'أخضر', lang: 'ar', category: 'color' },
    { text: 'برتقالي', lang: 'ar', category: 'color' },
    { text: 'وردي', lang: 'ar', category: 'color' },
    { text: 'بنفسجي', lang: 'ar', category: 'color' },
    { text: 'رمادي', lang: 'ar', category: 'color' },
  ],

  // Shapes
  shapes: [
    { text: 'Cercle', lang: 'fr', category: 'shape' },
    { text: 'Carré', lang: 'fr', category: 'shape' },
    { text: 'Triangle', lang: 'fr', category: 'shape' },
    { text: 'Rectangle', lang: 'fr', category: 'shape' },
    { text: 'دائرة', lang: 'ar', category: 'shape' },
    { text: 'مربع', lang: 'ar', category: 'shape' },
    { text: 'مثلث', lang: 'ar', category: 'shape' },
    { text: 'مستطيل', lang: 'ar', category: 'shape' },
  ],

  // Combination questions
  combinations: [
    { text: 'Où est le cercle rouge ?', lang: 'fr', category: 'combination' },
    { text: 'Où est le carré bleu ?', lang: 'fr', category: 'combination' },
    { text: 'Où est le triangle jaune ?', lang: 'fr', category: 'combination' },
    { text: 'Où est le rectangle vert ?', lang: 'fr', category: 'combination' },
    { text: 'أين الدائرة الحمراء؟', lang: 'ar', category: 'combination' },
    { text: 'أين المربع الأزرق؟', lang: 'ar', category: 'combination' },
    { text: 'أين المثلث الأصفر؟', lang: 'ar', category: 'combination' },
    { text: 'أين المستطيل الأخضر؟', lang: 'ar', category: 'combination' },
  ],

  // Alphabet word hints
  alphabetHints: [
    { text: 'Stylo', lang: 'fr', category: 'alphabet' },
    { text: 'Livre', lang: 'fr', category: 'alphabet' },
    { text: 'Cartable', lang: 'fr', category: 'alphabet' },
    { text: 'Maîtresse', lang: 'fr', category: 'alphabet' },
    { text: 'École', lang: 'fr', category: 'alphabet' },
    { text: 'Maman', lang: 'fr', category: 'alphabet' },
    { text: 'Papa', lang: 'fr', category: 'alphabet' },
    { text: 'Fille', lang: 'fr', category: 'alphabet' },
    { text: 'Garçon', lang: 'fr', category: 'alphabet' },
    { text: 'Ami', lang: 'fr', category: 'alphabet' },
    { text: 'Mouton', lang: 'fr', category: 'alphabet' },
    { text: 'Vache', lang: 'fr', category: 'alphabet' },
    { text: 'Poule', lang: 'fr', category: 'alphabet' },
    { text: 'Chat', lang: 'fr', category: 'alphabet' },
    { text: 'Chien', lang: 'fr', category: 'alphabet' },
    { text: 'Poisson', lang: 'fr', category: 'alphabet' },
    { text: 'بيت', lang: 'ar', category: 'alphabet' },
    { text: 'قمر', lang: 'ar', category: 'alphabet' },
    { text: 'شمس', lang: 'ar', category: 'alphabet' },
    { text: 'كتاب', lang: 'ar', category: 'alphabet' },
    { text: 'قلم', lang: 'ar', category: 'alphabet' },
    { text: 'أسد', lang: 'ar', category: 'alphabet' },
    { text: 'بحر', lang: 'ar', category: 'alphabet' },
    { text: 'وردة', lang: 'ar', category: 'alphabet' },
    { text: 'تفاحة', lang: 'ar', category: 'alphabet' },
    { text: 'جمل', lang: 'ar', category: 'alphabet' },
  ],

  // Success/feedback messages
  feedback: [
    { text: 'Très bien !', lang: 'fr', category: 'feedback' },
    { text: 'Bravo !', lang: 'fr', category: 'feedback' },
    { text: 'Excellent !', lang: 'fr', category: 'feedback' },
    { text: 'Super !', lang: 'fr', category: 'feedback' },
    { text: 'Tu es formidable !', lang: 'fr', category: 'feedback' },
    { text: 'أحسنت!', lang: 'ar', category: 'feedback' },
    { text: 'ممتاز!', lang: 'ar', category: 'feedback' },
    { text: ' رائع!', lang: 'ar', category: 'feedback' },
    { text: 'جيد جدا!', lang: 'ar', category: 'feedback' },
    { text: ' أنت ممتاز!', lang: 'ar', category: 'feedback' },
  ],

  // Error/retry messages
  errors: [
    { text: 'Essaie encore !', lang: 'fr', category: 'error' },
    { text: 'Pas tout à fait...', lang: 'fr', category: 'error' },
    { text: 'Réessaie !', lang: 'fr', category: 'error' },
    { text: 'حاول مرة أخرى!', lang: 'ar', category: 'error' },
    { text: 'ليس صحيحا...', lang: 'ar', category: 'error' },
    { text: 'أعد المحاولة!', lang: 'ar', category: 'error' },
  ],
};

export function getAllRecordings() {
  const recordings = [];
  Object.values(recordingsManifest).forEach(category => {
    category.forEach(item => {
      recordings.push(item);
    });
  });
  return recordings;
}

export function getRecordingPath(text, lang, voice) {
  let t = text.toLowerCase();
  
  // Special mappings for specific letters to match our file naming convention
  if (lang === 'fr') {
    if (t === 'î') return `/recordings/fr/${voice}/i_chapeau.wav`;
    if (t === 'é') return `/recordings/fr/${voice}/e_accent.wav`;
    if (t === 'ç') return `/recordings/fr/${voice}/c_cedille.wav`;
  }

  const normalized = t
    .replace(/[^a-z0-9\u0600-\u06FF]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .substring(0, 50);
  
  return `/recordings/${lang}/${voice}/${normalized}.wav`;
}
