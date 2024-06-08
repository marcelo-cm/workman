import SideBar from "@/components/dashboard/SideBar";
import React from "react";

const AppLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex h-dvh w-dvw flex-row overflow-x-hidden bg-white text-black">
      <SideBar />
      <main className="no-scrollbar flex h-dvh w-full items-center overflow-scroll">
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
