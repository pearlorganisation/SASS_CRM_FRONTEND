import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PasswordUpdateForm from "../../components/Profile/PasswordUpdateForm";
import EditUserForm from "../../components/Profile/EditUserForm";

const ProfilePage = () => {
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const defaultUserInfo = {
    userName: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    companyName: "Doe Industries",
  };

  const { register, handleSubmit, reset } = useForm({
    defaultValues: defaultUserInfo,
  });


  const toggleEdit = () => {
    setIsEditingInfo((prev) => !prev);
    if (!isEditingInfo) reset(defaultUserInfo);
  };

  const saveInfo = (data) => {
    console.log("Updated User Info:", data);
    setIsEditingInfo(false);
  };


  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info Card */}
        <div className="bg-white shadow-md w-full rounded-lg p-6 relative">
          {!isEditingInfo ? (
            <div >
              <div className="flex justify-end">
              <IconButton
                onClick={toggleEdit}
                className=""
              >
                <EditIcon />
              </IconButton>
              </div>
              <h2 className="text-xl font-bold mb-4">User Information</h2>
              <p className="mb-2">
                <strong>Name:</strong> {defaultUserInfo.userName}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {defaultUserInfo.email}
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> {defaultUserInfo.phone}
              </p>
              <p>
                <strong>Company:</strong> {defaultUserInfo.companyName}
              </p>
            </div>
          ) : (
            <EditUserForm onSubmit={saveInfo} defaultUserInfo={defaultUserInfo} />
          )}
        </div>

        {/* Password Update Card */}
        <PasswordUpdateForm/>
        
      </div>
    </div>
  );
};

export default ProfilePage;
