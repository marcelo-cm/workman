import React from 'react';

import Image from 'next/image';

import Chip from '../../ui/chip';
import { OrangeText } from '../../ui/orange-text';

import { BoxTREdge, InverseBoxTLEdge } from '../(molecules)/box-shape';
import { CallToAction } from '../(molecules)/call-to-action';
import {
  InverseRectangleTLEdge,
  RectangleTLEdge,
} from '../(molecules)/rectangle-shape';

const PRODUCT_STATS = [
  {
    subject: 'Process Time',
    value: '20s',
    description: '6x Faster than manual processes',
  },
  {
    subject: 'Accuracy',
    value: '99%',
    description: 'Reducing your human Error',
  },
  {
    subject: 'Ease of Use',
    value: '5 Clicks',
    description: 'From email to QuickBooks',
  },
];

const Landing = () => {
  return (
    <span className="relative">
      <div className="slg:max-[1500px]:h-[65dvh] container relative z-50 mx-auto flex h-[90dvh] flex-col items-center overflow-hidden p-12 px-4 sm:h-[80dvh] md:px-0 md:py-16 lg:h-[75dvh] min-[1280px]:overflow-visible">
        <Chip className="animate-appear-from-top mb-4 border border-wm-orange-300 bg-wm-orange-100 font-medium text-wm-orange">
          Accounting Automation for SMB Homebuilders
        </Chip>
        <h1 className="fade-in mb-4 max-w-screen-lg text-balance text-center text-3xl font-medium leading-[120%] sm:text-4xl md:mb-8 md:text-5xl lg:text-7xl">
          <span className="font-poppins ">
            Process invoices from your email to QuickBooks{' '}
            <OrangeText className="font-poppins">In Under 5 clicks</OrangeText>
          </span>
        </h1>
        <h3 className="mb-8 w-3/4 text-balance text-center">
          We use AI to scan your invoices with{' '}
          <OrangeText>99% accuracy</OrangeText>, automatically categorize them
          according to your filing habits, and reduce the time it takes to file
          an invoice down to <OrangeText>20 seconds</OrangeText>
        </h3>
        <CallToAction />
        <Image
          className={`animate-appear-from-bottom pointer-events-none relative z-30 mt-8 w-full select-none rounded border border-wm-orange-200 bg-wm-orange-100 p-2 min-[1280px]:hidden`}
          src="/images/landing/landing-dashboard.svg"
          alt="Splash"
          width="1000"
          height="1000"
          priority
        />
      </div>
      <Image
        className="absolute left-0 top-0 z-0"
        src="/images/landing/grid-decor.svg"
        alt="Splash"
        width="300"
        height="300"
      />
      <Image
        className="absolute bottom-0 right-0 z-0 rotate-180"
        src="/images/landing/grid-decor.svg"
        alt="Splash"
        width="300"
        height="300"
      />
    </span>
  );
};

const Details = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-8 bg-zinc-800 p-8 sm:grid-cols-2 lg:max-h-[650px] lg:grid-cols-4 min-[1280px]:grid-rows-2">
      <div className="fade-in relative col-span-1 row-span-1 flex min-[1280px]:row-span-2">
        <InverseRectangleTLEdge className="absolute z-50 flex h-full w-full" />
        <Image
          className="absolute bottom-0 right-0 object-cover"
          src="/images/landing/man-otp.png"
          alt="Splash"
          fill
        />
      </div>
      <div className="relative hidden min-h-[200px] sm:col-span-2 min-[1280px]:flex">
        <div className="absolute bottom-0 flex w-full">
          <Image
            className={`animate-appear-from-bottom pointer-events-none relative z-30 w-full select-none rounded border border-wm-orange-200 bg-wm-orange-100 p-2 min-[1272px]:w-[47dvw]`}
            src="/images/landing/landing-dashboard.svg"
            alt="Splash"
            width="1000"
            height="1000"
            priority
          />
        </div>
      </div>
      <div className="fade-in relative col-span-1 row-span-1 grid grid-rows-3 flex-col min-[1280px]:row-span-2">
        {PRODUCT_STATS.map((stat, index) => (
          <div className="z-50 row-span-1 mx-4 flex flex-col justify-center gap-1 border-t border-zinc-500 py-4 text-right font-poppins font-medium text-wm-orange-50 first:border-none">
            <p className="text-2xl text-wm-orange-200">{stat.subject}</p>
            <p className="text-6xl">{stat.value}</p>
            <p className="text-lg">{stat.description}</p>
          </div>
        ))}
        <RectangleTLEdge className="absolute h-full w-full" />
      </div>
      <div className="fade-in relative col-span-1 row-span-1 flex">
        <span className="z-50 flex flex-col gap-4 p-4 text-white">
          <div className="w-fit rounded bg-zinc-600 p-2 font-poppins text-sm leading-tight min-[1640px]:text-base">
            Pilot Program
          </div>
          <h3 className="w-4/5 max-w-[475px] text-pretty text-2xl min-[1280px]:w-full min-[1280px]:text-base min-[1640px]:text-xl">
            We've partnered with a select group of homebuilders to test our
            platform. Are you interested in joining our pilot program? Book a
            demo today!
          </h3>
        </span>
        <BoxTREdge className="absolute z-10 h-full w-full" />
      </div>
      <div className="fade-in relative col-span-1 row-span-1">
        <InverseBoxTLEdge className="absolute z-50 h-full w-full" />
        <Image
          className="absolute right-0 top-0 object-cover"
          src="/images/landing/lady-at-desk.png"
          alt="Splash"
          fill
        />
      </div>
    </div>
  );
};

const Splash = () => {
  return (
    <section>
      <Landing />
      <Details />
    </section>
  );
};

export default Splash;
