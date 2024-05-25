"use client";

import PDFViewer from "@/components/dashboard/PDFViewer";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { createClient as createNangoClient } from "@/utils/nango/client";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { decode } from "base64-arraybuffer";
import { useState } from "react";

const nango = createNangoClient();
const supabase = createSupabaseClient();

type Email = {
  subject: string;
  date: string;
  from: string;
  attachments: any[];
};

const TestPage = () => {
  const [emails, setEmails] = useState<Email[]>([]);

  const handleGoogleMailIntegration = async () => {
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;

    if (!userId) {
      console.error("User not found");
      return;
    }

    nango
      .auth("google-mail", userId)
      .then((result: { providerConfigKey: string; connectionId: string }) => {
        toast({
          title: "Authorization Successful",
          description: "You have successfully authorized Google Mail",
        });
      })
      .catch((err: { message: string; type: string }) => {
        toast({
          title: "Authorization Failed",
          description: err.message,
          variant: "destructive",
        });
      });
  };

  const getEmails = async () => {
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

      const response = await fetch(`/api/v1/gmail/messages?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          "Failed to fetch emails:",
          response.status,
          response.statusText,
          errorText,
        );
        return;
      }

      const emails = await response.json();
      setEmails(emails);
      console.log("Emails:", emails);

      toast({
        title: "Emails",
        description: "Emails fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  const handleUpload = async (
    attachments: { data: string; fileDecoded: any; filename: string }[],
  ) => {
    try {
      for (const attachment of attachments) {
        const rawBase64 = attachment.data;
        const base64repaired = rawBase64.replace(/-/g, "+").replace(/_/g, "/");

        const { data, error } = await supabase.storage
          .from("invoices")
          .upload("TEST_FILE", decode(base64repaired), {
            contentType: "application/pdf",
          });

        if (error) {
          console.error("Error uploading file:", error);
          throw error;
        }
      }

      toast({
        title: "Files uploaded",
        description: "Files uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col  gap-4 overflow-scroll">
      <div className="flex gap-2">
        <Button onClick={() => handleGoogleMailIntegration()}>
          Nango Auth
        </Button>
        <Button onClick={() => getEmails()}>Get Emails</Button>
      </div>
      <div className="flex h-fit w-full flex-col gap-2 border">
        {emails.map((email, index) => (
          <div
            key={index}
            className="flex h-fit w-full gap-2 overflow-x-scroll border p-4"
          >
            <div className="flex flex-col">
              <div>{email.subject}</div>
              <div>{email.date}</div>
              <div>{email.from}</div>
              <div>{email.attachments[0].filename}</div>
              <Button onClick={() => handleUpload(email.attachments)}>
                Upload all to Supabase
              </Button>
            </div>
            <div className="flex w-full flex-row gap-2">
              {email.attachments.map((attachment, index) => (
                <PDFViewer fileUrl={attachment.fileDecoded.data} key={index} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
