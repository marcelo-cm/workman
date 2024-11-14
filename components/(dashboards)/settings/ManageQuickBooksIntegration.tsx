import { useEffect, useState } from 'react';

import QuickBooks from '@/components/molecules/QuickBooks';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';

import { useAppContext } from '@/app/(dashboards)/context';
import { checkQuickBooksIntegration } from '@/lib/utils';
import { createQuickBooksIntegrationByCompanyID } from '@/lib/utils/nango/quickbooks.client';

const StatusBadge = ({
  integration,
}: {
  integration: {
    quickbooksToken: boolean;
    quickbooksRealmId: boolean;
  } | null;
}) => {
  if (!integration) {
    return <Badge variant="destructive">Not Connected</Badge>;
  }

  if (integration.quickbooksRealmId && integration.quickbooksToken) {
    return <Badge variant="success">Connected</Badge>;
  }

  return <Badge variant="warning">Partially Connected</Badge>;
};

const ManageQuickBooksIntegration = () => {
  const [quickbooksIntegration, setQuickbooksIntegration] = useState<null | {
    quickbooksToken: boolean;
    quickbooksRealmId: boolean;
  }>(null);
  const { user } = useAppContext();

  useEffect(() => {
    checkQuickBooksIntegration(user.company.id).then(setQuickbooksIntegration);
  }, []);

  return (
    <Container
      className="w-full"
      header={
        <div className="flex w-full flex-row items-center justify-between">
          QuickBooks Integration
          <div className="flex flex-row items-center gap-2">
            <StatusBadge integration={quickbooksIntegration} />
            <QuickBooks />
          </div>
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
