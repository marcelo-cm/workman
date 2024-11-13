import React from 'react';

import Image from 'next/image';

import Chip from '../../ui/chip';
import { OrangeText } from '../../ui/orange-text';

import { CallToAction } from '../call-to-action';

const Splash = () => {
  return (
    <div className="h-[95dvh] min-h-[95dvh] overflow-clip border-b bg-gradient-to-b from-white from-45% to-wm-orange-500 py-32">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <Chip className="mb-4 border border-wm-orange-300 bg-wm-orange-100 font-medium text-wm-orange">
          Accounting Automation for SMB Homebuilders
        </Chip>
        <h1 className="mb-8 text-balance text-center font-poppins text-6xl font-medium leading-[120%]">
          <span className="font-poppins ">
            Process invoices from your email to QuickBooks in{' '}
            <OrangeText className="font-poppins">5 clicks</OrangeText>
          </span>
        </h1>
        <h3 className="mb-8 w-3/4 text-balance text-center">
          We use AI to scan your invoices with{' '}
          <OrangeText>99% accuracy</OrangeText>, automatically categorize them
          according to your filing habits, and reduce the time it takes to file
          an invoice down to <OrangeText>20 seconds</OrangeText>.
        </h3>
        <CallToAction />
      </div>
      <div className="container relative mx-auto mt-12 flex w-full justify-center overflow-clip">
        <Image
          className="absolute top-3 -translate-x-1 -rotate-6 shadow-xl"
          src="/images/landing/landing-dashboard.svg"
          alt="Splash"
          width="1000"
          height="1000"
          loading="lazy"
        />
        <Image
          className="absolute top-3 -translate-x-1 -rotate-3 shadow-xl"
          src="/images/landing/landing-dashboard.svg"
          alt="Splash"
          width="1000"
          height="1000"
          loading="lazy"
        />
        <Image
          className="z-50 shadow-xl"
          src="/images/landing/landing-dashboard.svg"
          alt="Splash"
          width="1000"
          height="1000"
          priority
        />
      </div>
    </div>
  );
};

export default Splash;
