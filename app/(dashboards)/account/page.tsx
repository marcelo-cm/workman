"use client";

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from "react";
import { createClient as createNangoClient } from "@/utils/nango/client";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { VendorComboBox } from "@/components/extraction/VendorCombobox";

const nango = createNangoClient();
const supabase = createSupabaseClient();

interface Address {
  Id: string;
  Line1: string;
  City: string;
  CountrySubDivisionCode: string;
  PostalCode: string;
  Lat: string;
  Long: string;
}

interface CurrencyReference {
  value: string;
  name: string;
}

interface MetaData {
  CreateTime: string;
  LastUpdatedTime: string;
}

export interface Vendor {
  BillAddr?: Address;
  Balance?: number;
  AcctNum?: string;
  Vendor1099?: boolean;
  CurrencyRef?: CurrencyReference;
  domain?: string;
  sparse?: boolean;
  Id: string;
  SyncToken?: string;
  MetaData?: MetaData;
  GivenName?: string;
  FamilyName?: string;
  CompanyName: string;
  DisplayName?: string;
  PrintOnCheckName?: string;
  Active?: boolean;
  PrimaryPhone?: {
    FreeFormNumber: string;
  };
  PrimaryEmailAddr?: {
    Address: string;
  };
  WebAddr?: {
    URI: string;
  };
}

const Account = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);

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

      const columnsToSelect = "Id,CompanyName";

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
        ).filter((vendor: Vendor) => vendor.CompanyName),
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
          <Button onClick={() => getVendorList?.()}>Get Vendor List</Button>
          {vendors?.length > 0 && <VendorComboBox options={vendors} />}
        </div>
      </div>
    </div>
  );
};

export default Account;
