import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from local storage
        const storedUser = localStorage.getItem('campuspulse_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage");
            }
        }
        setLoading(false);
    }, []);

    const login = async (fullName, email, password) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                if (email && password) {
                    const mockUser = {
                        email,
                        name: fullName || email.split('@')[0],
                        id: Math.random().toString(36).substr(2, 9)
                    };
                    setUser(mockUser);
                    localStorage.setItem('campuspulse_user', JSON.stringify(mockUser));
                    resolve(mockUser);
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 800);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('campuspulse_user');
        window.location.hash = '#'; // Redirect to landing page
    };

    const value = {
        user,
        loading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
