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
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": {
          m: 1,
          width: "25ch",
        },
      }}
      noValidate
      autoComplete="off"
    >
      <Typography sx={{ mt: 2, mb: 1, fontSize: 40, fontWeight: "bold" }}>
        Confirm data
      </Typography>
    </Box>
  );
}
