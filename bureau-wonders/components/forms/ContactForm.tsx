'use client';

import React, { useState, FormEvent } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { strapiClient } from '@/lib/strapi-client';
import { ContactFormData } from '@/types';

interface FormErrors {
  name?: string;
  company?: string;
  email?: string;
  message?: string;
}

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate company
    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle input changes
   */
  const handleChange = (field: keyof ContactFormData) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }

    // Clear submit status when user modifies form
    if (submitStatus !== 'idle') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await strapiClient.submitContactForm(formData);
      
      // Success: clear form and show success message
      setFormData({
        name: '',
        company: '',
        email: '',
        message: '',
      });
      setSubmitStatus('success');
    } catch (error) {
      // Error: retain form data and show error message
      setSubmitStatus('error');
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to submit form. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <Input
          type="text"
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange('name')}
          error={errors.name}
          required
          disabled={isSubmitting}
          placeholder="Your full name"
        />

        <Input
          type="text"
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange('company')}
          error={errors.company}
          required
          disabled={isSubmitting}
          placeholder="Your company name"
        />

        <Input
          type="email"
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          required
          disabled={isSubmitting}
          placeholder="your.email@example.com"
        />

        <Input
          type="textarea"
          label="Message"
          name="message"
          value={formData.message}
          onChange={handleChange('message')}
          error={errors.message}
          required
          disabled={isSubmitting}
          placeholder="Tell us about your project or inquiry..."
          rows={6}
        />

        {/* Success Message */}
        {submitStatus === 'success' && (
          <div
            className="p-4 rounded-xl bg-accent-success/10 border border-accent-success/20 text-accent-success"
            role="alert"
          >
            <p className="font-medium">Thank you for your message!</p>
            <p className="text-sm mt-1">We'll get back to you as soon as possible.</p>
          </div>
        )}

        {/* Error Message */}
        {submitStatus === 'error' && (
          <div
            className="p-4 rounded-xl bg-accent-error/10 border border-accent-error/20 text-accent-error"
            role="alert"
          >
            <p className="font-medium">Failed to send message</p>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="large"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
