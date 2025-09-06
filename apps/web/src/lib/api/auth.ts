import fetcher from '../fetcher';
import { API_ENDPOINTS } from '../constants/api-endpoints';

// Types for auth requests and responses
export interface LoginRequest {
  emailOrUsername: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  message: string;
}

export interface RefreshResponse {
  accessToken: string;
  message: string;
}

export interface GetMeResponse {
  user: User;
  message: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  message: string;
}

// Auth API functions
export const authApi = {
  // Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await fetcher.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    
    // Lưu token sau khi đăng nhập thành công
    if (response.accessToken) {
      fetcher.setAuthToken(response.accessToken); // refreshToken được set qua cookie
    }
    
    return response;
  },

  // Đăng ký
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      const response = await fetcher.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
      
      // Lưu token sau khi đăng ký thành công
      if (response.accessToken) {
        fetcher.setAuthToken(response.accessToken);
      }
      
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Đăng xuất
  logout: async (): Promise<{ message: string }> => {
    try {
      // Gọi API logout để clear HttpOnly cookie từ server
      const response = await fetcher.post<{ message: string }>(API_ENDPOINTS.AUTH.LOGOUT);
      
      // Clear local access token
      fetcher.logout();
      
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn clear token local dù API call fail
      fetcher.logout();
      throw error;
    }
  },

  // Refresh token
  refreshToken: async (): Promise<RefreshResponse> => {
    try {
      return await fetcher.post<RefreshResponse>(API_ENDPOINTS.AUTH.REFRESH);
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  // Lấy thông tin user hiện tại
  getMe: async (): Promise<GetMeResponse> => {
    try {
      return await fetcher.get<GetMeResponse>(API_ENDPOINTS.AUTH.ME);
    } catch (error) {
      console.error('Get me error:', error);
      throw error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    try {
      return await fetcher.patch<{ message: string }>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Quên mật khẩu
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    try {
      return await fetcher.post<ForgotPasswordResponse>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
    try {
      return await fetcher.post<ResetPasswordResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, data);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  validateResetToken: async (token: string): Promise<{ valid: boolean; message?: string }> => {
    try {
      return await fetcher.post<{ valid: boolean; message?: string }>(
        API_ENDPOINTS.AUTH.VALIDATE_RESET_TOKEN, 
        { token }
      );
    } catch (error) {
      console.error('Validate reset token error:', error);
      throw error;
    }
  },

  // Kiểm tra email có sẵn không
  checkEmailAvailability: async (email: string): Promise<CheckAvailabilityResponse> => {
    try {
      return await fetcher.post<CheckAvailabilityResponse>(API_ENDPOINTS.AUTH.CHECK_EMAIL, { email });
    } catch (error) {
      console.error('Check email availability error:', error);
      throw error;
    }
  },

  // Kiểm tra username có sẵn không
  checkUsernameAvailability: async (username: string): Promise<CheckAvailabilityResponse> => {
    try {
      return await fetcher.post<CheckAvailabilityResponse>(API_ENDPOINTS.AUTH.CHECK_USERNAME, { username });
    } catch (error) {
      console.error('Check username availability error:', error);
      throw error;
    }
  },
};

// Export individual functions for convenience
export const {
  login,
  register,
  logout,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
  getMe,
  checkEmailAvailability,
  checkUsernameAvailability,
} = authApi;

export default authApi;