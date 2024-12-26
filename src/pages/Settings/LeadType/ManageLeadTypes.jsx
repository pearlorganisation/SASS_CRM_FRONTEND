import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Modal,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addLeadType, getLeadType, updateLeadType , deleteLeadType} from "../../../features/actions/assign";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const LeadTypesForm = () => {
  const dispatch = useDispatch();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState();

  const { leadTypeData, isSuccess } = useSelector((state) => state.assign);

  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      label: "",
      color: "#000000",
    },
  });

  const openModal = (data = null) => {
    setEditData(data);
    reset(data || { label: "", color: "#000000" });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    reset();
  };

  const onSubmit = (data) => {
    if (editData) {
      // Call API to update
      dispatch(updateLeadType({ id: editData._id, ...data }));
    } else {
      dispatch(addLeadType(data));
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteLeadType(id));
  };

  useEffect(() => {
    dispatch(getLeadType());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      closeModal();
      dispatch(getLeadType());
    }
  }, [isSuccess]);

  return (
    <div className="pt-14 flex flex-col items-center space-y-8">
      {/* Header with Add Button */}
      <div className="w-full px-4 lg:px-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">Manage Lead Types</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => openModal()}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Add Lead Type
        </Button>
      </div>

      {/* Lead Types Table */}
      <div className="w-full px-4 lg:px-8">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Label</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leadTypeData.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.label}</TableCell>
                <TableCell>
                  <div
                    style={{
                      width: "60px",
                      height: "24px",
                      backgroundColor: item.color,
                      borderRadius: "10%",
                    }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => openModal(item)}
                    color="primary"
                    aria-label="edit"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(item._id)}
                    color="secondary"
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modal for Add/Update */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="add-update-leadtype-modal"
      >
        <Box className="p-6 bg-white rounded-lg shadow-md space-y-6 w-full max-w-md mx-auto mt-20">
          <h3 className="text-xl font-bold text-gray-700">
            {editData ? "Update Lead Type" : "Add Lead Type"}
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Label Input */}
            <Controller
              name="label"
              control={control}
              rules={{ required: "Label is required" }}
              render={({ field, fieldState }) => (
                <TextField
                  fullWidth
                  label="Label"
                  variant="outlined"
                  {...field}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  placeholder="Enter label"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">🔖</InputAdornment>
                    ),
                  }}
                />
              )}
            />

            {/* Color Picker */}
            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <div className="flex gap-5 items-center">
                  <label htmlFor="color-picker" className="block text-gray-600">
                    Pick a Color
                  </label>
                  <input
                    type="color"
                    id="color-picker"
                    {...field}
                    className="w-20 h-8 cursor-pointer border rounded-full"
                  />
                </div>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="bg-blue-500 hover:bg-blue-600"
            >
              {editData ? "Update Lead Type" : "Add Lead Type"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default LeadTypesForm;
