import React, { useState, useEffect } from 'react';
import { Field, FieldLabel, FieldHint, FieldError, TextInput, Textarea } from '@strapi/design-system';
import { useIntl } from 'react-intl';

interface CharacterLimitFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  maxLength?: number;
  multiline?: boolean;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CharacterLimitField: React.FC<CharacterLimitFieldProps> = ({
  name,
  label,
  placeholder,
  hint,
  required = false,
  maxLength = 100,
  multiline = false,
  value = '',
  onChange,
  error,
}) => {
  const { formatMessage } = useIntl();
  const [characterCount, setCharacterCount] = useState(value.length);

  useEffect(() => {
    setCharacterCount(value.length);
  }, [value]);

  const handleChange = (newValue: string) => {
    if (newValue.length <= maxLength) {
      onChange(newValue);
      setCharacterCount(newValue.length);
    }
  };

  const getCharacterCountColor = () => {
    const percentage = (characterCount / maxLength) * 100;
    if (percentage >= 90) return 'danger600';
    if (percentage >= 75) return 'warning600';
    return 'neutral600';
  };

  const InputComponent = multiline ? Textarea : TextInput;

  return (
    <Field name={name} error={error} required={required}>
      <FieldLabel>{label}</FieldLabel>
      <InputComponent
        placeholder={placeholder}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
          handleChange(e.target.value)
        }
        maxLength={maxLength}
      />
      <FieldHint>
        {hint && <span>{hint} </span>}
        <span style={{ color: `var(--strapi-color-${getCharacterCountColor()})` }}>
          {characterCount}/{maxLength} characters
        </span>
      </FieldHint>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
};