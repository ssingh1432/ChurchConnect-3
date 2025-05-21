import { apiRequest } from './queryClient';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// Local storage keys
const TOKEN_KEY = 'church_app_token';
const USER_KEY = 'church_app_user';

// Helper functions
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getStoredUser = (): User | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

// Auth functions
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const res = await apiRequest('POST', '/api/auth/login', data);
  const json = await res.json();
  
  setToken(json.token);
  setStoredUser(json.user);
  
  return json;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await apiRequest('POST', '/api/auth/register', data);
  const json = await res.json();
  
  setToken(json.token);
  setStoredUser(json.user);
  
  return json;
};

export const logout = (): void => {
  removeToken();
  removeStoredUser();
  window.location.href = '/';
};

export const getCurrentUser = async (): Promise<User> => {
  const res = await apiRequest('GET', '/api/auth/me');
  const json = await res.json();
  
  setStoredUser(json.user);
  
  return json.user;
};

// React hook for authentication
export const useAuth = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(getStoredUser());
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!getToken());

  useEffect(() => {
    const checkAuth = async () => {
      if (!getToken()) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid auth state
        logout();
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please login again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [toast]);

  const loginUser = async (data: LoginData) => {
    try {
      const response = await login(data);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const registerUser = async (data: RegisterData) => {
    try {
      const response = await register(data);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    loading,
    isAuthenticated,
    isAdmin,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
  };
};
