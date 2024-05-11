"use client";

import PDFViewer from "@/components/dashboard/PDFViewer";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";

const Unprocessed = () => {
  const getInvoices = async () => {
    const supabase = createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      return [];
    }

    const { data } = await supabase.storage
      .from("invoices")
      .getPublicUrl("Invoice_3728_from_ROMA_CONCRETE.pdf_1715448182966");

    return [data] || [null];
  };

  const [invoices, setInvoices] = useState<{ publicUrl: string }[]>([]);

  async function fetchInvoices() {
    const incomingInvoices = await getInvoices();
    setInvoices(incomingInvoices);
  }

  useEffect(() => {
    fetchInvoices();
  }, []);

  if (!invoices.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {invoices[0].publicUrl}
      <PDFViewer fileUrl={invoices[0].publicUrl} />
    </div>
  );
};

export default Unprocessed;
