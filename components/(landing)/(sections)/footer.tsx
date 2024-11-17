import React from 'react';

import Link from 'next/link';

import Waitlist from '@/components/(shared)/general/Waitlist';

import { CallToAction } from '../(molecules)/call-to-action';

const Footer = () => {
  return (
    <section className="container mx-auto p-4 py-16 sm:px-0">
      <div className="mb-8 flex w-full flex-col gap-4 lg:flex-row lg:gap-16">
        <div>
          <div>
            <h2 className="mb-4 text-2xl leading-[125%] md:text-4xl">
              <span className="font-poppins">
                Workman is an accounting automation tool for SMB homebuilders.
              </span>
            </h2>
            <p>
              Our mission is to help the construction industry to interface with
              advanced technology.
            </p>
          </div>
        </div>
        <Waitlist className="h-fit" />
      </div>
      <div className="flex w-full flex-col-reverse items-center justify-between gap-4 md:flex-row">
        <p>
          Built by engineers at{' '}
          <Link
            href="https://www.intuitivelabs.co/?ref=workman.so"
            className="underline decoration-1 underline-offset-2 hover:decoration-wm-orange"
          >
            Intuitive Labs
          </Link>
        </p>
        <CallToAction />
      </div>
    </section>
  );
};

export default Footer;
