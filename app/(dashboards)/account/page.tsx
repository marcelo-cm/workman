"use client";

import { ComboBox } from "@/components/extraction/Combobox";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Label, Label_Basic } from "@/interfaces/gmail.interfaces";
import { Vendor } from "@/interfaces/quickbooks.interfaces";
import { useGmail } from "@/lib/hooks/gmail/useGmail";
import { useVendor } from "@/lib/hooks/quickbooks/useVendor";
import { useUser } from "@/lib/hooks/supabase/useUser";
import { handleGoogleMailIntegration } from "@/utils/nango/google";
import { handleQuickBooksIntegration } from "@/utils/nango/quickbooks";
import { useEffect, useState } from "react";

const Account = () => {
  const { getVendorList } = useVendor();
  const { getLabels, createLabel } = useGmail();
  const { updateUser } = useUser();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [labels, setLabels] = useState<Label_Basic[]>([]);

  const fetchVendors = async () => {
    const columns: (keyof Vendor)[] = ["DisplayName", "Id"];
    await getVendorList(columns, null, setVendors);
  };

  const fetchLabels = async () => {
    await getLabels(setLabels);
  };

  const handleUpsertLabel = async () => {
    const labels = await getLabels();

    const workmanLabelExists = labels.find(
      (label: Label_Basic) => label.name === "WORKMAN SCANNED",
    );

    const ignoreLabelExists = labels.find(
      (label: Label_Basic) => label.name === "WORKMAN IGNORE",
    );
    // @todo search for the ignore label, create it if not there, and update the user configs with the new label if successful

    if (!workmanLabelExists) {
      const WORKMAN_SCANNED_LABEL: Omit<Label_Basic, "id"> = {
        name: "WORKMAN SCANNED",
        messageListVisibility: "show",
        labelListVisibility: "labelShow",
        type: "user",
      };
      const newLabel = await createLabel(WORKMAN_SCANNED_LABEL);

      if (newLabel) {
        const valuesToUpdate = {
          scanned_label_id: newLabel.id,
        };

        await updateUser(valuesToUpdate);
      }
    }

    if (!ignoreLabelExists) {
      const WORKMAN_IGNORE_LABEL: Omit<Label_Basic, "id"> = {
        name: "WORKMAN IGNORE",
        messageListVisibility: "show",
        labelListVisibility: "labelShow",
        type: "user",
      };
      const newLabel = await createLabel(WORKMAN_IGNORE_LABEL);

      if (newLabel) {
        const valuesToUpdate = {
          ignore_label_id: newLabel.id,
        };

        await updateUser(valuesToUpdate);
      }
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
        <div className="flex w-fit flex-row items-center justify-between gap-4">
          Upsert Workman Label
          <Button onClick={() => handleUpsertLabel()}>Action!</Button>
        </div>
      </div>
    </div>
  );
};

export default Account;
