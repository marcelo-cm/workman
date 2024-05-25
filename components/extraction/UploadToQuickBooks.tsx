import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Invoice from "@/models/Invoice";
import { HammerIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ExtractionFormComponent from "./ExtractionFormComponent";
import { createClient } from "@/utils/supabase/client";
import { ComboBox } from "./Combobox";
import { toast } from "../ui/use-toast";
import { Vendor } from "@/app/(dashboards)/account/page";
import { Badge } from "../ui/badge";
import { InvoiceObject, LineItem } from "@/interfaces/common.interfaces";

const supabase = createClient();

export interface TransformedInvoiceObject extends Omit<InvoiceObject, "data"> {
  data: {
    supplierName: string;
    vendorId: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    customerAddress: string;
    notes: string;
    lineItems: TransformedLineItem[];
  };
}

export interface TransformedLineItem extends LineItem {
  customerId: string;
  billable: boolean;
}

const UploadToQuickBooks = ({ files }: { files: InvoiceObject[] }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [transformedFiles, setTransformedFiles] = useState<
    TransformedInvoiceObject[]
  >([]);

  useEffect(() => {
    if (!files) return;
    getVendorList();
    getCustomerList();
    transformData();
  }, [files]);

  async function uploadToQuickBooks(fileIndex: number) {
    await Invoice.uploadToQuickbooks(transformedFiles[fileIndex]);
  }

  const getVendorList = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to get user:", error);
        return;
      }

      const userId = data?.user?.id;

      if (!userId) {
        console.error("User not found");
        return;
      }

      const columnsToSelect = "Id,DisplayName";

      const response = await fetch(
        `/api/v1/quickbooks/company/vendor?userId=${userId}&select=${columnsToSelect}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Failed to fetch vendors:",
          response.status,
          response.statusText,
          errorText,
        );
        return;
      }

      const vendors = await response.json();
      setVendors(
        vendors.QueryResponse.Vendor.slice(
          vendors.QueryResponse.startPosition,
        ).filter((vendor: Vendor) => vendor.DisplayName),
      );

      toast({
        title: "Vendors",
        description: "Vendors fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const getCustomerList = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error("Failed to get user:", error);
        return;
      }

      const userId = data?.user?.id;

      if (!userId) {
        console.error("User not found");
        return;
      }

      const columnsToSelect = "Id,DisplayName";

      const response = await fetch(
        `/api/v1/quickbooks/company/customer?userId=${userId}&select=${columnsToSelect}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Failed to fetch Customers:",
          response.status,
          response.statusText,
          errorText,
        );
        return;
      }

      const customers = await response.json();
      setCustomers(
        customers.QueryResponse.Customer.slice(
          customers.QueryResponse.startPosition,
        ).filter((customer: any) => customer.DisplayName),
      );
      console.log(customers);

      toast({
        title: "Customers",
        description: "Customers fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const transformData = () => {
    const transformed: TransformedInvoiceObject[] = files.map((file) => ({
      ...file,
      data: {
        ...file.data,
        vendorId: file.data.supplierName, // Temporary mapping; to be updated on selection
        lineItems: file.data.lineItems.map((lineItem) => ({
          ...lineItem,
          customerId: file.data.customerAddress, // Temporary mapping; to be updated on selection
          billable: true,
        })),
      },
    }));
    setTransformedFiles(transformed);
  };

  const handleVendorSelect = (
    value: { sparse: boolean; Id: string; DisplayName: string },
    fileIndex: number,
  ) => {
    const updatedFiles = [...transformedFiles];
    updatedFiles[fileIndex].data.vendorId = value.Id;
    setTransformedFiles(updatedFiles);
  };

  const handleCustomerSelect = (
    value: { sparse: boolean; Id: string; DisplayName: string },
    fileIndex: number,
    lineItemIndex: number,
  ) => {
    const updatedFiles = [...transformedFiles];
    updatedFiles[fileIndex].data.lineItems[lineItemIndex].customerId = value.Id;
    setTransformedFiles(updatedFiles);
  };

  const handleBillableChange = (
    value: boolean,
    fileIndex: number,
    lineItemIndex: number,
  ) => {
    const updatedFiles = [...transformedFiles];
    updatedFiles[fileIndex].data.lineItems[lineItemIndex].billable = value;
    setTransformedFiles(updatedFiles);
  };

  useEffect(() => console.log(transformedFiles), [transformedFiles]);

  return (
    <>
      <div className="flex h-full flex-col gap-4 p-4 ">
        {vendors.length && customers.length
          ? files.map((file, fileIndex) => (
              <div
                className={`space-y-3 rounded-md border `}
                key={fileIndex + file.id}
              >
                <div
                  className={`flex w-full items-center justify-between border-b p-2 text-sm font-medium `}
                >
                  <div className="flex flex-col gap-1">
                    <ComboBox
                      options={vendors}
                      valueToMatch={file.data.supplierName}
                      callBackFunction={(value) =>
                        handleVendorSelect(value, fileIndex)
                      }
                    />{" "}
                    <p className="ml-2 text-xs text-wm-white-500">
                      Scanned: {file.data.supplierName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end font-normal">
                    <Badge className="text-wm-black-500 mb-1 font-medium">
                      No. {file.data.invoiceNumber}
                    </Badge>
                    <div>
                      <p className="inline font-medium">Txn Date: </p>
                      {file.data.date}
                    </div>
                    <div>
                      <p className="inline font-medium">Due Date: </p>
                      {file.data.dueDate}
                    </div>
                  </div>
                </div>
                <div className={`gap-3 !pt-0`}>
                  <Table key={file.id}>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Billable</TableHead>
                        <TableHead>Customer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {file.data.lineItems.map((lineItem, lineItemIndex) => (
                        <TableRow
                          key={lineItemIndex + file.id + lineItem.productCode}
                        >
                          <TableCell>Construction</TableCell>
                          <TableCell>{lineItem.description}</TableCell>
                          <TableCell>
                            ${lineItem.totalAmount?.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Checkbox
                              defaultChecked
                              onCheckedChange={(value: boolean) =>
                                handleBillableChange(
                                  Boolean(value),
                                  fileIndex,
                                  lineItemIndex,
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <ComboBox
                              options={customers}
                              valueToMatch={file.data.customerAddress}
                              callBackFunction={(value) =>
                                handleCustomerSelect(
                                  value,
                                  fileIndex,
                                  lineItemIndex,
                                )
                              }
                            />{" "}
                            <p className="ml-2 mt-1 text-xs text-wm-white-500">
                              {file.data.customerAddress}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableCell colSpan={5}>
                        <Button
                          onClick={() => uploadToQuickBooks(fileIndex)}
                          className="w-fit"
                          variant={"secondary"}
                        >
                          <HammerIcon className="h-4 w-4" /> Upload Invoice
                        </Button>
                      </TableCell>
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))
          : "Loading..."}
      </div>
      <div className="sticky bottom-0 flex h-14 min-h-14 w-full items-center justify-end gap-2 border-t bg-white pl-2 pr-8 ">
        <TabsList>
          <TabsTrigger value="1" asChild>
            <Button variant={"secondary"}>Go Back to Review</Button>
          </TabsTrigger>
        </TabsList>
        <Button onClick={() => console.log(files[0])} disabled>
          <HammerIcon className="h-4 w-4" /> Upload All
        </Button>
      </div>
    </>
  );
};

export default UploadToQuickBooks;
