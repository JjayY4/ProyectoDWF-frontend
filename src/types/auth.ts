export interface LoginRequest { 
  email: string; 
  password: string; 
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  passportNumber: string;
  phone: string;
}

export interface User {
  id: number;
  name: string;
  email: string;

}

export interface LoginResponse { 
  token: string; 
  rol: string;
  user?: User;
}