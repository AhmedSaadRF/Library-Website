import { Locale } from '@/types';

function getVoices() {
  if (typeof window === 'undefined') return [];
  return window.speechSynthesis.getVoices();
}

export function stopSpeaking() {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
}

export function speakText(text: string, locale: Locale, onDone?: () => void) {
  if (typeof window === 'undefined' || !text.trim()) return;
  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale === 'ar' ? 'ar-EG' : 'en-US';
  const voices = getVoices();
  const voice = voices.find((item) =>
    locale === 'ar'
      ? item.lang.toLowerCase().startsWith('ar')
      : item.lang.toLowerCase().startsWith('en')
  );

  if (voice) utterance.voice = voice;
  if (onDone) utterance.onend = onDone;
  window.speechSynthesis.speak(utterance);
}

export function extractMainContentText(mainId = 'page-main') {
  if (typeof document === 'undefined') return '';
  const main = document.getElementById(mainId);
  return main?.innerText ?? '';
}
