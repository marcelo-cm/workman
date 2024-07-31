import React from 'react';

import { UseFormReturn, useFieldArray } from 'react-hook-form';

import ExtractionFormComponent from '../../components/ExtractionFormComponent';
import InvoiceApprovals from '@/components/(shared)/invoices/InvoiceApprovals';
import LoadingState from '@/components/ui/empty-state';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import IfElseRender from '@/components/ui/if-else-renderer';
import { Textarea } from '@/components/ui/text-area';

import { useExtractionReview } from '../../ExtractionReview';
import BillDetails from './BillDetails';
import LineItems from './LineItems';

const InvoiceDataForm = ({
  form,
}: {
  form: UseFormReturn<any, any, undefined>;
}) => {
  const { accounts, customers, vendors, files, activeIndex } =
    useExtractionReview();

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
            <form className="space-y-4">
              <BillDetails form={form} />
              <LineItems form={form} />
              <ExtractionFormComponent
                label="Needs Approval From"
                className="text-sm p-4"
              >
                <p className="pt-1 pb-2">
                  Everybody in this list must approve your bill before it is
                  allowed to be sent to QuickBooks.
                </p>
                <InvoiceApprovals invoice={files[activeIndex]} />
              </ExtractionFormComponent>
              <ExtractionFormComponent
                label="Additional Details"
                className="p-4"
              >
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Type your notes here..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ExtractionFormComponent>
            </form>
          </Form>
        }
      />
    </div>
  );
};

export default InvoiceDataForm;