import { useState, useCallback, useRef, useEffect } from 'react';
import { useAuthValidation, ValidationSchema } from './useAuthValidation';

export interface UseAuthFormOptions {
  initialValues: Record<string, any>;
  validationSchema: ValidationSchema;
  onSubmit: (values: Record<string, any>) => Promise<void>;
}

export const useAuthForm = ({ initialValues, validationSchema, onSubmit }: UseAuthFormOptions) => {
  const [formData, setFormData] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validateForm, clearError, clearAllErrors, setFieldError } = useAuthValidation(validationSchema);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      clearError(field);
    }
  }, [errors, clearError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error: any) {
      // Handle server validation errors
      if (error?.response?.data?.errors) {
        const serverErrors = error.response.data.errors;
        Object.keys(serverErrors).forEach(field => {
          setFieldError(field, serverErrors[field]);
        });
      }
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSubmit, setFieldError]);

  const resetForm = useCallback(() => {
    setFormData(initialValues);
    setIsSubmitting(false);
    clearAllErrors();
  }, [clearAllErrors, initialValues]);

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
    resetForm,
  };
};