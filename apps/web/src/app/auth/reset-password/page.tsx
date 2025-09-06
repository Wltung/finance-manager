'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AuthContainer from '@/components/auth/AuthContainer';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import AuthLink from '@/components/auth/AuthLink';
import Default from '@/components/auth/variants/DefaultAuthLayout';
import { useAuthForm } from '@/hooks/useAuthForm';
import AuthForm, { FormField } from '@/components/auth/AuthForm';
import authApi from '@/lib/api/auth';

function ResetPasswordDefault() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isValidatingToken, setIsValidatingToken] = useState(true);
  const [tokenValidationError, setTokenValidationError] = useState<string | null>(null);

  // Validate token when component mounts
  useEffect(() => {
    const validateToken = async () => {
      const tokenParam = searchParams.get('token');
      
      if (!tokenParam) {
        setTokenValidationError('Token không hợp lệ hoặc đã hết hạn');
        setIsValidatingToken(false);
        return;
      }

      try {
        const result = await authApi.validateResetToken(tokenParam);
        
        if (result.valid) {
          setToken(tokenParam);
          setTokenValidationError(null);
        } else {
          setTokenValidationError(result.message || 'Token không hợp lệ');
        }
      } catch (error: any) {
        console.error('Token validation error:', error);
        setTokenValidationError('Có lỗi xảy ra khi kiểm tra token');
      } finally {
        setIsValidatingToken(false);
      }
    };

    validateToken();
  }, [searchParams]);

  // Redirect to forgot password if token is invalid
  useEffect(() => {
    if (!isValidatingToken && tokenValidationError) {
      toast.error(tokenValidationError);
      setTimeout(() => {
        router.replace('/auth/forgot-password');
      }, 2000);
    }
  }, [isValidatingToken, tokenValidationError, router]);

  // Form configuration
  const initialValues = {
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = {
    newPassword: { 
      required: true, 
      minLength: 6,
      password: true 
    },
    confirmPassword: { 
      required: true, 
      confirmPassword: 'newPassword' 
    },
  };

  const formFields: FormField[] = [
    {
      name: 'newPassword',
      label: 'New Password*',
      type: 'password',
      placeholder: 'Enter your new password',
      required: true,
    },
    {
      name: 'confirmPassword',
      label: 'Confirm New Password*',
      type: 'password',
      placeholder: 'Confirm your new password',
      required: true,
    },
  ];

  const handleFormSubmit = async (values: Record<string, any>) => {
    if (!token) {
      toast.error('Token không hợp lệ');
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: values.newPassword,
      });
      setIsPasswordReset(true);
      toast.success('Mật khẩu đã được đặt lại thành công!');
    } catch (error: any) {
      let errorMessage = 'Đặt lại mật khẩu thất bại. Vui lòng thử lại!';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      // Handle specific error cases
      if (
        errorMessage.includes('token') || 
        errorMessage.includes('expired') ||
        errorMessage.includes('hết hạn') ||
        errorMessage.includes('đã được sử dụng') ||
        errorMessage.includes('không hợp lệ')
      ) {
        toast.error(errorMessage);
        setTimeout(() => {
          router.replace('/auth/forgot-password');
        }, 2000);
        return;
      }
      
      toast.error(errorMessage);
    }
  };

  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useAuthForm({
    initialValues,
    validationSchema,
    onSubmit: handleFormSubmit,
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/admin/default');
    }
  }, [authLoading, isAuthenticated, router]);

  // Handle redirect to login after successful reset
  const handleGoToLogin = useCallback(() => {
    router.push('/auth/sign-in');
  }, [router]);

  // Show loading while validating token
  if (isValidatingToken) {
    return (
      <Default
        maincard={
          <AuthContainer
            title="Reset Password"
            subtitle="Validating reset token..."
          >
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          </AuthContainer>
        }
      />
    );
  }

  // Show error if token validation failed (sẽ tự động redirect)
  if (tokenValidationError) {
    return (
      <Default
        maincard={
          <AuthContainer
            title="Invalid Token"
            subtitle="The reset token is invalid or has expired."
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {tokenValidationError}
              </p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                Redirecting to forgot password page...
              </p>
            </div>
          </AuthContainer>
        }
      />
    );
  }

  // Show loading if no token yet
  if (!token) {
    return (
      <Default
        maincard={
          <AuthContainer
            title="Reset Password"
            subtitle="Validating reset token..."
          >
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
            </div>
          </AuthContainer>
        }
      />
    );
  }

  // Show success state
  if (isPasswordReset) {
    return (
      <Default
        maincard={
          <AuthContainer
            title="Password Reset Successful"
            subtitle="Your password has been successfully reset."
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="h-8 w-8 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You can now sign in with your new password.
              </p>
            </div>

            <button
              onClick={handleGoToLogin}
              className="linear mb-4 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300"
            >
              Go to Sign In
            </button>

            <AuthLink
              text="Need help?"
              linkText="Contact Support"
              href="/contact"
            />
          </AuthContainer>
        }
      />
    );
  }

  // Show reset password form
  return (
    <Default
      maincard={
        <AuthContainer
          title="Reset Password"
          subtitle="Enter your new password below."
        >
          <AuthForm
            fields={formFields}
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            submitText="Reset Password"
            submitLoadingText="Resetting..."
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
          />

          <AuthLink
            text="Remember your password?"
            linkText="Back to Sign In"
            href="/auth/sign-in"
          />
        </AuthContainer>
      }
    />
  );
}

export default ResetPasswordDefault;