"use client";

import SideBar from "@/components/dashboard/SideBar";
import { columns } from "@/components/dashboard/columns";
import { DataTable } from "@/components/dashboard/data-table";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Invoice } from "@/interfaces/common.interfaces";
import { createClient } from "@/utils/supabase/client";
import {
  MagnifyingGlassIcon,
  Pencil2Icon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { useEffect, useRef } from "react";

const invoices: Invoice[] = [
  {
    file_name: "invoice_001_construction.pdf",
    sender: "Anderson Construction Co.",
    status: "Manual Review",
    data: {
      invoice_number: "AC123456",
      date_invoiced: "2024-04-15",
      date_due: "2024-05-15",
      date_uploaded: "2024-04-16",
      balance: 15000,
      vendor_name: "Anderson Construction Co.",
      project_code: "PRJ321654",
      line_items: [
        {
          name: "Concrete Supply",
          description: "Ready-mix concrete for foundation",
          quantity: 30,
          unit_price: 120,
          amount: 3600,
        },
        {
          name: "Steel Rebars",
          description: "Reinforced steel bars",
          quantity: 2000,
          unit_price: 5.7,
          amount: 11400,
        },
      ],
    },
  },
  {
    file_name: "invoice_002_construction.pdf",
    sender: "Beacon Builders Ltd.",
    status: "Missing Fields",
    data: {
      invoice_number: "BB20240420",
      date_invoiced: "2024-04-20",
      date_due: "2024-05-20",
      date_uploaded: "2024-04-21",
      balance: 22000,
      vendor_name: "Beacon Builders Ltd.",
      project_code: "PRJ456789",
      line_items: [
        {
          name: "Electrical Wiring",
          description: "Copper wiring for new installation",
          quantity: 500,
          unit_price: 2,
          amount: 1000,
        },
        {
          name: "Plumbing Pipes",
          description: "PVC piping for bathrooms",
          quantity: 300,
          unit_price: 15,
          amount: 4500,
        },
        {
          name: "Labor",
          description: "Skilled labor for construction",
          quantity: 400,
          unit_price: 25,
          amount: 10000,
        },
      ],
    },
  },
  {
    file_name: "invoice_003_construction.pdf",
    sender: "Castle Rock Construction",
    status: "Pending",
    data: {
      invoice_number: "CRC123789",
      date_invoiced: "2024-04-25",
      date_due: "2024-05-25",
      date_uploaded: "2024-04-26",
      balance: 30000,
      vendor_name: "Castle Rock Construction",
      project_code: "PRJ789123",
      line_items: [
        {
          name: "Wood Beams",
          description: "Wooden beams for roof support",
          quantity: 50,
          unit_price: 200,
          amount: 10000,
        },
        {
          name: "Roofing Tiles",
          description: "Ceramic tiles for roofing",
          quantity: 1000,
          unit_price: 20,
          amount: 20000,
        },
      ],
    },
  },
  {
    file_name: "invoice_004_construction.pdf",
    sender: "Dynamic Engineering Solutions",
    status: "Successful",
    data: {
      invoice_number: "DES456321",
      date_invoiced: "2024-05-01",
      date_due: "2024-06-01",
      date_uploaded: "2024-05-02",
      balance: 8000,
      vendor_name: "Dynamic Engineering Solutions",
      project_code: "PRJ654987",
      line_items: [
        {
          name: "Survey Equipment",
          description: "Surveying equipment rental",
          quantity: 1,
          unit_price: 8000,
          amount: 8000,
        },
      ],
    },
  },
  {
    file_name: "invoice_005_construction.pdf",
    sender: "Elite Constructions",
    status: "Successful",
    data: {
      invoice_number: "EC789456",
      date_invoiced: "2024-05-05",
      date_due: "2024-06-05",
      date_uploaded: "2024-05-06",
      balance: 18000,
      vendor_name: "Elite Constructions",
      project_code: "PRJ852963",
      line_items: [
        {
          name: "Paint",
          description: "Exterior paint, 50 gallons",
          quantity: 50,
          unit_price: 150,
          amount: 7500,
        },
        {
          name: "Windows",
          description: "Double glazed windows",
          quantity: 20,
          unit_price: 500,
          amount: 10000,
        },
      ],
    },
  },
  {
    file_name: "invoice_006_construction.pdf",
    sender: "Foundation Builders Inc.",
    status: "Successful",
    data: {
      invoice_number: "FBI102938",
      date_invoiced: "2024-05-10",
      date_due: "2024-06-10",
      date_uploaded: "2024-05-11",
      balance: 25000,
      vendor_name: "Foundation Builders Inc.",
      project_code: "PRJ741852",
      line_items: [
        {
          name: "Excavation",
          description: "Excavation services for site preparation",
          quantity: 1,
          unit_price: 25000,
          amount: 25000,
        },
      ],
    },
  },

  {
    file_name: "invoice_007_construction.pdf",
    sender: "Metro Building Co.",
    status: "Successful",
    data: {
      invoice_number: "MBC20240515",
      date_invoiced: "2024-05-15",
      date_due: "2024-06-15",
      date_uploaded: "2024-05-16",
      balance: 32000,
      vendor_name: "Metro Building Co.",
      project_code: "PRJ968574",
      line_items: [
        {
          name: "Masonry Blocks",
          description: "Concrete masonry units",
          quantity: 1200,
          unit_price: 25,
          amount: 30000,
        },
        {
          name: "Mortar Mix",
          description: "Pre-mixed mortar for block setting",
          quantity: 400,
          unit_price: 5,
          amount: 2000,
        },
      ],
    },
  },
  {
    file_name: "invoice_008_construction.pdf",
    sender: "Skyline Structures",
    status: "Successful",
    data: {
      invoice_number: "SS20240516",
      date_invoiced: "2024-05-16",
      date_due: "2024-06-16",
      date_uploaded: "2024-05-17",
      balance: 11000,
      vendor_name: "Skyline Structures",
      project_code: "PRJ264587",
      line_items: [
        {
          name: "Structural Steel",
          description: "Steel beams for framing",
          quantity: 500,
          unit_price: 22,
          amount: 11000,
        },
      ],
    },
  },
  {
    file_name: "invoice_009_construction.pdf",
    sender: "Rapid Roadworks Ltd.",
    status: "Successful",
    data: {
      invoice_number: "RRL20240517",
      date_invoiced: "2024-05-17",
      date_due: "2024-06-17",
      date_uploaded: "2024-05-18",
      balance: 20000,
      vendor_name: "Rapid Roadworks Ltd.",
      project_code: "PRJ123789",
      line_items: [
        {
          name: "Asphalt",
          description: "Asphalt for road paving",
          quantity: 1000,
          unit_price: 20,
          amount: 20000,
        },
      ],
    },
  },
  {
    file_name: "invoice_010_construction.pdf",
    sender: "Precision Piping Inc.",
    status: "Successful",
    data: {
      invoice_number: "PPI20240518",
      date_invoiced: "2024-05-18",
      date_due: "2024-06-18",
      date_uploaded: "2024-05-19",
      balance: 15000,
      vendor_name: "Precision Piping Inc.",
      project_code: "PRJ456123",
      line_items: [
        {
          name: "Copper Pipes",
          description: "Copper pipes for plumbing installation",
          quantity: 300,
          unit_price: 50,
          amount: 15000,
        },
      ],
    },
  },
  {
    file_name: "invoice_011_construction.pdf",
    sender: "Elevated Architecture Designs",
    status: "Successful",
    data: {
      invoice_number: "EAD20240519",
      date_invoiced: "2024-05-19",
      date_due: "2024-06-19",
      date_uploaded: "2024-05-20",
      balance: 23000,
      vendor_name: "Elevated Architecture Designs",
      project_code: "PRJ789456",
      line_items: [
        {
          name: "Architectural Design Fees",
          description: "Design services for commercial building",
          quantity: 1,
          unit_price: 23000,
          amount: 23000,
        },
      ],
    },
  },
  {
    file_name: "invoice_012_construction.pdf",
    sender: "Granite Groundworks",
    status: "Successful",
    data: {
      invoice_number: "GG20240520",
      date_invoiced: "2024-05-20",
      date_due: "2024-06-20",
      date_uploaded: "2024-05-21",
      balance: 5000,
      vendor_name: "Granite Groundworks",
      project_code: "PRJ654321",
      line_items: [
        {
          name: "Landscaping Services",
          description: "Landscaping and groundwork for residential area",
          quantity: 1,
          unit_price: 5000,
          amount: 5000,
        },
      ],
    },
  },
];

const supabase = createClient();

export default function ForApproval() {
  const fileInputRef = useRef<null | HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      console.log("Clicking file input");
      fileInputRef.current.click();
    }
  };

  async function fetchUser() {
    const user = await supabase.auth.getUser();
    console.log(user);
  }
  useEffect(() => {
    fetchUser();
  }, []);

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

  return (
    <>
      <div className="flex w-full h-full py-8 px-4 flex-col gap-4">
        <BreadcrumbList className="text-wm-white-400">
          <BreadcrumbItem>Bills</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbLink className="text-black" href="/">
            For Approval
          </BreadcrumbLink>
        </BreadcrumbList>
        <div className="text-4xl font-poppins flex flex-row justify-between w-full">
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
        <DataTable columns={columns} data={invoices} />
      </div>
    </>
  );
}
