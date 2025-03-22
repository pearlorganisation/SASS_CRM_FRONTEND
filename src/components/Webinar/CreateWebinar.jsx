import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { closeModal } from "../../features/slices/modalSlice";
import {
  createWebinar,
  updateWebinar,
} from "../../features/actions/webinarContact";
import { ClipLoader } from "react-spinners";
import { getAllEmployees } from "../../features/actions/employee";
import useRoles from "../../hooks/useRoles";
import useAddUserActivity from "../../hooks/useAddUserActivity";
import { getAllProductsByAdminId } from "../../features/actions/product";
import { DateFormat } from "../../utils/extra";
import DatePicker from "react-datepicker";

const CreateWebinar = ({ modalName }) => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const logUserActivity = useAddUserActivity();
  const { isLoading, isSuccess } = useSelector((state) => state.webinarContact);
  const { modals, modalData } = useSelector((state) => state.modals);
  const open = modals[modalName] ? true : false;

  const { employeeData } = useSelector((state) => state.employee);
  const { userData } = useSelector((state) => state.auth);
  const dateFormat = userData?.dateFormat || DateFormat.DD_MM_YYYY;
  const { productDropdownData } = useSelector((state) => state.product);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      webinarDate: null,
    },
  });

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (open) {
      dispatch(
        getAllEmployees({
          page: 1,
          limit: 100,
          filters: { isActive: "active" },
        })
      );
      dispatch(getAllProductsByAdminId());
    }
  }, [open]);

  useEffect(() => {
    if (employeeData) {
      setOptions(
        employeeData.map((employee) => ({
          value: employee._id,
          label: `${employee.userName} - ${employee.role}`,
        }))
      );
    }
  }, [employeeData]);

  useEffect(() => {
    if (!open) return;
    if (modalData) {
      reset({
        webinarName: modalData?.webinarName,
        webinarDate: modalData?.webinarDate?.includes("T")
          ? modalData.webinarDate.split("T")[0]
          : modalData.webinarDate,
      });
      setSelectedEmployees(
        options.filter(
          (option) =>
            modalData?.assignedEmployees &&
            modalData?.assignedEmployees?.includes(option.value)
        ) || []
      );
      setSelectedProduct(
        productDropdownData
          ?.filter((product) => modalData?.productIds?.includes(product._id))
          .map((product) => ({
            value: product._id,
            label: product.name,
          }))
      );
    } else {
      reset({
        webinarName: "",
        webinarDate: "",
      });
      setSelectedEmployees([]);
      setSelectedProduct(null);
    }
  }, [modalData, open, productDropdownData, options]);

  const submitForm = (data) => {
    const payload = {
      ...data,
      assignedEmployees: selectedEmployees.map((e) => e.value),
      productIds: selectedProduct?.map((p) => p.value),
    };

    logUserActivity({
      action: modalData ? "edit" : "create",
      type: "Webinar",
      detailItem: payload.webinarName,
    });

    if (modalData) {
      dispatch(updateWebinar({ id: modalData?._id, data: payload }));
      return;
    }
    dispatch(createWebinar(payload));
  };

  const handleClose = () => {
    dispatch(closeModal(modalName));
    reset({
      webinarName: "",
      webinarDate: "",
    });
    setSelectedEmployees([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800">
            {modalData ? "Edit Webinar" : "Create Webinar"}
          </h2>
        </div>

        <form onSubmit={handleSubmit(submitForm)}>
          <div className="p-6 space-y-4">
            {/* Webinar Name */}
            <TextField
              label="Webinar Name"
              fullWidth
              variant="outlined"
              control={control}
              {...register("webinarName", {
                required: "Webinar Name is required",
              })}
              error={!!errors.webinarName}
              helperText={errors.webinarName?.message}
            />

            {/* Webinar Date */}
            <div className="border rounded-lg grid grid-cols-1 overflow-hidden">
              <Controller
                control={control}
                name="webinarDate"
                render={({ field }) => (
                  <DatePicker
                    className="w-full p-3 outline-none"
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    placeholderText="Select Webinar Date"
                    dateFormat={dateFormat}
                    showYearDropdown
                    minDate={new Date()}
                    showMonthDropdown
                    dropdownMode="select"
                  />
                )}
              />
            </div>

            {/* Employee Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Assign Employees
              </label>
              <Select
                isMulti
                options={options}
                value={selectedEmployees}
                onChange={setSelectedEmployees}
                placeholder="Select employees"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                aria-label="Assign Employees"
              />
            </div>

            {/* Product Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Assign Product
              </label>
              <Select
                isMulti
                options={
                  productDropdownData?.map((product) => ({
                    value: product._id,
                    label: `${product.name} | Level - ${product.level}`,
                  })) || []
                }
                value={selectedProduct}
                onChange={setSelectedProduct}
                isClearable={true}
                placeholder="Select product"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                aria-label="Assign Product"
              />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleClose}
                variant="outlined"
                color="secondary"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading}
                className="px-4 py-2"
              >
                {isLoading ? (
                  <ClipLoader color="#fff" size={20} />
                ) : modalData ? (
                  "Update Webinar"
                ) : (
                  "Create Webinar"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWebinar;
