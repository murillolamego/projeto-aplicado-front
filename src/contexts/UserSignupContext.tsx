import { createContext, ReactElement, useEffect, useState } from "react";

import {
  getCountriesAndStates,
  ICountry,
  IState,
} from "@/services/geolocationService";

export interface IUser {
  name: string;
  email: string;
  password: string;
  city?: string;
  state?: string;
  country: string;
  avatar?: string;
  phone?: string;
}

interface IUserSignupContext {
  user: IUser;
  setUser: (data: IUser) => void;
  countries: ICountry[];
  setCountries: (data: ICountry[]) => void;
  states: IState[];
  setStates: (data: IState[]) => void;
  cities: string[];
  setCities: (data: string[]) => void;
  file: File | null;
  setFile: (data: File) => void;
}

interface IProps {
  children?: React.ReactNode;
}

export const UserSignupContext = createContext({} as IUserSignupContext);

export function UserSignupProvider({ children }: IProps): ReactElement {
  const [user, setUser] = useState<IUser>({
    email: "",
    name: "",
    password: "",
    city: "",
    state: "",
    country: "",
  });
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (countries.length === 0) {
      (async (): Promise<void> => {
        const countries = await getCountriesAndStates();

        if (countries) {
          setCountries(countries);
        }
      })();
    }
  }, [countries, setCountries]);

  return (
    <UserSignupContext.Provider
      value={{
        user,
        setUser,
        countries,
        setCountries,
        states,
        setStates,
        cities,
        setCities,
        file,
        setFile,
      }}
    >
      {children}
    </UserSignupContext.Provider>
  );
}
