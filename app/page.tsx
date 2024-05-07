"use client";

import SideBar from "@/components/dashboard/SideBar";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  MagnifyingGlassIcon,
  Pencil2Icon,
  UploadIcon,
} from "@radix-ui/react-icons";
import { useRef } from "react";

export default function Home() {
  const searchFilterInputRef = useRef<HTMLInputElement>(null);

  return (
    <main className="flex items-center h-dvh">
      <SideBar />
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
          <Button>
            <UploadIcon /> Upload Document
          </Button>
        </div>
        <p>
          For us to process your bills, forward the bills you receive to
          email@workman.so. We’ll process it for you right away!
        </p>
        <div className="flex flex-row gap-4">
          <Button variant="secondary">
            <Pencil2Icon /> Review Selected
          </Button>
          <div className="flex flex-row flex h-full w-[300px] rounded-md border border-wm-white-300 bg-transparent px-3 py-1 text-sm transition-colors items-center gap-2 text-wm-white-500">
            <MagnifyingGlassIcon
              className="h-5 w-5 cursor-pointer"
              onClick={() => searchFilterInputRef.current?.focus()}
            />
            <input
              ref={searchFilterInputRef}
              placeholder="Search Filter"
              className="h-full appearance-none outline-none w-full bg-transparent disabled:cursor-not-allowed disabled:opacity-50 text-black placeholder:text-wm-white-500"
            />
          </div>
          <DatePickerWithRange />
        </div>
      </div>
    </main>
  );
}
