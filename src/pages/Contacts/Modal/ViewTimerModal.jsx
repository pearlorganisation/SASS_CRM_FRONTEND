import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { getAttendeeAlarm, setAlarm } from "../../../features/actions/alarm";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";

const ViewTimerModal = ({ setModal, email, attendeeId, dateFormat, logUserActivity }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [date, setDate] = useState(new Date());

  const onSubmit = (data) => {
    data["email"] = email;
    data["attendeeId"] = attendeeId;
    data["date"] = date.toISOString();
    if(!data?.secondaryNumber){
      data.secondaryNumber = undefined;
    }
    dispatch(setAlarm(data)).then((res) => {
      if(res.meta.requestStatus === "fulfilled"){
        logUserActivity({
          action: "setAlarm",
          type: "contact",
          detailItem: email,
          activityItem: email,
        });
        dispatch(getAttendeeAlarm({ email }));
      }
    });
    setModal(false);
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
        className="relative h-auto max-w-96 flex-col gap-6  rounded bg-white p-6 shadow-xl "
        id="modal"
        role="document"
      >
        <button
          onClick={() => setModal(false)}
          className="absolute right-2 top-2 w-8 h-8 rounded-full hover:bg-green-500 hover:text-white transition duration-300"
          aria-label="close dialog"
        >
          X
        </button>
        <div className="flex gap-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className=" rounded-lg p-5 bg-slate-50 w-full">
              <div className="">
                <label className="font-medium text-sm ">Time </label>
                <div className="  w-full flex  items-center gap-3 p-1">
                  <div className="relative max-w-sm">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                      <svg
                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                      </svg>
                    </div>

                    <DatePicker
                      className="border w-full p-2 rounded-lg"
                      selected={date}
                      onChange={(date) => setDate(date)}
                      minDate={new Date()} 
                      maxTime={new Date().setHours(23, 59, 59)}  
                      filterTime={(time) => time >= minDate} 
                      placeholderText="Select start date"
                      dateFormat={`${dateFormat} hh:mm aa`}
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      timeInputLabel="Time:"
                      showTimeInput
                    />
                  </div>
                </div>
              </div>
              <div className="pt-2 ">
                <label className="font-medium text-sm">Note</label>
                <textarea
                  {...register("note", { 
                    required: "Note is required",
                    maxLength: {
                      value: 600,
                      message: "Note cannot exceed 600 characters"
                    }
                  })}
                  className="w-full bg-white mt-1  px-5 py-2 text-gray-500 text-sm border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                  placeholder="Write a note (Max. 600 chars)"
                />
                {errors.note && (
                  <span className="text-red-500 text-sm">
                    {errors.note.message}
                  </span>
                )}
              </div>
              <div className="pt-2">
                <label className="font-medium text-sm">Secondary Number (Optional)</label>
                <input
                  {...register("secondaryNumber", {
                    pattern: {
                      value: /^\+91\d+$/,
                      message: "Number must start with +91"
                    }
                  })}
                  type="tel"
                  placeholder="+91XXXXXXXXXX"
                  className="w-full bg-white mt-1 px-5 py-2 text-gray-500 text-sm border-slate-300 bg-transparent outline-none border focus:border-teal-400 shadow-sm rounded-lg"
                />
                {errors.secondaryNumber && (
                  <span  className="w-fit text-red-500 text-sm">
                    {errors.secondaryNumber.message}
                  </span>
                )}
              </div>
              <button className="text-white bg-blue-600 hover:bg-blue-700  py-1 px-4 mt-2 rounded-md  border-md w-full">
                Set Alarm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ViewTimerModal;
