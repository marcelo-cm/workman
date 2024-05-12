import SideBar from "@/components/dashboard/SideBar";
import React from "react";

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex flex-row bg-white text-black">
      <SideBar />
      <main className="flex h-dvh grow items-center">{children}</main>
    </div>
  );
};

export default AppLayout;
