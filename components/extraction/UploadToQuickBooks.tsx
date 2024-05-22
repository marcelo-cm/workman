import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvoiceObject } from "@/models/Invoice";
import { HammerIcon } from "lucide-react";
import React from "react";
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

const supabase = createClient();

const UploadToQuickBooks = ({ files }: { files: InvoiceObject[] }) => {
  async function uploadToQuickBooks(file: InvoiceObject) {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error("User not found");
      return;
    }

    const userId = data?.user?.id;

    if (!userId) {
      console.error("User not found");
      return;
    }

    const body = {
      file: file,
      userId: userId,
    };

    const response = await fetch(
      `/api/v1/upload-to-quickbooks?userId=${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    const responseData = await response.json();
    console.log("response", responseData);
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        {files.map((file) => (
          <ExtractionFormComponent
            label={file.data.supplierName}
            className="p-4"
          >
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
                    <TableCell>${lineItem.totalAmount?.toFixed(2)}</TableCell>
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
          </ExtractionFormComponent>
        ))}
      </div>
      <div className="sticky bottom-0 flex h-14 min-h-14 w-full items-center justify-end gap-2 border-t bg-white pl-2 pr-8">
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
