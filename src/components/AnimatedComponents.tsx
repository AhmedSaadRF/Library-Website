"use client";

import { motion, AnimatePresence, HTMLMotionProps, Variants } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import * as React from 'react';

// --- Variants ---

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'backOut' } }
};

// --- Components ---

/**
 * Global Page Transition Wrapper
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return <>{children}</>;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Fades in and slides up when it enters the viewport
 */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode, className?: string, delay?: number }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Staggered entrance for lists
 */
export function StaggerContainer({ children, className = "" }: { children: ReactNode, className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? {} : staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }: { children: ReactNode, className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={shouldReduceMotion ? {} : fadeUpVariants}
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic/Scale effect on hover
 */
export function ScaleHover({ children, className = "", scale = 1.05 }: { children: ReactNode, className?: string, scale?: number }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      whileHover={shouldReduceMotion ? {} : { scale }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

// --- Additional Variants for Advanced Animations ---

export const bounceVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20
    }
  }
};

export const slideInFromLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const slideInFromRightVariants: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

export const pulseVariants: Variants = {
  animate: {
    opacity: [1, 0.6, 1],
    transition: { duration: 2, repeat: Infinity }
  }
};

export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
    transition: { duration: 3, repeat: Infinity }
  }
};

// --- Form Animation Components ---

// Fix: Cast motion.input to accept standard HTML input props (bypassing Framer Motion's conflicting event types)
const MotionInput = motion.input as React.ComponentType<React.InputHTMLAttributes<HTMLInputElement>>;

/**
 * Animated form input with focus ring and label animation
 */
export function AnimatedInput({
  label,
  value,
  onChange,
  type = 'text',
  className = '',
  ...props
}: {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <motion.div className="relative w-full">
      {label && (
        <motion.label
          initial={{ opacity: 0.7, y: 8 }}
          animate={
            isFocused || value
              ? { opacity: 1, y: -24 }
              : { opacity: 0.7, y: 8 }
          }
          className="absolute left-4 text-sm font-bold text-slate-600 dark:text-slate-300 pointer-events-none"
        >
          {label}
        </motion.label>
      )}
      <MotionInput
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full rounded-2xl border-2 border-slate-200 bg-transparent px-4 py-3 outline-none transition-colors dark:border-slate-700 focus:border-brand ${className}`}
        {...props}
      />
    </motion.div>
  );
}

/**
 * Button with ripple effect on click
 */
export function RippleButton({
  children,
  onClick,
  className = '',
  disabled = false,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = React.useState<Array<{ id: string; x: number; y: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now().toString();

    setRipples((prev) => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ opacity: 0.5, scale: 0 }}
            animate={{ opacity: 0, scale: 4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute pointer-events-none bg-white/30 rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 10,
              height: 10,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * Animated loading spinner
 */
export function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`inline-block rounded-full border-4 border-slate-200 border-t-brand dark:border-slate-700 dark:border-t-brand-light ${className}`}
    />
  );
}

/**
 * Success checkmark animation
 */
export function SuccessCheckmark({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className={`flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30 ${className}`}
    >
      <motion.svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="text-green-600 dark:text-green-400"
      >
        <motion.path
          d="M20 6L9 17l-5-5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </motion.svg>
    </motion.div>
  );
}