import { enqueueSnackbar } from "notistack";
import { useState, Fragment, ReactElement, useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { UserSignupContext } from "@/contexts/UserSignupContext";
import { signInRequest } from "@/services/authService";
import { signUp } from "@/services/userService";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";

import { FormUserBasicInfo } from "./forms/formUserBasicInfo";
import { FormUserConfirmInfo } from "./forms/formUserConfirmInfo";
import { FormUserMoreInfo } from "./forms/formUserMoreInfo";

const steps = ["Basic info", "Custom info"];

export function SignupUser(): ReactElement {
  const { user, file } = useContext(UserSignupContext);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

  const { signIn } = useContext(AuthContext);

  const isStepOptional = (step: number): boolean => {
    return false;
  };

  const isStepSkipped = (step: number): boolean => {
    return skipped.has(step);
  };

  const handleNext = (): void => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = (): void => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = (): void => {
    setActiveStep(0);
  };

  const handleSignup = async (): Promise<void> => {
    console.log("SIGN UP");
    const data = await signUp(user, file);

    if (data) {
      console.log("CREATED USER", user);
      enqueueSnackbar({
        message: "User successfully created",
        variant: "success",
      });
      await signIn({ email: user.email, password: user.password });
    } else {
      enqueueSnackbar({
        message: "User creation failed",
        variant: "error",
      });
    }
  };

  return (
    <Box className="flex flex-col px-10">
      <Typography
        variant="h1"
        className="text-center font-chicle text-secondary mb-12"
      >
        Caramelo
      </Typography>
      <Stepper activeStep={activeStep} className=" mb-12">
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Fragment>
          <FormUserConfirmInfo />
          <Box
            sx={{ display: "flex", flexDirection: "row", pt: 2 }}
            className="mt-12"
          >
            <button
              onClick={handleReset}
              className="px-6 border p-3 bg-secondary font-bold text-white rounded-md hover:bg-hoverSecondary ease-in-out duration-300"
              type="submit"
            >
              Reset
            </button>
            <Box sx={{ flex: "1 1 auto" }} />
            <button
              onClick={handleSignup}
              className="px-6 border p-3 bg-secondary font-bold text-white rounded-md hover:bg-hoverSecondary ease-in-out duration-300"
              type="submit"
            >
              Sign up
            </button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          {activeStep === 0 && <FormUserBasicInfo />}
          {activeStep === 1 && <FormUserMoreInfo />}
          <Box sx={{ display: "flex", flexDirection: "row" }} className="mt-12">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className="px-6 border p-3 bg-secondary font-bold text-white rounded-md hover:bg-hoverSecondary ease-in-out duration-300 disabled:bg-gray-300"
              type="submit"
            >
              Back
            </button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <button
              onClick={handleNext}
              className="px-6 border p-3 bg-secondary font-bold text-white rounded-md hover:bg-hoverSecondary ease-in-out duration-300"
              type="submit"
            >
              Next
            </button>
          </Box>
        </Fragment>
      )}
    </Box>
  );
}
