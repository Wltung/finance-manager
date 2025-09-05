import { useState, useCallback } from 'react';

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  username?: boolean;
  password?: boolean;
  confirmPassword?: string; // field name to match
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRules;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const useAuthValidation = (schema: ValidationSchema) => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((fieldName: string, value: any, allValues?: Record<string, any>): string => {
    const rules = schema[fieldName];
    if (!rules) return '';

    // Required validation for checkbox
    if (rules.required && typeof value === 'boolean' && !value) {
      return `Bạn phải đồng ý với ${getFieldDisplayName(fieldName).toLowerCase()}`;
    }

    // Required validation
    if (rules.required && typeof value === 'string' && !value.trim()) {
      return `${getFieldDisplayName(fieldName)} không được để trống`;
    }

    // Required validation for other types (null, undefined, empty)
    if (rules.required && (value === null || value === undefined || value === '')) {
      return `${getFieldDisplayName(fieldName)} không được để trống`;
    }

    // Skip other validations for boolean fields (checkboxes)
    if (typeof value === 'boolean') {
      return '';
    }

    // Skip other validations if field is empty and not required
    if (typeof value === 'string' && !value.trim() && !rules.required) {
      return '';
    }

    // Convert to string for validation if not already
    const stringValue = typeof value === 'string' ? value : String(value);

    // Min length validation
    if (rules.minLength && stringValue.length < rules.minLength) {
      return `${getFieldDisplayName(fieldName)} phải có ít nhất ${rules.minLength} ký tự`;
    }

    // Max length validation
    if (rules.maxLength && stringValue.length > rules.maxLength) {
      return `${getFieldDisplayName(fieldName)} không được quá ${rules.maxLength} ký tự`;
    }

    // Email validation
    if (rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(stringValue)) {
        return 'Email không hợp lệ';
      }
    }

    // Username validation
    if (rules.username) {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(stringValue)) {
        return 'Username chỉ được chứa chữ, số và dấu gạch dưới';
      }
    }

    // Password validation
    if (rules.password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
      if (!passwordRegex.test(stringValue)) {
        return 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số';
      }
    }

    // Confirm password validation
    if (rules.confirmPassword && allValues) {
      const originalPassword = allValues[rules.confirmPassword];
      if (stringValue !== originalPassword) {
        return 'Mật khẩu xác nhận không khớp';
      }
    }

    // Custom validation
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        return customError;
      }
    }

    return '';
  }, [schema]);

  const validateForm = useCallback((formData: Record<string, any>): boolean => {
    const newErrors: ValidationErrors = {};

    Object.keys(schema).forEach(fieldName => {
      const fieldValue = formData[fieldName];
      // Handle different field types properly
      const valueToValidate = fieldValue !== undefined ? fieldValue : '';
      const error = validateField(fieldName, valueToValidate, formData);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [schema, validateField]);

  const clearError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  }, []);

  return {
    errors,
    validateField,
    validateForm,
    clearError,
    clearAllErrors,
    setFieldError,
  };
};

// Helper function to get display name for fields
const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: Record<string, string> = {
    email: 'Email',
    username: 'Username',
    password: 'Mật khẩu',
    confirmPassword: 'Xác nhận mật khẩu',
    emailOrUsername: 'Email hoặc Username',
    fullName: 'Họ tên',
    oldPassword: 'Mật khẩu cũ',
    newPassword: 'Mật khẩu mới',
    agreeToTerms: 'Điều khoản và điều kiện',
  };

  return displayNames[fieldName] || fieldName;
};