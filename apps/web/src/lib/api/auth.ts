import fetcher from 'lib/fetcher';
import { API_ENDPOINTS } from 'lib/constants/api-endpoints';

export interface LoginData {
  emailOrUsername: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName?: string;
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
  refreshToken: string;
  user: User;
  message: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const authApi = {
  /**
   * Đăng nhập người dùng
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetcher.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    
    // Lưu tokens sau khi login thành công
    fetcher.setAuthToken(response.accessToken, response.refreshToken);
    
    return response;
  },

  /**
   * Đăng ký người dùng mới
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetcher.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
    
    // Lưu tokens sau khi register thành công
    fetcher.setAuthToken(response.accessToken, response.refreshToken);
    
    return response;
  },

  /**
   * Đăng xuất người dùng
   */
  async logout(): Promise<void> {
    try {
      await fetcher.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      // Log error nhưng vẫn clear tokens
      console.error('Logout error:', error);
    } finally {
      fetcher.logout();
    }
  },

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken?: string): Promise<RefreshTokenResponse> {
    const response = await fetcher.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      { refreshToken }
    );
    
    // Cập nhật tokens mới
    fetcher.setAuthToken(response.accessToken, response.refreshToken);
    
    return response;
  },

  /**
   * Lấy thông tin profile người dùng hiện tại
   */
  async getProfile(): Promise<User> {
    return fetcher.get<User>(API_ENDPOINTS.AUTH.PROFILE);
  },

  /**
   * Kiểm tra email có khả dụng không
   */
  async checkEmailAvailability(email: string): Promise<{ available: boolean }> {
    return fetcher.get<{ available: boolean }>(
      `${API_ENDPOINTS.AUTH.CHECK_EMAIL}?email=${encodeURIComponent(email)}`
    );
  },

  /**
   * Kiểm tra username có khả dụng không
   */
  async checkUsernameAvailability(username: string): Promise<{ available: boolean }> {
    return fetcher.get<{ available: boolean }>(
      `${API_ENDPOINTS.AUTH.CHECK_USERNAME}?username=${encodeURIComponent(username)}`
    );
  },

  /**
   * Kiểm tra trạng thái authentication
   */
  isAuthenticated(): boolean {
    return fetcher.isAuthenticated();
  },

  /**
   * Cập nhật thông tin profile
   */
  async updateProfile(data: Partial<Pick<User, 'fullName'>>): Promise<User> {
    return fetcher.patch<User>(API_ENDPOINTS.AUTH.PROFILE, data);
  },

  /**
   * Đổi mật khẩu
   */
  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> {
    return fetcher.patch<{ message: string }>(
      API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
      data
    );
  },
};

// Export default
export default authApi;