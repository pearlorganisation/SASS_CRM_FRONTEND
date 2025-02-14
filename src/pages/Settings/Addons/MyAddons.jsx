import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  getClientAddons,
} from "../../../features/actions/pricePlan";
import { resetAddonsData } from "../../../features/slices/pricePlan";
import useRoles from "../../../hooks/useRoles";
import { useParams } from "react-router-dom";
import AddonCard from "./AddonCard";

const MyAddOns = () => {
  const dispatch = useDispatch();
  const roles = useRoles();
  const { id } = useParams();



  const { addonsData } = useSelector(
    (state) => state.pricePlans
  );

  useEffect(() => {
    if (id) {
      dispatch(getClientAddons(id));
    }

    return () => {
      dispatch(resetAddonsData());
    }
  }, [id]);

  return (
    <div className="bg-gray-100 min-h-screen px-6 pt-14">
      <h1 className="text-2xl font-bold text-center mb-6">My AddOns</h1>

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
