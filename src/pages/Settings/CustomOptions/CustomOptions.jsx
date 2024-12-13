import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import {
  createCustomOption,
  deleteCustomOption,
  getCustomOptions,
} from "../../../features/actions/globalData";
import {
  Button,
  Modal,
  TextField,
  IconButton,
  Typography,
} from "@mui/material"; // Importing MUI components
import useRoles from "../../../hooks/useRoles";
import ComponentGuard from "../../../components/AccessControl/ComponentGuard";

const CustomOptions = () => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const { customOptions, isSuccess } = useSelector((state) => state.globalData);
  const { userData } = useSelector((state) => state.auth);
  const role = userData?.role || "";

  const customOptionsData = customOptions.filter(
    (option) => roles.SUPER_ADMIN === role || !option?.isDefault
  );

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOptionId, setDeleteOptionId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleModalToggle = () => setShowModal(!showModal);
  const handleDeleteModalToggle = () => setShowDeleteModal(!showDeleteModal);

  const onSubmit = (data) => {
    dispatch(createCustomOption(data));
  };

  const confirmDelete = () => {
    if (deleteOptionId) {
      dispatch(deleteCustomOption(deleteOptionId));
      setDeleteOptionId(null);
    }
    setShowDeleteModal(false);
  };

  useEffect(() => {
    dispatch(getCustomOptions());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setShowModal(false);
      reset();
      dispatch(getCustomOptions());
    }
  }, [isSuccess]);

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex justify-between py-6 items-center">
        <h1 className="text-2xl font-bold">
          {roles.SUPER_ADMIN === role ? "Default" : "Custom"} Options
        </h1>
        <ComponentGuard conditions={[userData?.isActive]}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleModalToggle}
          >
            Add {roles.SUPER_ADMIN === role ? "Default" : "Custom"} Option
          </Button>
        </ComponentGuard>
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
            {customOptionsData?.map((option, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{option.label}</td>
                <td className="p-4">
                  <IconButton
                    onClick={() => {
                      setDeleteOptionId(option?._id);
                      setShowDeleteModal(true);
                    }}
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
          <h2 className="text-xl font-semibold mb-4">
            Add {roles.SUPER_ADMIN === role ? "Default" : "Custom"} Option
          </h2>
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

      {/* Delete Warning Modal */}
      <Modal
        open={showDeleteModal}
        onClose={handleDeleteModalToggle}
        className="flex items-center justify-center"
      >
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <Typography className="text-lg font-medium mb-4">
            Are you sure you want to delete this option?
          </Typography>
          <Typography sx={{ my: 2 }} className="text-sm text-gray-600">
            If you delete this option, you will no longer be able to use it as a
            filter. This action is irreversible.
          </Typography>
          <div className="flex justify-end space-x-4">
            <Button
              variant="outlined"
              onClick={handleDeleteModalToggle}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={confirmDelete}
              className="px-4 py-2"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomOptions;
