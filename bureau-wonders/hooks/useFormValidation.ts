'use client';

import { useState, useEffect, useCallback } from 'react';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
  email?: boolean;
  phone?: boolean;
}

export interface FieldConfig {
  [fieldName: string]: ValidationRule;
}

export interface ValidationErrors {
  [fieldName: string]: string;
}

export interface FormData {
  [fieldName: string]: string;
}

interface UseFormValidationReturn {
  values: FormData;
  errors: ValidationErrors;
  isValid: boolean;
  isSubmitting: boolean;
  submitCount: number;
  setValue: (field: string, value: string) => void;
  validateField: (field: string) => string | null;
  validateAll: () => boolean;
  handleSubmit: (onSubmit: (data: FormData) => Promise<void> | void) => (e: React.FormEvent) => Promise<void>;
  reset: () => void;
  setFieldError: (field: string, error: string) => void;
  clearFieldError: (field: string) => void;
}

export const useFormValidation = (
  initialValues: FormData,
  validationRules: FieldConfig,
  options: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    revalidateOnSubmit?: boolean;
  } = {}
): UseFormValidationReturn => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    revalidateOnSubmit = true,
  } = options;

  const [values, setValues] = useState<FormData>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Validation functions
  const validateField = useCallback((field: string): string | null => {
    const value = values[field] || '';
    const rules = validationRules[field];
    
    if (!rules) return null;

    // Required validation
    if (rules.required && !value.trim()) {
      return `${field} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value.trim() && !rules.required) {
      return null;
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength) {
      return `${field} must be at least ${rules.minLength} characters`;
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return `${field} must be no more than ${rules.maxLength} characters`;
    }

    // Email validation
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (rules.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        return 'Please enter a valid phone number';
      }
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return `${field} format is invalid`;
    }

    // Custom validation
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [values, validationRules]);

  const validateAll = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    let isFormValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field);
      if (error) {
        newErrors[field] = error;
        isFormValid = false;
      }
    });

    setErrors(newErrors);
    return isFormValid;
  }, [validateField, validationRules]);

  // Set field value with optional validation
  const setValue = useCallback((field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));
    
    if (validateOnChange && touchedFields.has(field)) {
      const error = validateField(field);
      setErrors(prev => ({
        ...prev,
        [field]: error || ''
      }));
    }
  }, [validateOnChange, touchedFields, validateField]);

  // Handle field blur
  const handleBlur = useCallback((field: string) => {
    setTouchedFields(prev => new Set(prev).add(field));
    
    if (validateOnBlur) {
      const error = validateField(field);
      setErrors(prev => ({
        ...prev,
        [field]: error || ''
      }));
    }
  }, [validateOnBlur, validateField]);

  // Manual error setting
  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Form submission handler
  const handleSubmit = useCallback((onSubmit: (data: FormData) => Promise<void> | void) => {
    return async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitCount(prev => prev + 1);
      
      // Mark all fields as touched
      setTouchedFields(new Set(Object.keys(validationRules)));
      
      // Validate all fields
      const isFormValid = validateAll();
      
      if (!isFormValid) {
        return;
      }

      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validationRules, validateAll]);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouchedFields(new Set());
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  // Compute form validity
  const isValid = Object.keys(errors).length === 0 && 
    Object.keys(validationRules).every(field => {
      const rules = validationRules[field];
      const value = values[field] || '';
      return !rules.required || value.trim() !== '';
    });

  // Real-time validation effect
  useEffect(() => {
    if (revalidateOnSubmit && submitCount > 0) {
      validateAll();
    }
  }, [values, revalidateOnSubmit, submitCount, validateAll]);

  return {
    values,
    errors,
    isValid,
    isSubmitting,
    submitCount,
    setValue,
    validateField,
    validateAll,
    handleSubmit,
    reset,
    setFieldError,
    clearFieldError,
  };
};