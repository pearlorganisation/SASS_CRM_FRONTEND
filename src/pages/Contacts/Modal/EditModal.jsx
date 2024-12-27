import React from "react";
import { useForm } from "react-hook-form";

const EditModal = ({ setModal, initialData, onConfirmEdit }) => {





  function removeBlankAttributes(obj) {
    const result = {};
    for (const key in obj) {
        if ( obj[key] !== null && obj[key] !== undefined && obj[key].length > 0) {
            result[key] = obj[key];
        }
    }
    return result;
}


  const { register, handleSubmit } = useForm({
    defaultValues: {
      firstName: initialData?.firstName,
      lastName: initialData?.lastName,
      phone: initialData?.phone,
      location: initialData?.location,
      gender: initialData?.gender,
    },
  });

  const onSubmit = (data) => {
    data['id'] = initialData?._id;
    let finalData = removeBlankAttributes(data)
    onConfirmEdit(finalData);
  };

  return (
    <div className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-slate-300/20 backdrop-blur-sm">
      <div className="flex flex-col gap-6 overflow-hidden rounded bg-white p-6 shadow-xl sm:w-[800px]">
        <h2 className="text-lg font-semibold text-center">
          Attendee Information
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">First Name</label>
              <input
                {...register("firstName")}
                type="text"
                className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
                placeholder="Enter First Name"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium">Last Name</label>
              <input
                {...register("lastName")}
                type="text"
                className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
                placeholder="Enter Last Name"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Phone</label>
              <input
                {...register("phone")}
                type="tel"
                className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
                placeholder="Enter Phone Number"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium">Location</label>
              <input
                {...register("location")}
                type="text"
                className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
                placeholder="Enter Location"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Gender</label>
            <select
              {...register("gender")}
              className="mt-1 block w-full h-10 rounded border border-gray-300 px-3 focus:border-teal-500 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
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

export default EditModal;
