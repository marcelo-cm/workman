"use client";

import PDFViewer from "@/components/dashboard/PDFViewer";
import ExtractionReview from "@/components/extraction/ExtractionReview";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

const getInvoices = async () => {
  const supabase = createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const data = [
    {
      publicUrl:
        "https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/Invoice_3707_from_ROMA_CONCRETE.pdf_1715448182965?t=2024-05-14T00%3A56%3A27.669Z",
    },
    {
      publicUrl:
        "https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/Invoice_3726_from_ROMA_CONCRETE.pdf_1715448182966?t=2024-05-14T00%3A56%3A35.712Z",
    },
    {
      publicUrl:
        "https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/Invoice_3728_from_ROMA_CONCRETE.pdf_1715448182966?t=2024-05-14T00%3A56%3A42.532Z",
    },
    {
      publicUrl:
        "https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/Invoice_3732_from_ROMA_CONCRETE.pdf_1715448182966?t=2024-05-14T00%3A56%3A49.508Z",
    },
    {
      publicUrl:
        "https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/Invoices-daily-4-2-2024.pdf_1715448182966?t=2024-05-14T00%3A56%3A57.802Z",
    },
    {
      publicUrl:
        "https://nyihnifdeasiteiwlghu.supabase.co/storage/v1/object/public/invoices/Invoices-daily-4-9-2024%20(1).pdf_1715448182967?t=2024-05-14T00%3A57%3A03.743Z",
    },
  ];

  return data || [null];
};

const Unprocessed = () => {
  const [invoices, setInvoices] = useState<{ publicUrl: string }[]>([]);
  const [step, setStep] = useState(0);

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
    <>
      {step == 1 ? (
        <ExtractionReview fileUrls={invoices.map((inv) => inv.publicUrl)} />
      ) : (
        <div>
          {invoices[0].publicUrl}
          <div className="h-96 w-fit border ">
            <PDFViewer fileUrl={invoices[0].publicUrl} />
          </div>

          <Button onClick={() => setStep(1)}>
            Process Invoice with Mindee
          </Button>
        </div>
      )}
    </>
  );
};

export default Unprocessed;
