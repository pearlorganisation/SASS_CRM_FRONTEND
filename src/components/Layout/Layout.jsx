import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar/Sidebar";
import Header from "./Header/Header";

const Layout = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <div className=" pt-7 sm:ml-60">< Outlet /></div>
    </>
  );
};

export default Layout;
