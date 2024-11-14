import React from 'react';

import Container from '@/components/ui/container';

import { LANDING_BENEFITS } from '@/constants/constants';

const ORANGE_GRADIENT_TEXT_CLASS =
  'bg-gradient-to-b from-wm-orange-200 to-wm-orange-600 bg-clip-text text-transparent';

const Benefits = () => {
  return (
    <section className="bg-gradient-to-t from-white to-wm-orange-500">
      <div className="container mx-auto grid gap-4 px-4 py-16 sm:px-0 lg:grid-cols-2">
        <p className="mb-4 text-center lg:col-span-2">
          <span className="font-poppins text-xl text-white md:text-3xl">
            Looking to save time? Work with Workman.
          </span>
        </p>
        {LANDING_BENEFITS.map((benefit, index) => (
          <Container
            className={`bg-white ${index % 2 === 0 ? 'animate-appear-from-left' : 'animate-appear-from-right'}`}
            innerClassName="px-4 py-6 md:p-8 text-center flex flex-col items-center justify-center"
          >
            <h2
              className={`${ORANGE_GRADIENT_TEXT_CLASS} text-4xl font-medium md:text-5xl ${/[gjyqp]/.test(benefit.title) ? 'pb-1.5' : ''}`}
            >
              <span className="font-poppins">{benefit.title}</span>
            </h2>
            <h3 className={ORANGE_GRADIENT_TEXT_CLASS}>
              {benefit.description}
            </h3>
          </Container>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
