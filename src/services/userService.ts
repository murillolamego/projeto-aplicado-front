import axios from "axios";

import { IUser } from "@/contexts/UserSignupContext";

import { IPet } from "./petService";

export async function signUp(
  { email, name, password, city, state, country, phone }: IUser,
  avatar: File,
): Promise<IUser | undefined> {
  const data = new FormData();

  data.append("email", email);
  data.append("name", name);
  data.append("password", password);
  if (phone) {
    data.append("phone", phone);
  }
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

export async function findUserById(id: string): Promise<IUser | undefined> {
  try {
    const response = await axios.get<IUser>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/users/${id}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function getUserPets(id: string): Promise<IPet[] | undefined> {
  try {
    const response = await axios.get<IPet[]>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/users/${id}/pets`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
