import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import {
  createCustomOption,
  deleteCustomOption,
  getCustomOptions,
} from "../../../features/actions/globalData";
import { getRoleNameByID } from "../../../utils/roles";

const CustomOptions = () => {
  const dispatch = useDispatch();
  const { customOptions } = useSelector((state) => state.globalData);
  const {role} = useSelector((state) => state.auth.userData);

  const [showModal, setShowModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleModalToggle = () => setShowModal(!showModal);

  const onSubmit = (data) => {
    data["value"] = data["label"];
    dispatch(createCustomOption(data)).then(() => {
      dispatch(getCustomOptions());
      reset();
      setShowModal(false);
    });
  };

  useEffect(() => {
    dispatch(getCustomOptions());
  }, []);

  const handleDelete = (optionId) => {
    console.log("delete", optionId);

    dispatch(deleteCustomOption(optionId)).then(() => {
      dispatch(getCustomOptions());
    });
  };

  if(getRoleNameByID(role) !== "ADMIN") return null;

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex justify-between py-6 items-center">
        <h1 className="text-2xl font-bold">Custom Options</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleModalToggle}
        >
          Add Custom Option
        </button>
      </div>

      {/* Display Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-4 text-left">#</th>
              <th className="p-4 text-left">Label</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {customOptions?.map((option, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{option.label}</td>
                <td className="p-4">
                  <button onClick={() => handleDelete(option?._id)}>
                    <MdDelete className="text-red-500 hover:text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Add Custom Option</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Label
                </label>
                <input
                  type="text"
                  {...register("label", { required: "Label is required" })}
                  className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                />
                {errors.label && (
                  <p className="text-red-500 text-sm">{errors.label.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleModalToggle}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Option
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOptions;
