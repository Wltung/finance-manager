import React from 'react';

const AuthDivider: React.FC = () => {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
      <p className="text-base text-gray-600">or</p>
      <div className="h-px w-full bg-gray-200 dark:!bg-navy-700" />
    </div>
  );
};

export default AuthDivider;