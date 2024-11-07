import {useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "../../../features/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { clearLoadingAndData } from "../../../features/slices/auth";
import { getGlobalData } from "../../../features/actions/globalData";


function SignUp() {
  const dispatch = useDispatch()
  const {isLoading,userData} = useSelector((state)=>state.auth)
  const {landingGlobalData} = useSelector((state)=>state.globalData)
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();
  const [fileType, setFileType] = useState("");

  const onSubmit = (data) => {
    dispatch(signUp(data))

  }
  useEffect(()=>{
    if(userData.status === "SUCCESS"){
      navigate("/")
    }
  },[userData])
  
  useEffect(()=>{
dispatch(clearLoadingAndData())

  },[])

  useEffect(() => {
    dispatch(getGlobalData())
  },[]);

  return (
    <>
      <section className="h-screen w-full bg-neutral-200">
        <div className="h-full mx-auto border-2">
          <div className="g-6 flex h-full flex-wrap w-full text-neutral-800 dark:text-neutral-200">
            <div className="w-full h-full">
              <div className="block rounded-lg bg-white shadow-lg h-full">
                <div className="g-0 grid grid-cols-[60%_auto] h-full">
                  <div
                    className="flex items-end rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none h-full w-full"
                    style={{
                      background:
                        "linear-gradient(to right, #ee7724, #d8363a, #dd3675, #b44593)",
                    }}
                  >
                    <div className="px-4 py-6 text-white md:mx-6 md:p-12">
                      <h4 className="mb-6 text-4xl font-bold">
                        We are more than just an application
                      </h4>
                      <p className="text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit, sed do eiusmod tempor incididunt ut labore et
                        dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex
                        ea commodo consequat.
                      </p>
                    </div>
                  </div>

                  <div className="w-full flex flex-col justify-center h-full bg-white rounded-lg shadow md:mt-0 xl:p-0">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                        Create an account
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
                        <div>
                          <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg ring-primary-600 block w-full p-2.5"
                            placeholder="Enter Email"
                            {...register("email", { required: true })}
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="phoneNumber"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Phone Number
                          </label>
                          <input
                            type="number"
                            name="phoneNumber"
                            id="username"
                            className="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg ring-primary-600 block w-full p-2.5"
                            placeholder="Enter Username"
                            {...register("phone", { required: true })}
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
                  
                        </div>
                        <div className="relative">
                          <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-900"
                          >
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            name="password"
                            id="hs-toggle-password"
                            placeholder="Confirm your password"
                            className="bg-gray-50 border text-gray-900 sm:text-sm rounded-lg ring-primary-600 block w-full p-2.5"
                            {...register("confirmPassword", { 
                              required: "Please confirm your password",
                              validate: (value) =>
                                value === watch("password") || "The passwords do not match",
                            })}
                            required
                          />
                             {errors.confirmPassword && (
                <p className="text-red-800 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
     
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full text-white bg-[#2563eb] hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                          {isLoading ? <ClipLoader color="#c4c2c2" /> : "Sign Up "}
                        </button>
                        <p className="text-sm font-light text-gray-500">
                          Already have an account ?{" "}
                          <a
                            href="/"
                            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                          >
                            Sign in
                          </a>
                        </p>
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

export default SignUp;
