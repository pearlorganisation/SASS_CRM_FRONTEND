import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { logIn } from "../../../features/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { clearLoadingAndData } from "../../../features/slices/auth";
import { getGlobalData } from "../../../features/actions/globalData";
import { addUserActivity } from "../../../features/actions/userActivity";

function Login() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [fileType, setFileType] = useState("");
  const { landingGlobalData } = useSelector((state) => state.globalData);
  const {isEmployee} = useSelector(state => state.userActivity);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [isPasswordHidden, setPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => {
    setPasswordHidden(!isPasswordHidden);
    const passwordInput = document.getElementById("hs-toggle-password");
    if (passwordInput) {
      passwordInput.type = isPasswordHidden ? "text" : "password";
    }
  };

  const onSubmit = (data) => {
    dispatch(logIn(data)).then(() => {
      if (isEmployee) {
        dispatch(
          addUserActivity({
            action: "login",
            details: "User logged in successfully",
          })
        );
      }
    });
  };

  useEffect(() => {
    // Navigate to the root URL if the user is on the login page
    if (window.location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    dispatch(clearLoadingAndData());
  }, []);

  useEffect(() => {
    dispatch(getGlobalData());
  }, []);

  return (
    <>
      <section className="h-screen w-full bg-neutral-200">
        <div className="h-full mx-auto border-2">
          <div className="g-6 flex h-full flex-wrap w-full text-neutral-800 dark:text-neutral-200">
            <div className="w-full h-full">
              <div className="block rounded-lg bg-white shadow-lg h-full">
                <div className="g-0 grid grid-cols-[60%_auto] h-full">
                  <div className="relative  rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none h-screen w-full">
                    <div className="absolute  bg-black/40 h-full w-full"> </div>

                    {landingGlobalData?.itemType === "image" ? (
                      <img
                        className="top-0 left-0 w-full h-full object-cover"
                        src={landingGlobalData?.item}
                        alt=""
                      />
                    ) : (
                      <video
                        className="top-0 left-0 w-full h-full"
                        autoPlay
                        muted
                        loop
                        preload="auto"
                      >
                        <source
                          src={landingGlobalData?.item}
                          type="video/mp4"
                        />
                        Your browser does not support the video tag.
                      </video>
                    )}

                    <div className="absolute bottom-0  px-4 py-6 text-white md:mx-6 md:p-12">
                      <h4 className="mb-6 text-4xl font-bold">
                        {landingGlobalData?.title}
                      </h4>
                      <p className="text-sm font-bold tracking-wide">
                        {landingGlobalData?.subTitle}
                      </p>
                    </div>
                  </div>

                  <div className="w-full flex flex-col justify-center h-full  bg-white rounded-lg shadow md:mt-0 xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Sign in to your account
                      </h1>

                      <form
                        className="space-y-4 md:space-y-6"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <div>
                          <label
                            htmlFor="username"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Username
                          </label>
                          <input
                            type="username"
                            name="username"
                            id="username"
                            className="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg ring-primary-600 block w-full p-2.5"
                            placeholder="Enter Username"
                            {...register("userName", { required: true })}
                            required
                          />
                        </div>

                        <div className="relative">
                          <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="hs-toggle-password"
                            placeholder="Enter your password"
                            className="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg ring-primary-600 block w-full p-2.5"
                            {...register("password", { required: true })}
                            required
                          />
                          <button
                            className="text-gray-400 absolute right-3 top-9 active:text-gray-600"
                            type="button"
                            onClick={togglePasswordVisibility}
                          >
                            {isPasswordHidden ? (
                              <svg
                                className="w-6 h-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
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
                                className="w-6 h-6"
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
                        <button
                          disabled={isLoading}
                          type="submit"
                          className="w-full text-white bg-[#2563eb] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          {isLoading ? (
                            <ClipLoader color="#c4c2c2" />
                          ) : (
                            "Sign in to your account"
                          )}
                        </button>
                        {/* <p className="text-sm font-light text-gray-500">
                          Don’t have an account yet?{" "}
                          <a
                            href="/signUp"
                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                          >
                            Sign up
                          </a>
                        </p> */}
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
