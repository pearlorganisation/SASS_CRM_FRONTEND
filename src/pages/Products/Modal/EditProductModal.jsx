import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../../features/actions/product";
import {
  addEnrollment,
  getEnrollments,
} from "../../../features/actions/attendees";

const EditProductModal = ({ setModal, product }) => {
  const dispatch = useDispatch();

  const { selectedAttendee } = useSelector((state) => state.attendee);

  // function removeBlankAttributes(obj) {
  //   const result = {};
  //   for (const key in obj) {
  //     if (obj[key] !== null && obj[key] !== undefined && obj[key].length > 0) {
  //       result[key] = obj[key];
  //     }
  //   }
  //   return result;
  // }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: product?.name || "",
      level: product?.level || "",
      price: product?.price || "",
      description: product?.description || "",
    },
  });

  const onSubmit = (data) => {
    const attendeeEmail = selectedAttendee && selectedAttendee[0]?._id;
    data["attendee"] = attendeeEmail;
    console.log(data);
    dispatch(addEnrollment(data)).then((res) => {
      dispatch(getEnrollments({ id: attendeeEmail }));
    });
  };

  return (
    <div className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm">
      <div className="flex flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl sm:w-[800px]">
        <h2 className="text-lg font-semibold text-center">Add Enrollment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Product Name</label>

            <input
              {...register("name", { required: "Product name is required" })}
              type="text"
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
              placeholder="Enter Product Name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>

            <input
              {...register("price", { required: "Price is required" })}
              type="number"
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
              placeholder="Price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>

            <input
              {...register("description", {
                required: "description is required",
              })}
              type="number"
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
              placeholder="description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Level</label>
            <select
              {...register("level", { required: "Level is required" })}
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
            >
              <option value="" disabled>
                Select Level
              </option>

              <option value="L1">L1</option>

              <option value="L1">L2</option>

              <option value="L1">L3</option>
            </select>
            {errors.product && (
              <p className="text-red-500 text-sm mt-1">
                {errors.product.message}
              </p>
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
          className="inline-flex h-10 items-center justify-center w-full mt-2 text-sm font-medium text-red-600 hover:bg-red-100 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProductModal;
