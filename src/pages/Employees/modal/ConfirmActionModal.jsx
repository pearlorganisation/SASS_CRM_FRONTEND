import React, { useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Fade,
  Modal,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../features/slices/modalSlice";
import { updateEmployeeStatus } from "../../../features/actions/employee";
import useAddUserActivity from "../../../hooks/useAddUserActivity";

export default function ConfirmActionModal({ modalName }) {
  const logUserActivity = useAddUserActivity();
  const dispatch = useDispatch();
  const { subscription } = useSelector((state) => state.auth);
  const { modals, modalData } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;

  const { isSuccess } = useSelector((state) => state.employee);
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsInputValid(e.target.value === modalData?.email);
  };

  const handleConfirmAction = () => {
    if (inputValue === "") {
      setIsInputValid(false);
      return;
    }
    if (isInputValid) {
      dispatch(
        updateEmployeeStatus({
          id: modalData?._id,
          isActive: !modalData?.isActive,
        })
      );

      logUserActivity({
        action: !modalData?.isActive ? "activate" : "deactivate",
        details: `User ${
          !modalData?.isActive ? "activated" : "deactivated"
        } the Employee with Email: ${modalData?.email}`,
      });
    }
  };

  const handleClose = () => {
    dispatch(closeModal(modalName));
    setInputValue("");
  };

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);

  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition disablePortal>
      <Fade in={open}>
        <Box className="relative w-full max-w-md bg-white rounded-md shadow-lg p-6 mx-auto mt-20">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <Typography variant="h6" className="font-semibold">
              {!modalData?.isActive ? "Activate" : "Deactivate"} Account
            </Typography>
            <IconButton
              onClick={handleClose}
              className="text-black hover:text-red-500"
            >
              <CloseIcon />
            </IconButton>
          </div>

          {/* Note About Feature Usage */}
          <div className="flex justify-center mb-4">
            <Typography
              variant="caption"
              className="text-gray-600 text-center mb-4"
            >
              You can only activate/deactivate an Employee Account{" "}
              {subscription?.toggleLimit || 0} times.
            </Typography>
          </div>

          {/* Confirmation Message */}
          <Typography variant="body1" className="text-center mb-6">
            Confirm {!modalData?.isActive ? "activation" : "deactivation"} by
            entering Email: <strong>{modalData?.email}</strong>
          </Typography>

          {/* Input Field */}
          <div className="my-5">
            <TextField
              fullWidth
              type="email"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter your email to confirm"
              error={!isInputValid}
              helperText={!isInputValid && "The email entered does not match."}
              className="mb-6"
              variant="outlined"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-4">
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmAction}
              disabled={!isInputValid}
              className="w-full"
            >
              {!modalData?.isActive ? "Activate" : "Deactivate"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
