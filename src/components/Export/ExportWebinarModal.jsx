import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import { ClipLoader } from "react-spinners";

const ExportWebinarModal = ({ modalName, defaultColumns, handleExport }) => {

  const dispatch = useDispatch();

  const { isLoading, isSuccess } = useSelector((state) => state.export);
  const modalState = useSelector((state) => state.modals.modals);
  const open = modalState[modalName] ? true : false;

  const [limit, setLimit] = useState("");
  const [selectedColumns, setSelectedColumns] = useState(
    defaultColumns.map((col) => col.key)
  );

  const handleCheckboxChange = (key) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const handleClose = () => {
    dispatch(closeModal(modalName));
  };

  const handleSubmit = () => {
    handleExport({ limit: limit || undefined, columns: selectedColumns });

  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);

  return (
    <Modal open={open} onClose={handleClose}>
      <Box className="p-6 bg-white rounded-lg shadow-lg max-w-xl mx-5 sm:mx-auto mt-20">
        <h2 className="text-xl font-semibold mb-4">Export Excel Options</h2>
        <div className="mb-4">
          <TextField
            label="Limit"
            variant="outlined"
            type="number"
            fullWidth
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            onKeyDown={(e) => {
              const allowedKeys = [
                "Backspace",
                "ArrowLeft",
                "ArrowRight",
                "Delete",
                "Tab",
              ];

              if (
                !allowedKeys.includes(e.key) &&
                !(e.key >= "0" && e.key <= "9") // Allow numeric keys
              ) {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Columns</h3>
          <div className="grid grid-cols-2 gap-2">
            {defaultColumns.map((column) => (
              <FormControlLabel
                key={column.key}
                control={
                  <Checkbox
                    checked={selectedColumns.includes(column.key)}
                    onChange={() => handleCheckboxChange(column.key)}
                  />
                }
                label={column.header}
              />
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant="contained" color="primary" onClick={handleSubmit}>
            {isLoading ? <ClipLoader className="mx-8" color="#fff" size={20} /> : "Download"}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ExportWebinarModal;
