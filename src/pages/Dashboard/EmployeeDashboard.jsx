import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardNotes } from "../../features/actions/assign";
import { StatusComponent } from "../../components/Dashboard";

const EmployeeDashboard = () => {
  const dispatch = useDispatch();

  const { dashboardNotes } = useSelector((state) => state.assign);

  useEffect(() => {
    dispatch(getDashboardNotes());
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-14">
      <StatusComponent
        statuses={dashboardNotes
          .map((note) => ({
            count: note.count,
            label: note._id,
          }))
          .sort((a, b) => b.count - a.count)}
      />
    </div>
  );
};

export default EmployeeDashboard;
