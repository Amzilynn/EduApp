/**
 * Text-to-Speech Engine using Web Speech API
 */
export class SpeechEngine {
  constructor(language, voiceType) {
    this.language = language;   // 'fr' | 'ar'
    this.voiceType = voiceType; // 'girl' | 'boy'
    this.voice = null;
    this.ready = false;
    this.init();
  }

  async init() {
    return new Promise(resolve => {
      const load = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(`[SpeechEngine] Voices loaded: ${voices.length} found.`);
        this.voice = this.selectVoice(voices);
        if (this.voice) {
          console.log(`[SpeechEngine] Selected voice: ${this.voice.name} (${this.voice.lang})`);
        } else {
          console.warn(`[SpeechEngine] No suitable voice found for ${this.language}.`);
        }
        this.ready = true;
        resolve();
      };
      if (window.speechSynthesis && window.speechSynthesis.getVoices().length) {
        load();
      } else if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = load;
        setTimeout(load, 1500); // Wait longer for voices
      } else {
        console.error('[SpeechEngine] Web Speech API not supported.');
        resolve(); 
      }
    });
  }

  selectVoice(voices) {
    if (!voices || voices.length === 0) return null;
    const langCode = this.language === 'ar' ? 'ar' : 'fr';
    
    const langVoices = voices.filter(v => 
      v.lang.toLowerCase().startsWith(langCode) || 
      (langCode === 'ar' && (v.lang.toLowerCase().includes('ar') || v.name.toLowerCase().includes('arabic')))
    );
    
    console.log(`[SpeechEngine] Found ${langVoices.length} voices for ${langCode}`);

    const arabicFemaleKeywords = ['laila', 'muna', 'mariam', 'zariyah', 'nadia', 'salma', 'samira', 'houda', 'naayel', 'zira'];
    const arabicMaleKeywords = ['majed', 'tarik', 'hassan', 'naim', 'faisal', 'mehdi'];
    
    const femaleKeywords = ['female', 'woman', 'fille', 'amelie', 'marie', 'hana', ...arabicFemaleKeywords];
    const maleKeywords = ['male', 'man', 'garcon', 'thomas', 'nicolas', ...arabicMaleKeywords];

    if (langVoices.length === 0) return voices[0];

    let voice = null;
    if (this.voiceType === 'girl') {
      voice = langVoices.find(v =>
        femaleKeywords.some(k => v.name.toLowerCase().includes(k))
      );
    } else {
      voice = langVoices.find(v =>
        maleKeywords.some(k => v.name.toLowerCase().includes(k))
      );
    }

    return voice || langVoices[0];
  }

  speak(text, options = {}) {
    if (!window.speechSynthesis || !text) return Promise.resolve();
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const selectedVoice = options.voice || this.voice;
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = this.language === 'ar' ? 'ar-SA' : 'fr-FR';
    }

    utterance.rate = options.rate || 0.85;
    utterance.pitch = this.voiceType === 'girl' ? 1.15 : 0.90;
    utterance.volume = 1.0;

    console.log(`[SpeechEngine] Speaking: "${text}" with voice: ${selectedVoice?.name || 'default'} (lang: ${utterance.lang})`);

    return new Promise(resolve => {
      utterance.onstart = () => console.log(`[SpeechEngine] Speech started: "${text}"`);
      utterance.onend = () => {
        console.log(`[SpeechEngine] Speech finished: "${text}"`);
        resolve();
      };
      utterance.onerror = (e) => {
        console.error('[SpeechEngine] Error:', e);
        resolve();
      };
      
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    });
  }

  speakWithOppositeVoice(text) {
    if (!window.speechSynthesis || !text) return Promise.resolve();
    const allVoices = window.speechSynthesis.getVoices();
    const langCode = this.language === 'ar' ? 'ar' : 'fr';
    const langVoices = allVoices.filter(v => v.lang.toLowerCase().startsWith(langCode));
    
    if (langVoices.length === 0) return this.speak(text);

    const opposite = this.voiceType === 'girl' ? 'boy' : 'girl';
    const arabicFemaleKeywords = ['laila', 'muna', 'mariam', 'zariyah', 'nadia', 'salma'];
    const arabicMaleKeywords = ['majed', 'tarik', 'hassan', 'naim'];
    
    const femaleKeywords = ['female', 'woman', 'fille', 'amelie', 'marie', ...arabicFemaleKeywords];
    const maleKeywords = ['male', 'man', 'garcon', 'thomas', ...arabicMaleKeywords];
    
    let oppositeVoice;
    if (opposite === 'girl') {
      oppositeVoice = langVoices.find(v =>
        femaleKeywords.some(k => v.name.toLowerCase().includes(k))
      ) || langVoices[0];
    } else {
      oppositeVoice = langVoices.find(v =>
        maleKeywords.some(k => v.name.toLowerCase().includes(k))
      ) || langVoices[1] || langVoices[0];
    }

    return this.speak(text, { voice: oppositeVoice });
  }

  stop() {
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }
}
