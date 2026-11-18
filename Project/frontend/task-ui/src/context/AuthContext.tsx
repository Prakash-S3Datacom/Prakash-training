
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

import {
    getCurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    type User,
    type LoginInput,
    type RegisterInput
} from "../services/authService";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Check whether the user already has a valid login cookie.
    useEffect(() => {
        getCurrentUser()
            .then((currentUser) => {
                setUser(currentUser);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    async function login(input: LoginInput): Promise<void> {
        const loggedInUser = await loginUser(input);
        setUser(loggedInUser);
    }

    async function register(input: RegisterInput): Promise<User> {
        return await registerUser(input);
    }

    async function logout(): Promise<void> {
        try {
            await logoutUser();
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}

