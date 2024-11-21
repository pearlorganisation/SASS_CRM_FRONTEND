import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const CreateWebinar = ({ isOpen, onClose, onSubmit, webinarData, clearData }) => {
    console.log('webinar data',webinarData);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (webinarData) {
      reset({
        webinarName: webinarData.name,
        webinarDate: webinarData.date,
      });
    } else {
      reset({
        webinarName: "",
        webinarDate: "",
      });
    }
  }, [webinarData]);

  const submitForm = (data) => {
    onSubmit(data); 
    handleClose();
  };

  const handleClose = () => {
    onClose();
    reset({
      webinarName: "",
      webinarDate: "",
    });
    clearData();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-md">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {webinarData ? "Edit Webinar" : "Create Webinar"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✖
          </button>
        </div>
        <form onSubmit={handleSubmit(submitForm)} className="p-6">
          <div className="mb-4 pb-5 relative">
            <label
              htmlFor="webinarName"
              className="block text-sm font-medium text-gray-700"
            >
              Webinar Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="webinarName"
              {...register("webinarName", {
                required: "Webinar Name is required",
              })}
              placeholder="Enter webinar name"
              className={`mt-1 block w-full rounded-md outline-none border border-gray-300 p-2 ${
                errors.webinarName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.webinarName && (
              <p className="absolute bottom-0 left-0 text-sm text-red-500">
                {errors.webinarName.message}
              </p>
            )}
          </div>

          <div className="mb-4 pb-5 relative">
            <label
              htmlFor="webinarDate"
              className="block text-sm font-medium text-gray-700"
            >
              Webinar Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="webinarDate"
              {...register("webinarDate", {
                required: "Webinar Date is required",
              })}
              className={`mt-1 block w-full outline-none rounded-md border border-gray-300 p-2 ${
                errors.webinarDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.webinarDate && (
              <p className="absolute bottom-0 left-0 text-sm text-red-500">
                {errors.webinarDate.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="mr-2 px-4 py-2 rounded-md text-gray-600 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {webinarData ? "Update Webinar" : "Create Webinar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWebinar;
