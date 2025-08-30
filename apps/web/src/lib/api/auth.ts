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

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  message: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
}

export interface GetMeResponse {
  user: User;
}

// Auth API functions
export const authApi = {
  // Đăng nhập
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await fetcher.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
      
      // Lưu token sau khi đăng nhập thành công
      if (response.accessToken) {
        fetcher.setAuthToken(response.accessToken); // refreshToken được set qua cookie
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
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
      console.error('Register error:', error);
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
  getMe,
  checkEmailAvailability,
  checkUsernameAvailability,
} = authApi;

export default authApi;