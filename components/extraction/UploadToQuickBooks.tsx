import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceObject } from "@/models/Invoice";
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
import { VendorComboBox } from "./VendorCombobox";
import { toast } from "../ui/use-toast";
import { Vendor } from "@/app/(dashboards)/account/page";

const supabase = createClient();

const UploadToQuickBooks = ({ files }: { files: InvoiceObject[] }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);

  useEffect(() => {
    getVendorList();
  }, []);

  async function uploadToQuickBooks(file: InvoiceObject) {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("User not found");
      return;
    }

    const userId = data.user.id;

    const body = {
      file: file,
      userId: userId,
    };

    const response = await fetch(`/api/v1/upload-to-quickbooks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const responseData = await response.json();
    console.log("response", responseData);
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
        `/api/v1/get-vendor-list?userId=${userId}&select=${columnsToSelect}`,
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

  return (
    <>
      <div className="flex h-full flex-col gap-4 p-4 ">
        {vendors.length > 0
          ? files.map((file) => (
              <div className={`space-y-3 rounded-md border `}>
                <div
                  className={`flex w-full items-center justify-between border-b p-2 text-sm font-medium `}
                >
                  <div className="flex flex-col gap-1">
                    <VendorComboBox
                      options={vendors}
                      valueToMatch={file.data.supplierName}
                    />{" "}
                    <p className="ml-2 text-xs text-wm-white-500">
                      Scanned: {file.data.supplierName}
                    </p>
                  </div>
                  <div>
                    <p className="text-wm-black-500">
                      {file.data.supplierAddress}
                    </p>
                    <p className="text-wm-black-500">
                      Invoice {file.data.invoiceNumber}
                    </p>
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
                        <TableHead>Customer/Project</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {file.data.lineItems.map((lineItem, index) => (
                        <TableRow key={index + lineItem.productCode}>
                          <TableCell>Construction</TableCell>
                          <TableCell>{lineItem.description}</TableCell>
                          <TableCell>
                            ${lineItem.totalAmount?.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Checkbox checked />
                          </TableCell>
                          <TableCell>{file.data.customerAddress}</TableCell>
                        </TableRow>
                      ))}
                      <TableCell colSpan={5}>
                        <Button
                          onClick={() => uploadToQuickBooks(file)}
                          className="w-full"
                          variant={"secondary"}
                        >
                          <HammerIcon className="h-4 w-4" /> Upload All
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
        <Button onClick={() => console.log(files[0])}>
          <HammerIcon className="h-4 w-4" /> Upload All
        </Button>
      </div>
    </>
  );
};

export default UploadToQuickBooks;
