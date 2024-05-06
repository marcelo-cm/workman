import React, { ReactNode } from "react";

const MenuItem = ({
  children,
  icon = false,
  disabled = false,
}: {
  children: ReactNode;
  icon?: boolean;
  disabled?: boolean;
}) => {
  return (
    <div
      className={`
    pr-4 ${icon ? "pl-4" : "pl-10"} py-2 
    flex flex-row gap-2
    rounded-tr rounded-br 
    items-center 
     select-none
    ${
      !disabled
        ? "cursor-pointer hover:bg-white hover:border-r-2 hover:border-orange-500"
        : null
    }`}
    >
      {children}
    </div>
  );
};

export default MenuItem;
