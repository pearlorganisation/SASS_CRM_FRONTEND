import React, { useEffect } from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Required CSS for the date picker
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../features/slices/modalSlice";
import FormInput from "../FormInput";
import { filterTruthyValues } from "../../utils/extra";

const FilterModal = ({ modalName, setFilters, filters }) => {
  const dispatch = useDispatch();
  const { modals } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;
  const { control, handleSubmit, register, reset } = useForm();

  const onSubmit = (data) => {
    const filterData = filterTruthyValues(data);
    setFilters(filterData);
    dispatch(closeModal(modalName));
  };

  const resetForm = () => {
    reset({
      webinarName: "",
      webinarDate: null,
      totalRegistrations: null,
      totalParticipants: null,
      totalAttendees: null,
    });
  };

  const onClose = () => {
    dispatch(closeModal(modalName));
  };

  useEffect(() => {
    console.log("open", filters);
    if (open) {
      reset({
        ...filters
      });
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box className="bg-white p-6 rounded-md mx-auto mt-20 w-full max-w-2xl ">
        <Typography variant="h6" className="text-center mb-4">
          Webinar Filters
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="max-h-[65dvh] overflow-y-auto space-y-4 p-4 border rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                name="webinarName"
                label="Webinar Name"
                control={control}
              />
              <FormInput
                name="totalRegistrations.$gte"
                label="Total Registrations (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
              <FormInput
                name="totalRegistrations.$lte"
                label="Total Registrations (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
              <FormInput
                name="totalParticipants.$gte"
                label="Total Participants (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
              <FormInput
                name="totalParticipants.$lte"
                label="Total Participants (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
              <FormInput
                name="totalAttendees.$gte"
                label="Total Attendees (Min)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
              <FormInput
                name="totalAttendees.$lte"
                label="Total Attendees (Max)"
                control={control}
                type="number"
                validation={{
                  min: {
                    value: 1,
                    message: "Value must be at least 1",
                  },
                }}
              />
            
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-1">
                <Controller
                  name="webinarDate.$gte"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className="border p-4 w-full rounded flex-1"
                      placeholderText="Webinar Date (From)"
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-1">
                <Controller
                  name="webinarDate.$lte"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      className="border p-4 w-full rounded"
                      placeholderText="Webinar Date (To)"
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between">
            <Button variant="contained" color="primary" onClick={resetForm}>
              Reset
            </Button>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outlined" color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Apply Filters
              </Button>
            </div>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default FilterModal;
