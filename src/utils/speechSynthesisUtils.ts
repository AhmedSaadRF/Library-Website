import { Locale } from '@/types';

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function stopSpeaking() {
  if (typeof window === 'undefined') return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

function pickVoice(locale: Locale) {
  if (typeof window === 'undefined') return undefined;
  const voices = window.speechSynthesis.getVoices();

  const exactArabic =
    voices.find((voice) => /arabic|ar-|ar_/i.test(`${voice.lang} ${voice.name}`)) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith('ar'));

  const exactEnglish = voices.find((voice) => voice.lang.toLowerCase().startsWith('en'));

  return locale === 'ar' ? exactArabic ?? voices[0] : exactEnglish ?? voices[0];
}

export function extractMainContentText(mainId = 'page-main') {
  if (typeof document === 'undefined') return '';
  const main = document.getElementById(mainId);
  return main?.innerText ?? '';
}

export function speakText({
  text,
  locale,
  rate,
  onEnd
}: {
  text: string;
  locale: Locale;
  rate: number;
  onEnd?: () => void;
}) {
  if (typeof window === 'undefined' || !text.trim()) return;

  stopSpeaking();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale === 'ar' ? 'ar-EG' : 'en-US';
  utterance.rate = rate;
  const voice = pickVoice(locale);
  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    currentUtterance = null;
    onEnd?.();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}
