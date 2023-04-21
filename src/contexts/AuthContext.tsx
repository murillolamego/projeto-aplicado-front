import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { setCookie, parseCookies } from "nookies";
import { createContext, ReactElement, useEffect, useState } from "react";

import { refreshRequest, signInRequest } from "@/services/authService";
import { IPet } from "@/services/petService";

interface IUser {
  sub: string;
  email: string;
  exp: number;
  addressId: string;
  avatar?: string;
  createdAt: string;
  enabled: boolean;
  name: string;
  phone?: string;
  pets?: IPet[];
  follows?: IPet[];
}

export interface ISignInData {
  email: string;
  password: string;
}
interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser | null;
  setUser: (data: IUser) => void;
  signIn: (data: ISignInData) => Promise<void>;
}

interface IProps {
  children?: React.ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }: IProps): ReactElement {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!user);

  const router = useRouter();

  async function validateToken(currentAccessToken: string): Promise<void> {
    const user = jwt_decode<IUser>(currentAccessToken);

    const expirationTime = user?.exp * 1000; // timestamp

    const now = new Date().getTime();

    if (expirationTime && now > expirationTime) {
      const { "projeto-aplicado-refreshtoken": token } = parseCookies();

      await (async (): Promise<void> => {
        const data = await refreshRequest(token);

        if (data) {
          setCookie(
            undefined,
            "projeto-aplicado-accesstoken",
            data.accessToken,
            {
              maxAge: 60 * 60 * 1, // 1 hour
            },
          );

          setCookie(
            undefined,
            "projeto-aplicado-refreshtoken",
            data.refreshToken,
            {
              maxAge: 60 * 60 * 1, // 1 hour
            },
          );

          const user = jwt_decode<IUser>(data.accessToken);

          setUser(user);
          return;
        }
      })();
    } else {
      setUser(user);
    }
  }

  useEffect(() => {
    const { "projeto-aplicado-accesstoken": currentAccessToken } =
      parseCookies();
    if (!currentAccessToken) {
      return;
    }

    (async (): Promise<void> => {
      await validateToken(currentAccessToken);
    })();
  }, []);

  async function signIn({ email, password }: ISignInData): Promise<void> {
    const data = await signInRequest({
      email,
      password,
    });

    if (data) {
      setCookie(undefined, "projeto-aplicado-accesstoken", data.accessToken, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      setCookie(undefined, "projeto-aplicado-refreshtoken", data.refreshToken, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      const user = jwt_decode<IUser>(data.accessToken);

      setUser(user);

      router.push("/user");
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
