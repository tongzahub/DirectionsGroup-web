'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: React.ReactNode;
}

interface EnhancedFormProps {
  children?: React.ReactNode;
  steps?: FormStep[];
  currentStep?: number;
  onSubmit?: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  submitSuccess?: boolean;
  submitError?: string;
  className?: string;
  showProgress?: boolean;
  title?: string;
  description?: string;
}

const EnhancedForm: React.FC<EnhancedFormProps> = ({
  children,
  steps,
  currentStep = 0,
  onSubmit,
  isSubmitting = false,
  submitSuccess = false,
  submitError,
  className = '',
  showProgress = false,
  title,
  description,
}) => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    if (onSubmit) {
      onSubmit(e);
    }
  };

  React.useEffect(() => {
    if (submitSuccess) {
      setFormState('success');
    } else if (submitError) {
      setFormState('error');
    } else if (isSubmitting) {
      setFormState('submitting');
    } else {
      setFormState('idle');
    }
  }, [isSubmitting, submitSuccess, submitError]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div
      className={cn('w-full max-w-2xl mx-auto', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Form Header */}
      {(title || description) && (
        <motion.div className="mb-8 text-center" variants={itemVariants}>
          {title && (
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h2>
          )}
          {description && (
            <p className="text-neutral-600">{description}</p>
          )}
        </motion.div>
      )}

      {/* Progress Indicator */}
      {showProgress && steps && steps.length > 1 && (
        <motion.div className="mb-8" variants={itemVariants}>
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  'flex items-center',
                  index < steps.length - 1 && 'flex-1'
                )}
              >
                <motion.div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300',
                    index <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-neutral-200 text-neutral-500'
                  )}
                  animate={{
                    scale: index === currentStep ? 1.1 : 1,
                    backgroundColor: index <= currentStep ? '#2563eb' : '#e5e7eb',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {index < currentStep ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </motion.div>
                
                {index < steps.length - 1 && (
                  <motion.div
                    className="flex-1 h-0.5 mx-4 bg-neutral-200"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: index < currentStep ? 1 : 0,
                      backgroundColor: index < currentStep ? '#2563eb' : '#e5e7eb',
                    }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{ originX: 0 }}
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* Current Step Info */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-neutral-900">
              {steps[currentStep]?.title}
            </h3>
            {steps[currentStep]?.description && (
              <p className="text-sm text-neutral-600 mt-1">
                {steps[currentStep].description}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Form Content */}
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        variants={itemVariants}
      >
        {/* Multi-step Form */}
        {steps ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
            >
              {steps[currentStep]?.fields}
            </motion.div>
          </AnimatePresence>
        ) : (
          children
        )}

        {/* Form Status Messages */}
        <AnimatePresence mode="wait">
          {formState === 'success' && (
            <motion.div
              className="p-4 rounded-xl bg-green-50 border border-green-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <motion.div
                  className="w-6 h-6 text-green-600 mr-3"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <div>
                  <p className="font-medium text-green-800">Success!</p>
                  <p className="text-sm text-green-700">Your form has been submitted successfully.</p>
                </div>
              </div>
            </motion.div>
          )}

          {formState === 'error' && submitError && (
            <motion.div
              className="p-4 rounded-xl bg-red-50 border border-red-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center">
                <motion.div
                  className="w-6 h-6 text-red-600 mr-3"
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.1, duration: 0.5, type: 'spring' }}
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </motion.div>
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-700">{submitError}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submitting Overlay */}
        <AnimatePresence>
          {formState === 'submitting' && (
            <motion.div
              className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="flex items-center space-x-3 bg-white px-6 py-4 rounded-xl shadow-lg"
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                <span className="text-neutral-700 font-medium">Submitting...</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.form>
    </motion.div>
  );
};

export default EnhancedForm;