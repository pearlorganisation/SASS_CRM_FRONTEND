import React, { useEffect, useLayoutEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TextField, Button } from "@mui/material";
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
  console.log(productDropdownData, "productDropdownData");
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm();

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
      const product = productDropdownData?.find(
        (product) => product.name === modalData?.productName
      );
      setSelectedProduct(
        product
          ? {
              value: product?._id,
              label: product?.name,
            }
          : null
      );
    } else {
      reset({
        webinarName: "",
        webinarDate: "",
      });
      setSelectedEmployees([]);
      setSelectedProduct(null);
    }
  }, [modalData, open]);

  const submitForm = (data) => {
    const payload = {
      ...data,
      assignedEmployees: selectedEmployees.map((e) => e.value),
      productId: selectedProduct?.value,
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      disablePortal
    >
      <DialogTitle>{modalData ? "Edit Webinar" : "Create Webinar"}</DialogTitle>
      <form onSubmit={handleSubmit(submitForm)}>
        <DialogContent>
          <div className="space-y-4">
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
            <TextField
            
              label="Webinar Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                placeholder: dateFormat,  
              }}
              {...register("webinarDate", {
                required: "Webinar Date is required",
              })}
              error={!!errors.webinarDate}
              helperText={errors.webinarDate?.message}
            />

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
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                aria-label="Assign Employees"
              />
            </div>

            {/* Product Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Assign Product
              </label>
              <Select
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
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
                aria-label="Assign Product"
              />
            </div>
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
