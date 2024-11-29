import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PasswordUpdateForm from "../../components/Profile/PasswordUpdateForm";
import EditUserForm from "../../components/Profile/EditUserForm";
import {useDispatch, useSelector} from "react-redux";
import { updateUser } from "../../features/actions/auth";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const {userData, isSuccess} = useSelector((state) => state.auth);

  const toggleEdit = () => {
    setIsEditingInfo((prev) => !prev);
  };

  const saveInfo = (data) => {
    dispatch(updateUser(data));
  };

  useEffect(() => {
    if(isSuccess){
      setIsEditingInfo(false);
    }
    
  },[isSuccess])


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
                <strong>Name:</strong> {userData?.userName}
              </p>
              <p className="mb-2">
                <strong>Email:</strong> {userData?.email}
              </p>
              <p className="mb-2">
                <strong>Phone:</strong> {userData?.phone || "N/A"}
              </p>
              <p>
                <strong>Company:</strong> {userData?.companyName || "N/A"}
              </p>
            </div>
          ) : (
            <EditUserForm onSubmit={saveInfo} onClose={toggleEdit} />
          )}
        </div>

        {/* Password Update Card */}
        <PasswordUpdateForm/>
        
      </div>
    </div>
  );
};

export default ProfilePage;
