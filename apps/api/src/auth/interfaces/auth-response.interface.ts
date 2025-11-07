import { User } from 'src/user/entity/user.entity';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password'>;
  message: string;
}

export interface LoginResponse {
  accessToken: string;
  user: Omit<User, 'password'>;
  message: string;
}

export interface RefreshResponse {
  accessToken: string;
}

export interface LogoutResponse {
  message: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
}