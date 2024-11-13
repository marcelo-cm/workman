import React from 'react';

import { PhoneCallIcon } from 'lucide-react';

import { Button } from '../../ui/button';

import WorkmanLogo from '../../molecules/WorkmanLogo';

const NavBar = () => {
  return (
    <nav className="absolute top-0 flex h-16 w-full items-center px-24">
      <WorkmanLogo variant="COMBO" className="flex h-8 w-auto p-1.5" href="/" />
      <div className="flex-1"></div>
      <div className="flex flex-row gap-2">
        <Button variant={'secondary'}>
          <PhoneCallIcon className="size-[15px] stroke-[1.5px]" /> Book a Demo
        </Button>
        <Button variant={'outline'}>Sign In</Button>
      </div>
    </nav>
  );
};

export default NavBar;
