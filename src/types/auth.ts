export interface LoginRequest { email: string; password: string }
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  passportNumber: string;
  phone: string;
}
export interface LoginResponse { token: string; rol: string }