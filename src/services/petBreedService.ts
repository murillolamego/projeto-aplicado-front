import axios from "axios";

export interface IPetBreed {
  id: string;
  name: string;
  about: string;
}

export async function findAllBreedsByCategory(
  id: string,
): Promise<IPetBreed[] | undefined> {
  try {
    const response = await axios.get<IPetBreed[]>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/breeds/category/${id}`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
