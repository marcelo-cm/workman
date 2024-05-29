"use client";

import { ComboBox } from "@/components/extraction/Combobox";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label_Basic } from "@/interfaces/gmail.interfaces";
import { Vendor } from "@/interfaces/quickbooks.interfaces";
import { useGmail } from "@/lib/hooks/gmail/useGmail";
import { useVendor } from "@/lib/hooks/quickbooks/useVendor";
import { handleGoogleMailIntegration } from "@/utils/nango/google";
import { handleQuickBooksIntegration } from "@/utils/nango/quickbooks";
import { useEffect, useState } from "react";

const Account = () => {
  const { getVendorList } = useVendor();
  const { getLabels } = useGmail();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [labels, setLabels] = useState<Label_Basic[]>([]);

  const fetchVendors = async () => {
    const columns: (keyof Vendor)[] = ["DisplayName", "Id"];
    await getVendorList(columns, null, setVendors);
  };

  const fetchLabels = async () => {
    await getLabels(setLabels);
  };

  useEffect(() => {
    console.log(labels);
  }, [labels]);

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
          <Button onClick={() => fetchVendors()}>Get Vendor List</Button>
          {vendors?.length > 0 && (
            <ComboBox
              options={vendors}
              getOptionLabel={(option) => option?.DisplayName}
            />
          )}
        </div>
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          Google Mail Labels
          <Button onClick={() => fetchLabels()}>Get Labels</Button>
          {labels?.length > 0 && (
            <ComboBox
              options={labels}
              getOptionLabel={(options) => options?.name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
