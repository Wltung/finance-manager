import { useAuth } from '@/hooks/useAuth';
import { updateProfile, UpdateUserRequest } from '@/lib/api/user';
import Card from 'components/card';
import InputField from 'components/fields/InputField';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const AccountSettings = () => {
  const { user, isLoading: authLoading, refreshUser } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    job: '',
    aboutMe: '',
  });

  // Populate form data when user data is available
  useEffect(() => {
		if (user) { 
			const initialData = {
				username: user.username || '',
				email: user.email || '',
				fullName: user.fullName || '',
				job: 'Product Manager', // Default job title
				aboutMe: '',
			};
			setFormData(initialData);
		}
  }, [user]);

	// Check if form has changes
  useEffect(() => {
    if (user) {
      const hasChanged = 
        formData.username !== (user.username || '') ||
        formData.email !== (user.email || '') ||
        formData.fullName !== (user.fullName || '');
      setHasChanges(hasChanged);
    }
  }, [formData, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!hasChanges) {
      toast.error('Không có thay đổi nào để lưu');
      return;
    }

		if (!user?.id) {
			toast.error('Không tìm thấy thông tin người dùng');
			return;
		}

    setIsSubmitting(true);

    try {
      // Prepare update data (only send changed fields)
			const updateData: UpdateUserRequest = {};
			
			if (formData.username !== (user?.username || '')) {
				updateData.username = formData.username;
			}
			if (formData.email !== (user?.email || '')) {
				updateData.email = formData.email;
			}
			if (formData.fullName !== (user?.fullName || '')) {
				updateData.fullName = formData.fullName;
			}

      // Call update API with user ID
    	const response = await updateProfile(user.id, updateData);
      
      // Refresh user data in AuthContext
      await refreshUser();
      
      // Show success message
      toast.success(response.message || 'Cập nhật thông tin thành công');
      
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      // Show error message
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Có lỗi xảy ra khi cập nhật thông tin';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while user data is being fetched
  if (authLoading) {
    return (
      <Card extra="w-full p-6">
        <div className="animate-pulse">
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card extra="w-full p-6">
      <div className="mb-6">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Account Settings
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update your account information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username and Email in same row */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InputField
            variant="auth"
            extra="mb-0"
            label="Username*"
            placeholder="Enter your username"
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
						disabled={isSubmitting}
          />
          <InputField
            variant="auth"
            extra="mb-0"
            label="Email Address*"
            placeholder="Enter your email"
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
						disabled={isSubmitting}
          />
        </div>

        {/* Full Name */}
        <InputField
          variant="auth"
          extra="mb-0"
          label="Full Name"
          placeholder="Enter your full name"
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
					disabled={isSubmitting}
        />

        {/* Job */}
        <InputField
          variant="auth"
          extra="mb-0"
          label="Job Title"
          placeholder="Enter your job title"
          id="job"
          type="text"
          value={formData.job}
          onChange={(e) => handleInputChange('job', e.target.value)}
        />

        {/* About Me */}
        <div>
          <label
            htmlFor="aboutMe"
            className="text-sm text-navy-700 dark:text-white ml-1.5 font-medium"
          >
            About Me
          </label>
          <textarea
            id="aboutMe"
            rows={4}
            className="mt-2 flex h-full w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
            placeholder="Tell us about yourself..."
            value={formData.aboutMe}
            onChange={(e) => handleInputChange('aboutMe', e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          {hasChanges && (
            <button
              type="button"
              onClick={() => {
                if (user) {
                  setFormData({
                    username: user.username || '',
                    email: user.email || '',
                    fullName: user.fullName || '',
										job: 'Product Manager',
                    aboutMe: '',
                  });
                }
              }}
              disabled={isSubmitting}
              className="linear rounded-xl bg-gray-500 px-6 py-3 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !hasChanges}
            className="linear rounded-xl bg-brand-500 px-6 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Card>
  );
};

export default AccountSettings;