import React from 'react';
import { FcGoogle } from 'react-icons/fc';

interface GoogleAuthButtonProps {
  type: 'signin' | 'signup';
  onClick?: () => void;
  disabled?: boolean;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ type, onClick, disabled = false }) => {
  const buttonText = type === 'signin' ? 'Sign In with Google' : 'Sign Up with Google';

  return (
    <div 
      onClick={disabled ? undefined : onClick}
      className={`mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary dark:bg-navy-800 dark:text-white transition-colors ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:cursor-pointer hover:bg-lightPrimary/80 dark:hover:bg-navy-700'
      }`}
    >
      <div className="rounded-full text-xl">
        <FcGoogle />
      </div>
      <p className="text-sm font-medium text-navy-700 dark:text-white">
        {buttonText}
      </p>
    </div>
  );
};

export default GoogleAuthButton;