import React, { ReactElement, useContext, useEffect } from "react";

import { UserSignupContext } from "@/contexts/UserSignupContext";
import { Box, Typography } from "@mui/material";

export function FormUserConfirmInfo(): ReactElement {
  const { user, setUser } = useContext(UserSignupContext);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  });

  return (
    <Box component="form" className="flex flex-col space-y-6 mb-6">
      <Typography variant="h6">Name: {user.name}</Typography>
      <Typography variant="h6">Email: {user.email}</Typography>
      <Typography variant="h6">City: {user.city}</Typography>
      <Typography variant="h6">State: {user.state}</Typography>
      <Typography variant="h6">Country: {user.country}</Typography>
    </Box>
  );
}
