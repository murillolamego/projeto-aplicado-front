import { enqueueSnackbar } from "notistack";
import { useState, Fragment, ReactElement, useContext } from "react";

import { UserSignupContext } from "@/contexts/UserSignupContext";
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

const steps = ["User 1", "User 2"];

export function SignupUser(): ReactElement {
  const { user } = useContext(UserSignupContext);
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set<number>());

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
    const data = await signUp(user);

    if (data) {
      console.log("CREATED USER", user);
      enqueueSnackbar({
        message: "User successfully created",
        variant: "success",
      });
    } else {
      enqueueSnackbar({
        message: "User creation failed",
        variant: "error",
      });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
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
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleReset}
              sx={{ mr: 1 }}
            >
              Reset
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleSignup} sx={{ mr: 1 }}>
              Sign up
            </Button>
          </Box>
        </Fragment>
      ) : (
        <Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
          {activeStep === 0 && <FormUserBasicInfo />}
          {activeStep === 1 && <FormUserMoreInfo />}
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />
            {isStepOptional(activeStep) && (
              <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                Skip
              </Button>
            )}
            <Button onClick={handleNext}>Next</Button>
          </Box>
        </Fragment>
      )}
    </Box>
  );
}
