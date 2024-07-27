'use client';

import { useState } from 'react';

import Gmail from '@/components/molecules/Gmail';
import QuickBooks from '@/components/molecules/QuickBooks';
import { BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combo-box';
import IfElseRender from '@/components/ui/if-else-renderer';

import { useGmail } from '@/lib/hooks/gmail/useGmail';
import { useVendor } from '@/lib/hooks/quickbooks/useVendor';
import { useUser } from '@/lib/hooks/supabase/useUser';

import { Label_Basic } from '@/interfaces/gmail.interfaces';
import { Vendor } from '@/interfaces/quickbooks.interfaces';
import { handleGoogleMailIntegration } from '@/utils/nango/google';
import { handleQuickBooksIntegration } from '@/utils/nango/quickbooks';

import { useAppContext } from '../layout';
import CompanyRules from './CompanyRules';
import ManageAccount from './ManageAccount';

const Account = () => {
  const { getVendorList } = useVendor();
  const { user } = useAppContext();
  const { getLabels, createLabel } = useGmail();
  const { updateUser } = useUser();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [labels, setLabels] = useState<Label_Basic[]>([]);

  const fetchVendors = async () => {
    const columns: (keyof Vendor)[] = ['DisplayName', 'Id'];
    await getVendorList(columns, null, setVendors);
  };

  const fetchLabels = async () => {
    await getLabels(setLabels);
  };

  const handleUpsertLabel = async () => {
    const labels = await getLabels();

    const workmanLabelExists = labels.find(
      (label: Label_Basic) => label.name === 'WORKMAN_SCANNED',
    );

    const ignoreLabelExists = labels.find(
      (label: Label_Basic) => label.name === 'WORKMAN_IGNORE',
    );

    if (!workmanLabelExists) {
      const WORKMAN_SCANNED_LABEL: Omit<Label_Basic, 'id'> = {
        name: 'WORKMAN_SCANNED',
        messageListVisibility: 'show',
        labelListVisibility: 'labelShow',
        type: 'user',
      };
      const newLabel = await createLabel(WORKMAN_SCANNED_LABEL);

      if (newLabel) {
        const valuesToUpdate = {
          scanned_label_id: newLabel.id,
        };

        await updateUser(valuesToUpdate);
      }
    }

    if (!ignoreLabelExists) {
      const WORKMAN_IGNORE_LABEL: Omit<Label_Basic, 'id'> = {
        name: 'WORKMAN_IGNORE',
        messageListVisibility: 'show',
        labelListVisibility: 'labelShow',
        type: 'user',
      };
      const newLabel = await createLabel(WORKMAN_IGNORE_LABEL);

      if (newLabel) {
        const valuesToUpdate = {
          ignore_label_id: newLabel.id,
        };

        await updateUser(valuesToUpdate);
      }
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
      <BreadcrumbList>
        <BreadcrumbItem>Settings</BreadcrumbItem>
      </BreadcrumbList>
      <div className="flex w-full flex-row justify-between font-poppins text-4xl">
        Settings
      </div>
      <IfElseRender
        condition={!!user.name}
        ifTrue={<ManageAccount user={user} />}
        ifFalse={null}
      />
      <IfElseRender
        condition={!!user.company}
        ifTrue={<CompanyRules company={user.company} />}
        ifFalse={null}
      />
      <div className="flex flex-col gap-2">
        <div className="text-xl">Integrations</div>
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          Google Mail Integration <Gmail />
          <Button onClick={handleGoogleMailIntegration}>
            Connect Google Mail
          </Button>
        </div>
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          QuickBooks Integration <QuickBooks />
          <Button onClick={handleQuickBooksIntegration}>
            Connect QuickBooks
          </Button>
        </div>
        <div className="text-xl">Test Functionality</div>
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          QuickBook Vendor List
          <Button onClick={() => fetchVendors()}>Get Vendor List</Button>
          {vendors?.length > 0 && (
            <ComboBox
              options={vendors}
              getOptionLabel={(option) => option?.DisplayName}
            />
          )}
        </div>
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          Google Mail Labels
          <Button onClick={() => fetchLabels()}>Get Labels</Button>
          {labels?.length > 0 && (
            <ComboBox
              options={labels}
              getOptionLabel={(option) => option?.name}
            />
          )}
        </div>
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          Upsert Workman Label
          <Button onClick={() => handleUpsertLabel()}>Action!</Button>
        </div>
      </div>
    </div>
  );
};

export default Account;