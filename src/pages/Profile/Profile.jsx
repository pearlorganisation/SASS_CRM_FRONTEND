import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import EditIcon from "@mui/icons-material/Edit";
import PasswordUpdateForm from "../../components/Profile/PasswordUpdateForm";
import EditUserForm from "../../components/Profile/EditUserForm";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserDocumet,
  getCurrentUser,
  getUserSubscription,
  updateUser,
} from "../../features/actions/auth";
import { ExpandLess, ExpandMore, Delete } from "@mui/icons-material";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import useRoles from "../../hooks/useRoles";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { DateFormat, formatDateAsNumber } from "../../utils/extra";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();

  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const { isLoading, userData, isSuccess, subscription } = useSelector(
    (state) => state.auth
  );

  const dateFormat = userData?.dateFormat || DateFormat.DD_MM_YYYY;
  const totalContactLimit =
    (subscription?.contactLimit ?? 0) + (subscription?.contactLimitAddon ?? 0);
  const totalEmployeeLimit =
    (subscription?.employeeLimit ?? 0) +
    (subscription?.employeeLimitAddon ?? 0);
  const usedContacts = subscription?.contactCount ?? 0;

  const [isDocumentOpen, setIsDocumentOpen] = useState(false);
  const [doc, setDoc] = useState(null);
  console.log("doc", doc);
  const [deletemodal, setdeleteModal] = useState(false);

  const toggleEdit = () => {
    setIsEditingInfo((prev) => !prev);
  };

  const handleDeleteModal = () => {
    dispatch(deleteUserDocumet(doc.filename)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        logUserActivity({
          action: "delete",
          type: "document",
          detailItem: document.filename,
        });
        setdeleteModal(false);
      }
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

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getUserSubscription());
  }, []);

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex pt-14 justify-center p-8">
        <div className="w-full h-fit max-w-4xl grid grid-cols-1 gap-6">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* User Info Section */}
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
                <p className="mb-2">
                  <strong>Company:</strong> {userData?.companyName || "N/A"}
                </p>
                <p className="mb-2">
                  <strong>Date Format:</strong> {dateFormat?.toUpperCase().replaceAll("-", "/")}
                </p>
                <ComponentGuard allowedRoles={[roles.ADMIN]}>
                  <p className="mb-2">
                    <strong>GST Number:</strong> {userData?.gst || "N/A"}
                  </p>

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

                                <button
                                  onClick={() => {
                                    setDoc(doc);
                                    setdeleteModal(true);
                                  }}
                                  className="p-2 rounded-lg text-red-400 hover:text-red-600 duration-150 hover:bg-gray-50"
                                >
                                  <Delete />
                                </button>
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

          <PasswordUpdateForm />
         </div>

 {/* Subscription Details Section */}
 <ComponentGuard allowedRoles={[roles.ADMIN]}>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full">
              <h2 className="text-2xl font-semibold mb-4">
                Subscription Details
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <DetailItem
                  label="Plan Name"
                  value={subscription?.plan?.name || "N/A"}
                />
                <DetailItem label="Contacts Used" value={usedContacts} />
                
                <DetailItem
                  label="Base Contact Limit"
                  value={subscription?.contactLimit || 0}
                />
                <DetailItem
                  label="Contact Addons"
                  value={subscription?.contactLimitAddon || 0}
                />
                <DetailItem
                  label="Total Contact Limit"
                  value={totalContactLimit}
                />
                <DetailItem
                  label="Base Employee Limit"
                  value={subscription?.employeeLimit || 0}
                />
                <DetailItem
                  label="Start Date"
                  value={formatDateAsNumber(subscription?.startDate)}
                />
                <DetailItem
                  label="Plan Expiry Date"
                  value={formatDateAsNumber(subscription?.expiryDate)}
                />
                <DetailItem
                  label="Employee Addons"
                  value={subscription?.employeeLimitAddon || 0}
                />
                <DetailItem
                  label="Total Employee Limit"
                  value={totalEmployeeLimit}
                />
                
                <DetailItem
                  label="Toggle Limit"
                  value={subscription?.toggleLimit || 0}
                />
              </div>
            </div>
          </ComponentGuard>
          {/* Password Update Section */}

         
        </div>
      </div>
      {deletemodal && (
        <ConfirmDeleteModal
          setModal={setdeleteModal}
          triggerDelete={handleDeleteModal}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default ProfilePage;

const DetailItem = ({ label, value }) => (
  <p className="flex justify-between bg-gray-100 p-2 rounded-md">
    <strong>{label}:</strong> <span>{value}</span>
  </p>
);
