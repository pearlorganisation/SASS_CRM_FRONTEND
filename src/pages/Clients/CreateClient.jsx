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
} from "@mui/material";
import { clientSignup } from "../../features/actions/client";
import { getPricePlans } from "../../features/actions/pricePlan";
import PlanCard from "../Settings/Plans/PlanCard";
import { errorToast } from "../../utils/extra";
import { useNavigate } from "react-router-dom";

function CreateClient() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.client);
  const { planData } = useSelector((state) => state.pricePlans);

  const steps = ["Client Information", "Choose Plan"];
  const [activeStep, setActiveStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    if (activeStep === 0) {
      setActiveStep(1);
    } else {
      if (!selectedPlan) {
        errorToast("Please select a plan");
        return;
      }
      data["plan"] = selectedPlan;
      console.log(data);
      dispatch(clientSignup(data)).then((res) => {
        console.log("ressst", res);
        if (res?.meta?.requestStatus === "fulfilled") {
          navigate("/clients", { replace: true });
        }
      });
    }
  };

  const handleBack = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  useEffect(() => {
    dispatch(getPricePlans());
  }, []);

  return (
    <section className=" mt-4 flex justify-center items-center bg-gray-100">
      <div className="w-full bg-white p-8 rounded-lg ">
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <form
            className="space-y-4 w-full mx-auto "
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography
              variant="h5"
              className="text-center mb-6"
              fontWeight="bold"
            >
              Step 1: Fill Client Information
            </Typography>
            <div className="max-w-xl mx-auto">
              <div className="pb-5 relative">
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Username"
                  {...register("userName", {
                    required: "Username is required",
                  })}
                />
                {errors.userName && (
                  <p className="text-red-600 absolute bottom-0 left-0 text-sm mt-1">
                    {errors.userName.message}
                  </p>
                )}
              </div>
              <div className="pb-5 relative">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="text-red-600 absolute bottom-0 left-0 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="pb-5 relative">
                <label
                  htmlFor="phoneNumber"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Phone Number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Phone number must be 10 digits",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-red-600 absolute bottom-0 left-0 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="pb-5 relative">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter Password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="text-red-600 absolute bottom-0 left-0 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="pb-5 relative">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 absolute bottom-0 left-0 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between mt-4">
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
            </div>
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
            <div className="flex overflow-x-auto gap-4 max-">
              {planData &&
                Array.isArray(planData) &&
                planData?.map((item, index) => {
                  return (
                    <div key={index} className="min-w-72">
                      <PlanCard
                        plan={item}
                        key={item?._id}
                        selectedPlan={selectedPlan}
                        handlePlanSelection={(id) => setSelectedPlan(id)}
                      />
                    </div>
                  );
                })}
            </div>
            <div className="flex justify-between mt-4">
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
            </div>
          </Box>
        )}
      </div>
    </section>
  );
}

export default CreateClient;
