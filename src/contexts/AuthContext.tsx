import { createContext } from "react";

interface IAuthContext {
  isAuthenticated: false;
}

interface ISignInData {
  email: string;
  password: string;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }) {
  const isAuthenticated = false;

  async function signIn({ email, password }: ISignInData) {}

  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
