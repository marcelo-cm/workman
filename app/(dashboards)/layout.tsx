import SideBar from "@/components/dashboard/SideBar";
import React from "react";

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-row bg-white text-black">
      <SideBar />
      <main className="flex items-center h-dvh grow">{children}</main>
    </div>
  );
};

export default AppLayout;
