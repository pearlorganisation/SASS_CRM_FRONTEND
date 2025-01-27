import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import {
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { clientSignup } from "../../features/actions/client";
import { getPricePlans } from "../../features/actions/pricePlan";
import PlanCard from "../Settings/Plans/PlanCard";
import { errorToast } from "../../utils/extra";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function CreateClient() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.client);
  const { planData } = useSelector((state) => state.pricePlans);

  const steps = ["Client Information", "Choose Plan"];
  const [activeStep, setActiveStep] = useState(0);
  const [billingData, setBillingData] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm();

  const onSubmit = (data) => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else {
      if (!selectedPlan) {
        errorToast("Please select a plan");
        return;
      }
      console.log(billingData);
      data["plan"] = selectedPlan;
      data["durationType"] = billingData.durationType;
      data["userName"] = data.clientUserName;
      dispatch(clientSignup(data)).then((res) => {
        if (res?.meta?.requestStatus === "fulfilled") {
          navigate("/clients", { replace: true });
        }
      });
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  useEffect(() => {
    reset({});
    dispatch(getPricePlans());
  }, []);

  return (
    <section className="mt-4 flex justify-center items-center bg-gray-100">
      <div className="w-full bg-white p-8 rounded-lg">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <form
            className="space-y-4 w-full mx-auto"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography
              variant="h5"
              className="text-center mb-6"
              fontWeight="bold"
            >
              Step 1: Fill Client Information
            </Typography>
            <Box className="max-w-xl mx-auto space-y-4">
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                {...register("clientUserName", {
                  required: "Username is required",
                })}
                error={!!errors.clientUserName}
                helperText={errors.clientUserName?.message}
              />
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                {...register("companyName", {
                  required: "Company Name is required",
                })}
                error={!!errors.companyName}
                helperText={errors.companyName?.message}
              />
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                label="Phone Number"
                variant="outlined"
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\+\d{1,3}\d{9}$/,
                    message:
                      "10 Digit Phone number with Country Code is required, eg: +911234567890",
                  },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              <TextField
                {...register("password", {
                  required: "Password is required",
                })}
                label="Password"
                type={showPassword.password ? "text" : "password"}
                fullWidth
                variant="outlined"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility("password")}
                      >
                        {showPassword.password ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                label="Confirm Password"
                type={showPassword.confirmPassword ? "text" : "password"}
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          togglePasswordVisibility("confirmPassword")
                        }
                      >
                        {showPassword.confirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box className="flex justify-between mt-4">
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader size={20} color="#fff" /> : "Next"}
              </Button>
            </Box>
          </form>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography
              variant="h5"
              className="text-center mb-6"
              fontWeight="bold"
            >
              Step 2: Choose Plan
            </Typography>
            <div className="flex overflow-x-auto gap-4">
              {planData &&
                Array.isArray(planData) &&
                planData.map((item, index) => (
                  <div key={index} className="min-w-72">
                    <PlanCard
                      plan={item}
                      key={item._id}
                      isSelectVisible={true}
                      selectedPlan={selectedPlan}
                      handlePlanSelection={(id, billing) => {
                        setSelectedPlan(id);
                        console.log('--->', billing);
                        setBillingData(billing);
                      }}
                    />
                  </div>
                ))}
            </div>
            <Box className="flex justify-between mt-4">
              <Button variant="outlined" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
              >
                {isLoading ? <ClipLoader size={20} color="#fff" /> : "Submit"}
              </Button>
            </Box>
          </Box>
        )}
      </div>
    </section>
  );
}

export default CreateClient;
