'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import EnhancedForm from './EnhancedForm';
import { useFormValidation } from '@/hooks/useFormValidation';
import { strapiClient } from '@/lib/strapi-client';
import { ContactFormData } from '@/types';
// Using simple SVG icons instead of heroicons for now
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingOfficeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ChatBubbleLeftRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

interface ContactFormProps {
  className?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    values,
    errors,
    isValid,
    isSubmitting,
    setValue,
    handleSubmit,
    reset,
  } = useFormValidation(
    {
      name: '',
      company: '',
      email: '',
      message: '',
    },
    {
      name: { required: true, minLength: 2, maxLength: 50 },
      company: { required: true, minLength: 2, maxLength: 100 },
      email: { required: true, email: true },
      message: { required: true, minLength: 10, maxLength: 1000 },
    },
    {
      validateOnChange: true,
      validateOnBlur: true,
    }
  );

  const onSubmit = async (data: any) => {
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await strapiClient.submitContactForm(data);
      setSubmitStatus('success');
      reset();
    } catch (error) {
      setSubmitStatus('error');
      
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to submit form. Please try again.');
      }
      throw error; // Re-throw to let the form handler know about the error
    }
  };

  return (
    <EnhancedForm
      className={className}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitSuccess={submitStatus === 'success'}
      submitError={submitStatus === 'error' ? errorMessage : undefined}
      title="Get in Touch"
      description="Ready to elevate your brand? Let's start a conversation about your vision."
    >
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2,
            }
          }
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <Input
            type="text"
            label="Full Name"
            name="name"
            value={values.name}
            onChange={(value) => setValue('name', value)}
            error={errors.name}
            required
            disabled={isSubmitting}
            icon={<UserIcon />}
            helperText="Enter your full name as you'd like to be addressed"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <Input
            type="text"
            label="Company"
            name="company"
            value={values.company}
            onChange={(value) => setValue('company', value)}
            error={errors.company}
            required
            disabled={isSubmitting}
            icon={<BuildingOfficeIcon />}
            helperText="Your organization or company name"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <Input
            type="email"
            label="Email Address"
            name="email"
            value={values.email}
            onChange={(value) => setValue('email', value)}
            error={errors.email}
            required
            disabled={isSubmitting}
            icon={<EnvelopeIcon />}
            helperText="We'll use this to get back to you"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <Input
            type="textarea"
            label="Message"
            name="message"
            value={values.message}
            onChange={(value) => setValue('message', value)}
            error={errors.message}
            required
            disabled={isSubmitting}
            icon={<ChatBubbleLeftRightIcon />}
            rows={6}
            helperText="Tell us about your project, goals, and how we can help"
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <Button
            type="submit"
            variant="luxury"
            size="lg"
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
            className="w-full"
            luxury={true}
          >
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </Button>
        </motion.div>
      </motion.div>
    </EnhancedForm>
  );
};

export default ContactForm;
