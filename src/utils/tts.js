/**
 * Text-to-Speech Engine using self-hosted XTTS-v2 backend on HuggingFace Spaces.
 * Falls back to Web Speech API if backend is unavailable.
 */
export class SpeechEngine {
  constructor(language, voiceType) {
    this.language = language || localStorage.getItem('ttsLanguage') || 'fr';
    this.voiceType = voiceType || localStorage.getItem('ttsVoiceType') || 'child_female';
    this.ready = false;
    this.isSpeaking = false;
    this.isWarmingUp = false;
    this.backendUrl = import.meta.env.VITE_TTS_BACKEND_URL || ''; // Set this in .env
    this.audioContext = null;
    this.currentAudio = null;

    this.savePreferences();
    this.init();
  }

  savePreferences() {
    localStorage.setItem('ttsLanguage', this.language);
    localStorage.setItem('ttsVoiceType', this.voiceType);
  }

  setLanguage(lang) {
    this.language = lang;
    this.savePreferences();
  }

  setVoiceType(type) {
    this.voiceType = type;
    this.savePreferences();
  }

  async init() {
    if (!this.backendUrl) {
      console.warn('[SpeechEngine] VITE_TTS_BACKEND_URL not set. Using Web Speech API fallback only.');
      this.ready = true;
      return;
    }

    // Ping the backend to wake it up (cold start handling)
    try {
      this.isWarmingUp = true;
      const response = await fetch(`${this.backendUrl}/health`, { signal: AbortSignal.timeout(20000) });
      const data = await response.json();
      
      if (data.status === 'warming_up') {
        console.log('[SpeechEngine] Backend is warming up...');
        // We don't block here, but we set the flag
      } else if (data.status === 'ready') {
        console.log('[SpeechEngine] Backend is ready.');
        this.isWarmingUp = false;
      }
    } catch (error) {
      console.error('[SpeechEngine] Backend health check failed:', error);
      this.isWarmingUp = false;
    } finally {
      this.ready = true;
    }
  }

  /**
   * Main speak method
   */
  async speak(text, options = {}) {
    if (!text) return;

    // Try backend first
    if (this.backendUrl) {
      try {
        await this.speakViaBackend(text, options);
        return;
      } catch (error) {
        console.error('[SpeechEngine] Backend TTS failed, falling back to Web Speech API:', error);
      }
    }

    // Fallback to Web Speech API
    await this.speakViaBrowser(text, options);
  }

  /**
   * Speak using XTTS-v2 Backend
   */
  async speakViaBackend(text, options = {}) {
    const lang = this.language === 'ar' ? 'ar' : 'fr';
    const voice = (this.voiceType === 'child_female' || this.voiceType === 'girl') ? 'girl' : 'boy';

    const response = await fetch(`${this.backendUrl}/synthesize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language: lang, voice }),
      signal: AbortSignal.timeout(30000) // 30s timeout for XTTS generation
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${await response.text()}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return new Promise((resolve, reject) => {
      if (this.currentAudio) {
        this.currentAudio.pause();
      }
      
      this.currentAudio = new Audio(audioUrl);
      this.currentAudio.onplay = () => { this.isSpeaking = true; };
      this.currentAudio.onended = () => {
        this.isSpeaking = false;
        URL.revokeObjectURL(audioUrl);
        resolve();
      };
      this.currentAudio.onerror = (e) => {
        this.isSpeaking = false;
        URL.revokeObjectURL(audioUrl);
        reject(e);
      };
      this.currentAudio.play().catch(reject);
    });
  }

  /**
   * Speak using Web Speech API (Fallback)
   */
  async speakViaBrowser(text, options = {}) {
    if (!window.speechSynthesis) return;

    return new Promise(resolve => {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.language === 'ar' ? 'ar-SA' : 'fr-FR';
      
      // Force child-like pitch and rate for fallback
      utterance.pitch = 1.8;
      utterance.rate = 1.1;
      utterance.volume = 1.0;

      utterance.onstart = () => { this.isSpeaking = true; };
      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };
      utterance.onerror = (e) => {
        console.error('[SpeechEngine] Browser TTS Error:', e);
        this.isSpeaking = false;
        resolve();
      };
      
      window.speechSynthesis.speak(utterance);
    });
  }

  speakWithOppositeVoice(text) {
    const originalVoice = this.voiceType;
    const opposite = (originalVoice === 'child_female' || originalVoice === 'girl') ? 'child_male' : 'child_female';
    
    // Temporarily swap voice type
    this.voiceType = opposite;
    const promise = this.speak(text);
    // Restore
    promise.finally(() => { this.voiceType = originalVoice; });
    return promise;
  }

  stop() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }
}
