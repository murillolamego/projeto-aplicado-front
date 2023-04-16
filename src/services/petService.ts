import axios from "axios";

import { IPetBreed } from "./petBreedService";
import { IPetCategory } from "./petCategoryService";

export interface IPet {
  id?: string;
  username: string;
  name: string;
  birthdate: string;
  avatar: string;
  categoryId: string;
  Category?: IPetCategory;
  breedId: string;
  Breed?: IPetBreed;
}

export async function addPet(
  { username, name, birthdate, categoryId, breedId }: IPet,
  avatar: File,
): Promise<IPet | undefined> {
  const data = new FormData();

  data.append("username", username);
  data.append("name", name);
  data.append("birthdate", birthdate);
  if (avatar) {
    data.append("file", avatar);
  }
  data.append("categoryId", categoryId);
  data.append("breedId", breedId);

  try {
    const response = await axios.post<IPet>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/pets`,
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

export async function findPetById(id: string): Promise<IPet | undefined> {
  try {
    const response = await axios.get<IPet>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/pets/${id}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function findPetByUsername(
  username: string,
): Promise<IPet | undefined> {
  try {
    const response = await axios.get<IPet>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/pets/username/${username}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
