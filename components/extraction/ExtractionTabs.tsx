import Invoice from "@/classes/Invoice";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/text-area";
import { InvoiceData, InvoiceObject } from "@/interfaces/common.interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookmarkIcon,
  ChevronRightIcon,
  PlusIcon,
  ResetIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Scan } from "lucide-react";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import ExtractionFormComponent from "./ExtractionFormComponent";
import UploadToQuickBooks from "./UploadToQuickBooks";

const formSchema = z.object({
  date: z
    .string()
    .min(1, "Date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  supplierName: z.string().min(1, "Supplier name is required"),
  supplierAddress: z.string().min(1, "Supplier address is required"),
  supplierEmail: z
    .string()
    .min(1, "Supplier email is required")
    .email("Invalid email"),
  supplierPhoneNumber: z.string().min(1, "Supplier phone number is required"),
  customerAddress: z.string().min(1, "Customer address is required"),
  customerName: z.string().min(1, "Customer name is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  totalNet: z.number().min(0, "Total net should be a positive number"),
  totalAmount: z.number().min(0, "Total amount should be a positive number"),
  totalTax: z.number().min(0, "Total tax should be a positive number"),
  lineItems: z
    .array(
      z.object({
        confidence: z.number().min(0, "Confidence should be a positive number"),
        description: z.string().min(1, "Description is required"),
        productCode: z.string().optional(),
        quantity: z.number().min(0, "Quantity should be a positive number"),
        totalAmount: z
          .string()
          .regex(/^\d+(\.\d+)?$/, "Number must be positive and decimal"),
        unitPrice: z.number().min(0, "Unit price should be a positive number"),
        pageId: z.number().min(0, "Page ID should be a positive number"),
      }),
    )
    .min(1, "At least one line item is required"),
  notes: z.string(),
});

const ExtractionTabs = ({
  files,
  activeIndex,
  handleSetActiveIndex,
  setActiveIndex,
}: {
  files: InvoiceObject[];
  activeIndex: number;
  handleSetActiveIndex: (index: 1 | -1) => void;
  setActiveIndex: React.Dispatch<SetStateAction<number>>;
}) => {
  const [approvedFiles, setApprovedFiles] = useState<InvoiceObject[]>([]);
  const uploadToQuickBooksTabRef = useRef<HTMLButtonElement>(null);
  const file = files[activeIndex];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: file?.data?.date || "",
      dueDate: file?.data?.dueDate || "",
      invoiceNumber: file?.data?.invoiceNumber || "",
      supplierName: file?.data?.supplierName || "",
      supplierAddress: file?.data?.supplierAddress || "",
      supplierEmail: file?.data?.supplierEmail || "",
      supplierPhoneNumber: file?.data?.supplierPhoneNumber || "",
      customerAddress: file?.data?.customerAddress || "",
      customerName: file?.data?.customerName || "",
      shippingAddress: file?.data?.shippingAddress || "",
      totalNet: file?.data?.totalNet || 0,
      totalAmount: file?.data?.totalAmount || 0,
      totalTax: file?.data?.totalTax || 0,
      lineItems: file?.data?.lineItems || [],
      notes: file?.data?.notes || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const watchLineItems = useWatch({
    control: form.control,
    name: "lineItems",
  });

  const watchTotalTax = useWatch({
    control: form.control,
    name: "totalTax",
  });

  useEffect(() => {
    if (
      approvedFiles.length === files.length &&
      uploadToQuickBooksTabRef.current
    ) {
      uploadToQuickBooksTabRef.current.focus();
    }
  }, [approvedFiles]);

  useEffect(() => {
    mapDataToForm(file?.data);
  }, [file]);

  useEffect(() => {
    const totalAmount = watchLineItems.reduce(
      (acc, item) => acc + Number(item.totalAmount),
      0,
    );

    const totalNet = totalAmount + (form?.getValues("totalTax") || 0);

    form.setValue("totalAmount", totalAmount, {
      shouldValidate: true,
      shouldDirty: true,
    });
    form.setValue("totalNet", totalNet);
  }, [watchLineItems, watchTotalTax]);

  const addLineItem = () => {
    append({
      confidence: 1,
      description: "",
      productCode: "",
      quantity: 0,
      totalAmount: "",
      unitPrice: 0,
      pageId: 0,
    });
  };

  const mapDataToForm = async (data: any) => {
    form.reset({
      date: data?.date || "",
      dueDate: data?.dueDate || "",
      invoiceNumber: data?.invoiceNumber || "",
      supplierName: data?.supplierName || "",
      supplierAddress: data?.supplierAddress || "",
      supplierEmail: data?.supplierEmail || "",
      supplierPhoneNumber: data?.supplierPhoneNumber || "",
      customerAddress: data?.customerAddress || "",
      customerName: data?.customerName || "",
      shippingAddress: data?.shippingAddress || "",
      totalNet: data?.totalNet || 0,
      totalAmount: data?.totalAmount || 0,
      totalTax: data?.totalTax || 0,
      lineItems: data?.lineItems || [],
      notes: data?.notes || "",
    });

    files[activeIndex].data = form.getValues();
  };

  const handleProcessInvoice = async (file: InvoiceObject) => {
    const mappedResponse = await Invoice.scanAndUpdate(file.fileUrl);
    mapDataToForm(mappedResponse);
  };

  const handleUpdateInvoiceData = async (file: InvoiceObject) => {
    if (!approvedFiles.includes(file)) {
      setApprovedFiles([...approvedFiles, file]);
    }

    if (!form.formState.isDirty) return;

    const data: InvoiceData = form.getValues();
    files[activeIndex].data = data;
    await Invoice.update(file.fileUrl, data);
    mapDataToForm(data);
  };

  const discardChanges = (file: InvoiceObject) => {
    mapDataToForm(file.data);
  };

  return (
    <Tabs defaultValue="1" className="relative flex h-full w-full flex-col">
      <TabsList className="sticky top-0 flex h-fit w-full rounded-none bg-white">
        <TabsTrigger
          value="1"
          className="flex h-10 w-1/2 grow justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
        >
          1. Review & Edit Details
        </TabsTrigger>
        <TabsTrigger
          value="2"
          className="flex h-10 w-1/2 grow justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
          disabled={form.formState.isDirty}
          ref={uploadToQuickBooksTabRef}
        >
          2. Upload to Quickbooks {form.formState.isDirty && "(Save Changes)"}
        </TabsTrigger>
      </TabsList>
      <div className="no-scrollbar h-full overflow-scroll">
        <TabsContent value="1" className="w-full">
          <Form {...form}>
            <form className="space-y-4 p-4">
              <div className="text-xs">
                <div>
                  <p className="mr-2 inline font-medium">Sub-Total:</p> $
                  {Number(form.getValues("totalAmount"))?.toFixed(2) || 0}
                </div>
                <FormField
                  control={form.control}
                  name="totalTax"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        <p className="w-12 break-keep font-medium">Tax: $</p>
                        <Input
                          type="number"
                          {...form.register("totalTax", {
                            setValueAs: (value) => parseFloat(value) || 0,
                            onChange: (e) =>
                              form.setValue(
                                "totalTax",
                                parseFloat(e.target.value),
                                { shouldValidate: true, shouldDirty: true },
                              ),
                          })}
                          className="h-fit w-16 px-1 py-0 text-right text-xs"
                          {...field}
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-2xl">
                  Total: ${Number(form.getValues("totalNet"))?.toFixed(2) || 0}
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
                        <Input
                          placeholder="Workman Concrete"
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
                        <Input
                          placeholder="123 Cedergate Court"
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
              </ExtractionFormComponent>
              <ExtractionFormComponent label="Line Items">
                {(fields.length &&
                  fields.map((lineItem, index) => (
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
                              <FormLabel>Code</FormLabel> <FormMessage />
                            </div>
                            <FormControl>
                              <Input
                                placeholder="CONC-001"
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
                      <div className="flex items-center justify-end gap-4 self-end text-xs">
                        Confidence: {Number(lineItem?.confidence) * 100}%
                        <Button
                          type="button"
                          onClick={() => remove(index)}
                          variant={"ghost"}
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
                  variant={"ghost"}
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
          <div className="sticky bottom-0 flex h-14 min-h-14 w-full items-center gap-2 border-t bg-white pl-2 pr-8">
            <Button
              variant={"secondary"}
              onClick={() => handleProcessInvoice(file)}
            >
              <Scan className="h-4 w-4" />
              Re-Scan
            </Button>
            <Button
              onClick={() => {
                handleUpdateInvoiceData(file);
                handleSetActiveIndex(1);
              }}
              disabled={Object.keys(form.formState.errors).length !== 0}
            >
              <BookmarkIcon /> Approve & Save
            </Button>
            {form.formState.isDirty ? (
              <Button onClick={() => discardChanges(file)} variant={"outline"}>
                <ResetIcon /> Discard Changes
              </Button>
            ) : null}
            <TabsList className="ml-auto">
              <TabsTrigger asChild value="2">
                <Button disabled={form.formState.isDirty} variant={"outline"}>
                  Ready for Upload <ChevronRightIcon />
                </Button>
              </TabsTrigger>
            </TabsList>
          </div>
        </TabsContent>
        <TabsContent value="2">
          <UploadToQuickBooks files={files} setActiveIndex={setActiveIndex} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ExtractionTabs;
