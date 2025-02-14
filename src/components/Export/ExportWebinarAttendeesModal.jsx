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
import { exportWebinarAttendeesExcel } from "../../features/actions/export-excel";
import { ClipLoader } from "react-spinners";
import { attendeeTableColumns } from "../../utils/columnData";
import { resetExportSuccess } from "../../features/slices/export-excel";

const ExportWebinarAttendeesModal = ({
  modalName,
  filters,
  isAttended,
  webinarId,
  validCall,
  assignmentType,
  sort,
}) => {
  const dispatch = useDispatch();
  console.log("ExportWebinarAttendeesModal -> Render");


  const { subscription } = useSelector((state) => state.auth);
  const tableConfig = subscription?.plan?.attendeeTableConfig || {};

  const { isLoading, isSuccess } = useSelector((state) => state.export);

  const [limit, setLimit] = useState("");
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [columns, setColumns] = useState([]);

  const handleCheckboxChange = (key) => {
    setSelectedColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  const handleClose = () => {
    dispatch(closeModal(modalName));
  };

  const handleSubmit = () => {
    const limitValue = limit || undefined;
    // dispatch(exportClientExcel({ limit: limitValue, columns, filters }));
    dispatch(
      exportWebinarAttendeesExcel({
        limit: Number(limitValue) || 0,
        columns: selectedColumns,
        filters,
        isAttended,
        webinarId,
        validCall,
        assignmentType,
        sort,
      })
    );

    //
  };
  console.log("isSuccess, assignSuccess, isSuccessReAssign", isSuccess);

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      dispatch(resetExportSuccess());
    }
  }, [isSuccess]);

  useEffect(() => {
    console.log(tableConfig);
    const filteredColumns = attendeeTableColumns.filter(
      (col) => col.key in tableConfig && tableConfig[col.key].downloadable
    );
    if(tableConfig['leadType']?.downloadable){
      filteredColumns.push({ header: "LeadType", key: "leadType", width: 20 },)
    }
    setColumns(filteredColumns);
    setSelectedColumns(filteredColumns.map((col) => col.key));
  }, [tableConfig]);

  return (
    <Modal open={true} onClose={handleClose} disablePortal>
      <Box className="p-6 bg-white rounded-lg shadow-lg max-w-xl mx-5 sm:mx-auto mt-20">
        <h2 className="text-xl font-semibold mb-4">Export Excel Options</h2>
        <div className="mb-4">
          <TextField
            label="Limit"
            variant="outlined"
            type="number"
            placeholder="All"
            fullWidth
            value={limit}
            onChange={(e) => {
              if (e.target.value === "") {
                setLimit(e.target.value);
                return;
              }
              const value = Number(e.target.value);
              if (!isNaN(value) && value > 0 && value <= 10000) {
                setLimit(value);
              }
            }}
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
            InputLabelProps={{ shrink: true }}
          />
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select Columns</h3>
          <div className="grid grid-cols-2 gap-2">
            {columns.map((column) => (
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
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            {isLoading ? (
              <ClipLoader className="mx-8" color="#fff" size={20} />
            ) : (
              "Download"
            )}
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ExportWebinarAttendeesModal;
