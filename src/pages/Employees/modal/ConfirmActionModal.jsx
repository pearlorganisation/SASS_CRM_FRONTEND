import React, { useState } from "react";
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

export default function ConfirmActionModal({
  setModal,
  handleAction,
  modalData,
  action,
}) {
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
      handleAction();
    }
  };

  return (
    <Modal open={true} onClose={() => setModal(false)} closeAfterTransition>
      <Fade in={true}>
        <Box className="relative w-full max-w-md bg-white rounded-md shadow-lg p-6 mx-auto mt-20">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <Typography variant="h6" className="font-semibold">
              {action === "activate" ? "Activate" : "Deactivate"} Account
            </Typography>
            <IconButton
              onClick={() => setModal(false)}
              className="text-black hover:text-red-500"
            >
              <CloseIcon />
            </IconButton>
          </div>

          {/* Confirmation Message */}
          <Typography variant="body1" className="text-center mb-6">
            Confirm {action === "activate" ? "activation" : "deactivation"} by
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
              {action === "activate" ? "Activate" : "Deactivate"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setModal(false)}
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
