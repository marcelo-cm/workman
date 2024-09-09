import React from 'react';

import { UseFormReturn, useFormContext } from 'react-hook-form';

import ExtractionFormComponent from '@/components/(dashboards)/bills/extraction/components/ExtractionFormComponent';
import Container from '@/components/ui/container';
import { FormItem } from '@/components/ui/form';

import { ReceiptData } from '@/interfaces/common.interfaces';

const ReceiptValues = () => {
  const form: UseFormReturn<ReceiptData, any, undefined> = useFormContext();

  return (
    <ExtractionFormComponent
      label={
        <div className="flex w-full flex-row items-center justify-between font-normal">
          <p className="text-2xl ">
            Total: ${Number(form.getValues('totalNet'))?.toFixed(2) || 0}
          </p>
        </div>
      }
    >
      <FormItem></FormItem>
    </ExtractionFormComponent>
  );
};

export default ReceiptValues;
