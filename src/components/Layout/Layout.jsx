import React, { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";
import FallbackPage from "../Fallback/FallbackPage";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const { isUserLoggedIn } = useSelector((state) => state.auth);
  const { isSidebarOpen } = useSelector((state) => state.globalData);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isUserLoggedIn) {
      navigate("/login");
    }
  }, [isUserLoggedIn]);
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
