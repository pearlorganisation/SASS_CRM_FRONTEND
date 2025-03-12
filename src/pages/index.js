import { lazy } from "react";

// Lazy loading components
const Layout = lazy(() => import("../components/Layout/Layout"));
const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
const Login = lazy(() => import("./Auth/Login/Login"));
const Webinar = lazy(() => import("./Webinar/Webinar"));
const ComingSoon = lazy(() => import("./NotFound/ComingSoon"));
const NotFound = lazy(() => import("./NotFound/NotFound"));
const Employees = lazy(() => import("./Employees/Employees"));
const ViewParticularContact = lazy(() =>
  import("./Contacts/ViewParticularContact")
);
const ViewProducts = lazy(() => import("./Products/ViewProducts"));
const CreateProduct = lazy(() => import("./Products/CreateProduct"));
const ViewAttendees = lazy(() => import("./Attendees/ViewAttendees"));
const CreateEmployee = lazy(() => import("./Employees/CreateEmployee"));
const ViewSettings = lazy(() => import("./Settings/ViewSettings"));
const ViewPlans = lazy(() => import("./Settings/Plans/ViewPlans"));
const AddPlan = lazy(() => import("./Settings/Plans/AddPlan"));
const ViewSidebarLinks = lazy(() =>
  import("./Settings/SidebarLinks/ViewSidebarLinks")
);
const CreateSidebarLink = lazy(() =>
  import("./Settings/SidebarLinks/CreateSidebarLink")
);
const Assignments = lazy(() => import("./Assignments/Assignments"));
const Clients = lazy(() => import("./Clients/Clients"));
const LandingPageForm = lazy(() =>
  import("./Settings/LandingPage/LandingPageForm")
);
const PabblyToken = lazy(() => import("./Settings/PabblyToken/PabblyToken"));
const CustomOptions = lazy(() =>
  import("./Settings/CustomOptions/CustomOptions")
);
const CreateClient = lazy(() => import("./Clients/CreateClient"));
const ViewClient = lazy(() => import("./Clients/ViewClient"));
const Profile = lazy(() => import("./Profile/Profile"));
const WebinarAttendees = lazy(() => import("./Webinar/WebinarAttendees"));
const NotesPage = lazy(() => import("./Contacts/NotesPage"));
const AttendeeHistory = lazy(() => import("./Contacts/AttendeeHistory"));
const CalendarPage = lazy(() => import("./Calendar/CalendarPage"));
const AddOnsPage = lazy(() => import("./Settings/Addons/Addons"));
const ViewEmployee = lazy(() => import("./Employees/ViewEmployee"));
const LeadTypes = lazy(() => import("./Settings/LeadType/ManageLeadTypes"));
const EmployeeDashboard = lazy(() => import("./Dashboard/EmployeeDashboard"));
const UpdateNoticeBoard = lazy(() => import("./NoticeBoard/UpdateNoticeBoard"));
const NoticeBoard = lazy(() => import("./NoticeBoard/NoticeBoard"));
const MyAddOns = lazy(() => import("./Settings/Addons/MyAddons"));
const Notifications = lazy(() => import("./Notifications/Notifications"));
const BillingHistory = lazy(() =>
  import("./Settings/BillingHistory/BillingHistory")
);
const PlanOrder = lazy(() => import("./Settings/Plans/PlanOrder"));
const UpdateClientPlan = lazy(() => import("./Clients/UpdateClientPlan"));
const Revenue = lazy(() => import("./Revenue/Revenue"));
const ProductLevel = lazy(() => import("./Products/ProductLevel"));
const ManageTags = lazy(() => import("./Settings/Tags/ManageTags"));
const Locations = lazy(() => import("./Location/Location"));
const ProductRevenue = lazy(() => import("./Revenue/ProductRevenue"));
const ProductEnrollments = lazy(() => import("./Products/ProductEnrollments"));
const UserDownloads = lazy(() => import("./Notifications/UserDownloads"));
const EmployeeAssignMetrics = lazy(() => import("./Assignments/EmployeeAssignMetrics"));

export {
  CalendarPage,
  UpdateNoticeBoard,
  NoticeBoard,
  AddOnsPage,
  ViewEmployee,
  LeadTypes,
  EmployeeDashboard,
  AttendeeHistory,
  Dashboard,
  Login,
  Webinar,
  Layout,
  ComingSoon,
  NotFound,
  Employees,
  ViewParticularContact,
  ViewProducts,
  CreateProduct,
  ViewAttendees,
  CreateEmployee,
  ViewSettings,
  ViewPlans,
  AddPlan,
  ViewSidebarLinks,
  CreateSidebarLink,
  Assignments,
  Clients,
  LandingPageForm,
  PabblyToken,
  CustomOptions,
  CreateClient,
  ViewClient,
  Profile,
  WebinarAttendees,
  NotesPage,
  MyAddOns,
  Notifications,
  BillingHistory,
  PlanOrder,
  UpdateClientPlan,
  Revenue,
  ProductLevel,
  ManageTags,
  Locations,
  ProductRevenue,
  ProductEnrollments,
  UserDownloads,
  EmployeeAssignMetrics
};
