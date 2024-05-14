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
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import ExtractionFormComponent from "./ExtractionFormComponent";
import { mindeeScan } from "@/lib/actions/actions";

const formSchema = z.object({
  date: z.string(),
  dueDate: z.string(),
  invoiceNumber: z.string(),
  supplierName: z.string(),
  supplierAddress: z.string(),
  supplierEmail: z.string(),
  supplierPhoneNumber: z.string(),
  totalNet: z.number(),
  totalAmount: z.number(),
  totalTax: z.number(),
  lineItems: z.array(
    z.object({
      confidence: z.number(),
      description: z.string(),
      productCode: z.string(),
      quantity: z.number(),
      totalAmount: z.number(),
      unitPrice: z.number(),
      pageId: z.number(),
    }),
  ),
  notes: z.string().optional(),
});

const ExtractionTabs = ({ fileUrl }: { fileUrl: string }) => {
  const [data, setData] = useState<any | null>(null);

  const handleProcessInvoice = async (fileUrl: string) => {
    const response = await mindeeScan(fileUrl);
    const parsedResponse = JSON.parse(response); // Parse the response string into a JSON object
    console.log(parsedResponse);
    setData(parsedResponse.document.inference.prediction);
  };

  useEffect(() => {
    form.reset();
    handleProcessInvoice(fileUrl);
  }, [fileUrl]);

  useEffect(() => {
    form.setValue("supplierName", data?.supplierName.value);
    form.setValue("supplierAddress", data?.supplierAddress.value);
    form.setValue("supplierEmail", data?.supplierEmail.value);
    form.setValue("supplierPhoneNumber", data?.supplierPhoneNumber.value);
    form.setValue("date", data?.date.value || "");
    form.setValue("dueDate", data?.dueDate.value || "");
    form.setValue("invoiceNumber", data?.invoiceNumber.value || "");
    form.setValue("totalNet", data?.totalNet.value);
    form.setValue("totalAmount", data?.totalNet.value);
    form.setValue("totalTax", data?.totalTax.value);
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
    form.setValue("notes", "");
  }, [data]);

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
      lineItems: data?.lineItems.map(
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
      notes: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "lineItems",
  });

  const addLineItem = () => {
    append({
      confidence: 0,
      description: "",
      productCode: "",
      quantity: 0,
      totalAmount: 0,
      unitPrice: 0,
      pageId: 0,
    });
  };

  return (
    <Tabs
      defaultValue="1"
      className="relative flex h-full w-full flex-col overflow-y-scroll"
    >
      <TabsList className="sticky top-0 flex w-full rounded-none bg-white">
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
      <TabsContent value="1" className="w-full">
        <Form {...form}>
          <form className="space-y-4 p-4">
            <div className="flex w-full items-center justify-between">
              <p className="text-2xl">
                Total: ${form.getValues("totalAmount")?.toFixed(2) || 0}
              </p>
              <div className="text-xs">
                <p>Tax: ${form.getValues("totalTax")?.toFixed(2) || 0}</p>
                <p>Tax: ${form.getValues("totalAmount")?.toFixed(2) || 0}</p>
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
              {form.getValues().lineItems?.map((lineItem, index) => (
                <div className="grid grid-cols-2 gap-3 border-b p-4 pt-2 last:border-0">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Workman Concrete" {...field} />
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
                          <Input placeholder="Workman Concrete" {...field} />
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
                          <Input placeholder="Workman Concrete" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-end gap-4 self-end text-xs">
                    Confidence: {Number(lineItem.confidence.toFixed(2)) * 100}%
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="rounded p-2 hover:bg-wm-white-50 hover:text-red-500"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              )) || <p className="p-4">No line items</p>}
              <Button
                variant={"ghost"}
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
            <ExtractionFormComponent label="Additional Details" className="p-4">
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
      <div className="sticky bottom-0 flex min-h-14 w-full items-center justify-end border-t bg-white pl-2 pr-8">
        <Button>Approve</Button>
      </div>
    </Tabs>
  );
};

export default ExtractionTabs;
