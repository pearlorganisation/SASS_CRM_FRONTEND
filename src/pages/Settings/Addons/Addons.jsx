import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import TextField from "@mui/material/TextField";
import FormInput from "../../../components/FormInput";
import { errorToast } from "../../../utils/extra";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddon,
  getAddons,
  getClientAddons,
} from "../../../features/actions/pricePlan";
import { resetPricePlanSuccess } from "../../../features/slices/pricePlan";
import ComponentGuard from "../../../components/AccessControl/ComponentGuard";
import useRoles from "../../../hooks/useRoles";
import { useNavigate, useParams } from "react-router-dom";

const AddOnsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const roles = useRoles();
  const { id } = useParams();

  const [isModalOpen, setModalOpen] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { userData } = useSelector((state) => state.auth);
  const { isLoading, isSuccess, addonsData } = useSelector(
    (state) => state.pricePlans
  );

  console.log("addonsdata", addonsData);

  // Static data for addons
  const addons = [
    {
      id: 1,
      name: "Basic AddOn",
      employeeLimit: 10,
      contactLimit: 100,
      addOnPrice: 20,
      validityInDays: 30,
      isActive: true,
    },
    {
      id: 2,
      name: "Contact Only AddOn",
      contactLimit: 200,
      addOnPrice: 15,
      validityInDays: 15,
      isActive: true,
    },
    {
      id: 3,
      name: "Employee Only AddOn",
      employeeLimit: 50,
      addOnPrice: 25,
      validityInDays: 60,
      isActive: false,
    },
  ];

  useEffect(() => {
    if (!id) dispatch(getAddons());
    else dispatch(getClientAddons(id));
  }, [id]);

  useEffect(() => {
    if (isSuccess && !id) {
      setModalOpen(false);
      reset();
      dispatch(resetPricePlanSuccess());
      dispatch(getAddons());
    }
  }, [isSuccess]);

  const onSubmit = (data) => {
    console.log(data);
    if (!data.employeeLimit && !data.contactLimit) {
      errorToast("Either Employee Limit or Contact Limit must be provided.");
      return;
    }
    if (!data.contactLimit) data.contactLimit = 0;
    if (!data.employeeLimit) data.employeeLimit = 0;

    dispatch(createAddon(data));
  };

  return (
    <div className="bg-gray-100 min-h-screen px-6 pt-14">
      <h1 className="text-2xl font-bold text-center mb-6">AddOns</h1>

      <div className="flex justify-end mb-6">
        <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Create AddOn
          </button>
        </ComponentGuard>

        <ComponentGuard allowedRoles={[roles.ADMIN]} conditions={[!id ? true : false]}>
          <button
            onClick={() => {
              navigate(`/addons/${userData?._id}`);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            My AddOns
          </button>
        </ComponentGuard>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {addonsData.map((addon) => (
          <AddOnCard key={addon._id} addon={addon} roles={roles} id={id} />
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create AddOn</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                name="addonName"
                label="AddOn Name"
                control={control}
                validation={{ required: "Name is required" }}
              />

              <FormInput
                name="employeeLimit"
                label="Employee Limit"
                control={control}
                type="number"
                validation={{
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be at least 0" },
                }}
              />

              <FormInput
                name="contactLimit"
                label="Contact Limit"
                control={control}
                type="number"
                validation={{
                  valueAsNumber: true,
                  min: { value: 0, message: "Must be at least 0" },
                }}
              />

              <FormInput
                name="addOnPrice"
                label="Price"
                control={control}
                type="number"
                validation={{
                  valueAsNumber: true,
                  required: "Price is required",
                  min: { value: 0, message: "Must be at least 0" },
                }}
              />

              <FormInput
                name="validityInDays"
                label="Validity (days)"
                control={control}
                type="number"
                validation={{
                  valueAsNumber: true,
                  required: "Validity is required",
                  min: { value: 1, message: "Must be at least 1 day" },
                }}
              />

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddOnsPage;

const AddOnCard = ({ addon, id, roles }) => {
  return (
    <div
      key={addon._id}
      className={`border h-full rounded-lg p-4 shadow-md bg-white`}
    >
      <h2 className="text-lg font-semibold mb-2">{addon.addonName}</h2>
      <div className="w-full border-b mb-2"></div>
      {addon.employeeLimit ? (
        <p className="text-gray-700">Employee Limit: {addon.employeeLimit}</p>
      ) : null}
      {addon.contactLimit ? (
        <p className="text-gray-700">Contact Limit: {addon.contactLimit}</p>
      ) : null}
      <p className="text-gray-700">
        Price: {"\u20B9"}
        {addon.addOnPrice}
      </p>
      {!id ? (
        <p className="text-gray-700">Validity: {addon.validityInDays} days</p>
      ) : (
        <p className="text-gray-700">
          Expiry Date:{" "}
          {addon.expiryDate ? addon.expiryDate.split("T")[0] : "N/A"}
        </p>
      )}
       <ComponentGuard allowedRoles={[roles.ADMIN]}>
       <button className="mt-4 bottom-0 relative w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
        Select AddOn
      </button>
      </ComponentGuard>

      {/* <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
       <div className="border-t pt-4 w-full mt-2">

       </div>
      </ComponentGuard> */}
    </div>
  );
};
