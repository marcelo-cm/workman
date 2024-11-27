import React, { Fragment } from 'react';

import Image from 'next/image';

import Chip from '@/components/ui/chip';

const Features = () => {
  return (
    <section className="animate-appear-from-bottom container mx-auto flex flex-col items-center justify-center gap-8 px-4 py-16 lg:max-w-full lg:px-24">
      <h1 className="mb-4 text-center text-xl font-medium md:text-4xl">
        Seamlessly fits into your workflow, making your life easier
      </h1>
      <div className="grid w-full grid-cols-1 gap-2 md:gap-8 lg:grid-cols-2">
        <div className="flex h-full w-full rounded-lg border border-wm-orange-200 bg-wm-orange-100 p-2">
          <div className="flex h-full w-full flex-col justify-center gap-4 rounded bg-white p-[15%]">
            <Chip className="bg-teal-600 text-white">Automation</Chip>
            <h1 className="font-poppins text-4xl font-medium">
              Invoice Capture
            </h1>
            <h3 className="text-zinc-500">
              Workman's AI-powered engine leverages world-class computer vision
              to eliminate manual invoice entry, saving you hours of copy and
              pasting fields into your accounting software
            </h3>
          </div>
        </div>
        <div className="relative flex h-full w-full flex-col items-center justify-center gap-4 bg-wm-orange-100 p-[10%] sm:flex-row lg:flex-col min-[1280px]:flex-row">
          <div className="h-full w-fit sm:w-full ">
            <Image
              className="rounded-sm object-contain shadow-md"
              src="/images/landing/pdf-scanning.svg"
              alt="Invoice Capture"
              width={300}
              height={300}
            />
          </div>
          <div className=" h-fit w-fit min-w-[200px] p-4">
            <Image
              className="object-contain"
              src="/images/landing/pdf-scanning-process.svg"
              alt="Arrow Right"
              width={200}
              height={200}
            />
          </div>
        </div>
        <div className="relative flex h-full w-full flex-col items-end justify-center gap-4 bg-wm-orange-100 p-[10%]">
          <div className="h-fit w-fit">
            <Image
              className="object-contain"
              src="/images/landing/approver-mock.svg"
              alt="Invoice Data Table"
              width={200}
              height={200}
            />
          </div>
          <div className="h-fit w-fit">
            <Image
              className="w-full object-contain"
              src="/images/landing/invoice-data-table-mock.svg"
              alt="Invoice Data Table"
              width={500}
              height={400}
            />
          </div>
        </div>
        <div className="flex h-full w-full rounded-lg border border-wm-orange-200 bg-wm-orange-100 p-2">
          <div className="flex h-full w-full flex-col justify-center gap-4 rounded bg-white p-[15%]">
            <Chip className="bg-teal-600 text-white">Management</Chip>
            <h1 className="font-poppins text-4xl font-medium">
              Approval Workflows
            </h1>
            <h3 className="text-zinc-500">
              Involve your team and make sure the right people have approved
              invoice details before creating the Quickbooks entry
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
