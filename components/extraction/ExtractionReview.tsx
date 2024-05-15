"use client";

import PDFViewer from "@/components/dashboard/PDFViewer";
import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import ExtractionTabs from "./ExtractionTabs";

interface ExtractionReviewProps {
  fileUrls: string[];
}

const ExtractionReview = ({ fileUrls }: ExtractionReviewProps) => {
  const [activeFile, setActiveFile] = useState(0);

  const handleSetActiveFile = (increment: 1 | -1) => {
    setActiveFile((prev: number) => {
      const nextValue = prev + increment;
      if (nextValue < 0) return 0;
      if (nextValue >= fileUrls.length) return fileUrls.length - 1;
      return nextValue;
    });
  };

  return (
    <>
      <div className="flex h-dvh w-full flex-col gap-4 pl-4 pt-8">
        <BreadcrumbList className="text-wm-white-400">
          <BreadcrumbItem>Bills</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbEllipsis />
          <BreadcrumbSeparator />
          <BreadcrumbItem className="text-black">Review</BreadcrumbItem>
        </BreadcrumbList>
        <div className="relative flex h-[calc(100%-3px-3rem)] rounded-tl border-l border-t">
          <div className="flex h-full w-fit flex-col border-r">
            <div className="flex h-10 min-h-10 items-center justify-between border-b bg-wm-white-50 px-2 text-sm">
              <p className="min-w-24 break-keep font-medium">Current File</p>
              <DropdownMenu>
                <DropdownMenuTrigger className="ellipsis flex items-center gap-1">
                  <CaretDownIcon />
                  {fileUrls[activeFile].split("/")[8].split("?")[0]}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  {fileUrls.map((file, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setActiveFile(index)}
                      className="cursor-pointer"
                    >
                      {file.split("/")[8].split("?")[0]}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="h-full w-full overflow-scroll bg-wm-white-50">
              <div className=" p-4">
                <PDFViewer fileUrl={fileUrls[activeFile]} />
              </div>
            </div>
            <div className="sticky bottom-0 flex h-14 min-h-14 items-center gap-2 border-t bg-white px-2">
              <Button
                variant="outline"
                className="py-2"
                onClick={() => handleSetActiveFile(-1)}
              >
                <CaretLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="py-2"
                onClick={() => handleSetActiveFile(1)}
              >
                <CaretRightIcon /> Next File
              </Button>
            </div>
          </div>
          <ExtractionTabs fileUrl={fileUrls[activeFile]} />
        </div>
      </div>
    </>
  );
};

export default ExtractionReview;
