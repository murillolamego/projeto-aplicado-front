import axios from "axios";

import { IUser } from "@/contexts/UserSignupContext";

export async function signUp(
  { email, name, password, city, state, country }: IUser,
  avatar: File,
): Promise<IUser | undefined> {
  const data = new FormData();

  data.append("email", email);
  data.append("name", name);
  data.append("password", password);
  if (avatar) {
    data.append("file", avatar);
  }
  if (city) {
    data.append("city", city);
  }
  if (state) {
    data.append("state", state);
  }
  data.append("country", country);

  console.log("FORM DATA", data);

  try {
    const response = await axios.post<IUser>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/users`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
