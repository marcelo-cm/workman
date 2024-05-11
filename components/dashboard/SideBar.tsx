"use client";

import React, { useContext, useEffect, useState } from "react";
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
import { ExitIcon, FileTextIcon, PersonIcon } from "@radix-ui/react-icons";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { createClient } from "@/utils/supabase/client";

interface SideBarProps {
  activePath: string;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
}

const defaultContextValue: SideBarProps = {
  activePath: "",
  expanded: false,
  setExpanded: () => {},
};

export const SideBarContext =
  React.createContext<SideBarProps>(defaultContextValue);

const supabase = createClient();

async function handleSignOut() {
  await supabase.auth.signOut();
  window.location.href = "/";
}

const SideBar = () => {
  const { getItem, setItem } = useLocalStorage();
  const [expanded, setExpanded] = useState(false);
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(window.location.pathname);
    if (JSON.parse(getItem("sidebar-expanded")) !== expanded) {
      setExpanded(JSON.parse(getItem("sidebar-expanded")));
    }
  }, []);

  useEffect(() => {
    setItem("sidebar-expanded", expanded);
  }, [expanded]);

  const context = { activePath, expanded, setExpanded };

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

  const { activePath, expanded, setExpanded } = context;

  return (
    <div className="w-[105px] min-w-[105px] border-r h-dvh items-center flex flex-col py-8 gap-8 bg-white">
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
            <MenuItem href="/account">
              <PersonIcon className="w-4 h-4" />
            </MenuItem>
          </div>
          <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2">
            <MenuItem disabled>
              <FileText className="w-4 h-4" />
            </MenuItem>
            <MenuItem href="/unprocessed">
              <div className="text-xs min-h-5 min-w-5 bg-gray-800 rounded-full flex justify-center items-center text-white">
                3
              </div>
            </MenuItem>
            <MenuItem href="/for-approval">
              <div className="text-xs min-h-5 min-w-5 bg-wm-orange rounded-full flex justify-center items-center text-white">
                5
              </div>
            </MenuItem>
            <MenuItem href="/completed">
              <Check className="w-4 h-4" />
            </MenuItem>
          </div>
        </div>
        <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2 flex flex-col">
          <MenuItem onClick={handleSignOut}>
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

  const { activePath, expanded, setExpanded } = context;

  return (
    <div className="w-[240px] min-w-[240px] border-r items-center flex flex-col py-8 gap-8 h-dvh bg-white">
      <button
        className="absolute left-3.5 top-[32px] p-1 text-wm-white-300 hover:bg-wm-white-50 rounded cursor-pointer"
        onClick={() => setExpanded(false)}
      >
        <ArrowLeftToLine className="w-4 h-4" />
      </button>
      <WorkmanLogo variant="COMBO" href="/" className="w-1/2 flex" />
      <div
        className="
        h-full w-full pr-4
        flex flex-col gap-4
        justify-between
        "
      >
        <div className="flex flex-col gap-2">
          <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2">
            <MenuItem icon href="/account">
              <PersonIcon className="w-4 h-4" />
              Manage Account
            </MenuItem>
          </div>
          <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2">
            <MenuItem icon disabled>
              <FileTextIcon className="w-4 h-4" />
              Bills
            </MenuItem>
            <MenuItem href="/unprocessed">
              <div className="w-full flex justify-between items-center">
                Unprocessed
                <div className="text-xs h-5 w-5 bg-wm-white-800 rounded-full flex justify-center items-center text-white">
                  3
                </div>
              </div>
            </MenuItem>
            <MenuItem href="/for-approval">
              <div className="w-full flex justify-between items-center">
                For Approval{" "}
                <div className="text-xs h-5 w-5 bg-wm-orange rounded-full flex justify-center items-center text-white">
                  5
                </div>
              </div>
            </MenuItem>
            <MenuItem href="/completed">
              <div className="w-full flex justify-between items-center">
                Completed
                <Check className="w-4 h-4" />
              </div>
            </MenuItem>
          </div>
        </div>
        <div className="w-full bg-wm-white-50 rounded-r-lg py-1 pr-2 flex flex-col">
          <MenuItem icon onClick={handleSignOut}>
            <ExitIcon className="w-4 h-4" />
            Sign Out
          </MenuItem>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
