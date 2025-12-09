import React from 'react';

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
    },
    ref
  ) => {
    const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-');
    const hasError = !!error;

    const baseStyles = 'w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
    const normalStyles = 'border-neutral-gray-light focus:border-primary';
    const errorStyles = 'border-accent-error focus:border-accent-error';
    const inputClassName = `${baseStyles} ${hasError ? errorStyles : normalStyles} ${className}`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
    };

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-gray-dark mb-2"
        >
          {label}
          {required && <span className="text-accent-error ml-1">*</span>}
        </label>

        {type === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={inputId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={inputClassName}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            id={inputId}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={inputClassName}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${inputId}-error` : undefined}
          />
        )}

        {hasError && (
          <p
            id={`${inputId}-error`}
            className="mt-2 text-sm text-accent-error"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
