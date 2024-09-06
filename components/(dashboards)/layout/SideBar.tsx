'use client';

import React, { useEffect, useState } from 'react';

import { ExitIcon, GearIcon } from '@radix-ui/react-icons';
import { ArrowLeftToLine, ArrowRightToLine } from 'lucide-react';

import { usePathname } from 'next/navigation';

import IfElseRender from '../../ui/if-else-renderer';

import useLocalStorage from '@/lib/hooks/useLocalStorage';

import { createClient } from '@/lib/utils/supabase/client';

import WorkmanLogo from '../../molecules/WorkmanLogo';
import { MENU_TABS } from '../constants';
import MenuItem from './MenuItem';

interface SideBarProps {
  activePath: string;
  expanded: boolean;
}

const defaultContextValue: SideBarProps = {
  activePath: '',
  expanded: false,
};

export const SideBarContext =
  React.createContext<SideBarProps>(defaultContextValue);

const supabase = createClient();

async function handleSignOut() {
  await supabase.auth.signOut();
  window.location.href = '/';
}

const SideBar = () => {
  const { getItem, setItem } = useLocalStorage();

  const [expanded, setExpanded] = useState(false);
  const activePath = usePathname();

  useEffect(() => {
    checkExpandedState();
  }, []);

  function checkExpandedState() {
    if (JSON.parse(getItem('sidebar-expanded')) !== expanded) {
      setExpanded(JSON.parse(getItem('sidebar-expanded')));
    }
  }

  useEffect(() => {
    setItem('sidebar-expanded', expanded);
  }, [expanded]);

  const context = { activePath, expanded };

  return (
    <SideBarContext.Provider value={context}>
      <div
        className={`flex h-dvh flex-col items-center gap-8 border-r bg-white py-8 ${expanded ? 'w-[240px] min-w-[240px]' : 'w-[105px] min-w-[105px]'}`}
      >
        <button
          className={`${expanded ? 'absolute' : ''} left-3.5 top-[32px] cursor-pointer rounded p-1 text-wm-white-300 hover:bg-wm-white-50`}
          onClick={() => setExpanded((prev) => !prev)}
        >
          <IfElseRender
            condition={expanded}
            ifTrue={<ArrowLeftToLine className="h-4 w-4" />}
            ifFalse={<ArrowRightToLine className="h-4 w-4" />}
          />
        </button>
        <WorkmanLogo
          variant={expanded ? 'COMBO' : 'EMBLEM'}
          href="/"
          className="flex w-1/2"
        />
        <section className="flex h-full w-full flex-col justify-between gap-4 pr-4">
          <section className="flex flex-col gap-2">
            <div className="w-full rounded-r-lg bg-wm-white-50 py-1 pr-2">
              <MenuItem
                leadingIcon={<GearIcon className="h-4 w-4" />}
                route="/settings"
              >
                Settings
                <IfElseRender
                  condition={expanded}
                  ifTrue={<div className="w-full" />}
                  ifFalse={null}
                />
              </MenuItem>
            </div>
            <div className="w-full rounded-r-lg bg-wm-white-50 py-1 pr-2">
              {MENU_TABS.map((tab) => (
                <MenuItem
                  key={tab.route}
                  route={tab.route}
                  trailingIcon={tab.trailingIcon}
                  disabled={tab.disabled}
                >
                  {tab.name}
                </MenuItem>
              ))}
            </div>
          </section>
          <section className="flex w-full flex-col rounded-r-lg bg-wm-white-50 py-1 pr-2">
            <MenuItem
              leadingIcon={<ExitIcon className="h-4 w-4" />}
              onClick={handleSignOut}
            >
              Sign Out
              <IfElseRender
                condition={expanded}
                ifTrue={<div className="w-full" />}
                ifFalse={null}
              />
            </MenuItem>
          </section>
        </section>
      </div>
    </SideBarContext.Provider>
  );
};

export default SideBar;
