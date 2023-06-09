import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import { ReactElement, useEffect, useState } from "react";

import { findAllBreedsByCategory, IPetBreed } from "@/services/petBreedService";
import {
  findAllPetCategories,
  IPetCategory,
} from "@/services/petCategoryService";
import { findAllPetsWithRelations, IPet } from "@/services/petService";
import {
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

export default function Products(): ReactElement {
  // TODO implement useReducer
  const [initialPets, setInitialPets] = useState<IPet[]>([]);
  const [categories, setCategories] = useState<IPetCategory[]>([]);
  const [category, setCategory] = useState("");
  const [breeds, setBreeds] = useState<IPetBreed[]>([]);
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pets, setPets] = useState<IPet[]>([]);
  const [listLoading, setListLoading] = useState(true);

  // TODO bundle handle select functions
  const handleCategorySelect = async (
    event: SelectChangeEvent<string>,
  ): Promise<void> => {
    setListLoading(true);
    setCategory(event.target.value);
    setBreeds([]);

    if (event.target.value != "all") {
      const petsFromCategory = initialPets.filter(
        (pet) => pet.categoryId === event.target.value,
      );

      setPets(petsFromCategory);

      const petBreeds: IPetBreed[] | undefined = await findAllBreedsByCategory(
        event.target.value,
      );

      if (petBreeds) {
        setBreeds(petBreeds);
      }
    } else {
      setPets(initialPets);
    }
    setListLoading(false);
  };

  const handleBreedSelect = async (
    event: SelectChangeEvent<string>,
  ): Promise<void> => {
    setListLoading(true);
    setBreed(event.target.value);

    if (event.target.value != "all") {
      const petsFromBreed = initialPets.filter(
        (pet) => pet.breedId === event.target.value,
      );

      setPets(petsFromBreed);
    } else {
      const petsFromCategory = initialPets.filter(
        (pet) => pet.categoryId === category,
      );

      setPets(petsFromCategory);
    }
    setListLoading(false);
  };

  const handleAgeSelect = async (
    event: SelectChangeEvent<string>,
  ): Promise<void> => {
    setAge(event.target.value);

    // TODO filter pets from AGE
  };

  const handleSizeSelect = async (
    event: SelectChangeEvent<string>,
  ): Promise<void> => {
    setSize(event.target.value);

    // TODO filter pets from SIZE
  };

  const handleCountrySelect = async (
    event: SelectChangeEvent<string>,
  ): Promise<void> => {
    setCountry(event.target.value);

    // TODO filter pets from SIZE
  };

  const handleStateSelect = async (
    event: SelectChangeEvent<string>,
  ): Promise<void> => {
    setState(event.target.value);

    // TODO filter pets from SIZE
  };

  const handleCitySelect = async (
    event: SelectChangeEvent<string>,
  ): Promise<void> => {
    setCity(event.target.value);

    // TODO filter pets from SIZE
  };

  const getAge = (birthdate: string): string | undefined => {
    const now = dayjs();
    const birth = dayjs(birthdate);
    const years = now.diff(birth, "y");
    const months = Math.floor(now.diff(birth, "M", true) % 12);

    if (years < 1 && months < 2) {
      return `${months} month`;
    }
    if (years < 1 && months > 1) {
      return `${months} months`;
    }

    if (years == 1) {
      return `${years} year and ${months} month`;
    }
    if (years > 1) {
      return `${years} years and ${months} months`;
    }
  };

  useEffect(() => {
    (async (): Promise<void> => {
      if (initialPets.length === 0) {
        const initialPets = await findAllPetsWithRelations();

        if (initialPets) {
          setInitialPets(initialPets);
          setPets(initialPets);
        }
        setListLoading(false);
      }

      if (categories.length === 0) {
        const petCategories: IPetCategory[] | undefined =
          await findAllPetCategories();

        if (petCategories) {
          setCategories(petCategories);
        }
      }
    })();
  }, [pets, categories, initialPets]);

  return (
    <>
      <Head>
        <title>Caramelo - Pet on the web</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center w-screen h-screen">
        <div className="container xl:max-w-screen-xl p-0 flex flex-col">
          <div className="bg-orange-400">selects</div>
          {!listLoading ? (
            <List className="grid grid-cols-4 h-max">
              {pets.map((pet) => (
                <ListItem key={pet.id} className="flex p-3 items-start">
                  <Avatar
                    className="object-contain border border-orange-400"
                    alt={pet?.name ? `${pet.name}'s avatar` : "Pet avatar"}
                    src={
                      pet?.avatar &&
                      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                    }
                    sx={{
                      width: 80,
                      height: 80,
                      fontSize: 80,
                      objectFit: "contain",
                    }}
                  />
                  <div className="flex px-3 items-start flex-wrap">
                    <Typography variant="h6">{pet.name}</Typography>
                    <Typography variant="body1">
                      Category: {pet.Category?.name}
                    </Typography>
                    <Typography variant="body1">
                      Breed: {pet.Breed?.name}
                    </Typography>
                    <Typography variant="body1">
                      Birthdate: {getAge(pet.birthdate)}
                    </Typography>
                    <Typography variant="body1">
                      Guardian: {pet.Guardian?.name}
                    </Typography>
                  </div>
                </ListItem>
              ))}
              {pets.length === 0 && (
                <ListItem>
                  <Typography variant="body1">
                    No pets meet the criteria
                  </Typography>
                </ListItem>
              )}
            </List>
          ) : (
            <CircularProgress className="m-auto" />
          )}
        </div>
      </main>
    </>
  );
}
