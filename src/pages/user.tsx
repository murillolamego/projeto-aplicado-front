import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSnackbar } from "notistack";
import { ReactElement, useContext, useEffect, useState, Fragment } from "react";

import { IMAGE_TYPE } from "@/components/forms/formUserMoreInfo";
import { AuthContext } from "@/contexts/AuthContext";
import { IUser } from "@/contexts/UserSignupContext";
import { findAllBreedsByCategory, IPetBreed } from "@/services/petBreedService";
import {
  findAllPetCategories,
  IPetCategory,
} from "@/services/petCategoryService";
import { addPet, IPet } from "@/services/petService";
import {
  findUserById,
  getUserFollows,
  getUserPets,
} from "@/services/userService";
import { PhotoCamera } from "@mui/icons-material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ChatBubbleRoundedIcon from "@mui/icons-material/ChatBubbleRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Avatar,
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export default function Dashboard(): ReactElement {
  const { user, setUser } = useContext(AuthContext);

  const [pet, setPet] = useState<IPet>({
    username: "",
    name: "",
    birthdate: "",
    avatar: "",
    categoryId: "",
    breedId: "",
    guardianId: "",
  });

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [petCategories, setPetCategories] = useState<IPetCategory[]>([]);

  const [petBreeds, setPetBreeds] = useState<IPetBreed[]>([]);

  const [file, setFile] = useState<File | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const [openCreatePet, setOpenCreatePet] = useState(false);
  const handleOpen = (): void => setOpenCreatePet(true);
  const handleClose = (): void => setOpenCreatePet(false);

  const handleAddPet = async (): Promise<void> => {
    console.log("ADD PET");
    const data = await addPet(pet, file);

    if (user && user.pets && data) {
      setUser({ ...user, pets: [...user.pets, data] });
      enqueueSnackbar({
        message: "Pet successfully added",
        variant: "success",
      });
      handleClose();
    } else {
      enqueueSnackbar({
        message: "Failed to add pet",
        variant: "error",
      });
    }
  };

  const fileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file?.type.match(IMAGE_TYPE)) {
        enqueueSnackbar({
          message: "Image type not supported",
          variant: "error",
        });
        return;
      }
      setFile(file);

      let fileReader: FileReader;
      let isCancel = false;
      if (file) {
        fileReader = new FileReader();
        fileReader.onload = (e) => {
          const { result } = e.target;
          if (result && !isCancel) {
            setPet({ ...pet, avatar: result });
            enqueueSnackbar({
              message: "Looks great!",
              variant: "success",
            });
          }
        };
        fileReader.readAsDataURL(file);
      }
      return () => {
        isCancel = true;
        if (fileReader && fileReader.readyState === 1) {
          fileReader.abort();
        }
      };
    }
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        className="w-full h-full"
      >
        {value === index && <>{children}</>}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    console.log("USE EFFECT");
    (async (): Promise<void> => {
      if (user && !user?.name) {
        setPet({ ...pet, guardianId: user.sub });
        const updatedUser: IUser | undefined = await findUserById(user?.sub);

        if (updatedUser) {
          setUser(Object.assign(updatedUser, user));
        }
      }

      if (user && !user.pets) {
        const pets = await getUserPets(user?.sub);

        if (pets) {
          setUser({ ...user, pets });
        }
        console.log("USER with pets", user);
      }

      if (petCategories.length === 0) {
        const petCategories = await findAllPetCategories();

        if (petCategories) {
          setPetCategories(petCategories);
        }
      }

      if (pet.categoryId && petBreeds.length === 0) {
        const petBreeds = await findAllBreedsByCategory(pet.categoryId);

        if (petBreeds) {
          setPetBreeds(petBreeds);
        }
      }

      if (!user?.follows) {
        const userFollows = await getUserFollows(user?.sub);

        if (user && userFollows) {
          setUser({ ...user, follows: userFollows });
        }
      }
    })();
  }, [user, setUser, pet, petCategories, petBreeds]);

  return (
    <>
      <Head>
        <title>Caramelo - {user?.name}&apos;s profile</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="justify-center w-screen h-full min-h-screen relative">
        <div className="w-full h-[calc(100%_-_5.4rem)] bg-primary absolute bottom-0 left-0 -z-10"></div>
        <div className="container xl:max-w-screen-xl mx-auto text-white">
          <div className="flex flex-col items-center justify-center h-40 relative w-fit mx-auto">
            <Avatar
              className="mx-auto object-contain border-4 border-white"
              alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
              src={
                user?.avatar &&
                `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
              }
              sx={{
                width: 140,
                height: 140,
                fontSize: 140,
                objectFit: "contain",
              }}
            />
          </div>
          <Typography variant="h4" className="text-center font-bold my-6">
            User name
          </Typography>
          <Box className="flex flex-col justify-center items-center w-fit mx-auto h-max  overflow-x-hidden">
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                sx={{
                  ".MuiTab-root": {
                    color: "#ffffff !important",
                    fontWeight: "bold",
                  },
                  ".Mui-selected": {
                    color: "#ffffff",
                    fontWeight: "bold",
                  },
                }}
                TabIndicatorProps={{ style: { background: "#ffffff" } }}
              >
                <Tab
                  label="Pets"
                  {...a11yProps(0)}
                  className="hover:bg-hoverDark"
                />
                <Tab
                  label="Following"
                  {...a11yProps(1)}
                  className="hover:bg-hoverDark"
                />
                <Tab
                  label="Likes"
                  {...a11yProps(2)}
                  className="hover:bg-hoverDark"
                />
                <Tab
                  label="Comments"
                  {...a11yProps(3)}
                  className="hover:bg-hoverDark"
                />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <List className="flex flex-col" disablePadding>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
              </List>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <List className="flex flex-col" disablePadding>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className="hover:bg-hoverLight ease-in-out duration-300"
                  disablePadding
                >
                  <Link
                    href={`/pet/${pet.username}`}
                    className="flex items-center space-x-3  w-full p-3 "
                  >
                    <Avatar
                      className="object-contain border-2 border-white"
                      alt={pet?.name ? `${pet.name}'s avatar` : "User avatar"}
                      src={
                        pet?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${pet?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                        cursor: "pointer",
                      }}
                    />
                    <div className="flex items-center space-x-1">
                      <Typography
                        variant="h6"
                        className="text-center font-bold"
                      >
                        Pet Name
                      </Typography>
                      <Typography variant="body1" className="text-center">
                        @petusername
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
              </List>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <List className="flex flex-col h-max w-fit max-w-3xl text-black">
                <ListItem className="flex px-2 py-3 mb-3 items-start bg-white rounded-3xl">
                  <Avatar
                    className="object-contain"
                    alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
                    src={
                      user?.avatar &&
                      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
                    }
                    sx={{
                      width: 50,
                      height: 50,
                      fontSize: 50,
                      objectFit: "contain",
                    }}
                  />
                  <div className="flex px-3 items-start flex-wrap">
                    <div className="flex items-center w-full space-x-2">
                      <Typography variant="h6">{user?.name}</Typography>
                      <Typography
                        variant="body1"
                        className="text-gray-500 text-sm"
                      >
                        @username
                      </Typography>
                      <Typography
                        variant="body1"
                        className="text-gray-500 text-sm"
                      >
                        &#x2022; 40 min
                      </Typography>
                    </div>
                    <Typography variant="body1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aliquam mattis, ante vel pretium vulputate, ligula ipsum
                      eleifend augue, vel sagittis eros risus a felis. Morbi
                      pretium tincidunt lacinia.
                    </Typography>
                  </div>
                  <div className="flex flex-col">
                    <IconButton
                      color="primary"
                      aria-label="Add a pet"
                      component="label"
                      onClick={() => ""}
                      className="flex justify-start"
                    >
                      <FavoriteBorderIcon fontSize="medium" />
                      <Typography
                        variant="body1"
                        className="text-gray-400 ml-1"
                      >
                        99
                      </Typography>
                    </IconButton>
                    <IconButton
                      color="primary"
                      aria-label="Add a pet"
                      component="label"
                      onClick={() => ""}
                      className="flex justify-start"
                    >
                      <ChatBubbleOutlineIcon fontSize="medium" />
                      <Typography
                        variant="body1"
                        className="text-gray-400 ml-1"
                      >
                        170
                      </Typography>
                    </IconButton>
                    <IconButton
                      color="primary"
                      aria-label="Add a pet"
                      component="label"
                      onClick={() => ""}
                      className="flex justify-start"
                    >
                      <MoreHorizIcon fontSize="medium" />
                    </IconButton>
                  </div>
                </ListItem>
                <ListItem className="flex px-2 py-3 mb-3 items-start bg-white rounded-3xl">
                  <Avatar
                    className="object-contain border border-orange-400"
                    alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
                    src={
                      user?.avatar &&
                      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
                    }
                    sx={{
                      width: 50,
                      height: 50,
                      fontSize: 50,
                      objectFit: "contain",
                    }}
                  />
                  <div className="flex px-3 items-start flex-wrap">
                    <div className="flex items-center w-full space-x-2">
                      <Typography variant="h6">{user?.name}</Typography>
                      <Typography
                        variant="body1"
                        className="text-gray-500 text-sm"
                      >
                        @username
                      </Typography>
                      <Typography
                        variant="body1"
                        className="text-gray-500 text-sm"
                      >
                        &#x2022; 40 min
                      </Typography>
                    </div>
                    <Typography variant="body1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aliquam mattis, ante vel pretium vulputate, ligula ipsum
                      eleifend augue, vel sagittis eros risus a felis. Morbi
                      pretium tincidunt lacinia.
                    </Typography>
                  </div>
                  <div className="flex flex-col">
                    <IconButton
                      color="primary"
                      aria-label="Add a pet"
                      component="label"
                      onClick={() => ""}
                      className="flex justify-start"
                    >
                      <FavoriteBorderIcon fontSize="medium" />
                      <Typography
                        variant="body1"
                        className="text-gray-400 ml-1"
                      >
                        99
                      </Typography>
                    </IconButton>
                    <IconButton
                      color="primary"
                      aria-label="Add a pet"
                      component="label"
                      onClick={() => ""}
                      className="flex justify-start"
                    >
                      <ChatBubbleOutlineIcon fontSize="medium" />
                      <Typography
                        variant="body1"
                        className="text-gray-400 ml-1"
                      >
                        170
                      </Typography>
                    </IconButton>
                    <IconButton
                      color="primary"
                      aria-label="Add a pet"
                      component="label"
                      onClick={() => ""}
                      className="flex justify-start"
                    >
                      <MoreHorizIcon fontSize="medium" />
                    </IconButton>
                  </div>
                </ListItem>
                <ListItem className="flex px-2 py-3 mb-3 items-start bg-white rounded-3xl">
                  <Avatar
                    className="object-contain border border-orange-400"
                    alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
                    src={
                      user?.avatar &&
                      `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
                    }
                    sx={{
                      width: 50,
                      height: 50,
                      fontSize: 50,
                      objectFit: "contain",
                    }}
                  />
                  <div className="flex px-3 items-start flex-wrap">
                    <div className="flex items-center w-full space-x-2">
                      <Typography variant="h6">{user?.name}</Typography>
                      <Typography
                        variant="body1"
                        className="text-gray-500 text-sm"
                      >
                        @username
                      </Typography>
                      <Typography
                        variant="body1"
                        className="text-gray-500 text-sm"
                      >
                        &#x2022; 40 min
                      </Typography>
                    </div>
                    <div className="flex w-full h-80 my-3 relative rounded-3xl">
                      <Image
                        className="object-contain"
                        src="/dog.png"
                        alt="Drawing of a french bulldog sitting looking back at you"
                        fill
                        priority
                      />
                    </div>
                    <Typography variant="body1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Aliquam mattis, ante vel pretium vulputate, ligula ipsum
                      eleifend augue, vel sagittis eros risus a felis. Morbi
                      pretium tincidunt lacinia.
                    </Typography>
                  </div>
                  <div className="flex flex-col">
                    <IconButton
                      color="primary"
                      aria-label="Add a pet"
                      component="label"
                      onClick={() => ""}
                      className="flex justify-start"
                    >
                      <FavoriteBorderIcon fontSize="medium" />
                      <Typography
                        variant="body1"
                        className="text-gray-400 ml-1"
                      >
                        99
                      </Typography>
                    </IconButton>
                    <IconButton
                      color="primary"
                      aria-label="Add a pet"
                      component="label"
                      onClick={() => ""}
                      className="flex justify-start"
                    >
                      <ChatBubbleOutlineIcon fontSize="medium" />
                      <Typography
                        variant="body1"
                        className="text-gray-400 ml-1"
                      >
                        170
                      </Typography>
                    </IconButton>
                    <IconButton
                      color="primary"
                      aria-label="Add a pet"
                      component="label"
                      onClick={() => ""}
                      className="flex justify-start"
                    >
                      <MoreHorizIcon fontSize="medium" />
                    </IconButton>
                  </div>
                </ListItem>
              </List>
            </TabPanel>
            <TabPanel value={value} index={3}>
              <List className="flex flex-col h-max w-fit max-w-3xl text-black">
                <ListItem className="flex flex-col px-2 pt-3 mb-3 items-start bg-white rounded-3xl">
                  <div className="flex items-start">
                    <Avatar
                      className="object-contain"
                      alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
                      src={
                        user?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                      }}
                    />
                    <div className="flex px-3 items-start flex-wrap mb-3">
                      <div className="flex items-center w-full space-x-2">
                        <Typography variant="h6">{user?.name}</Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          @username
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          &#x2022; 40 min
                        </Typography>
                      </div>
                      <Typography variant="body1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aliquam mattis, ante vel pretium vulputate, ligula ipsum
                        eleifend augue, vel sagittis eros risus a felis. Morbi
                        pretium tincidunt lacinia.
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <FavoriteBorderIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          99
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <ChatBubbleOutlineIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          170
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <MoreHorizIcon fontSize="medium" />
                      </IconButton>
                    </div>
                  </div>
                  <div className="flex px-2 py-3 mb-3 items-start bg-white rounded-3xl border-2 border-gray-200">
                    <Avatar
                      className="object-contain"
                      alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
                      src={
                        user?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                      }}
                    />
                    <div className="flex px-3 items-start flex-wrap">
                      <div className="flex items-center w-full space-x-2">
                        <Typography variant="h6">{user?.name}</Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          @username
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          &#x2022; 40 min
                        </Typography>
                      </div>
                      <Typography variant="body1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aliquam mattis, ante vel pretium vulputate, ligula ipsum
                        eleifend augue, vel sagittis eros risus a felis. Morbi
                        pretium tincidunt lacinia.
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <FavoriteBorderIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          99
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <ChatBubbleOutlineIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          170
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <MoreHorizIcon fontSize="medium" />
                      </IconButton>
                    </div>
                  </div>
                </ListItem>
                <ListItem className="flex flex-col px-2 pt-3 mb-3 items-start bg-white rounded-3xl">
                  <div className="flex items-start">
                    <Avatar
                      className="object-contain"
                      alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
                      src={
                        user?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                      }}
                    />
                    <div className="flex px-3 items-start flex-wrap mb-3">
                      <div className="flex items-center w-full space-x-2">
                        <Typography variant="h6">{user?.name}</Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          @username
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          &#x2022; 40 min
                        </Typography>
                      </div>
                      <div className="flex w-full h-80 my-3 relative rounded-3xl">
                        <Image
                          className="object-contain"
                          src="/dog.png"
                          alt="Drawing of a french bulldog sitting looking back at you"
                          fill
                          priority
                        />
                      </div>
                      <Typography variant="body1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aliquam mattis, ante vel pretium vulputate, ligula ipsum
                        eleifend augue, vel sagittis eros risus a felis. Morbi
                        pretium tincidunt lacinia.
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <FavoriteBorderIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          99
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <ChatBubbleOutlineIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          170
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <MoreHorizIcon fontSize="medium" />
                      </IconButton>
                    </div>
                  </div>
                  <div className="flex px-2 py-3 mb-3 items-start bg-white rounded-3xl border-2 border-gray-200">
                    <Avatar
                      className="object-contain"
                      alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
                      src={
                        user?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                      }}
                    />
                    <div className="flex px-3 items-start flex-wrap">
                      <div className="flex items-center w-full space-x-2">
                        <Typography variant="h6">{user?.name}</Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          @username
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          &#x2022; 40 min
                        </Typography>
                      </div>
                      <Typography variant="body1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aliquam mattis, ante vel pretium vulputate, ligula ipsum
                        eleifend augue, vel sagittis eros risus a felis. Morbi
                        pretium tincidunt lacinia.
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <FavoriteBorderIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          99
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <ChatBubbleOutlineIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          170
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <MoreHorizIcon fontSize="medium" />
                      </IconButton>
                    </div>
                  </div>
                </ListItem>
                <ListItem className="flex flex-col px-2 pt-3 mb-3 items-start bg-white rounded-3xl">
                  <div className="flex items-start">
                    <Avatar
                      className="object-contain"
                      alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
                      src={
                        user?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                      }}
                    />
                    <div className="flex px-3 items-start flex-wrap mb-3">
                      <div className="flex items-center w-full space-x-2">
                        <Typography variant="h6">{user?.name}</Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          @username
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          &#x2022; 40 min
                        </Typography>
                      </div>
                      <Typography variant="body1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aliquam mattis, ante vel pretium vulputate, ligula ipsum
                        eleifend augue, vel sagittis eros risus a felis. Morbi
                        pretium tincidunt lacinia.
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <FavoriteBorderIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          99
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <ChatBubbleOutlineIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          170
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <MoreHorizIcon fontSize="medium" />
                      </IconButton>
                    </div>
                  </div>
                  <div className="flex px-2 py-3 mb-3 items-start bg-white rounded-3xl border-2 border-gray-200">
                    <Avatar
                      className="object-contain"
                      alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
                      src={
                        user?.avatar &&
                        `${process.env.NEXT_PUBLIC_SERVER_ADDRESS}/${user?.avatar}`
                      }
                      sx={{
                        width: 50,
                        height: 50,
                        fontSize: 50,
                        objectFit: "contain",
                      }}
                    />
                    <div className="flex px-3 items-start flex-wrap">
                      <div className="flex items-center w-full space-x-2">
                        <Typography variant="h6">{user?.name}</Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          @username
                        </Typography>
                        <Typography
                          variant="body1"
                          className="text-gray-500 text-sm"
                        >
                          &#x2022; 40 min
                        </Typography>
                      </div>
                      <Typography variant="body1">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Aliquam mattis, ante vel pretium vulputate, ligula ipsum
                        eleifend augue, vel sagittis eros risus a felis. Morbi
                        pretium tincidunt lacinia.
                      </Typography>
                    </div>
                    <div className="flex flex-col">
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <FavoriteBorderIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          99
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <ChatBubbleOutlineIcon fontSize="medium" />
                        <Typography
                          variant="body1"
                          className="text-gray-400 ml-1"
                        >
                          170
                        </Typography>
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="Add a pet"
                        component="label"
                        onClick={() => ""}
                        className="flex justify-start"
                      >
                        <MoreHorizIcon fontSize="medium" />
                      </IconButton>
                    </div>
                  </div>
                </ListItem>
              </List>
            </TabPanel>
          </Box>
        </div>
      </main>
    </>
  );
}
