import React from 'react';
import InputField from 'components/fields/InputField';
import Checkbox from 'components/checkbox';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'checkbox';
  placeholder?: string;
  required?: boolean;
}

interface AuthFormProps {
  fields: FormField[];
  formData: Record<string, any>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitText: string;
  submitLoadingText: string;
  onInputChange: (field: string, value: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  extraContent?: React.ReactNode; // For forgot password link, etc.
}

const AuthForm: React.FC<AuthFormProps> = ({
  fields,
  formData,
  errors,
  isSubmitting,
  submitText,
  submitLoadingText,
  onInputChange,
  onSubmit,
  extraContent,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
      {fields.map((field) => {
        if (field.type === 'checkbox') {
          return (
            <div key={field.name} className="mb-4">
              <div className="flex items-center px-2">
                <Checkbox
                  id={field.name}
                  checked={formData[field.name] || false}
                  onChange={(checked) => onInputChange(field.name, checked)}
                />
                <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                  {field.label}
                </p>
              </div>
              {/* Thêm hiển thị error cho checkbox */}
              {errors[field.name] && (
                <p className="mt-1 px-2 text-sm text-red-500">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        }

        return (
          <InputField
            key={field.name}
            variant="auth"
            extra="mb-3"
            label={field.label}
            placeholder={field.placeholder || ''}
            id={field.name}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => onInputChange(field.name, e.target.value)}
            error={errors[field.name]}
            disabled={isSubmitting}
          />
        );
      })}

      {extraContent}

      <button
        type="submit"
        disabled={isSubmitting}
        className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? submitLoadingText : submitText}
      </button>
    </form>
  );
};

export default AuthForm;