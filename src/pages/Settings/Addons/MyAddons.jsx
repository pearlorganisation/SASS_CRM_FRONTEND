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
import AddonCard from "./AddonCard";

const MyAddOns = () => {
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

  // Static data for addons
  // const addons = [
  //   {
  //     id: 1,
  //     name: "Basic AddOn",
  //     employeeLimit: 10,
  //     contactLimit: 100,
  //     addOnPrice: 20,
  //     validityInDays: 30,
  //     isActive: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Contact Only AddOn",
  //     contactLimit: 200,
  //     addOnPrice: 15,
  //     validityInDays: 15,
  //     isActive: true,
  //   },
  //   {
  //     id: 3,
  //     name: "Employee Only AddOn",
  //     employeeLimit: 50,
  //     addOnPrice: 25,
  //     validityInDays: 60,
  //     isActive: false,
  //   },
  // ];

  useEffect(() => {
    if(id){
        dispatch(getClientAddons(id));
    }
  }, [id]);



  return (
    <div className="bg-gray-100 min-h-screen px-6 pt-14">
      <h1 className="text-2xl font-bold text-center mb-6">
    
        My AddOns
      </h1>

     

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {addonsData.map((addon) => (
          <AddonCard
            key={addon._id}
            addon={addon}
            roles={roles}
            id={addon._id}
            showAction={false}
          />
        ))}
      </div>

     
    </div>
  );
};

export default MyAddOns;

