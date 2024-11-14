import React from 'react';

import Image from 'next/image';

import Chip from '../../ui/chip';
import { OrangeText } from '../../ui/orange-text';

import { CallToAction } from '../(molecules)/call-to-action';

const IMAGE_CLASS_NAME =
  'pointer-events-none select-none shadow-xl absolute invisible lg:visible';

const Splash = () => {
  return (
    <section className="h-[85dvh] overflow-clip border-b bg-gradient-to-b from-white from-45% to-wm-orange-500 px-4 py-16 md:px-0 lg:h-[90dvh] lg:py-24">
      <div className="container mx-auto flex flex-col items-center justify-center">
        <Chip className="animate-appear-from-top mb-4 border border-wm-orange-300 bg-wm-orange-100 font-medium text-wm-orange">
          Accounting Automation for SMB Homebuilders
        </Chip>
        <h1 className="fade-in mb-8 text-balance text-center text-4xl font-medium leading-[120%] sm:text-4xl md:text-5xl lg:text-6xl">
          <span className="font-poppins ">
            Process invoices from your email to QuickBooks in{' '}
            <OrangeText className="font-poppins">5 clicks</OrangeText>
          </span>
        </h1>
        <h3 className="mb-8 w-3/4 text-balance text-center">
          We use AI to scan your invoices with{' '}
          <OrangeText>99% accuracy</OrangeText>, automatically categorize them
          according to your filing habits, and reduce the time it takes to file
          an invoice down to <OrangeText>20 seconds</OrangeText>
        </h3>
        <CallToAction />
      </div>
      <div className="relative mx-auto mt-16 flex w-full justify-center overflow-clip px-8">
        <Image
          className={`${IMAGE_CLASS_NAME} animate-appear-from-bottom-6-deg`}
          src="/images/landing/landing-dashboard.svg"
          alt="Splash"
          width="1000"
          height="1000"
          loading="lazy"
        />
        <Image
          className={`${IMAGE_CLASS_NAME} animate-appear-from-bottom-3-deg `}
          src="/images/landing/landing-dashboard.svg"
          alt="Splash"
          width="1000"
          height="1000"
          loading="lazy"
        />
        <Image
          className={`${IMAGE_CLASS_NAME} animate-appear-from-bottom !visible !relative z-30`}
          src="/images/landing/landing-dashboard.svg"
          alt="Splash"
          width="1000"
          height="1000"
          priority
        />
      </div>
    </section>
  );
};

export default Splash;
