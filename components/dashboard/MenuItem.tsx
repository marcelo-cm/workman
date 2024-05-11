import React, { ReactNode, useContext } from "react";
import { SideBarContext } from "./SideBar";

const MenuItem = ({
  children,
  icon = false,
  href,
  disabled = false,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  icon?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  const { activePath } = useContext(SideBarContext);
  return (
    <div
      className={`
    pr-4 ${icon ? "pl-4" : "pl-10"} py-2 
    flex flex-row gap-2
    rounded-tr rounded-br 
    items-center 
     select-none
    ${!disabled ? "cursor-pointer hover:bg-white" : null}
    ${
      activePath == href
        ? "bg-white border-r-2 border-orange-500"
        : "bg-wm-white-50"
    }`}
      onClick={
        onClick ? onClick : () => (href ? (window.location.href = href) : null)
      }
    >
      {children}
    </div>
  );
};

export default MenuItem;
