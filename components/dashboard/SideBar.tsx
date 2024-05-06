"use client";

import React, { useContext, useState } from "react";
import WorkmanLogo from "../molecules/WorkmanLogo";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Check,
  FileText,
  LogOut,
  UserRound,
} from "lucide-react";
import MenuItem from "./MenuItem";

interface SideBarProps {
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const defaultContextValue: SideBarProps = {
  expanded: false,
  setExpanded: () => {},
};

const SideBarContext = React.createContext<SideBarProps>(defaultContextValue);

const SideBar = () => {
  const [expanded, setExpanded] = useState(true);
  const context = { expanded, setExpanded };

  return (
    <SideBarContext.Provider value={context}>
      {expanded ? <SideBarExpanded /> : <SideBarCollapsed />}
    </SideBarContext.Provider>
  );
};

const SideBarCollapsed = () => {
  const context = useContext(SideBarContext);

  if (!context) {
    throw new Error(
      "Cannot use SideBarCollapsed outside of SideBarCollapsed component"
    );
  }

  const { expanded, setExpanded } = context;

  return (
    <div className="w-[105px] border h-full items-center flex flex-col py-8 gap-8">
      <div className="flex flex-col gap-6 w-full items-center">
        <button
          className="p-1 text-wm-white-300 hover:bg-wm-white-50 rounded cursor-pointer"
          onClick={() => setExpanded(true)}
        >
          <ArrowRightToLine className="w-4 h-4" />
        </button>
        <WorkmanLogo variant="EMBLEM" href="/" className="w-1/2 flex" />
      </div>
      <div
        className="
        h-full w-full pr-2
        flex flex-col gap-4
        justify-between
        "
      >
        <div className="flex flex-col gap-2">
          <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2">
            <MenuItem>
              <UserRound className="w-4 h-4" />
            </MenuItem>
          </div>
          <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2">
            <MenuItem disabled>
              <FileText className="w-4 h-4" />
            </MenuItem>
            <MenuItem>
              <div className="text-xs min-h-5 min-w-5 bg-wm-orange rounded-full flex justify-center items-center text-white">
                5
              </div>
            </MenuItem>
            <MenuItem>
              <Check className="w-4 h-4" />
            </MenuItem>
          </div>
        </div>
        <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2 flex flex-col">
          <MenuItem>
            <LogOut className="w-4 h-4" />
          </MenuItem>
        </div>
      </div>
    </div>
  );
};

const SideBarExpanded = () => {
  const context = useContext(SideBarContext);

  if (!context) {
    throw new Error(
      "Cannot use SideBarCollapsed outside of SideBarExpanded component"
    );
  }

  const { expanded, setExpanded } = context;

  return (
    <div className="w-[240px] border h-full items-center flex flex-col py-8 gap-8">
      <button
        className="absolute left-3.5 top-[32px] p-1 text-wm-white-300 hover:bg-wm-white-50 rounded cursor-pointer"
        onClick={() => setExpanded(false)}
      >
        <ArrowLeftToLine className="w-4 h-4" />
      </button>
      <WorkmanLogo variant="COMBO" href="/" className="w-1/2 flex" />
      <div
        className="
        h-full w-full pr-2
        flex flex-col gap-4
        justify-between
        "
      >
        <div className="flex flex-col gap-2">
          <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2">
            <MenuItem icon>
              <UserRound className="w-4 h-4" />
              Manage Account
            </MenuItem>
          </div>
          <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2">
            <MenuItem icon disabled>
              <FileText className="w-4 h-4" />
              Bills
            </MenuItem>
            <MenuItem>
              <div className="w-full flex justify-between items-center">
                For Approval{" "}
                <div className="text-xs h-5 w-5 bg-wm-orange rounded-full flex justify-center items-center text-white">
                  5
                </div>
              </div>
            </MenuItem>
            <MenuItem>
              <div className="w-full flex justify-between items-center">
                Completed
                <Check className="w-4 h-4" />
              </div>
            </MenuItem>
          </div>
        </div>
        <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2 flex flex-col">
          <MenuItem icon>
            <LogOut className="w-4 h-4" />
            Sign Out
          </MenuItem>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
