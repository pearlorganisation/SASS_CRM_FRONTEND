import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { logIn } from "../../../features/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { getGlobalData } from "../../../features/actions/globalData";
import * as path from "path";

function Login() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { landingGlobalData } = useSelector((state) => state.globalData);
  const [isPasswordHidden, setPasswordHidden] = useState(true);

  console.log("sdkfsdf ---> ", landingGlobalData);

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

  function getFileURL(filename, destination, baseUrl) {
    // Remove '/api/v1' from the baseUrl if it exists
    const cleanedBaseUrl = baseUrl.replace(/\/api\/v1$/, '');
  
    // Remove leading './' or '/' from the destination for URL safety
    const normalizedDestination = destination.replace(/^(\.\/|\/)/, '');
    
    // Ensure the destination uses forward slashes and combine it with the filename
    const relativePath = `${normalizedDestination}/${filename}`.replace(/\\/g, '/');
    
    // Construct the full URL
    return `${cleanedBaseUrl}/${relativePath}`;
  }
  return (
    <div className="flex md:flex-row flex-col h-screen w-full">
      {/* Left Section */}
      <div className="flex flex-col w-full md:w-3/5 bg-gray-100">
        {/* Video/Banner Section */}
        <div className="relative h-3/5">
          {landingGlobalData?.file?.mimetype !== "video/mp4" ? (
            <img
              className="w-full h-full object-cover"
              src={getFileURL(
                landingGlobalData?.file?.filename,
                landingGlobalData?.file?.destination,
                import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT ===
                  "development"
                  ? import.meta.env.VITE_REACT_APP_API_BASE_URL_DEVELOPMENT
                  : import.meta.env
                      .VITE_REACT_APP_API_BASE_URL_MAIN_PRODUCTION
              )}
              alt="Banner"
            />
          ) : (
            <video
              className="w-full h-full object-cover"
              autoPlay
              {...(true && { controls: true })}
              loop
              muted
              preload="auto"
            >
              <source
                src={getFileURL(
                  landingGlobalData?.file?.filename,
                  landingGlobalData?.file?.destination,
                  import.meta.env.VITE_REACT_APP_WORKING_ENVIRONMENT ===
                    "development"
                    ? import.meta.env.VITE_REACT_APP_API_BASE_URL_DEVELOPMENT
                    : import.meta.env
                        .VITE_REACT_APP_API_BASE_URL_MAIN_PRODUCTION
                )}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Text Section */}
        <div className="flex flex-col justify-center items-center bg-gray-200 h-2/5 p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {landingGlobalData?.title || "Welcome Back"}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {landingGlobalData?.subTitle || "Please sign in to continue"}
          </p>
          <Button
            variant="contained"
            color="primary"
            size="large"
            className="rounded-lg"
            style={{
              height: landingGlobalData?.buttonHeight || "auto",
              width: landingGlobalData?.buttonWidth || "auto",
            }}
            onClick={() => window.open(landingGlobalData?.link || "/", "_blank")}
          >
            {landingGlobalData?.buttonName || "Click Me"}
          </Button>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="flex items-center justify-center w-full  md:w-2/5 bg-white p-8">
        <div className="max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Sign in to your account
          </h1>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              className="bg-gray-50"
              {...register("userName", { required: true })}
              error={!!errors.userName}
              helperText={errors.userName && "Username is required"}
            />

            {/* Password */}
            <div className="relative">
              <TextField
                fullWidth
                type={isPasswordHidden ? "password" : "text"}
                label="Password"
                variant="outlined"
                {...register("password", { required: true })}
                error={!!errors.password}
                helperText={errors.password && "Password is required"}
              />
              <button
                type="button"
                className={`absolute  right-3 text-gray-400 hover:text-gray-600 ${
                  errors.password ? " top-4" : "top-1/2 -translate-y-1/2"
                }`}
                onClick={togglePasswordVisibility}
              >
                {isPasswordHidden ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </button>
            </div>

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
        </div>
      </div>
    </div>
  );
}

export default Login;
