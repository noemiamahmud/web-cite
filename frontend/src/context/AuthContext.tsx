import { createContext, useContext, useState } from "react";

type User = {
  id: string;
  username: string;
  email: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: (u: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
