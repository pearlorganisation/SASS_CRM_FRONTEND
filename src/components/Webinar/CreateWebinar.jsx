import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { TextField, Button } from "@mui/material";

const CreateWebinar = ({ isOpen, onClose, onSubmit, webinarData, clearData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (webinarData) {
      reset({
        webinarName: webinarData.name,
        webinarDate: webinarData.date,
      });
    } else {
      reset({
        webinarName: "",
        webinarDate: "",
      });
    }
  }, [webinarData, reset]);

  const submitForm = (data) => {
    onSubmit(data);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    reset({
      webinarName: "",
      webinarDate: "",
    });
    clearData();
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {webinarData ? "Edit Webinar" : "Create Webinar"}
      </DialogTitle>
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
          <Button type="submit" variant="contained" color="primary">
            {webinarData ? "Update Webinar" : "Create Webinar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateWebinar;
