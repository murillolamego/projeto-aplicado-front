import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import { ReactElement, useEffect, useState } from "react";

import { findAllBreedsByCategory, IPetBreed } from "@/services/petBreedService";
import {
  findAllPetCategories,
  IPetCategory,
} from "@/services/petCategoryService";
import {
  findAllPetsProcreationWithRelations,
  findAllPetsWithRelations,
  IPet,
} from "@/services/petService";
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

export default function Adoption(): ReactElement {
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
        const initialPets = await findAllPetsProcreationWithRelations();

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
        <title>Caramelo - Find a pair!</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex p-0 justify-center relative">
        <div className="bg-primary w-3/4 -z-10 h-full absolute top-0 right-0"></div>
        <div className="container xl:max-w-screen-xl p-0 flex">
          <div className="flex flex-col h-full items-start pr-10 w-[60%] bg-white px-3 text-white">
            <div className="relative w-24 h-24 lg:w-64 lg:h-64">
              <Image
                className="object-contain"
                src="/love.svg"
                alt="Drawing of animals"
                fill
                priority
              />
            </div>
            <Typography
              variant="h5"
              className="text-center font-bold text-[#31676B]"
            >
              Find a pair!
            </Typography>
            <Box sx={{ minWidth: 120 }} className="w-full">
              <FormControl fullWidth className="my-3">
                <InputLabel id="demo-simple-category-select-label">
                  Category
                </InputLabel>
                <Select
                  labelId="demo-simple-category-select-label"
                  id="demo-simple-category-select"
                  disabled={categories.length === 0}
                  label="Category"
                  value={
                    category && categories.some((e) => e.id === category)
                      ? category
                      : "all"
                  }
                  onChange={(event): Promise<void> =>
                    handleCategorySelect(event)
                  }
                >
                  <MenuItem key={"all"} value={"all"}>
                    all
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth className="my-3">
                <InputLabel id="demo-simple-breed-select-label">
                  Breed
                </InputLabel>
                <Select
                  labelId="demo-simple-breed-select-label"
                  id="demo-simple-breed-select"
                  disabled={breeds.length === 0}
                  label="Breed"
                  value={
                    breed && breeds.some((e) => e.id === breed) ? breed : "all"
                  }
                  onChange={(event): Promise<void> => handleBreedSelect(event)}
                >
                  <MenuItem key={"all"} value={"all"}>
                    all
                  </MenuItem>
                  {breeds.map((breed) => (
                    <MenuItem key={breed.id} value={breed.id}>
                      {breed.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth className="my-3">
                <InputLabel id="demo-simple-age-select-label">Age</InputLabel>
                <Select
                  labelId="demo-simple-age-select-label"
                  id="demo-simple-age-select"
                  label="Age"
                  disabled={pets.length === 0}
                  value="all"
                  onChange={(event): Promise<void> => handleAgeSelect(event)}
                >
                  <MenuItem value={"all"}>all</MenuItem>
                  <MenuItem value={10}>0 - 6 months</MenuItem>
                  <MenuItem value={20}>6 months - 1 year</MenuItem>
                  <MenuItem value={30}>1 - 2 years</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth className="my-3">
                <InputLabel id="demo-simple-size-select-label">Size</InputLabel>
                <Select
                  labelId="demo-simple-size-select-label"
                  id="demo-simple-size-select"
                  label="Size"
                  disabled={pets.length === 0}
                  value="all"
                  onChange={(event): Promise<void> => handleSizeSelect(event)}
                >
                  <MenuItem value={"all"}>all</MenuItem>
                  <MenuItem value={"small"}>small</MenuItem>
                  <MenuItem value={"medium"}>medium</MenuItem>
                  <MenuItem value={"large"}>large</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Typography
              variant="h5"
              className="text-center font-bold text-[#31676B]"
            >
              Location
            </Typography>
            <Box sx={{ minWidth: 120 }} className="w-full">
              <FormControl fullWidth className="my-3">
                <InputLabel id="demo-simple-country-select-label">
                  Country
                </InputLabel>
                <Select
                  labelId="demo-simple-country-select-label"
                  id="demo-simple-country-select"
                  disabled={categories.length === 0}
                  label="Country"
                  value={
                    category && categories.some((e) => e.id === category)
                      ? category
                      : "all"
                  }
                  onChange={(event): Promise<void> =>
                    handleCountrySelect(event)
                  }
                >
                  <MenuItem key={"all"} value={"all"}>
                    all
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth className="my-3">
                <InputLabel id="demo-simple-state-select-label">
                  State
                </InputLabel>
                <Select
                  labelId="demo-simple-state-select-label"
                  id="demo-simple-state-select"
                  disabled={breeds.length === 0}
                  label="State"
                  value={
                    breed && breeds.some((e) => e.id === breed) ? breed : "all"
                  }
                  onChange={(event): Promise<void> => handleStateSelect(event)}
                >
                  <MenuItem key={"all"} value={"all"}>
                    all
                  </MenuItem>
                  {breeds.map((breed) => (
                    <MenuItem key={breed.id} value={breed.id}>
                      {breed.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth className="my-3">
                <InputLabel id="demo-simple-city-select-label">City</InputLabel>
                <Select
                  labelId="demo-simple-city-select-label"
                  id="demo-simple-city-select"
                  label="City"
                  disabled={pets.length === 0}
                  value="all"
                  onChange={(event): Promise<void> => handleCitySelect(event)}
                >
                  <MenuItem value={"all"}>all</MenuItem>
                  <MenuItem value={10}>0 - 6 months</MenuItem>
                  <MenuItem value={20}>6 months - 1 year</MenuItem>
                  <MenuItem value={30}>1 - 2 years</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          {!listLoading ? (
            <List
              className="flex-auto w-[240%] h-max p-10 grid grid-cols-2 auto-rows-fr gap-6"
              disablePadding
            >
              {pets.map((pet) => (
                <ListItem
                  key={pet.id}
                  className="flex p-0 items-start w-full h-full bg-white rounded-3xl overflow-hidden flex-1"
                >
                  <div className="flex w-full h-auto flex-1 justify-self-stretch self-stretch relative">
                    <div className="mx-10 w-full h-full">
                      <Image
                        className="object-cover border-2 border-white rounded-l-3xl"
                        src="https://images.unsplash.com/photo-1589965716319-4a041b58fa8a"
                        alt="Drawing of a french bulldog sitting looking back at you"
                        fill
                        priority
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-3 items-start flex-wrap">
                    <Typography variant="h4">{pet.name}</Typography>
                    <Typography variant="body1">
                      Category: {pet.Category?.name}
                    </Typography>
                    <Typography variant="body1">
                      Breed: {pet.Breed?.name}
                    </Typography>
                    <Typography variant="body1">
                      Age: {getAge(pet.birthdate)}
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