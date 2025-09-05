import React from 'react';

interface AuthLinkProps {
  text: string;
  linkText: string;
  href: string;
}

const AuthLink: React.FC<AuthLinkProps> = ({ text, linkText, href }) => {
  return (
    <div className="mt-4">
      <span className="text-sm font-medium text-navy-700 dark:text-gray-500">
        {text}
      </span>
      <a
        href={href}
        className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
      >
        {linkText}
      </a>
    </div>
  );
};

export default AuthLink;