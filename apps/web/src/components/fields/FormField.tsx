import React from 'react';
import InputField from 'components/fields/InputField';
import Checkbox from 'components/checkbox';

export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'checkbox' | 'textarea' | 'number' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  showPasswordToggle?: boolean;
  rows?: number; // For textarea
  maxLength?: number;
  helpText?: string;
  disabled?: boolean;
}

interface FormFieldProps {
  field: FormFieldConfig;
  value: any;
  error?: string;
  disabled?: boolean;
  onChange: (field: string, value: any) => void;
  variant?: 'default' | 'auth';
  extra?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  disabled = false,
  onChange,
  variant = 'default',
  extra = 'mb-4',
}) => {
  // Handle checkbox type
  if (field.type === 'checkbox') {
    return (
      <div className={extra}>
        <div className="flex items-center px-2">
          <Checkbox
            id={field.name}
            checked={value || false}
            onChange={(checked) => onChange(field.name, checked)}
            disabled={disabled || field.disabled}
          />
          <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </p>
        </div>
        {error && (
          <p className="mt-1 px-2 text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        {field.helpText && !error && (
          <p className="mt-1 px-2 text-xs text-gray-500 dark:text-gray-400">
            {field.helpText}
          </p>
        )}
      </div>
    );
  }

  // Handle textarea type
  if (field.type === 'textarea') {
    return (
      <div className={extra}>
        <label
          htmlFor={field.name}
          className={`text-sm text-navy-700 dark:text-white ${
            variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
          }`}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          id={field.name}
          name={field.name}
          rows={field.rows || 4}
          placeholder={field.placeholder || ''}
          value={value || ''}
          onChange={(e) => onChange(field.name, e.target.value)}
          disabled={disabled || field.disabled}
          maxLength={field.maxLength}
          className={`mt-2 flex w-full items-start justify-start rounded-xl border bg-white/0 p-3 text-sm outline-none resize-vertical ${
            disabled || field.disabled
              ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
              : error
              ? "border-red-500 text-red-500 placeholder:text-red-500 dark:!border-red-400 dark:!text-red-400 dark:placeholder:!text-red-400"
              : "border-gray-200 dark:!border-white/10 dark:text-white"
          }`}
        />
        {error && (
          <p className="ml-1.5 mt-1 text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        {field.helpText && !error && (
          <p className="ml-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {field.helpText}
          </p>
        )}
        {field.maxLength && value && (
          <p className="ml-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
            {value.length}/{field.maxLength}
          </p>
        )}
      </div>
    );
  }

  // Handle regular input types using existing InputField component
  return (
    <div className={extra}>
      <InputField
        variant={variant}
        extra="mb-0"
        label={`${field.label}${field.required ? '*' : ''}`}
        placeholder={field.placeholder || ''}
        id={field.name}
        type={field.type}
        value={value || ''}
        onChange={(e) => onChange(field.name, e.target.value)}
        error={error}
        disabled={disabled || field.disabled}
        showPasswordToggle={field.type === 'password' && (field.showPasswordToggle ?? true)}
      />
      {field.helpText && !error && (
        <p className="ml-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
          {field.helpText}
        </p>
      )}
      {field.maxLength && value && field.type !== 'password' && (
        <p className="ml-1.5 mt-1 text-xs text-gray-500 dark:text-gray-400">
          {value.length}/{field.maxLength}
        </p>
      )}
    </div>
  );
};

export default FormField;