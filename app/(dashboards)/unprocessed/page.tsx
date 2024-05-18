"use client";

import PDFViewer from "@/components/dashboard/PDFViewer";
import ExtractionReview from "@/components/extraction/ExtractionReview";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceObject } from "@/models/Invoice";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const getInvoices = async () => {
  const supabase = createClient();
  const { data: userDataRes, error: userDataError } =
    await supabase.auth.getUser();

  if (userDataError) {
    throw userDataError;
  }

  const { data: invoices, error: invoicesError } = await supabase
    .from("invoices")
    .select("*")
    .eq("owner", userDataRes.user.id)
    .eq("status", "UNPROCESSED");

  if (invoicesError) {
    throw invoicesError;
  }

  return invoices;
};

const Unprocessed = () => {
  const [invoices, setInvoices] = useState<InvoiceObject[]>();

  async function fetchInvoices() {
    const incomingInvoices = await getInvoices();
    setInvoices(incomingInvoices);
    console.log(incomingInvoices);
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="flex h-dvh w-full p-4">
      <div className="h-fit rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>View File</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  {invoice.fileUrl.split("/")[8]?.split(".pdf")[0]}
                </TableCell>
                <TableCell>{invoice.created_at}</TableCell>
                <TableCell>
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      window.open(invoice.fileUrl, "_blank");
                    }}
                  >
                    View File
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Unprocessed;
