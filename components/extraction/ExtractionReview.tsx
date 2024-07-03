'use client';

import { useState } from 'react';

import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@radix-ui/react-icons';

import { Separator } from '@radix-ui/react-dropdown-menu';

import { Badge } from '../ui/badge';
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

import Invoice from '@/classes/Invoice';

import ExtractionTabs from './ExtractionTabs';

const ExtractionReview = ({ files }: { files: Invoice[] }) => {
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
        <Button
          variant={'ghost'}
          size={'sm'}
          className="w-fit text-sm font-normal"
          onClick={() => window.location.reload()}
        >
          <CaretLeftIcon className="h-4 w-4" />
          Go Back
        </Button>

        <div className="relative flex h-[calc(100%-3px-3rem)] overflow-hidden rounded-tl border-l border-t">
          <div className="flex h-full w-fit flex-col border-r">
            <DropdownMenu defaultOpen>
              <DropdownMenuTrigger asChild>
                <div className="flex h-10 min-h-10 cursor-pointer items-center justify-between border-b bg-wm-white-50 px-1 text-sm hover:bg-wm-white-100">
                  <div className="ellipsis flex items-center gap-1 ">
                    {decodeURI(
                      files[activeIndex].fileUrl.split('/')[8].split('.pdf')[0],
                    )}
                    <CaretDownIcon />
                  </div>
                  <div>
                    {activeIndex} of {files.length}
                  </div>
                </div>
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

            <div className="no-scrollbar h-full w-full overflow-y-scroll bg-wm-white-50 p-4">
              <PDFViewer file={files[activeIndex].fileUrl} zoomable />
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
