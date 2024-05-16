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
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import ExtractionFormComponent from "./ExtractionFormComponent";
import { mindeeScan } from "@/lib/actions/actions";
import Invoice from "@/models/Invoice";

const formSchema = z.object({
  date: z.string().min(1, "Date is required"),
  dueDate: z.string().min(1, "Due date is required"),
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  supplierName: z.string().min(1, "Supplier name is required"),
  supplierAddress: z.string().min(1, "Supplier address is required"),
  supplierEmail: z
    .string()
    .min(1, "Supplier email is required")
    .email("Invalid email")
    .optional(),
  supplierPhoneNumber: z.string().min(1, "Supplier phone number is required"),
  totalNet: z.number().min(0, "Total net should be a positive number"),
  totalAmount: z.number().min(0, "Total amount should be a positive number"),
  totalTax: z.number().min(0, "Total tax should be a positive number"),
  lineItems: z
    .array(
      z.object({
        confidence: z.number().min(0, "Confidence should be a positive number"),
        description: z.string().min(1, "Description is required"),
        productCode: z.string().min(1, "Product code is required"),
        quantity: z.number().min(0, "Quantity should be a positive number"),
        totalAmount: z
          .number()
          .min(0, "Total amount should be a positive number"),
        unitPrice: z.number().min(0, "Unit price should be a positive number"),
        pageId: z.number().min(0, "Page ID should be a positive number"),
      }),
    )
    .min(1, "At least one line item is required"),
  notes: z.string().optional(),
});

const ExtractionTabs = ({ fileUrl }: { fileUrl: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: "",
      dueDate: "",
      invoiceNumber: "",
      supplierName: "",
      supplierAddress: "",
      supplierEmail: "",
      supplierPhoneNumber: "",
      totalNet: 0,
      totalAmount: 0,
      totalTax: 0, // Needs to read total tax from the data, but may not exist.
      lineItems: [],
      notes: "",
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
    handleFileChange();
  }, [fileUrl]);

  const handleFileChange = async () => {
    form.reset();
    const invoice = await Invoice.getByUrl(fileUrl);
    if (invoice) {
      mapDataToForm(invoice.data);
    } else {
      console.log("No invoice found, processing...");
      handleProcessInvoice(fileUrl);
    }
  };

  useEffect(() => {
    const totalAmount = watchLineItems.reduce(
      (acc, item) => acc + item.totalAmount,
      0,
    );

    form.setValue("totalAmount", totalAmount, {
      shouldValidate: true,
      shouldDirty: true,
    });
    const totalNet = totalAmount + (form?.getValues("totalTax") || 0);
    form.setValue("totalNet", totalNet, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [watchLineItems, watchTotalTax, form]);

  const addLineItem = () => {
    append({
      confidence: 1,
      description: "",
      productCode: "",
      quantity: 0,
      totalAmount: 0,
      unitPrice: 0,
      pageId: 0,
    });
  };

  const mapDataToForm = async (data: any) => {
    form.setValue("supplierName", data?.supplierName);
    form.setValue("supplierAddress", data?.supplierAddress);
    form.setValue("supplierEmail", data?.supplierEmail);
    form.setValue("supplierPhoneNumber", data?.supplierPhoneNumber);
    form.setValue("date", data?.date);
    form.setValue("dueDate", data?.dueDate);
    form.setValue("invoiceNumber", data?.invoiceNumber);
    form.setValue("totalNet", data?.totalNet);
    form.setValue("totalAmount", data?.totalNet);
    form.setValue("totalTax", data?.totalTax);
    form.setValue(
      "lineItems",
      data?.lineItems.map(
        (lineItem: {
          confidence: number;
          description: string;
          productCode: string;
          quantity: number;
          totalAmount: number;
          unitPrice: number;
          pageId: number;
        }) => ({
          confidence: lineItem.confidence,
          description: lineItem.description,
          productCode: lineItem.productCode,
          quantity: lineItem.quantity,
          totalAmount: lineItem.totalAmount,
          unitPrice: lineItem.unitPrice,
          pageId: lineItem.pageId,
        }),
      ),
    );
    form.setValue("notes", data.notes);

    console.log("Mapped data to form", form.getValues());

    const invoice = await Invoice.getByUrl(fileUrl);
    if (!invoice) {
      console.log("Creating invoice...");
      Invoice.create(form.getValues(), fileUrl);
    }
  };

  const handleProcessInvoice = async (fileUrl: string) => {
    const response = await mindeeScan(fileUrl);
    const parsedResponse = JSON.parse(response);
    const mappedReponse = await Invoice.parse(parsedResponse);
    mapDataToForm(mappedReponse);
  };

  const handleUpdateInvoiceData = async (fileUrl: string) => {
    const data = form.getValues();
    const response = await Invoice.update(fileUrl, data);
  };

  return (
    <Tabs defaultValue="1" className="relative flex h-full w-full flex-col">
      <TabsList className="sticky top-0 flex h-fit w-full rounded-none bg-white">
        <TabsTrigger
          value="1"
          className="flex h-10 grow justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
        >
          1. Review & Edit Details
        </TabsTrigger>
        <TabsTrigger
          value="2"
          className="flex h-10 grow justify-start border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
        >
          2. Upload to Quickbooks
        </TabsTrigger>
      </TabsList>
      <div className="h-full overflow-scroll">
        <TabsContent value="1" className="w-full">
          <Form {...form}>
            <form className="space-y-4 p-4">
              <div className="flex w-full items-center justify-between">
                <p className="text-2xl">
                  Total: ${form.getValues("totalNet")?.toFixed(2) || 0}
                </p>
                <div className=" text-xs">
                  <p className="text-right">
                    Sub-Total: ${form.getValues("totalAmount")?.toFixed(2) || 0}
                  </p>
                  <FormField
                    control={form.control}
                    name="totalTax"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-end">
                          <p className="w-12 break-keep">Tax: $</p>
                          <Input
                            type="number"
                            {...form.register("totalTax", {
                              setValueAs: (value) => parseFloat(value) || 0,
                              onChange: (e) =>
                                form.setValue(
                                  "totalTax",
                                  parseFloat(e.target.value) || 0,
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
                </div>
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
                      <FormLabel>Vendor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Workman Concrete" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice #</FormLabel>
                      <FormControl>
                        <Input placeholder="Workman Concrete" {...field} />
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
                      <FormLabel>Date Due</FormLabel>
                      <FormControl>
                        <Input placeholder="Workman Concrete" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Issued</FormLabel>
                      <FormControl>
                        <Input placeholder="Workman Concrete" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </ExtractionFormComponent>
              <ExtractionFormComponent label="Line Items">
                {(fields.length &&
                  fields.map((lineItem, index) => (
                    <div
                      className="grid grid-cols-2 gap-3 border-b p-4 pt-2 last:border-0"
                      key={lineItem.id}
                    >
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Workman Concrete"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.totalAmount`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Balance ($)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Workman Concrete"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`lineItems.${index}.productCode`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Workman Concrete"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-end gap-4 self-end text-xs">
                        Confidence:{" "}
                        {Number(lineItem.confidence.toFixed(2)) * 100}%
                        <Button
                          type="button"
                          onClick={() => {
                            console.log(index);
                            remove(index);
                          }}
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
        </TabsContent>
        <TabsContent value="2">Step 2</TabsContent>
      </div>
      <div className="sticky bottom-0 flex h-14 min-h-14 w-full items-center justify-end gap-2 border-t bg-white pl-2 pr-8">
        <Button
          variant={"secondary"}
          onClick={() => handleProcessInvoice(fileUrl)}
        >
          Scan
        </Button>
        <Button
          variant={"secondary"}
          onClick={() => handleUpdateInvoiceData(fileUrl)}
        >
          Approve
        </Button>
      </div>
    </Tabs>
  );
};

export default ExtractionTabs;
