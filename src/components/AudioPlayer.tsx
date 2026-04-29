"use client";

import { Pause, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export function AudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }

    await audioRef.current.play();
    setPlaying(true);
  };

  return (
    <div className="rounded-3xl border border-brand/10 bg-brand/5 p-4 dark:bg-white/5">
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} controls className="sr-only" />
      <div className="flex items-center gap-4">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          animate={playing ? { scale: [1, 1.07, 1] } : { scale: 1 }}
          transition={{ repeat: playing ? Infinity : 0, duration: 1.5 }}
          onClick={toggle}
          className="rounded-full bg-brand p-4 text-white"
          aria-label={playing ? 'Pause audio' : 'Play audio'}
        >
          {playing ? <Pause className="size-5" /> : <Play className="size-5" />}
        </motion.button>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand/10">
          <motion.div
            className="h-full rounded-full bg-brand"
            animate={playing ? { x: ['-100%', '100%'] } : { x: '-100%' }}
            transition={{ repeat: playing ? Infinity : 0, duration: 2, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
}
