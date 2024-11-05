'use client';

import React, { useEffect, useState } from 'react';

import Gmail from '@/components/molecules/Gmail';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';

import { useGmail } from '@/lib/hooks/gmail/useGmail';
import { useGmailIntegration } from '@/lib/hooks/supabase/useGmailIntegration';

import { useAppContext } from '@/app/(dashboards)/context';
import { createGoogleMailIntegrationByCompanyID } from '@/lib/utils/nango/google.client';
import {
  GmailIntegration,
  WORKMAN_IGNORE_LABEL_CREATE,
  WORKMAN_IGNORE_LABEL_NAME,
  WORKMAN_PROCESSED_LABEL_CREATE,
  WORKMAN_PROCESSED_LABEL_NAME,
} from '@/models/GmailIntegration';

const StatusBadge = ({
  integration,
}: {
  integration: GmailIntegration | undefined;
}) => {
  if (!integration) {
    return <Badge variant="destructive">Not Connected</Badge>;
  }

  if (integration.ignoredLabel && integration.processedLabel) {
    return <Badge variant="success">Connected</Badge>;
  }

  return <Badge variant="warning">Partially Connected</Badge>;
};

const ManageGmailIntegration = () => {
  const { user } = useAppContext();
  const { getGmailIntegrationByCompanyID } = useGmailIntegration();
  const { createLabel } = useGmail();
  const [gmailIntegration, setGmailIntegration] = useState<GmailIntegration>();

  useEffect(() => {
    getGmailIntegrationByCompanyID(user.company.id).then(setGmailIntegration);
  }, []);

  const handleConnect = async () => {
    const gmailIntegration = await createGoogleMailIntegrationByCompanyID(
      user.company.id,
    );

    let ignoredLabel;
    if (
      !gmailIntegration?.ignoredLabel ||
      gmailIntegration?.ignoredLabel.name !== WORKMAN_IGNORE_LABEL_NAME
    ) {
      ignoredLabel = await createLabel(WORKMAN_IGNORE_LABEL_CREATE);
    }

    let processedLabel;
    if (
      !gmailIntegration?.processedLabel ||
      gmailIntegration?.processedLabel.name !== WORKMAN_PROCESSED_LABEL_NAME
    ) {
      processedLabel = await createLabel(WORKMAN_PROCESSED_LABEL_CREATE);
    }

    if ((ignoredLabel || processedLabel) && gmailIntegration) {
      gmailIntegration?.update({
        ignored_label: ignoredLabel,
        processed_label: processedLabel,
      });
    }
  };

  return (
    <Container
      className="w-full"
      header={
        <div className="flex w-full flex-row items-center justify-between">
          Gmail Integration{' '}
          <div className="flex flex-row items-center gap-2">
            <StatusBadge integration={gmailIntegration} />
            <Gmail />
          </div>
        </div>
      }
      innerClassName="p-4"
    >
      <div className="flex w-full flex-row items-center justify-between">
        <Button size={'sm'} onClick={handleConnect}>
          Connect Gmail
        </Button>
      </div>
    </Container>
  );
};

export default ManageGmailIntegration;
