import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Collapse,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PasswordUpdateForm from "../../components/Profile/PasswordUpdateForm";
import EditUserForm from "../../components/Profile/EditUserForm";
import { useDispatch, useSelector } from "react-redux";
import { deleteUserDocumet, updateUser } from "../../features/actions/auth";
import { ExpandLess, ExpandMore, Delete } from "@mui/icons-material";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import useRoles from "../../hooks/useRoles";
import useAddUserActivity from "../../hooks/useAddUserActivity";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const { userData, isSuccess } = useSelector((state) => state.auth);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  console.log("userData", userData);

  const toggleEdit = () => {
    setIsEditingInfo((prev) => !prev);
  };

  const handleDeleteModal = (document) => {
    dispatch(deleteUserDocumet(document.filename));
    logUserActivity({
      action: "delete",
      type: "document",
      detailItem: document.filename,
    });
  };

  const saveInfo = (data) => {
    console.log("Info updated successfully", data);
    if (data.document) data.document = data.document[0];
    dispatch(updateUser(data));
    logUserActivity({
      action: "update",
      details: "User updated the profile information",
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setIsEditingInfo(false);
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Info Card */}
        <div className="bg-white shadow-md w-full rounded-lg p-6 relative">
          {!isEditingInfo ? (
            <div>
              <div className="flex justify-end">
                <IconButton onClick={toggleEdit} className="">
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
              <ComponentGuard allowedRoles={[roles.ADMIN]}>
                <Box className="mt-3">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    className="cursor-pointer"
                    onClick={() => setIsDocumentOpen(!isDocumentOpen)}
                  >
                    <Typography variant="bold" className="mb-2 font-semibold">
                      Documents
                    </Typography>
                    <IconButton>
                      {isDocumentOpen ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Box>
                  <Collapse in={isDocumentOpen} timeout="auto" unmountOnExit>
                    {Array.isArray(userData?.documents)
                      ? userData.documents.map((doc, index) => (
                          <div
                            className="flex justify-between items-center mb-2 shadow-md"
                            key={index}
                          >
                            <Typography variant="body1">
                              {doc?.originalname}
                            </Typography>

                            <Tooltip title="Delete" arrow>
                              <button
                                onClick={() => handleDeleteModal(doc)}
                                className="p-2 rounded-lg text-red-400 hover:text-red-600 duration-150 hover:bg-gray-50"
                              >
                                <Delete />
                              </button>
                            </Tooltip>
                          </div>
                        ))
                      : null}
                  </Collapse>
                </Box>
              </ComponentGuard>
            </div>
          ) : (
            <EditUserForm onSubmit={saveInfo} onClose={toggleEdit} />
          )}
        </div>

        {/* Password Update Card */}
        <PasswordUpdateForm />
      </div>
    </div>
  );
};

export default ProfilePage;
