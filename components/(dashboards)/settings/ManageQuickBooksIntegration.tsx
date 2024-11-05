import React from 'react';

import QuickBooks from '@/components/molecules/QuickBooks';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';

import { useAppContext } from '@/app/(dashboards)/context';
import { createQuickBooksIntegrationByCompanyID } from '@/lib/utils/nango/quickbooks.client';

const ManageQuickBooksIntegration = () => {
  const { user } = useAppContext();
  return (
    <Container
      className="w-full"
      header={
        <div className="flex w-full flex-row items-center justify-between">
          QuickBooks Integration <QuickBooks />
        </div>
      }
      innerClassName="p-4"
    >
      <Button
        onClick={() => createQuickBooksIntegrationByCompanyID(user.company.id)}
        size={'sm'}
      >
        Connect to QuickBooks
      </Button>
    </Container>
  );
};

export default ManageQuickBooksIntegration;
