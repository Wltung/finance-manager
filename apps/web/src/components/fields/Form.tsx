import React from 'react';
import FormField, { FormFieldConfig } from './FormField';

interface FormProps {
  fields: FormFieldConfig[];
  formData: Record<string, any>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitText: string;
  submitLoadingText: string;
  onInputChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  extraContent?: React.ReactNode;
  variant?: 'default' | 'auth';
  showSubmitButton?: boolean;
  submitButtonClassName?: string;
  resetButton?: {
    show: boolean;
    text: string;
    onClick: () => void;
  };
}

const Form: React.FC<FormProps> = ({
  fields,
  formData,
  errors,
  isSubmitting,
  submitText,
  submitLoadingText,
  onInputChange,
  onSubmit,
  extraContent,
  variant = 'default',
  showSubmitButton = true,
  submitButtonClassName,
  resetButton,
}) => {
  const defaultSubmitClassName = variant === 'auth' 
    ? "linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 disabled:opacity-50 disabled:cursor-not-allowed"
    : "linear rounded-xl bg-brand-500 px-6 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <form onSubmit={onSubmit} className="w-full">
      {fields.map((field) => (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name]}
          error={errors[field.name]}
          disabled={isSubmitting}
          onChange={onInputChange}
          variant={variant}
          extra={variant === 'auth' ? 'mb-3' : 'mb-4'}
        />
      ))}

      {extraContent}

      {showSubmitButton && (
        <div className={`flex ${resetButton?.show ? 'justify-end space-x-3' : variant === 'auth' ? 'justify-center' : 'justify-end'} mt-6`}>
          {resetButton?.show && (
            <button
              type="button"
              onClick={resetButton.onClick}
              disabled={isSubmitting}
              className="linear rounded-xl bg-gray-500 px-6 py-3 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetButton.text}
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={submitButtonClassName || defaultSubmitClassName}
          >
            {isSubmitting ? submitLoadingText : submitText}
          </button>
        </div>
      )}
    </form>
  );
};

export default Form;