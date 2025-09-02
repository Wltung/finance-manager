'use client';
import InputField from 'components/fields/InputField';
import Default from 'components/auth/variants/DefaultAuthLayout';
import { FcGoogle } from 'react-icons/fc';
import Checkbox from 'components/checkbox';
import { useRouter } from 'next/navigation';
import { useAuth, useGuestOnly } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

function SignInDefault() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuth();
  const [isMounted, setIsMounted] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({
    emailOrUsername: '',
    password: '',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if already authenticated (chỉ sau khi mounted)
  useEffect(() => {
    if (isMounted && !isLoading && isAuthenticated) {
      router.replace('/admin/default');
    }
  }, [isMounted, isLoading, isAuthenticated, router]);

  // Không render form nếu đang redirect
  if (!isMounted || (isAuthenticated && !isLoading)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {
      emailOrUsername: '',
      password: '',
    };

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email hoặc Username không để trống';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu không để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login({
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
      });

      toast.success('Đăng nhập thành công!');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error messages
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
      }
    }
  };

  // // Handle Google sign in (placeholder)
  // const handleGoogleSignIn = () => {
  //   toast.info('Tính năng đăng nhập Google sẽ được triển khai sau');
  // };

  return (
    <Default
      maincard={
        <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
          {/* Sign in section */}
          <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
            <h3 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
              Sign In
            </h3>
            <p className="mb-9 ml-1 text-base text-gray-600">
              Enter your email and password to sign in!
            </p>

            {/* Google Sign In Button */}
            <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800 dark:text-white">
              <div className="rounded-full text-xl">
                <FcGoogle />
              </div>
              <p className="text-sm font-medium text-navy-700 dark:text-white">
                Sign In with Google
              </p>
            </div>

            {/* Divider */}
            <div className="mb-6 flex items-center  gap-3">
              <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
              <p className="text-base text-gray-600"> or </p>
              <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="w-full">
            {/* Email/Username */}
              <InputField
                variant="auth"
                extra="mb-3"
                label="Email hoặc Username* "
                placeholder="mail@simmmple.com hoặc username"
                id="emailOrUsername"
                type="text"
                value={formData.emailOrUsername}
                onChange={(e) => handleInputChange('emailOrUsername', e.target.value)}
                error={errors.emailOrUsername}
                disabled={isLoading}
              />

              {/* Password */}
              <InputField
                variant="auth"
                extra="mb-3"
                label="Password*"
                placeholder="Min. 8 characters"
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                disabled={isLoading}
              />
              {/* Checkbox and Forgot Password */}
              <div className="mb-4 flex items-center justify-between px-2">
                <div className="mt-2 flex items-center">
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={(checked) => setFormData(prev => ({ ...prev, rememberMe: checked }))}
                  />
                  <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">
                    Keep me logged In
                  </p>
                </div>
                <a
                  className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
                  href="/auth/forgot-password"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="linear w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-4">
              <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
                Not registered yet?
              </span>
              <a
                href="/auth/sign-up"
                className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      }
    />
  );
}

export default SignInDefault;
