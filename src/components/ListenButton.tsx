"use client";

import { useTranslation } from '@/contexts/LanguageContext';
import { extractMainContentText, speakText, stopSpeaking } from '@/utils/speechSynthesisUtils';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ListenButton() {
  const { locale, t } = useTranslation();
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [lastText, setLastText] = useState('');

  useEffect(() => {
    if (!speaking || !lastText) return;
    stopSpeaking();
    speakText({ text: lastText, locale, rate, onEnd: () => setSpeaking(false) });
    // Restart in the new language when locale changes while reading.
  }, [lastText, locale, rate, speaking]);

  const toggleSpeech = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }

    const text = extractMainContentText();
    setLastText(text);
    speakText({ text, locale, rate, onEnd: () => setSpeaking(false) });
    setSpeaking(true);
  };

  return (
    <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/10 px-2 py-2 backdrop-blur md:flex">
      <motion.button
        type="button"
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={toggleSpeech}
        className="rounded-full border border-brand/20 bg-white px-3 py-2 text-sm font-semibold text-brand shadow-glow dark:bg-slate-900 dark:text-brand-light"
        aria-label={t('listen')}
      >
        <span className="inline-flex items-center gap-2">
          {speaking ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          {t('listen')}
        </span>
      </motion.button>
      <label className="sr-only" htmlFor="speech-rate">
        Speech rate
      </label>
      <input
        id="speech-rate"
        type="range"
        min="0.7"
        max="1.4"
        step="0.1"
        value={rate}
        onChange={(event) => setRate(Number(event.target.value))}
        className="w-20 accent-brand"
        aria-label="Speech rate"
      />
      <button
        type="button"
        onClick={() => {
          setRate(1);
          if (lastText) {
            stopSpeaking();
            setSpeaking(false);
          }
        }}
        className="rounded-full p-2 text-slate-600 dark:text-slate-300"
        aria-label="Reset speech"
      >
        <RotateCcw className="size-4" />
      </button>
    </div>
  );
}
