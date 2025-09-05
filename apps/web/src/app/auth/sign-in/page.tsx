'use client';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { FcGoogle } from 'react-icons/fc';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import AuthContainer from '@/components/auth/AuthContainer';
import GoogleAuthButton from '@/components/auth/GoogleAuthButton';
import AuthDivider from '@/components/auth/AuthDivider';
import AuthLink from '@/components/auth/AuthLink';
import AuthForm, { FormField } from '@/components/auth/AuthForm';
import { useAuthForm } from '@/hooks/useAuthForm';

function SignInDefault() {
  const router = useRouter();
  const { login, isLoading: authLoading, isAuthenticated } = useAuth();

  //Form configuration
  const initialValues ={
    emailOrUsername: '',
    password: '',
    rememberMe: false,
  };

  const validationSchema = {
    emailOrUsername: { required: true },
    password: { required: true, minLength: 6 },
  };

  const formFields: FormField[] = [
    {
      name: 'emailOrUsername',
      label: 'Email hoặc Username*',
      type: 'text',
      placeholder: 'mail@example.com hoặc username',
      required: true,
    },
    {
      name: 'password',
      label: 'Password*',
      type: 'password',
      placeholder: 'Min. 6 characters',
      required: true,
    },
    {
      name:'rememberMe',
      label: 'Keep me logged In',
      type: 'checkbox',
    },
  ];

  const handleFormSubmit = async (values: Record<string, any>) => {
    try {
      await login({
        emailOrUsername: values.emailOrUsername,
        password: values.password,
      });
      toast.success('Đăng nhập thành công!');
    } catch (error: any) {
      // Handle specific error messages
      let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại!';
      
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

  // Redirect if already authenticated (chỉ sau khi mounted)
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/admin/default');
    }
  }, [authLoading, isAuthenticated, router]);

  // // Handle Google sign in (placeholder)
  // const handleGoogleSignIn = () => {
  //   toast.info('Tính năng đăng nhập Google sẽ được triển khai sau');
  // };

  return (
    <Default
      maincard={
        <AuthContainer
          title="Sign In"
          subtitle="Enter your email and password to sign in!"
        >
          {/* Google Sign In Button */}
          <GoogleAuthButton
            type="signin"
            // onClick={handleGoogleSignIn}
            disabled={isSubmitting}
          />

          {/* Divider */}
          <AuthDivider />

          {/* Login Form */}
          <AuthForm
            fields={formFields}
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            submitText="Sign In"
            submitLoadingText="Signing In..."
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            extraContent={
              <div className="mb-4 flex items-center justify-between px-2">
                <div /> {/* Empty div for spacing since checkbox is in form fields */}
                  <a
                    className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                    href="/auth/forgot-password"
                  >
                    Forgot Password?
                  </a>
              </div>
            }
          />

          {/* Sign Up Link */}
          <AuthLink
            text="Not registered yet?"
            linkText="Create an account"
            href="/auth/sign-up"
          />
        </AuthContainer>
      }
    />
  );
}

export default SignInDefault;
