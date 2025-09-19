import api from './api';

export interface LoginCredentials {
  email?: string;
  password?: string;
  contactInfo?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullname: string;
  contactInfo?: string;
}

export interface OTPData {
  email?: string;
  contactInfo?: string;
  otp: string;
}

export interface AuthResponse {
  token: string;
  user: {
    userProfileId: number;
    email: string;
    fullname: string;
    contactInfo?: string;
    serviceAreaId?: number;
  };
}

// New UserDetails interface matching backend response including userProfileId
export interface UserDetails {
  id: string;
  userProfileId: number;
  email: string;
  fullname: string;
  contactInfo?: string;
  serviceAreaId?: number;
}

export interface BusinessDashboardItem {
  buIconPath: string;
  name: string;
}

export interface BusinessDashboardResponse {
  userBusinessProfileDTOList: any[];
  buIconDetails: BusinessDashboardItem[];
  roles: string[];
  colorTheam: string;
}

export const authService = {
  // Email/Password Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/public/login', credentials);
    return response.data;
  },

  // Mobile Login
  loginWithMobile: async (contactInfo: string): Promise<{ otpSent: boolean }> => {
    const response = await api.post('/public/loginM', { contactInfo });
    return response.data;
  },

  // User Registration
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/public/registerUser', userData);
    return response.data;
  },

  // Send Mobile OTP
  sendMobileOTP: async (contactInfo: string): Promise<{ otpSent: boolean }> => {
    const response = await api.post('/public/registerUser/sendMobileOTP', { contactInfo });
    return response.data;
  },

  // Send Email OTP
  sendEmailOTP: async (email: string): Promise<{ otpSent: boolean }> => {
    const response = await api.post('/public/registerUser/sendEmailOTP', { email });
    return response.data;
  },

  // Verify OTP
  verifyOTP: async (otpData: OTPData): Promise<{ verified: boolean }> => {
    const response = await api.post('/public/registerUser/verifyOTP', otpData);
    return response.data;
  },

  // Get User Details - updated to return UserDetails interface
  getUserDetails: async (): Promise<UserDetails> => {
    const response = await api.get('/api/user/getUserDetails');
    return response.data;
  },

  // Load Business Dashboard
  loadBusinessDashboard: async (userProfileId: number): Promise<BusinessDashboardResponse> => {
    const response = await api.get(`/api/user/loadBusinessDashboard/${userProfileId}`);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  // Save auth data
  saveAuthData: (token: string, user: AuthResponse['user']) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get user from localStorage
  getUser: (): AuthResponse['user'] | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
