import React, { ReactElement, useContext, useEffect } from "react";

import { UserSignupContext } from "@/contexts/UserSignupContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";

export function FormUserBasicInfo(): ReactElement {
  const { user, setUser } = useContext(UserSignupContext);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = (): void => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    event.preventDefault();
  };

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  });

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      className="flex flex-col w-full space-y-6"
    >
      <TextField
        required
        type="text"
        label="Name"
        placeholder="Your name"
        value={user?.name && user.name}
        onChange={(e): void => setUser({ ...user, name: e.target.value })}
      />
      <TextField
        required
        type="email"
        label="Email"
        placeholder="you@email.com"
        value={user?.email && user.email}
        onChange={(e): void => setUser({ ...user, email: e.target.value })}
      />
      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          required
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Strong password"
          value={user?.password && user.password}
          onChange={(e): void => setUser({ ...user, password: e.target.value })}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
    </Box>
  );
}
