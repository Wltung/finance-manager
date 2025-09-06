'use client';

import AuthContainer from "@/components/auth/AuthContainer";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthForm, { FormField } from "@/components/auth/AuthForm";
import AuthLink from "@/components/auth/AuthLink";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import Default from "@/components/auth/variants/DefaultAuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

function SignUpDefault(){
    const router = useRouter();
    const { register, isLoading: authLoading, isAuthenticated } = useAuth();

    //Form configuration
    const initialValues ={
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    };

    const validationSchema = {
        fullName: { required: true, maxLength: 100 },
        username: { required: true, username: true, minLength: 3 },
        email: { required: true, email: true },
        password: { required: true, password: true, minLength: 6 },
        confirmPassword: { required: true, confirmPassword: 'password' },
        agreeToTerms: { required: true },
    };

    const formFields: FormField[] = [
        {
            name: 'fullName',
            label: 'Full Name*',
            type: 'text',
            placeholder: 'Enter your full name',
            required: true,
        },
        {
            name: 'username',
            label: 'Username*',
            type: 'text',
            placeholder: 'Enter your username',
            required: true,
        },
        {
            name: 'email',
            label: 'Email*',
            type: 'email',
            placeholder: 'mail@example.com',
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
            name: 'confirmPassword',
            label: 'Confirm Password*',
            type: 'password',
            placeholder: 'Confirm your password',
            required: true,
        },
        {
            name: 'agreeToTerms',
            label: 'I agree to the Terms and Conditions',
            type: 'checkbox',
            required: true,
        },
    ];

    const handleFormSubmit = async (values: Record<string, any>) => {
        try {
            // Validate password confirmation
            if (values.password !== values.confirmPassword) {
                toast.error('Mật khẩu xác nhận không khớp!');
                return;
            }

            // Check terms agreement
            if (!values.agreeToTerms) {
                toast.error('Bạn phải đồng ý với điều khoản và điều kiện!');
                return;
            }

            await register({
                fullName: values.fullName,
                username: values.username,
                email: values.email,
                password: values.password,
            });
            
            toast.success('Đăng ký thành công!');
        } catch (error: any) {
            let errorMessage = 'Đăng ký thất bại. Vui lòng thử lại!';
            
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

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.replace('/admin/default');
        }
    }, [authLoading, isAuthenticated, router]);

    return (
        <Default
            maincard={
                <AuthContainer
                    title="Sign Up"
                    subtitle="Enter your email and password to sign up!"
                >
                    {/* Google Sign In Button */}
                    <GoogleAuthButton
                        type="signup"
                        // onClick={handleGoogleSignIn}
                        disabled={isSubmitting}
                    />

                    {/* Divider */}
                    <AuthDivider />

                    {/* Register Form */}
                    <AuthForm
                        fields={formFields}
                        formData={formData}
                        errors={errors}
                        isSubmitting={isSubmitting}
                        submitText="Create my account"
                        submitLoadingText="Creating account..."
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                    />

                    {/* Sign In Link */}
                    <AuthLink
                        text="Already have an account?"
                        linkText="Sign In"
                        href="/auth/sign-in"
                    />
                </AuthContainer>
            }
        />
    );
}

export default SignUpDefault;