import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { Toaster } from "sonner";

///// pages /////

import Dashboard from "./pages/Dashboard/Dashboard";
import Login from "./pages/Auth/Login/Login";
import MeetingDetails from "./pages/Meeting Details/MeetingDetails";
import Layout from "./components/Layout/Layout";
import ComingSoon from "./pages/NotFound/ComingSoon";
import NotFound from "./pages/NotFound/NotFound";
import Employees from "./pages/Employees/Employees";
import ViewParticularContact from "./pages/Contacts/ViewParticularContact";
import ViewContacts from "./pages/Contacts/ViewContacts";
import ViewProducts from "./pages/Products/ViewProducts";
import CreateProduct from "./pages/Products/CreateProduct";
import ViewAttendees from "./pages/Attendees/ViewAttendees";
import CreateEmployee from "./pages/Employees/CreateEmployee";
import ViewSettings from "./pages/Settings/ViewSettings";
import ViewPlans from "./pages/Settings/Plans/ViewPlans";
import { useSelector } from "react-redux";
import SignUp from "./pages/Auth/SignUp/SignUp";
import AddPlan from "./pages/Settings/Plans/AddPlan";
import ViewSidebarLinks from "./pages/Settings/SidebarLinks/ViewSidebarLinks";
import CreateSidebarLink from "./pages/Settings/SidebarLinks/CreateSidebarLink";
import Assignments from "./pages/Assignments/Assignments";
import Clients from "./pages/Clients/Clients";
import EmployeeAssignments from "./pages/Employees/EmployeeAssignments";
import LandingPageForm from "./pages/Settings/LandingPage/LandingPageForm";



const App = () => {
  const {isUserLoggedIn} = useSelector((state)=>state.auth)
  const {role} = useSelector((state)=>state.auth.userData)


  const router = createBrowserRouter([
          
    {
      path: "/signUp",
      element: !isUserLoggedIn ? <SignUp /> : <Dashboard />, // Redirect to dashboard if logged in
    },
    {
      path: "/",
      element: isUserLoggedIn ? <Layout /> :  <Login/> ,

      children: [
        {
          path: "/",
          element: <Dashboard />,
        },

        {
          path: "/webinarDetails",
          element:<MeetingDetails /> ,
        },
        {
          path: "/contacts/:csvId",
          element:<ViewContacts />  ,
        },
        {
          path: "/particularContact",
          element: <ViewParticularContact />,
        },
        {
          path: "/*",
          element: <ComingSoon />,
        },
        {
          path: "/employees",
          element: <Employees />,
        },
        {
          path: "/employees/assignments/:id",
          element: <EmployeeAssignments />,
        },
        {
          path: "/clients",
          element: <Clients />,
        },
        {
          path: "/products",
          element: <ViewProducts />,
        },
        {
          path: "/assignments",
          element: <Assignments />,
        },
        {
          path: "/products/addProduct",
          element: <CreateProduct />,
        },
        {
          path: "/attendees",
          element: <ViewAttendees/>,
        },
        {
          path: "/createEmployee",
          element: <CreateEmployee/>,
        },
        {
          path: "/settings",
          element: <ViewSettings/>,
        },
        {
          path: "/plans",
          element: <ViewPlans/>,
        },
        {
          path: "/plans/addPlan",
          element: <AddPlan/>,
        },
        {
          path: "/sidebarLinks",
          element: <ViewSidebarLinks/>,
        },
        {
          path: "/sidebarLinks/addSidebarLink",
          element: <CreateSidebarLink/>,
        },
        {
          path: "/update-landing-page",
          element: <LandingPageForm/>,
        },

      
        
        
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  return (
  <div className=''><Toaster position="top-center" richColors/>
  <RouterProvider router={router} />;
  </div>
  )
};

export default App;
