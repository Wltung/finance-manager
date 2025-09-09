import fetcher from '../fetcher';
import { API_ENDPOINTS } from '../constants/api-endpoints';

// User update request interface
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  fullName?: string;
}

// User update response interface
export interface UpdateUserResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    fullName?: string;
    createdAt: string;
    updatedAt: string;
  };
}

// User API functions
export const userApi = {
  // Update user profile
  updateProfile: async (userId: string, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    try {
      return await fetcher.patch<UpdateUserResponse>(API_ENDPOINTS.USERS.UPDATE(userId), data);
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  },
};

// Export the functions for easier importing
export const {
  updateProfile,
} = userApi;
