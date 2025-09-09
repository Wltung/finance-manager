import Card from 'components/card';
import InputField from 'components/fields/InputField';
import { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic will be added later
    console.log('Change password form submitted:', formData);
  };

  return (
    <Card extra="w-full p-6">
      <div className="mb-6">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Change Password
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update your password to keep your account secure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div className="relative">
          <InputField
            variant="auth"
            extra="mb-0"
            label="Current Password*"
            placeholder="Enter your current password"
            id="currentPassword"
            type={showPasswords.current ? "text" : "password"}
            value={formData.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-xl text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
            onClick={() => togglePasswordVisibility('current')}
          >
            {showPasswords.current ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <InputField
            variant="auth"
            extra="mb-0"
            label="New Password*"
            placeholder="Enter your new password"
            id="newPassword"
            type={showPasswords.new ? "text" : "password"}
            value={formData.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-xl text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
            onClick={() => togglePasswordVisibility('new')}
          >
            {showPasswords.new ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        </div>

        {/* Confirm New Password */}
        <div className="relative">
          <InputField
            variant="auth"
            extra="mb-0"
            label="Confirm New Password*"
            placeholder="Confirm your new password"
            id="confirmPassword"
            type={showPasswords.confirm ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-xl text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
            onClick={() => togglePasswordVisibility('confirm')}
          >
            {showPasswords.confirm ? <MdVisibilityOff /> : <MdVisibility />}
          </button>
        </div>

        {/* Password Requirements */}
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-navy-800">
          <h6 className="mb-2 text-sm font-medium text-navy-700 dark:text-white">
            Password Requirements:
          </h6>
          <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <li>• At least 6 characters long</li>
            <li>• Contains at least one uppercase letter</li>
            <li>• Contains at least one lowercase letter</li>
            <li>• Contains at least one number</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="linear rounded-xl bg-brand-500 px-6 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          >
            Update Password
          </button>
        </div>
      </form>
    </Card>
  );
};

export default ChangePassword;