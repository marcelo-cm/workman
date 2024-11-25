import React, { Fragment } from 'react';

import Image from 'next/image';

import Container from '@/components/ui/container';

import {
  INTEGRATION_DETAILS,
  LANDING_PAGE_FEATURES,
} from '@/constants/constants';

import { CallToAction } from '../(molecules)/call-to-action';

const FeatureItem = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => {
  return (
    <div className="flex flex-col border-l border-wm-orange px-4">
      <h3 className="mb-2">
        <span className="font-poppins font-medium">{title}</span>
      </h3>
      {description && <p>{description}</p>}
    </div>
  );
};

const Features = () => {
  return (
    <section className="animate-appear-from-bottom mx-auto flex flex-col items-center justify-center px-4 py-16 lg:px-24">
      <h1 className="mb-4 text-center">
        <span className="font-poppins text-xl md:text-3xl">
          Seamlessly fits into your workflow, making your life easier
        </span>
      </h1>
      <Container
        innerClassName="p-3 md:p-4 flex flex-col-reverse min-[1326px]:flex-row gap-4 max-w-[1150px]"
        className="my-4"
      >
        <div className="flex flex-col space-y-2 min-[1326px]:space-y-4">
          <h3 className="text-xl">
            <span className="hidden font-poppins min-[1326px]:block">
              Built from the ground up to support small teams
            </span>
          </h3>
          {LANDING_PAGE_FEATURES.map((item, idx) => (
            <FeatureItem {...item} key={idx} />
          ))}
        </div>
        <Image
          src="/images/landing/invoice-review.svg"
          alt="Invoice Review"
          width={1000}
          height={600}
          className="w-[900px] min-[1326px]:w-[800px]"
        />
      </Container>
      <Container
        innerClassName="flex p-6 max-w-[1150px] flex-col min-[1326px]:flex-row"
        className="mb-8"
      >
        {INTEGRATION_DETAILS.map(({ title, description, Icon }, idx) => (
          <Fragment key={idx}>
            <div key={idx} className="flex w-full flex-col">
              <h3 className="mb-2 flex w-full flex-row items-center justify-between">
                <span className="font-poppins font-medium">{title}</span>
                <Icon />
              </h3>
              <p>{description}</p>
            </div>
            <div className="my-4 border-t last:hidden min-[1326px]:mx-8 min-[1326px]:border-l" />
          </Fragment>
        ))}
      </Container>
      <CallToAction />
    </section>
  );
};

export default Features;
