import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';

interface User {
  userId: string;
  role: 'manager' | 'employee';
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  //  const navigate=useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser({ userId: decoded.userId, role: decoded.role, name: decoded.name, email: decoded.email });
      } catch (e) {
        console.error('Invalid token');
        logout();
      }
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // const logout = () => {
  //   localStorage.removeItem('token');
  //   setToken(null);
  //   setUser(null);
  // };

  const logout = () => {
    console.log('🚪 Logging out...');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    //  navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
