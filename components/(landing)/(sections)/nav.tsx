import React from 'react';

import BookDemo from '../(molecules)/book-demo-button';
import SignIn from '../(molecules)/sign-in-button';
import WorkmanLogo from '../../molecules/WorkmanLogo';

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-center px-4 backdrop-blur lg:px-24">
      <WorkmanLogo variant="COMBO" className="flex h-8 w-auto p-1.5" href="/" />
      <div className="ml-auto flex gap-2">
        <BookDemo />
        <SignIn className="hidden md:block" />
      </div>
    </nav>
  );
};

export default NavBar;
