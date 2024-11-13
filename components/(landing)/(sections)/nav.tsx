import React from 'react';

import { PhoneCallIcon } from 'lucide-react';

import { Button } from '../../ui/button';

import WorkmanLogo from '../../molecules/WorkmanLogo';

const NavBar = () => {
  return (
    <nav className="absolute top-0 flex h-16 w-full items-center justify-center px-8 lg:px-24">
      <WorkmanLogo variant="COMBO" className="flex h-8 w-auto p-1.5" href="/" />
      <div className="ml-auto flex gap-2">
        <Button variant="secondary">
          <PhoneCallIcon className="h-4 w-4 stroke-[1.5]" /> Book a Demo
        </Button>
        <Button variant="outline" className="hidden sm:block">
          Sign In
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
