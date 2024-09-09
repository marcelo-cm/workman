import React from 'react';

import { useFormContext } from 'react-hook-form';

import ExtractionFormComponent from '@/components/(dashboards)/bills/extraction/components/ExtractionFormComponent';
import { ComboBox } from '@/components/ui/combo-box';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useReceiptExtractionReview } from '../../ReceiptExtractionReview';

const ReceiptDetails = () => {
  const { customers, vendors, accounts } = useReceiptExtractionReview();
  const form = useFormContext();
  const { watch } = form;
  return (
    <ExtractionFormComponent
      label="Receipt Details"
      gridCols={2}
      className="p-3"
    >
      <FormField
        control={form.control}
        name="supplierName"
        render={({ field }) => (
          <FormItem>
            <div className="my-1 flex w-full justify-between">
              <FormLabel>Vendor Name</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <ComboBox
                options={vendors}
                valueToMatch={watch(field.name)}
                callBackFunction={(newValue) => {
                  form.setValue(field.name, newValue.DisplayName, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                getOptionLabel={(option) => option?.DisplayName}
                className="w-full"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="date"
        render={({ field }) => (
          <FormItem>
            <div className="my-1 flex w-full justify-between">
              <FormLabel>Date</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <Input
                placeholder="2024-05-10"
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
        name="category"
        render={({ field }) => (
          <FormItem>
            <div className="my-1 flex w-full justify-between">
              <FormLabel>Category</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <ComboBox
                options={accounts}
                valueToMatch={watch(field.name)}
                callBackFunction={(newValue) => {
                  form.setValue(field.name, newValue.Name, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                getOptionLabel={(option) => option?.Name}
                className="w-full"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="project"
        render={({ field }) => (
          <FormItem>
            <div className="my-1 flex w-full justify-between">
              <FormLabel>Customer / Project</FormLabel>
              <FormMessage />
            </div>
            <FormControl>
              <ComboBox
                options={customers}
                valueToMatch={watch(field.name)}
                callBackFunction={(newValue) => {
                  form.setValue(field.name, newValue.DisplayName, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                getOptionLabel={(option) => option?.DisplayName}
                className="w-full"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </ExtractionFormComponent>
  );
};

export default ReceiptDetails;
