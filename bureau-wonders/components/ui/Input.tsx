import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type InputType = 'text' | 'email' | 'textarea';

export interface InputProps {
  type?: InputType;
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  rows?: number;
  className?: string;
  floatingLabel?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  success?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      type = 'text',
      label,
      error,
      value,
      onChange,
      placeholder,
      required = false,
      disabled = false,
      id,
      name,
      rows = 4,
      className = '',
      floatingLabel = true,
      icon,
      iconPosition = 'left',
      success = false,
      helperText,
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    
    const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;
    const isFloating = floatingLabel && (isFocused || hasValue || value);

    useEffect(() => {
      setHasValue(!!value);
    }, [value]);

    const baseStyles = cn(
      'w-full transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
      'border-2 rounded-xl bg-white',
      floatingLabel ? 'pt-6 pb-2 px-4' : 'py-3 px-4',
      icon && iconPosition === 'left' && 'pl-12',
      icon && iconPosition === 'right' && 'pr-12'
    );

    const stateStyles = cn(
      hasError 
        ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
        : success
        ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
        : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-200',
      'focus:ring-4 focus:ring-opacity-20'
    );

    const inputClassName = cn(baseStyles, stateStyles, className);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    return (
      <div className="w-full">
        <div className="relative">
          {/* Floating Label */}
          {floatingLabel ? (
            <motion.label
              htmlFor={inputId}
              className={cn(
                'absolute pointer-events-none transition-all duration-300 origin-left',
                icon && iconPosition === 'left' ? 'left-12' : 'left-4',
                isFloating
                  ? 'top-2 text-xs font-medium text-primary-600 scale-90'
                  : 'top-1/2 -translate-y-1/2 text-base text-neutral-500',
                hasError && isFloating && 'text-red-600',
                success && isFloating && 'text-green-600'
              )}
              animate={{
                y: isFloating ? 0 : 0,
                scale: isFloating ? 0.9 : 1,
                fontSize: isFloating ? '0.75rem' : '1rem',
              }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </motion.label>
          ) : (
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}

          {/* Icon */}
          {icon && (
            <div
              className={cn(
                'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 transition-colors duration-200',
                iconPosition === 'left' ? 'left-4' : 'right-4',
                isFocused && 'text-primary-500',
                hasError && 'text-red-500',
                success && 'text-green-500'
              )}
            >
              {icon}
            </div>
          )}

          {/* Input Field */}
          {type === 'textarea' ? (
            <motion.textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              id={inputId}
              name={name}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={floatingLabel ? '' : placeholder}
              required={required}
              disabled={disabled}
              rows={rows}
              className={inputClassName}
              aria-invalid={hasError}
              aria-describedby={
                hasError 
                  ? `${inputId}-error` 
                  : helperText 
                  ? `${inputId}-helper` 
                  : undefined
              }
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
          ) : (
            <motion.input
              ref={ref as React.Ref<HTMLInputElement>}
              type={type}
              id={inputId}
              name={name}
              value={value}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={floatingLabel ? '' : placeholder}
              required={required}
              disabled={disabled}
              className={inputClassName}
              aria-invalid={hasError}
              aria-describedby={
                hasError 
                  ? `${inputId}-error` 
                  : helperText 
                  ? `${inputId}-helper` 
                  : undefined
              }
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
          )}

          {/* Success/Error Icons */}
          <AnimatePresence>
            {(hasError || success) && (
              <motion.div
                className={cn(
                  'absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5',
                  icon && iconPosition === 'right' && 'right-12'
                )}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
              >
                {hasError ? (
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Helper Text, Error, or Success Message */}
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.p
              id={`${inputId}-error`}
              className="mt-2 text-sm text-red-600 flex items-center gap-1"
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </motion.p>
          )}
          
          {!hasError && success && (
            <motion.p
              className="mt-2 text-sm text-green-600 flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Valid input
            </motion.p>
          )}
          
          {!hasError && !success && helperText && (
            <motion.p
              id={`${inputId}-helper`}
              className="mt-2 text-sm text-neutral-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {helperText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
