import { Suspense, lazy } from "react";
import ComponentGuard from "../../components/AccessControl/ComponentGuard";
import { roles } from "../../utils/roles";
const ClientDashboard = lazy(() => import("./ClientDashboard"));
const EmployeeDashboard = lazy(() => import("./EmployeeDashboard"));
const SuperAdminDashboard = lazy(() => import("./SuperAdminDashboard"));

const Dashboard = () => {
  return (
    <>
      <ComponentGuard allowedRoles={[roles.SUPER_ADMIN]}>
        <Suspense fallback={<div>Loading...</div>}>
          <SuperAdminDashboard />
        </Suspense>
      </ComponentGuard>
      <ComponentGuard allowedRoles={[roles.ADMIN]}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientDashboard />
        </Suspense>
      </ComponentGuard>
      <ComponentGuard
        allowedRoles={[roles.EMPLOYEE_SALES, roles.EMPLOYEE_REMINDER]}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <EmployeeDashboard />
        </Suspense>
      </ComponentGuard>
    </>
  );
};

export default Dashboard;
