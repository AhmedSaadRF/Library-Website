"use client";

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 220, damping: 28 });
  const springY = useSpring(y, { stiffness: 220, damping: 28 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const onResize = () => setEnabled(window.innerWidth > 768);
    const onMove = (event: MouseEvent) => {
      x.set(event.clientX - 14);
      y.set(event.clientY - 14);
    };

    onResize();
    window.addEventListener('resize', onResize);
    window.addEventListener('mousemove', onMove);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] hidden h-7 w-7 rounded-full border border-brand/60 bg-brand/10 backdrop-blur md:block"
      style={{ x: springX, y: springY }}
    >
      <div className="absolute inset-2 rounded-full bg-brand/70" />
    </motion.div>
  );
}
