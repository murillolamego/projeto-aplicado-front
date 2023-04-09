import axios from "axios";

import { IUser } from "@/contexts/UserSignupContext";

export async function signUp(user: IUser): Promise<IUser | undefined> {
  try {
    const { data } = await axios.post<IUser>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/users`,
      user,
    );

    return data;
  } catch (error) {
    console.error(error);
  }
}
