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
import {
  approveLocation,
  disapproveLocation,
  getLocationRequests,
} from "../../../features/actions/location";
// import { updateEmployeeStatus } from "../../../features/actions/employee";
// import useAddUserActivity from "../../../hooks/useAddUserActivity";

export default function RequestApprovalDisapprovalModal({ modalName }) {
  const dispatch = useDispatch();
  const { subscription } = useSelector((state) => state.auth);
  const { modals, modalData } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;

  const { isSuccess } = useSelector((state) => state.employee);
  const [inputValue, setInputValue] = useState("");
  const [isInputValid, setIsInputValid] = useState(true);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setIsInputValid(e.target.value === modalData?.name);
  };

  const handleConfirmAction = () => {
    if (inputValue === "") {
      setIsInputValid(false);
      return;
    }
    if (isInputValid) {
      if (modalName === "requestApprovalModal") {
        dispatch(approveLocation({ id: modalData?._id })).then(() => {
          dispatch(getLocationRequests({ page: 1, limit: 100 }));
        });
      } else {
        dispatch(disapproveLocation({ id: modalData?._id })).then(() => {
          dispatch(getLocationRequests({ page: 1, limit: 100 }));
        });
      }
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
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box className="relative w-full max-w-md bg-white rounded-md shadow-lg p-6 mx-auto mt-20">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-4">
            <Typography variant="h6" className="font-semibold">
              {modalName === "requestApprovalModal" ? "Approve" : "Disapprove"}{" "}
              Location.
            </Typography>
            <IconButton
              onClick={handleClose}
              className="text-black hover:text-red-500"
            >
              <CloseIcon />
            </IconButton>
          </div>

          {/* Note About Feature Usage */}
          {/* <div className="flex justify-center mb-4">
            <Typography
              variant="caption"
              className="text-gray-600 text-center mb-4"
            >
              You can only{" "}
              {modalName === "requestApprovalModal" ? "Approve" : "Disapprove"}{" "}
              a location request once.
            </Typography>
          </div> */}

          {/* Confirmation Message */}
          <Typography variant="body1" className="text-center mb-6">
            Entering Location name to submit: <strong>{modalData?.name}</strong>
          </Typography>

          {/* Input Field */}
          <div className="my-5">
            <TextField
              fullWidth
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter location as above to confirm"
              error={!isInputValid}
              helperText={
                !isInputValid && "The location name entered does not match."
              }
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
              Submit
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
