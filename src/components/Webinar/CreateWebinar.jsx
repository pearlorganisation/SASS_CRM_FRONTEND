import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TextField, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import { createWebinar, updateWebinar } from "../../features/actions/webinarContact";
import { ClipLoader } from "react-spinners";

const CreateWebinar = ({ modalName }) => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector((state) => state.webinarContact);
  const { modals, modalData } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);

  useEffect(() => {
    console.log("modalData  ---->", modalData);
    if (modalData) {
      reset({
        webinarName: modalData?.webinarName,
        webinarDate: modalData?.webinarDate?.includes("T")
          ? modalData.webinarDate.split("T")[0]
          : modalData.webinarDate,
      });
    } else {
      reset({
        webinarName: "",
        webinarDate: "",
      });
    }
  }, [modalData]);

  const submitForm = (data) => {
    if(modalData) {
      dispatch(updateWebinar({id: modalData?._id, data}));
      return;
    }
    dispatch(createWebinar(data));
  };

  const handleClose = () => {
    dispatch(closeModal(modalName));
    reset({
      webinarName: "",
      webinarDate: "",
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{modalData ? "Edit Webinar" : "Create Webinar"}</DialogTitle>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent>
          <div className="space-y-4">
            {/* Webinar Name */}
            <TextField
              label="Webinar Name"
              fullWidth
              variant="outlined"
              {...register("webinarName", {
                required: "Webinar Name is required",
              })}
              error={!!errors.webinarName}
              helperText={errors.webinarName?.message}
            />

            {/* Webinar Date */}
            <TextField
              label="Webinar Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              {...register("webinarDate", {
                required: "Webinar Date is required",
              })}
              error={!!errors.webinarDate}
              helperText={errors.webinarDate?.message}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            type="submit"
            variant="contained"
            color="primary"
          >
            {isLoading ? (
              <ClipLoader color="#fff" className="mx-14 my-[2px]" size={20} />
            ) : modalData ? (
              "Update Webinar"
            ) : (
              "Create Webinar"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateWebinar;
