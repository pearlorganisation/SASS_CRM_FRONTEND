import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";

const UpdateClientModal = ({ open, onClose, userName, email, phone, _id, onUpdate }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      userName,
      email,
      phone
    }
  });

  const onSubmit = (data) => {
    onUpdate({ ...data, _id });
    onClose(); 
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Client Info</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              {...register("userName", { required: "Name is required" })}
              className="mt-1 block w-full p-2 border rounded-md"
            />
            {errors.userName && <p className="text-red-500 text-xs">{errors.userName.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { 
                required: "Email is required", 
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 
                  message: "Invalid email address"
                }
              })}
              className="mt-1 block w-full p-2 border rounded-md"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              {...register("phone", { 
                required: "Phone number is required", 
                pattern: {
                  value: /^[0-9]{10}$/, 
                  message: "Invalid phone number"
                }
              })}
              className="mt-1 block w-full p-2 border rounded-md"
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} color="primary">Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateClientModal;
