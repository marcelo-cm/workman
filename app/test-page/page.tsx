"use client";

import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { createClient as createNangoClient } from "@/utils/nango/client";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import React from "react";

const nango = createNangoClient();
const supabase = createSupabaseClient();

const TestPage = () => {
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

      const response = await fetch(`/api/v1/get-emails?userId=${userId}`, {
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
      console.log("Emails:", emails);

      toast({
        title: "Emails",
        description: "Emails fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching emails:", error);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <Button
        onClick={() =>
          toast({
            title: "Default Toast",
            description: "This is a default toast",
            action: <ToastAction altText="Action">Action</ToastAction>,
          })
        }
      >
        Default
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Destructive Toast",
            description: "This is a destructive toast",
            variant: "destructive",
            action: <ToastAction altText="Action">Action</ToastAction>,
          })
        }
      >
        Destructive
      </Button>
      <Button onClick={() => handleGoogleMailIntegration()}>Nango Auth</Button>
      <Button onClick={() => getEmails()}>Get Emails</Button>
    </div>
  );
};

export default TestPage;
