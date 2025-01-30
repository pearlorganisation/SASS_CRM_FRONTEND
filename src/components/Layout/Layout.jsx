import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import FallbackPage from "../Fallback/FallbackPage";
import { useSelector } from "react-redux";

const Layout = () => {
  const { isSidebarOpen } = useSelector((state) => state.globalData);
  return (
    <div className="">
      <Header />
      <Sidebar />
      <Suspense fallback={<FallbackPage />}>
        <div className={` pt-7 transition-all ease-in-out duration-500 ${isSidebarOpen ? "sm:ml-64" : ""}`}>
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
};

export default Layout;
