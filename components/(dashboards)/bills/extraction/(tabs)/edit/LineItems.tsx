import React from 'react';

import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';

import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combo-box';
import Container from '@/components/ui/container';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Account } from '@/interfaces/quickbooks.interfaces';

import { useExtractionReview } from '../../ExtractionReview';
import { invoiceDataFormSchema } from '../../constants';

const LineItems = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof invoiceDataFormSchema>, any, undefined>;
}) => {
  const { accounts } = useExtractionReview();
  const { watch } = form;
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const addLineItem = () => {
    append({
      confidence: 1,
      description: '',
      productCode: '',
      quantity: 0,
      totalAmount: '',
      unitPrice: 0,
      pageId: 0,
    });
  };

  return (
    <Container
      header={
        <div className="flex w-full flex-row items-center justify-between font-normal">
          <p className="text-2xl ">
            Total: ${Number(form.getValues('totalNet'))?.toFixed(2) || 0}
          </p>
          <div className="text-xs">
            <div>
              <p className="mr-2 inline font-medium">Sub-Total:</p> $
              {Number(form.getValues('totalAmount'))?.toFixed(2) || 0}
            </div>
            <FormField
              control={form.control}
              name="totalTax"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-2">
                    <p className="w-12 break-keep font-medium">Tax: $</p>
                    <Input
                      placeholder="0.00"
                      {...field}
                      {...form.register(field.name, {
                        onChange(event) {
                          form.setValue(
                            field.name,
                            String(event.target.value),
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                            },
                          );
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
                      className="h-fit w-16 px-1 py-0 text-right text-xs"
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      }
      footer={
        <Button
          variant={'ghost'}
          className="w-full justify-end"
          type="button"
          onClick={(e) => {
            e.preventDefault;
            addLineItem();
          }}
        >
          <PlusIcon />
          Add Line Item
        </Button>
      }
    >
      {(fields.length &&
        fields.map((lineItem: any, index) => (
          <div
            className="grid grid-cols-2 gap-3 border-b p-4 pt-2 first:pt-2 last:border-0"
            key={lineItem.id}
          >
            <FormField
              control={form.control}
              name={`lineItems.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <div className="my-1 flex w-full justify-between">
                    <FormLabel>Description</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      placeholder="CONCRETE"
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
              name={`lineItems.${index}.totalAmount`}
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
            <FormField
              control={form.control}
              name={`lineItems.${index}.productCode`}
              render={({ field }) => (
                <FormItem>
                  <div className="mb-1 flex w-full justify-between">
                    <FormLabel>Category</FormLabel> <FormMessage />
                  </div>
                  <FormControl>
                    <ComboBox
                      options={accounts}
                      valueToMatch={watch(`lineItems.${index}.productCode`)}
                      callBackFunction={(newValue: Account) => {
                        form.setValue(
                          `lineItems.${index}.productCode`,
                          newValue.Name,
                          {
                            shouldValidate: true,
                            shouldDirty: true,
                          },
                        );
                      }}
                      getOptionLabel={(option) => option?.Name}
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-4 self-end text-xs">
              Confidence: {Number(lineItem?.confidence) * 100}%
              <Button
                type="button"
                onClick={() => remove(index)}
                variant={'ghost'}
                className="h-8 w-8 p-0 hover:bg-wm-white-50 hover:text-red-500"
              >
                <TrashIcon />
              </Button>
            </div>
          </div>
        ))) || (
        <p className="border-b px-2 pb-3 text-center text-wm-white-300">
          No line items
        </p>
      )}
    </Container>
  );
};

export default LineItems;
