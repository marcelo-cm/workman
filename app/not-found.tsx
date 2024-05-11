import SideBar from "@/components/dashboard/SideBar";
import React from "react";

const NotFound = () => {
  return (
    <div className="text-black flex">
      <SideBar />
      <div>Whoops. Page not found.</div>
    </div>
  );
};

export default NotFound;
