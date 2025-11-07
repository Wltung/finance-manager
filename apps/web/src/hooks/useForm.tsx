import { useForm as useReactHookForm, UseFormProps, FieldValues, Path, UseFormReturn as RHFUseFormReturn } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export interface UseFormOptions<T extends FieldValues> extends Omit<UseFormProps<T>, 'resolver'> {
  validationSchema?: yup.ObjectSchema<any>;
  onSubmit?: (data: T) => Promise<void> | void;
  onError?: (error: any) => void;
  showSuccessToast?: boolean;
  successMessage?: string;
  showErrorToast?: boolean;
  resetOnSuccess?: boolean;
}

export interface UseFormReturn<T extends FieldValues> extends RHFUseFormReturn<T> {
  isSubmitting: boolean;
  submitForm: (e?: React.BaseSyntheticEvent) => Promise<void>;
  setFieldValue: (name: Path<T>, value: any) => void;
  getFieldError: (name: Path<T>) => string | undefined;
  hasErrors: boolean;
  isDirty: boolean;
  isValid: boolean;
}

export const useForm = <T extends FieldValues = FieldValues>({
  validationSchema,
  onSubmit,
  onError,
  showSuccessToast = true,
  successMessage = 'Thao tác thành công',
  showErrorToast = true,
  resetOnSuccess = false,
  ...options
}: UseFormOptions<T> = {}): UseFormReturn<T> => {
  const form = useReactHookForm<T>({
    ...options,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors, isDirty, isValid },
    setValue,
    reset,
    setError,
  } = form;

  const setFieldValue = useCallback((name: Path<T>, value: any) => {
    setValue(name, value, { shouldValidate: true, shouldDirty: true });
  }, [setValue]);

  const getFieldError = useCallback((name: Path<T>) => {
    const error = errors[name];
    return error?.message as string | undefined;
  }, [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  const submitForm = useCallback(async (e?: React.BaseSyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }

    await handleSubmit(
      async (data: T) => {
        try {
          if (onSubmit) {
            await onSubmit(data);
            
            if (showSuccessToast) {
              toast.success(successMessage);
            }
            
            if (resetOnSuccess) {
              reset();
            }
          }
        } catch (error: any) {
          console.error('Form submission error:', error);
          
          // Handle server validation errors
          if (error?.response?.data?.errors) {
            const serverErrors = error.response.data.errors;
            Object.keys(serverErrors).forEach((field) => {
              setError(field as Path<T>, {
                type: 'server',
                message: serverErrors[field],
              });
            });
          }
          
          if (showErrorToast) {
            const errorMessage = error?.response?.data?.message || 
                               error?.message || 
                               'Có lỗi xảy ra. Vui lòng thử lại.';
            toast.error(errorMessage);
          }
          
          if (onError) {
            onError(error);
          }
        }
      },
      (errors) => {
        console.error('Form validation errors:', errors);
        if (showErrorToast) {
          toast.error('Vui lòng kiểm tra lại thông tin và thử lại.');
        }
      }
    )(e);
  }, [handleSubmit, onSubmit, onError, showSuccessToast, successMessage, showErrorToast, resetOnSuccess, reset, setError]);

  return {
    ...form,
    isSubmitting,
    submitForm,
    setFieldValue,
    getFieldError,
    hasErrors,
    isDirty,
    isValid,
  };
};