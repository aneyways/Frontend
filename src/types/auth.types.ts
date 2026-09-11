export interface LoginDto {
  userName: string;
  password: string;
}

export interface RegisterDto {
  userName: string;
  password: string;
  email: string;
}

export interface AuthResponse {
  token: string;
}

export interface TokenPayload {
  id: number;
  userName: string;
  email: string;
  role: number;
  exp: number;
}