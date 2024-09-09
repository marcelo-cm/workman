import React from 'react';

import { UseFormReturn, useFormContext } from 'react-hook-form';

import ExtractionFormComponent from '@/components/(dashboards)/bills/extraction/components/ExtractionFormComponent';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
      gridCols={2}
      className="p-3"
    >
      <FormField
        control={form.control}
        name={`description`}
        render={({ field }) => (
          <FormItem>
            <div className="my-1 flex w-full justify-between">
              <FormLabel>Description</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Input
                placeholder="Client Meeting"
                {...field}
                {...form.register(field.name, {
                  onChange(event) {
                    form.setValue(field.name, event.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  },
                })}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`totalNet`}
        render={({ field }) => (
          <FormItem>
            <div className="my-1 flex w-full justify-between">
              <FormLabel>Balance ($)</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Input
                placeholder="$100.45"
                {...field}
                {...form.register(field.name, {
                  onChange(event) {
                    form.setValue(field.name, event.target.value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  },
                  onBlur(event) {
                    form.setValue(
                      field.name,
                      parseFloat(event.target.value || 0).toFixed(2),
                      {
                        shouldValidate: true,
                        shouldDirty: true,
                      },
                    );
                  },
                })}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </ExtractionFormComponent>
  );
};

export default ReceiptValues;
