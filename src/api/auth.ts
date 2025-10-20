import axios from './axios';
import { LoginRequest, LoginResponse, RegisterRequest } from '../types/auth'

export const login = (data: LoginRequest) =>
  axios.post<LoginResponse>('/auth/login', data).then((r) => r.data);

export const register = (data: RegisterRequest) =>
  axios.post<void>('/auth/register', data).then((r) => r.data);