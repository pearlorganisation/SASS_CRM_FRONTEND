import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  addEnrollment,
  getEnrollments,
} from "../../../features/actions/attendees";
import { addLocation, getLocations } from "../../../features/actions/location";

const AddRequestLocation = ({ setModal, locationsData, title }) => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      previousName: locationsData?.previousName || null,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    dispatch(addLocation(data)).then(() => {
        dispatch(getLocations({ page: 1, limit: 100 }));
        setModal(false)
    })
  };

  return (
    <div className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm">
      <div className="flex flex-col gap-4 overflow-hidden rounded bg-white p-6 shadow-xl ">
        <h2 className="text-lg font-semibold text-center">{title}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <div>
            <label className="block text-sm font-medium pb-2">
              Location Name:
            </label>
            <input
              {...register("name")}
              type="text"
              placeholder="Enter Location Name"
              className="rounded-lg border focus:border-teal-500 outline-none p-2 text-xl"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition duration-150"
          >
            Submit
          </button>
        </form>

        <button
          onClick={() => setModal(null)}
          className="inline-flex h-10 items-center justify-center w-full mt-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition duration-300 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddRequestLocation;
