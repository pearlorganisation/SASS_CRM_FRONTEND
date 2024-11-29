import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import { roles } from "../../utils/roles";
import ClientDashboard from "./ClientDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import SuperAdminDashboard from "./SuperAdminDashboard";

const Dashboard = () => {
  return (
    <>
      <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
        <SuperAdminDashboard />
      </ComponentGuard>
      <ComponentGuard allowedRoles={[roles.ADMIN]}>
        <ClientDashboard />
      </ComponentGuard>
      <ComponentGuard
        allowedRoles={[roles.EMPLOYEE_SALES, roles.EMPLOYEE_REMINDER]}
      >
        <EmployeeDashboard />
      </ComponentGuard>
    </>
  );
};

export default Dashboard;
