"use client";

import { columns } from "@/components/dashboard/columns-unprocessed";
import { DataTable } from "@/components/dashboard/data-table";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import { ExternalLinkIcon } from "@radix-ui/react-icons";
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
  const [invoices, setInvoices] = useState<InvoiceObject[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<InvoiceObject[]>([]);

  async function fetchInvoices() {
    const incomingInvoices = await getInvoices();
    setInvoices(incomingInvoices);
    console.log(incomingInvoices);
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
      <BreadcrumbList className="text-wm-white-400">
        <BreadcrumbItem>Bills</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbLink className="text-black" href="/unprocessed">
          Unprocessed
        </BreadcrumbLink>
      </BreadcrumbList>
      <div className="flex w-full flex-row justify-between font-poppins text-4xl">
        Unprocessed Invoices
      </div>
      <p>
        Any invoices that have not been processed will be displayed here. Please
        select and process them as needed.
      </p>
      <DataTable
        data={invoices}
        columns={columns}
        onSelected={setSelectedFiles}
      />
    </div>
  );
};

export default Unprocessed;
