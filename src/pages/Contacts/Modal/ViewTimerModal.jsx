import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setAlarm } from "../../../features/actions/alarm";

const ViewTimerModal = ({ setModal }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch()

  const onSubmit = (data) => {
    console.log(data);
    dispatch(setAlarm(data))
  };

  return (
    <div
      className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm"
      aria-labelledby="header-3a content-3a"
      aria-modal="true"
      tabIndex="-1"
      role="dialog"
    >
      {/*    <!-- Modal --> */}
      <div
        className="flex h-auto sm:w-[35%]  flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl "
        id="modal"
        role="document"
      >
        <div className="flex gap-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" rounded-lg p-5 bg-slate-50 w-full">
              <div className="">
                <label className="font-medium text-sm ">Time </label>
                <div className="  w-full flex  items-center gap-3 p-1">
                  <div class="relative max-w-sm">
                    <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        class="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>
                    <input
                      {...register("date", { required: true })}
                      id="datepicker-format"
                      datepicker
                      datepicker-format="mm-dd-yyyy"
                      type="datetime-local"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 "
                      placeholder="Select date"
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2 ">
                <label className="font-medium text-sm">Note</label>
                <textarea
                  {...register("note", { required: true })}
                  className="w-full bg-white mt-1  px-5 py-2 text-gray-500 text-sm border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                />
                {/* {errors.duration && (
                   <span className="text-red-500">
                     Duration is required
                   </span>
                 )} */}
              </div>
              <button className="text-white bg-blue-600 hover:bg-blue-700  py-1 px-4 mt-2 rounded-md  border-md">
                Set Alarm
              </button>
            </div>
          </form>

          <div>
            <button
              onClick={() => setModal(false)}
              className="inline-flex h-10 items-center justify-center gap-2 justify-self-center whitespace-nowrap rounded-full px-5 text-sm font-medium tracking-wide text-emerald-500 transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:text-emerald-300 disabled:shadow-none disabled:hover:bg-transparent"
              aria-label="close dialog"
            >
              <span className="relative only:-mx-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  role="graphics-symbol"
                  aria-labelledby="title-79 desc-79"
                >
                  <title id="title-79">Icon title</title>
                  <desc id="desc-79">
                    A more detailed description of the icon
                  </desc>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTimerModal;
