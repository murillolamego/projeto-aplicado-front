import jwt_decode from "jwt-decode";
import { useRouter } from "next/router";
import { setCookie, parseCookies } from "nookies";
import { createContext, ReactElement, useEffect, useState } from "react";

import { refreshRequest, signInRequest } from "@/services/authService";

interface IUser {
  sub: string;
  email: string;
  exp: number;
}

export interface ISignInData {
  email: string;
  password: string;
}
interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser | null;
  signIn: (data: ISignInData) => Promise<void>;
}

interface IProps {
  children?: React.ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthProvider({ children }: IProps): ReactElement {
  const [user, setUser] = useState<IUser | null>(null);

  const router = useRouter();

  const isAuthenticated = !!user;

  async function validateToken(currentAccessToken: string): Promise<void> {
    console.log("VALIDATE TOKEN");

    const user = jwt_decode<IUser>(currentAccessToken);

    const expirationTime = user?.exp * 1000; // timestamp

    console.log("EXP TIME", expirationTime);

    const now = new Date().getTime();

    console.log("NOW", now);

    console.log("NOW > EXP TIME", now > expirationTime);

    if (expirationTime && now > expirationTime) {
      console.log("SHOULD REFRESH TOKEN");
      const { "projeto-aplicado-refreshtoken": token } = parseCookies();

      console.log("REFRESH TOKEN", token);

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

          console.log("UPDATED USER", user);
          return;
        }
      })();
    } else {
      console.log("TOKEN IS VALID");
      setUser(user);

      console.log("UPDATED USER 2", user);
    }
  }

  useEffect(() => {
    console.log("USE EFFECT");
    const { "projeto-aplicado-accesstoken": currentAccessToken } =
      parseCookies();
    console.log("CURRENT TOKEN", currentAccessToken);
    if (!currentAccessToken) {
      console.log("NOT LOGGED IN");
      return;
    }
    console.log("ALREADY LOGGED IN");

    (async (): Promise<void> => {
      console.log("SHOULD VALIDATE TOKEN");
      await validateToken(currentAccessToken);
    })();
  }, []);

  async function signIn({ email, password }: ISignInData): Promise<void> {
    console.log("SIGN IN");
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

      console.log("USER", user);

      router.push("/dashboard");
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
