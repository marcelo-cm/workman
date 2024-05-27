"use client";

import { Email } from "@/app/api/v1/gmail/messages/route";
import { columns as InvoiceColumns } from "@/components/dashboard/columns-unprocessed";
import { columns as EmailColumns } from "@/components/dashboard/columns-email";
import { DataTable as InvoiceTable } from "@/components/dashboard/data-table-invoice";
import { DataTable as EmailTable } from "@/components/dashboard/data-table-invoice";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { InvoiceObject } from "@/interfaces/common.interfaces";
import { useGmail } from "@/lib/hooks/gmail/useGmail";
import Invoice from "@/models/Invoice";
import { createClient } from "@/utils/supabase/client";
import { MagicWandIcon } from "@radix-ui/react-icons";
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
  const { getEmails } = useGmail();
  const [invoices, setInvoices] = useState<InvoiceObject[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);

  async function fetchInvoices() {
    const incomingInvoices = await getInvoices();
    setInvoices(incomingInvoices);
  }

  async function fetchEmails() {
    await getEmails(setEmails);
  }

  useEffect(() => {
    fetchInvoices();
    fetchEmails();
  }, []);

  async function handleProcessSelected(selectedRows: InvoiceObject[]) {
    try {
      const scanAndUpdatePromises = selectedRows.map(async (row) => {
        await Invoice.scanAndUpdate(row.fileUrl);
      });

      const scanAndUpdateResolved = await Promise.all(scanAndUpdatePromises);

      window.location.reload();
    } catch (error) {
      console.error("Error processing invoices:", error);
    }
  }

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
      <InvoiceTable
        data={invoices}
        columns={InvoiceColumns}
        onAction={handleProcessSelected}
        actionIcon={<MagicWandIcon />}
        actionOnSelectText="Process Selected Invoices"
        filters={false}
      />
      <EmailTable
        data={emails}
        columns={EmailColumns}
        onAction={() => null}
        actionOnSelectText="Process Selected Emails"
        actionIcon={<MagicWandIcon />}
        filters={false}
      />
    </div>
  );
};

export default Unprocessed;
