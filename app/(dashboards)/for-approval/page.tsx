"use client";

import { columns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/data-table";
import ExtractionReview from "@/components/extraction/ExtractionReview";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { InvoiceObject } from "@/models/Invoice";
import { createClient } from "@/utils/supabase/client";
import { UploadIcon } from "@radix-ui/react-icons";
import { UserResponse } from "@supabase/supabase-js";
import { Suspense, useEffect, useRef, useState } from "react";

const supabase = createClient();

export default function ForApproval() {
  const [invoices, setInvoices] = useState<InvoiceObject[]>([]);
  const fileInputRef = useRef<null | HTMLInputElement>(null);

  useEffect(() => {
    getInvoices();
  }, []);

  async function fetchUser(): Promise<UserResponse> {
    const user = await supabase.auth.getUser();
    return user;
  }

  async function getInvoices() {
    const user = await fetchUser();
    const id = user.data.user?.id;

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("status", "FOR_REVIEW")
      .eq("owner", `${id}`);

    if (error) {
      console.error("Error fetching invoices:", error);
    } else {
      setInvoices(data as InvoiceObject[]);
    }
  }

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: any) => {
    const filesList = event.target.files;
    if (!filesList) {
      console.log("No files selected!");
      return;
    }

    const files = Array.from(filesList) as File[];

    const uploadPromises = Array.from(files).map((file: File) => {
      const filePath = `/${file.name}_${new Date().getTime()}`;
      return supabase.storage.from("invoices").upload(filePath, file);
    });

    try {
      const results = await Promise.all(uploadPromises);
      results.forEach(({ data, error }, index) => {
        if (error) {
          console.error(`Error uploading file ${files[index].name}:`, error);
        } else {
          console.log(`File uploaded successfully ${files[index].name}:`, data);
        }
      });
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  const [selectedFilesUrls, setSelectedFilesUrls] = useState<string[]>([]);
  const [review, setReview] = useState<boolean>(false);

  const handleReviewSelected = async (fileUrls: string[]) => {
    setSelectedFilesUrls(fileUrls);
    setReview(true);
  };

  return (
    <>
      {review ? (
        <ExtractionReview fileUrls={selectedFilesUrls} />
      ) : (
        <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
          <BreadcrumbList className="text-wm-white-400">
            <BreadcrumbItem>Bills</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbLink className="text-black" href="/for-approval">
              For Approval
            </BreadcrumbLink>
          </BreadcrumbList>
          <div className="flex w-full flex-row justify-between font-poppins text-4xl">
            Bills for Approval{" "}
            <Button onClick={handleButtonClick}>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <UploadIcon /> Upload Document
            </Button>
          </div>
          <p>
            For us to process your bills, forward the bills you receive to
            email@workman.so. We’ll process it for you right away!
          </p>
          <DataTable
            columns={columns}
            data={invoices}
            onReviewSelected={handleReviewSelected}
          />
        </div>
      )}
    </>
  );
}
