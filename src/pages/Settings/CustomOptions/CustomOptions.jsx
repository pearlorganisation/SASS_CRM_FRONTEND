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
import { Button, Modal, TextField, IconButton } from "@mui/material"; // Importing MUI components

const CustomOptions = () => {
  const dispatch = useDispatch();
  const { customOptions } = useSelector((state) => state.globalData);
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";

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
      if (res.meta.requestStatus === "fulfilled"){
        dispatch(getCustomOptions());
        reset();
        setShowModal(false);
      }
    });
  };

  useEffect(() => {
    dispatch(getCustomOptions());
  }, [dispatch]);

  const handleDelete = (optionId) => {
    dispatch(deleteCustomOption(optionId)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") dispatch(getCustomOptions());
    });
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex justify-between py-6 items-center">
        <h1 className="text-2xl font-bold">Custom Options</h1>
        <Button variant="contained" color="primary" onClick={handleModalToggle}>
          Add Custom Option
        </Button>
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
                  <IconButton
                    onClick={() => handleDelete(option?._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Adding Custom Option */}
      <Modal
        open={showModal}
        onClose={handleModalToggle}
        className="flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded shadow-lg w-80">
          <h2 className="text-xl font-semibold mb-4">Add Custom Option</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <TextField
                label="Label"
                variant="outlined"
                fullWidth
                {...register("label", { required: "Label is required" })}
                error={!!errors.label}
                helperText={errors.label?.message}
                className="mb-4"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="outlined"
                onClick={handleModalToggle}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="px-4 py-2"
              >
                Add Option
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default CustomOptions;
