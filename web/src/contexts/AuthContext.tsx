import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AuthState, User } from '@/lib/types';
import { authApi, setAuthToken, removeAuthToken, getAuthToken } from '@/lib/requests';

// Action types
type AuthAction =
    | { type: 'AUTH_START' }
    | { type: 'AUTH_SUCCESS'; payload: User }
    | { type: 'AUTH_FAILURE'; payload: string }
    | { type: 'AUTH_LOGOUT' }
    | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'AUTH_START':
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null,
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: action.payload,
            };
        case 'AUTH_LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            };
        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
}

// Context
interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<boolean>;
    register: (userData: any) => Promise<boolean>;
    logout: () => void;
    clearError: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = getAuthToken();
        if (!token) {
            dispatch({ type: 'AUTH_FAILURE', payload: '' });
            return;
        }

        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authApi.getCurrentUser();

            if (response.success && response.data) {
                dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
            } else {
                removeAuthToken();
                dispatch({ type: 'AUTH_FAILURE', payload: response.error || 'Authentication failed' });
            }
        } catch (error) {
            removeAuthToken();
            dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
        }
    };

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authApi.login({ email, password });

            if (response.success && response.data) {
                setAuthToken(response.data.token);
                dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
                return true;
            } else {
                dispatch({ type: 'AUTH_FAILURE', payload: response.error || 'Login failed' });
                return false;
            }
        } catch (error) {
            dispatch({ type: 'AUTH_FAILURE', payload: 'Login failed' });
            return false;
        }
    };

    const register = async (userData: any): Promise<boolean> => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authApi.register(userData);

            if (response.success && response.data) {
                setAuthToken(response.data.token);
                dispatch({ type: 'AUTH_SUCCESS', payload: response.data.user });
                return true;
            } else {
                dispatch({ type: 'AUTH_FAILURE', payload: response.error || 'Registration failed' });
                return false;
            }
        } catch (error) {
            dispatch({ type: 'AUTH_FAILURE', payload: 'Registration failed' });
            return false;
        }
    };

    const logout = () => {
        removeAuthToken();
        dispatch({ type: 'AUTH_LOGOUT' });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const value: AuthContextType = {
        ...state,
        login,
        register,
        logout,
        clearError,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 