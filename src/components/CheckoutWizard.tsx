"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/contexts/LanguageContext';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

interface CheckoutWizardProps {
  currentStep: number;
  steps: string[];
  children: React.ReactNode;
}

export function CheckoutWizard({ currentStep, steps, children }: CheckoutWizardProps) {
  const { t, locale } = useTranslation();
  const totalSteps = steps.length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-12 relative">
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const isActive = index + 1 === currentStep;
            const isCompleted = index + 1 < currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className={`size-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                    isActive ? 'bg-brand border-brand text-white shadow-glow scale-110' : 
                    isCompleted ? 'bg-brand/10 border-brand text-brand' : 
                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="size-5" /> : <span>{index + 1}</span>}
                </div>
                <span className={`mt-2 text-xs font-bold ${isActive ? 'text-brand' : 'text-slate-400'}`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Background Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -z-0" />
        {/* Active Line */}
        <motion.div 
          className="absolute top-5 left-0 h-0.5 bg-brand -z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Step Content */}
      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: locale === 'ar' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: locale === 'ar' ? 20 : -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
