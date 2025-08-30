import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Định nghĩa interface cho response API
interface ApiResponse<T = any> {
  data: T;
  message?: string;
  statusCode?: number;
}

// Định nghĩa interface cho error response
interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

declare module 'axios' {
    export interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

class Fetcher {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - thêm token vào header
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - xử lý response và error
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Xử lý lỗi 401 (Unauthorized) - token hết hạn
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              const newTokens = await this.refreshAccessToken(refreshToken);
              this.setTokens(newTokens.accessToken, newTokens.refreshToken);
              
              // Retry request với token mới
              originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            // Refresh token cũng hết hạn, redirect to login
            this.clearTokens();
            window.location.href = '/auth/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      return {
        message: error.response.data?.message || 'Có lỗi xảy ra từ server',
        statusCode: error.response.status,
        error: error.response.data?.error,
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Không thể kết nối đến server',
        statusCode: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'Có lỗi không xác định xảy ra',
        statusCode: 0,
      };
    }
  }

  // Helper method để extract data từ response
  private extractData<T>(response: AxiosResponse<any>): T {
    // Kiểm tra nếu response có cấu trúc ApiResponse
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return response.data.data as T;
    }
    // Nếu không, trả về toàn bộ response.data
    return response.data as T;
  }

  // Token management methods
  private getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  private clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  private async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await axios.post(`${this.baseURL}/auth/refresh`, {
      refreshToken,
    });
    return response.data;
  }

  // HTTP Methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get(url, config);
    return this.extractData<T>(response);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post(url, data, config);
    return this.extractData<T>(response);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put(url, data, config);
    return this.extractData<T>(response);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch(url, data, config);
    return this.extractData<T>(response);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete(url, config);
    return this.extractData<T>(response);
  }

  // Utility methods
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.axiosInstance.defaults.baseURL = baseURL;
  }

  setTimeout(timeout: number): void {
    this.axiosInstance.defaults.timeout = timeout;
  }

  // Method để set token manually (sau khi login)
  setAuthToken(accessToken: string, refreshToken: string): void {
    this.setTokens(accessToken, refreshToken);
  }

  // Method để logout
  logout(): void {
    this.clearTokens();
  }

  // Method để check authentication status
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

// Export singleton instance
const fetcher = new Fetcher();
export default fetcher;

// Export class for testing or multiple instances
export { Fetcher };

// Export types
export type { ApiResponse, ApiError };