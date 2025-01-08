import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import FallbackPage from "../Fallback/FallbackPage";

const Layout = () => {
  return (
    <div className="">
      <Header />
      <Sidebar />
      <Suspense fallback={<FallbackPage />}>
        <div className=" pt-7 sm:ml-64">< Outlet /></div>
      </Suspense>
    
    </div>
  );
};

export default Layout;
