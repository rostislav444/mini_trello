import React, {useEffect, useState} from "react";
import {User} from "interfaces/user";


interface UserContextType {
    user: User | null;
    token: string | null;
    login: (user: User, token: string) => void;
    logout: () => void;
}

interface UserProviderProps {
    children: React.ReactNode;
}

export const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (user && token) {
            setUser(JSON.parse(user));
            setToken(token);
        }
    }, []);

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const login = (user: User, token: string) => {
        setUser(user);
        setToken(token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', token);
    };

    return (
        <UserContext.Provider value={{
            user,
            token,
            login,
            logout
        }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = React.useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}