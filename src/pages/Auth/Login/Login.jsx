import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { logIn } from "../../../features/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { getGlobalData } from "../../../features/actions/globalData";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import ForgotPasswordModal from "../ForgotPassword/ForgotPassword";

function Login() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { landingGlobalData } = useSelector((state) => state.globalData);
  const [isPasswordHidden, setPasswordHidden] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const togglePasswordVisibility = () => {
    setPasswordHidden(!isPasswordHidden);
  };

  const onSubmit = (data) => {
    dispatch(logIn(data));
  };

  useEffect(() => {
    if (window.location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(getGlobalData());
  }, []);

  function getFileURL(filename = "", destination = "") {
    const baseUrl =
      import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT === "development"
        ? import.meta.env.VITE_REACT_APP_API_BASE_URL_DEVELOPMENT
        : import.meta.env.VITE_REACT_APP_API_BASE_URL_MAIN_PRODUCTION;

    const cleanedBaseUrl = baseUrl.replace(/\/api\/v1$/, "");

    const normalizedDestination = destination.replace(/^(\.\/|\/)/, "");

    const relativePath = `${normalizedDestination}/${filename}`.replace(
      /\\/g,
      "/"
    );

    return `${cleanedBaseUrl}/${relativePath}`;
  }
  return (
    <div className="flex md:flex-row flex-col h-screen w-full">
      {/* Left Section */}
      <div className="flex flex-col w-full  md:w-3/5 bg-gray-100">
        {/* Video/Banner Section */}
        <div
          className={`relative ${
            landingGlobalData?.title ||
            landingGlobalData?.subTitle ||
            landingGlobalData?.buttonName
              ? "h-3/5"
              : "h-full object-cover"
          } `}
        >
          {landingGlobalData?.file && (
            <>
              {landingGlobalData?.file?.mimetype !== "video/mp4" ? (
                <img
                  className="w-full h-full object-cover"
                  src={landingGlobalData?.file?.url}
                  alt="Banner"
                  loading="lazy"
                />
              ) : (
                <video
                  className="w-full h-full "
                  autoPlay
                  controls={landingGlobalData?.videoControls}
                  loop
                  muted
                  preload="auto"
                >
                  <source
                    src={getFileURL(
                      landingGlobalData?.file?.filename,
                      landingGlobalData?.file?.destination
                    )}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              )}
            </>
          )}
        </div>
        {(landingGlobalData?.title ||
          landingGlobalData?.subTitle ||
          landingGlobalData?.buttonName) && (
          <div className="flex flex-col justify-center items-center bg-gray-200 h-2/5 p-6">
            {landingGlobalData?.title && (
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {landingGlobalData.title || "Welcome Back"}
              </h2>
            )}

            {landingGlobalData?.subTitle && (
              <p className="text-gray-600 text-center mb-6">
                {landingGlobalData.subTitle}
              </p>
            )}

            {landingGlobalData?.buttonName && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                className="rounded-lg"
                style={{
                  height: landingGlobalData?.buttonHeight || "auto",
                  width: landingGlobalData?.buttonWidth || "auto",
                }}
                onClick={() =>
                  window.open(landingGlobalData?.link || "/", "_blank")
                }
              >
                {landingGlobalData.buttonName}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Right Section - Login Form */}
      <div className="flex items-center justify-center w-full  md:w-2/5 bg-white p-8">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Sign in to your account
          </h1>
          <form
            className="space-y-6"
            autoComplete="on"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* Email */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              variant="outlined"
              type="email"
              className="bg-gray-50"
              {...register("email", { required: true })}
              error={!!errors.email}
              helperText={errors.email && "Email is required"}
            />

            {/* Password */}
            <TextField
              {...register("password", { required: "Password is required" })}
              fullWidth
              label="Password"
              name="password"
              autoComplete="password"
              variant="outlined"
              type={isPasswordHidden ? "text" : "password"}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {isPasswordHidden ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? <ClipLoader color="#fff" size={20} /> : "Sign In"}
            </Button>
          </form>
          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <button
              onClick={() => setForgotModalOpen(true)}
              className="text-sm text-blue-600 hover:text-blue-500 hover:underline"
            >
              Forgot your password?
            </button>
          </div>
          {forgotModalOpen && (
            <ForgotPasswordModal onClose={() => setForgotModalOpen(false)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;
