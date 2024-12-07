import React, { memo } from 'react';

import Gmail from '@/components/molecules/Gmail';
import QuickBooks from '@/components/molecules/QuickBooks';

import { PentagonShape } from '../(molecules)/pentagon-shape';

const INTEGRATION_DETAILS = [
  {
    title: 'Quickbooks',
    description:
      'In one-click, we activate a 2-way sync with QuickBooks, ensuring your information is always accurate',
    Icon: QuickBooks,
  },
  {
    title: 'Gmail',
    description:
      'We can provide a dedicate forwarding email to make invoice uploading a breeze',
    Icon: Gmail,
  },
];

const Integrations = memo(() => {
  return (
    <section className="relative flex h-fit w-full items-center justify-center">
      <span className="z-30 flex max-w-screen-xl flex-col items-center justify-center p-16 px-8 md:px-16">
        <h1 className="mb-12 w-3/4 text-wrap text-center text-2xl font-medium text-white md:text-4xl">
          Integrated To Your Favourite Apps
        </h1>
        <div className="grid w-full grid-cols-1 gap-4 text-balance text-center sm:text-left lg:grid-cols-2">
          {INTEGRATION_DETAILS.map(({ title, description, Icon }) => (
            <div className="rounded-lg border border-teal-300 bg-teal-100 p-2">
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 rounded bg-white p-[10%] sm:flex-row">
                <div className="w-fit rounded-full bg-gradient-to-br from-teal-100 to-teal-400 p-8">
                  <Icon className="size-[100px]" />
                </div>
                <div>
                  <h4 className="mb-2 font-poppins text-2xl font-medium min-[1280px]:text-4xl">
                    {title}
                  </h4>
                  <h3 className="text-zinc-500">{description}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </span>
      <PentagonShape className="absolute h-full w-full" />
    </section>
  );
});

export default Integrations;
