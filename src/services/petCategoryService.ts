import axios from "axios";

export interface IPetCategory {
  id: string;
  name: string;
  about: string;
}

export async function findAllPetCategories(): Promise<
  IPetCategory[] | undefined
> {
  try {
    const response = await axios.get<IPetCategory[]>(
      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/categories`,
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}
