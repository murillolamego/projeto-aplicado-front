import { useSnackbar } from "notistack";
import React, { ReactElement, useContext, useEffect, useState } from "react";

import { UserSignupContext } from "@/contexts/UserSignupContext";
import {
  getCitiesByCountry,
  getCitiesByCountryAndState,
} from "@/services/geolocationService";
import { PhotoCamera } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

const IMAGE_TYPE = /image\/(png|jpg|jpeg)/i;

export function FormUserMoreInfo(): ReactElement {
  const { enqueueSnackbar } = useSnackbar();
  const {
    user,
    setUser,
    countries,
    setCountries,
    states,
    setStates,
    cities,
    setCities,
  } = useContext(UserSignupContext);
  const [file, setFile] = useState<File | null>(null);

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
            setUser({ ...user, avatar: result });
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

  const handleCountrySelect = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const country = countries.find(
      (country) => country.name === event.target.value,
    );

    setStates([]);
    setCities([]);

    if (country) {
      setUser({ ...user, country: event.target.value });
      if (country.states.length > 0) {
        setStates(country.states);
      } else {
        (async (): Promise<void> => {
          const cities = await getCitiesByCountry(event.target.value);

          if (cities) {
            setCities(cities);
          }
        })();
      }
    }
  };

  const handleStateSelect = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setUser({ ...user, state: event.target.value });

    setCities([]);

    (async (): Promise<void> => {
      const cities = await getCitiesByCountryAndState(
        user.country,
        event.target.value,
      );

      if (cities) {
        setCities(cities);
      }
    })();
  };

  const handleCitySelect = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setUser({ ...user, city: event.target.value });
  };

  useEffect(() => {
    if (user) {
      setUser(user);
    }
    if (countries.length > 0) {
      setCountries(countries);
    }
    if (states.length > 0) {
      setStates(states);
    }
    if (cities.length > 0) {
      setCities(cities);
    }
  });

  return (
    <Box
      component="form"
      sx={{
        m: 1,
        width: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
      noValidate
      autoComplete="off"
    >
      <div className="relative">
        <label htmlFor="inputFile">
          <Avatar
            className="object-contain border-gray-400"
            alt={user?.name ? `${user.name}'s avatar` : "User avatar"}
            src={user?.avatar}
            sx={{
              width: 180,
              height: 180,
              fontSize: 120,
              objectFit: "contain",
              cursor: "pointer",
            }}
          />
        </label>
        <IconButton
          className="absolute start-0 bottom-0"
          color="primary"
          aria-label="upload avatar"
          component="label"
        >
          <input
            hidden
            id="inputFile"
            name="inputFile"
            accept="image/*"
            type="file"
            onChange={(e): void => {
              fileHandler(e);
              e.target.value = "";
            }}
          />
          <PhotoCamera sx={{ fontSize: 32 }} />
        </IconButton>
        <IconButton
          className="absolute end-0 bottom-0"
          color="primary"
          aria-label="delete avatar"
          component="label"
          onClick={(): void => {
            setUser({ ...user, avatar: "" });
            setFile(null);
            console.log("USER", user);
          }}
        >
          <DeleteIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </div>
      <Typography sx={{ mt: 2, mb: 1, fontSize: 40, fontWeight: "bold" }}>
        {user?.name && user.name}
      </Typography>
      <Box
        component="div"
        sx={{
          "& .MuiTextField-root": {
            m: 1,
            width: "25ch",
          },
        }}
      >
        <TextField
          required
          select
          label="Country"
          defaultValue=""
          value={user?.country && user.country}
          onChange={(e): void => handleCountrySelect(e)}
        >
          {countries.length > 0 ? (
            countries.map((country) => (
              <MenuItem key={country.iso3} value={country.name}>
                {country.name}
              </MenuItem>
            ))
          ) : (
            <span></span>
          )}
        </TextField>
        <TextField
          select
          label="State"
          defaultValue=""
          value={user?.state && user.state}
          onChange={(e): void => handleStateSelect(e)}
          disabled={states.length === 0}
        >
          {states.length > 0 ? (
            states.map((state) => (
              <MenuItem key={state.state_code} value={state.name}>
                {state.name}
              </MenuItem>
            ))
          ) : (
            <span></span>
          )}
        </TextField>
        <TextField
          select
          label="City"
          defaultValue=""
          value={user?.city && user.city}
          onChange={(e): void => handleCitySelect(e)}
          disabled={cities.length === 0}
        >
          {cities.length > 0 ? (
            cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))
          ) : (
            <span></span>
          )}
        </TextField>
      </Box>
    </Box>
  );
}
