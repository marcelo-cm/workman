'use client';

import PDFViewer from '@/components/PDF/PDFViewer';
import {
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InvoiceObject } from '@/interfaces/common.interfaces';
import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@radix-ui/react-icons';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import ExtractionTabs from './ExtractionTabs';
import { Separator } from '@radix-ui/react-dropdown-menu';

const ExtractionReview = ({ files }: { files: InvoiceObject[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSetActiveIndex = (increment: 1 | -1) => {
    setActiveIndex((prev: number) => {
      const nextValue = prev + increment;
      if (nextValue < 0) return files.length - 1;
      if (nextValue >= files.length) return 0;
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
        <div className="relative flex h-[calc(100%-3px-3rem)] overflow-hidden rounded-tl border-l border-t">
          <div className="flex h-full w-fit flex-col border-r">
            <div className="flex h-10 min-h-10 items-center justify-between border-b bg-wm-white-50 px-1 text-sm">
              <DropdownMenu>
                <DropdownMenuTrigger className="ellipsis flex items-center gap-1 rounded-md px-1 ring-wm-white-200 hover:opacity-50 hover:ring-1">
                  {decodeURI(
                    files[activeIndex].fileUrl.split('/')[8].split('.pdf')[0],
                  )}
                  <CaretDownIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white">
                  <DropdownMenuLabel>Queue ({files.length})</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {files.map((file, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className="hover flex cursor-pointer items-center justify-between gap-4 rounded-md hover:bg-wm-white-50"
                    >
                      {decodeURI(file.fileUrl.split('/')[8].split('.pdf')[0])}
                      {activeIndex === index ? (
                        <Badge variant="success">Active</Badge>
                      ) : null}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="no-scrollbar h-full w-full overflow-y-scroll bg-wm-white-50 p-4">
              <PDFViewer file={files[activeIndex].fileUrl} />
            </div>
            <div className="sticky bottom-0 flex h-14 min-h-14 items-center gap-2 border-t bg-white px-2">
              <Button
                variant="outline"
                className="py-2"
                onClick={() => handleSetActiveIndex(-1)}
              >
                <CaretLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="py-2"
                onClick={() => handleSetActiveIndex(1)}
              >
                Next File
                <CaretRightIcon />
              </Button>
            </div>
          </div>
          <ExtractionTabs
            files={files}
            activeIndex={activeIndex}
            handleSetActiveIndex={handleSetActiveIndex}
            setActiveIndex={setActiveIndex}
          />
        </div>
      </div>
    </>
  );
};

export default ExtractionReview;
