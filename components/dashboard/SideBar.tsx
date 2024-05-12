"use client";

import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { createClient } from "@/utils/supabase/client";
import { ExitIcon, FileTextIcon, PersonIcon } from "@radix-ui/react-icons";
import {
  ArrowLeftToLine,
  ArrowRightToLine,
  Check,
  FileText,
  LogOut,
} from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import WorkmanLogo from "../molecules/WorkmanLogo";
import MenuItem from "./MenuItem";

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
    checkExpandedState();
  }, []);

  function checkExpandedState() {
    if (JSON.parse(getItem("sidebar-expanded")) !== expanded) {
      setExpanded(JSON.parse(getItem("sidebar-expanded")));
    }
  }

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
      "Cannot use SideBarCollapsed outside of SideBarCollapsed component",
    );
  }

  const { activePath, expanded, setExpanded } = context;

  return (
    <div className="flex h-dvh w-[105px] min-w-[105px] flex-col items-center gap-8 border-r bg-white py-8">
      <div className="flex w-full flex-col items-center gap-6">
        <button
          className="cursor-pointer rounded p-1 text-wm-white-300 hover:bg-wm-white-50"
          onClick={() => setExpanded(true)}
        >
          <ArrowRightToLine className="h-4 w-4" />
        </button>
        <WorkmanLogo variant="EMBLEM" href="/" className="flex w-1/2" />
      </div>
      <div
        className="
        flex h-full w-full
        flex-col justify-between gap-4
        pr-2
        "
      >
        <div className="flex flex-col gap-2">
          <div className="w-full rounded-r-lg bg-wm-white-50 py-1 pr-2">
            <MenuItem href="/account">
              <PersonIcon className="h-4 w-4" />
            </MenuItem>
          </div>
          <div className="w-full rounded-r-lg bg-wm-white-50 py-1 pr-2">
            <MenuItem disabled>
              <FileText className="h-4 w-4" />
            </MenuItem>
            <MenuItem href="/unprocessed">
              <div className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-gray-800 text-xs text-white">
                3
              </div>
            </MenuItem>
            <MenuItem href="/for-approval">
              <div className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-wm-orange text-xs text-white">
                5
              </div>
            </MenuItem>
            <MenuItem href="/completed">
              <Check className="h-4 w-4" />
            </MenuItem>
          </div>
        </div>
        <div className="flex w-full flex-col rounded-r-lg bg-wm-white-50 py-1 pr-2">
          <MenuItem onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
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
      "Cannot use SideBarCollapsed outside of SideBarExpanded component",
    );
  }

  const { activePath, expanded, setExpanded } = context;

  return (
    <div className="flex h-dvh w-[240px] min-w-[240px] flex-col items-center gap-8 border-r bg-white py-8">
      <button
        className="absolute left-3.5 top-[32px] cursor-pointer rounded p-1 text-wm-white-300 hover:bg-wm-white-50"
        onClick={() => setExpanded(false)}
      >
        <ArrowLeftToLine className="h-4 w-4" />
      </button>
      <WorkmanLogo variant="COMBO" href="/" className="flex w-1/2" />
      <div
        className="
        flex h-full w-full
        flex-col justify-between gap-4
        pr-4
        "
      >
        <div className="flex flex-col gap-2">
          <div className="w-full rounded-r-lg bg-wm-white-50 py-1 pr-2">
            <MenuItem icon href="/account">
              <PersonIcon className="h-4 w-4" />
              Manage Account
            </MenuItem>
          </div>
          <div className="w-full rounded-r-lg bg-wm-white-50 py-1 pr-2">
            <MenuItem icon disabled>
              <FileTextIcon className="h-4 w-4" />
              Bills
            </MenuItem>
            <MenuItem href="/unprocessed">
              <div className="flex w-full items-center justify-between">
                Unprocessed
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-wm-white-800 text-xs text-white">
                  3
                </div>
              </div>
            </MenuItem>
            <MenuItem href="/for-approval">
              <div className="flex w-full items-center justify-between">
                For Approval{" "}
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-wm-orange text-xs text-white">
                  5
                </div>
              </div>
            </MenuItem>
            <MenuItem href="/completed">
              <div className="flex w-full items-center justify-between">
                Completed
                <Check className="h-4 w-4" />
              </div>
            </MenuItem>
          </div>
        </div>
        <div className="flex w-full flex-col rounded-r-lg bg-wm-white-50 py-1 pr-2">
          <MenuItem icon onClick={handleSignOut}>
            <ExitIcon className="h-4 w-4" />
            Sign Out
          </MenuItem>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
