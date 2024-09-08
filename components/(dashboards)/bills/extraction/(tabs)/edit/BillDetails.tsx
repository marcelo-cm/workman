import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

import ExtractionFormComponent from '../../components/ExtractionFormComponent';
import { ComboBox } from '@/components/ui/combo-box';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useVendor } from '@/lib/hooks/quickbooks/useVendor';

import { useExtractionReview } from '../../InvoiceExtractionReview';
import { invoiceDataFormSchema } from '../../constants';

const { getDefaultCategoryByVendorName } = useVendor();

const BillDetails = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof invoiceDataFormSchema>, any, undefined>;
}) => {
  const { customers, vendors } = useExtractionReview();
  const { watch } = form;
  const { fields } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });

  const setLineItemsDefaultCategories = async (vendorName: string) => {
    const defaultCategory = await getDefaultCategoryByVendorName(vendorName);
    if (!defaultCategory) return;

    fields.forEach((lineItem, index) => {
      form.setValue(
        `lineItems.${index}.productCode`,
        defaultCategory.category,
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    });
  };

  return (
    <ExtractionFormComponent label="Bill Details" gridCols={2} className="p-4">
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
                  setLineItemsDefaultCategories(newValue.DisplayName);
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
  );
};

export default BillDetails;
