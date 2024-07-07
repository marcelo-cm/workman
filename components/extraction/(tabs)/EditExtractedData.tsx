import React, { useEffect, useState } from 'react';

import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { Loader2Icon } from 'lucide-react';

import { UseFormReturn, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import IfElseRender from '@/components/ui/if-else-renderer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/text-area';

import { useAccount } from '@/lib/hooks/quickbooks/useAccount';

import { Account, Customer } from '@/interfaces/quickbooks.interfaces';

import { ComboBox } from '../Combobox';
import ExtractionFormComponent from '../ExtractionFormComponent';
import { useExtractionReview } from '../ExtractionReview';

const EditExtractedData = ({
  form,
}: {
  form: UseFormReturn<any, any, undefined>;
}) => {
  const { accounts, customers, vendors, activeIndex } = useExtractionReview();
  const { watch } = form;

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const initialLoading = !(
    vendors.length &&
    customers.length &&
    accounts.length
  );

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
    <div className=" p-4">
      <IfElseRender
        ternary={initialLoading}
        ifTrue={
          <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-md border bg-wm-white-50">
            Loading... <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
          </div>
        }
        ifFalse={
          <Form {...form}>
            <form className="space-y-4">
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
                <p className="text-2xl">
                  Total: ${Number(form.getValues('totalNet'))?.toFixed(2) || 0}
                </p>
              </div>
              <ExtractionFormComponent
                label="Bill Details"
                gridCols={2}
                className="p-4"
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
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <div className="my-1 flex w-full justify-between">
                        <FormLabel>Invoice #</FormLabel>
                        <FormMessage />
                      </div>

                      <FormControl>
                        <Input
                          placeholder="Workman Construction Group"
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="my-1 flex w-full justify-between">
                        <FormLabel>Date Due</FormLabel>
                        <FormMessage />
                      </div>
                      <FormControl>
                        <Input
                          placeholder="2024-04-25"
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
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <div className="my-1 flex w-full justify-between">
                        <FormLabel>Date Issued</FormLabel>
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
                  name="customerAddress"
                  render={({ field }) => (
                    <FormItem>
                      <div className="my-1 flex w-full justify-between">
                        <FormLabel>Customer/Project</FormLabel>
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
              <ExtractionFormComponent label="Line Items">
                {(fields.length &&
                  fields.map((lineItem: any, index) => (
                    <div
                      className="grid grid-cols-2 gap-3 border-b p-4 pt-2 first:pt-0 last:border-0"
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
                                    form.setValue(
                                      field.name,
                                      event.target.value,
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
                                    form.setValue(
                                      field.name,
                                      event.target.value,
                                      {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                      },
                                    );
                                  },
                                  onBlur(event) {
                                    form.setValue(
                                      field.name,
                                      parseFloat(
                                        event.target.value || 0,
                                      ).toFixed(2),
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
                                valueToMatch={watch(
                                  `lineItems.${index}.productCode`,
                                )}
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

export default EditExtractedData;