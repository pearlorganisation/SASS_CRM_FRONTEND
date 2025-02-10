import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Modal,
  Box,
  Tooltip,
  IconButton,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { updateClient } from "../../features/actions/client";
import { resetClientState } from "../../features/slices/client";
import { closeModal } from "../../features/slices/modalSlice";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { useNavigate } from "react-router-dom";

const ActiveInactiveModal = ({ modalName }) => {
  const navigate = useNavigate();
  const logUserActivity = useAddUserActivity();
  const { modalData: clientData } = useSelector((state) => state.modals);
  console.log(clientData);


  const dispatch = useDispatch();
  const { isUpdating, isSuccess } = useSelector((state) => state.client);
  const [inputValue, setInputValue] = useState("");
  const [note, setNote] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsInputValid(e.target.value === clientData.email);
  };

  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  const handleConfirmAction = () => {
    if (inputValue === "") {
      setIsInputValid(false);
      return;
    }
    if (isInputValid) {
      if(clientData?.remainingDays <= 0 && !clientData.isActive) {
        navigate(`/client/plan/${clientData?._id}`);

        return;
      }

      dispatch(
        updateClient({
          data: { statusChangeNote: note, isActive: !clientData.isActive },
          id: clientData?._id,
        })
      );

      logUserActivity({
        action: !clientData?.isActive ? "activate" : "deactivate",
        details: `User ${
          !clientData?.isActive ? "activated" : "deactivated"
        } the Employee with Email: ${clientData?.email} and Note: ${note}`,
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
    return () => {
      dispatch(resetClientState());
    };
  }, [isSuccess]);

  const onClose = () => {
    dispatch(closeModal(modalName));
    setInputValue("");
    setNote("");
  };

  return (
    <Modal open={true} onClose={onClose} disablePortal>
      <Box
        className="relative w-full max-w-lg mx-auto mt-20 bg-white rounded-lg shadow-lg p-6"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">Confirm Action</h2>
          <Tooltip title="Close">
            <IconButton
              onClick={onClose}
              className="text-gray-600 hover:text-black"
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </div>

        {/* Modal Content */}
        <div className="text-center">
          <p className="text-gray-700 mb-4">
            To proceed, copy and paste the email below into the input field:
          </p>
          <p className="text-sm font-medium bg-gray-100 p-2 rounded border mb-6">
            {clientData?.email}
          </p>

          <TextField
            label="Enter email to confirm"
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            error={!isInputValid}
            helperText={!isInputValid && "The email entered does not match."}
            fullWidth
          />

          {/* Optional Note Section */}
          <textarea
            value={note}
            onChange={handleNoteChange}
            placeholder="Add an optional note (e.g., reason for status change)"
            className="w-full mt-4 p-2 rounded-md border border-gray-300"
            rows="4"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col space-y-2 mt-6">
          <Button
            onClick={handleConfirmAction}
            disabled={!isInputValid || isUpdating}
            variant="contained"
            color="primary"
            className={`!py-2 !font-medium ${
              isInputValid ? "!bg-blue-500" : "!bg-gray-300 !cursor-not-allowed"
            }`}
          >
            {isUpdating ? (
              <CircularProgress size={20} color="inherit" />
            ) : clientData?.isActive ? (
              "Set as Inactive"
            ) : (
              "Set as Active"
            )}
          </Button>
          <Button
            onClick={onClose}
            variant="outlined"
            className="!py-2"
          >
            Cancel
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default ActiveInactiveModal;
