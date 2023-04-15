import axios from "axios";

export interface IPetCategory {
  id: string;
  name: string;
  about: string;
}

export interface IPetBreed {
  id: string;
  name: string;
  about: string;
}

export interface IPet {
  id: string;
  username: string;
  name: string;
  age: number;
  Category: IPetCategory;
  Breed: IPetBreed;
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
