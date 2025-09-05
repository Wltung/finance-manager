
'use client';

import { useCallback, useEffect, useState } from 'react';
import AuthContainer from '@/components/auth/AuthContainer';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AuthLink from '@/components/auth/AuthLink';
import Default from '@/components/auth/variants/DefaultAuthLayout';
import { useAuthForm } from '@/hooks/useAuthForm';
import AuthForm, { FormField } from '@/components/auth/AuthForm';

function ForgotPasswordDefault() {
  const router = useRouter();
  const { forgotPassword, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isEmailSent, setIsEmailSent] = useState(false);

  // Form configuration
  const initialValues = {
    email: '',
  };

  const validationSchema = {
    email: { required: true, email: true },
  };

  const formFields: FormField[] = [
    {
      name: 'email',
      label: 'Email Address*',
      type: 'email',
      placeholder: 'Enter your email address',
      required: true,
    },
  ];

  const handleFormSubmit = async (values: Record<string, any>) => {
    try {
      await forgotPassword({ email: values.email });
      setIsEmailSent(true);
      toast.success('Email khôi phục mật khẩu đã được gửi!');
    } catch (error: any) {
      let errorMessage = 'Gửi email thất bại. Vui lòng thử lại!';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
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

	// Handle resend email
  const handleResendEmail = useCallback(() => {
    setIsEmailSent(false);
    // Reset form data to allow user to enter email again
  }, []);

  if (isEmailSent) {
    return (
      <Default
        maincard={
          <AuthContainer
            title="Check Your Email"
            subtitle="We've sent a password reset link to your email address."
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
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
                Please check your email and click on the link to reset your password.
                If you don't see the email, check your spam folder.
              </p>
            </div>

            <button
              onClick={handleResendEmail}
              className="linear mb-4 w-full rounded-xl bg-gray-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700"
            >
              Send Another Email
            </button>

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

  return (
    <Default
      maincard={
        <AuthContainer
          title="Forgot Password"
          subtitle="Enter your email address and we'll send you a link to reset your password."
        >
          <AuthForm
            fields={formFields}
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            submitText="Send Reset Link"
            submitLoadingText="Sending..."
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

export default ForgotPasswordDefault;