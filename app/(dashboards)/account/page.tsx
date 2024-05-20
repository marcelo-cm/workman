"use client";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { createClient as createNangoClient } from "@/utils/nango/client";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

const nango = createNangoClient();
const supabase = createSupabaseClient();

const Account = () => {
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

  const handleQuickBooksIntegration = async () => {
    const { data } = await supabase.auth.getUser();
    const userId = data?.user?.id;

    if (!userId) {
      console.error("User not found");
      return;
    }

    nango
      .auth("quickbooks", userId)
      .then((result: { providerConfigKey: string; connectionId: string }) => {
        toast({
          title: "Authorization Successful",
          description: "You have successfully authorized QuickBooks",
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

  const getVendorList = async () => {
    const response = await fetch("/api/v1/get-vendor-list");
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
      <BreadcrumbList className="text-wm-white-400">
        <BreadcrumbItem>Bills</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbLink className="text-black" href="/account">
          Account
        </BreadcrumbLink>
      </BreadcrumbList>
      <div className="flex w-full flex-row justify-between font-poppins text-4xl">
        Manage your Account
      </div>
      <p>
        Manage all your integrations, settings, and preferences in one place.
      </p>
      <div className="flex flex-col gap-2">
        <div className="text-xl">Integrations</div>
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          Google Mail Integration
          <Button onClick={handleGoogleMailIntegration}>
            Connect Google Mail
          </Button>
        </div>
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          QuickBooks Integration
          <Button onClick={handleQuickBooksIntegration}>
            Connect Quickbooks
          </Button>
        </div>
        <div className="text-xl">Test Functionality</div>
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          QuickBook Vendor List
          <Button onClick={getVendorList}>Get Vendor List</Button>
        </div>
      </div>
    </div>
  );
};

export default Account;
