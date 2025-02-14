import React, { useState } from "react";
import { Usecase } from "../../../utils/extra";
import { useForm } from "react-hook-form";
import tagsService from "../../../services/tagsService";

const AddEditTagsModal = ({ setModal, formState, fetchTags }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: formState });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (data) => {
    setIsLoading(true);
    tagsService
      .createTag(data)
      .then((res) => {
        if (res.success) {
          setModal(false);
          fetchTags();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {formState?.id ? "Edit Tag" : "Add New Tag"}
          </h3>
          <button
            onClick={() => setModal(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Tag Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Tag Name</label>
            <input
              type="text"
              {...register("name", { 
                required: "Tag name is required",
                pattern: {
                  value: /^[a-z0-9_]+$/,
                  message: "Only lowercase letters, numbers and underscores allowed"
                }
              })}
              aria-invalid={errors.name ? "true" : "false"}
              placeholder="Enter tag name"
              onChange={(e) => {
                // Sanitize and lowercase input in real-time
                let val = e.target.value.toLowerCase();
                val = val.replace(/[^a-z0-9_]/g, '');
                e.target.value = val;
              }}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-500"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Usecase Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Purpose</label>
            <select
              {...register("usecase", { required: "Please select a purpose" })}
              aria-invalid={errors.usecase ? "true" : "false"}
              defaultValue={""}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 ${
                errors.usecase
                  ? "border-red-500 focus:ring-red-200"
                  : "focus:ring-blue-500"
              }`}
            >
              <option disabled value="">
                Select a purpose
              </option>
              {Object.entries(Usecase).map(([key, value]) => (
                <option className="capitalize" key={key} value={value}>
                  {key.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            {errors.usecase && (
              <p className="text-red-500 text-sm mt-1">
                {errors.usecase.message}
              </p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={() => setModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {formState?.id ? "Update Tag" : "Save Tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditTagsModal;
