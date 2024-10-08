import React from 'react';

import { UseFormReturn } from 'react-hook-form';

import Approvals from '@/components/(shared)/Approvals';
import Container from '@/components/ui/container';
import LoadingState from '@/components/ui/empty-state';
import { Form } from '@/components/ui/form';
import IfElseRender from '@/components/ui/if-else-renderer';

import { ReceiptData } from '@/interfaces/common.interfaces';

import { useReceiptExtractionReview } from '../../ReceiptExtractionReview';
import ReceiptDetails from './ReceiptDetails';
import ReceiptValues from './ReceiptValues';

const ReceiptDataForm = ({
  form,
}: {
  form: UseFormReturn<ReceiptData, any, undefined>;
}) => {
  const { accounts, customers, vendors, files, activeIndex } =
    useReceiptExtractionReview();

  const initialLoading = !(
    form &&
    vendors.length &&
    customers.length &&
    accounts.length
  );

  return (
    <div className="p-4">
      <IfElseRender
        condition={initialLoading}
        ifTrue={<LoadingState />}
        ifFalse={
          <Form {...form}>
            <form className="space-y-2">
              <ReceiptDetails />
              <ReceiptValues />
              <Container
                header="Needs Approval From"
                innerClassName="p-4 text-sm"
              >
                <p className="pb-2 pt-1">
                  Everybody in this list must approve your bill before it is
                  allowed to be sent to QuickBooks.
                </p>
                <Approvals approvable={files[activeIndex]} />
              </Container>
            </form>
          </Form>
        }
      />
    </div>
  );
};

export default ReceiptDataForm;
