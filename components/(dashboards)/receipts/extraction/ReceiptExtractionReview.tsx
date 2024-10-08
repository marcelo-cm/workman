'use client';

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import React from 'react';

import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from '@radix-ui/react-icons';

import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useAccount } from '@/lib/hooks/quickbooks/useAccount';
import { useCustomer } from '@/lib/hooks/quickbooks/useCustomer';
import { useVendor } from '@/lib/hooks/quickbooks/useVendor';

import { Account, Customer, Vendor } from '@/interfaces/quickbooks.interfaces';
import { Receipt } from '@/models/Receipt';

import ExtractionTabs from './(tabs)/ExtractionTabs';

interface ExtractionReviewContext {
  files: Receipt[];
  accounts: Account[];
  vendors: Vendor[];
  customers: Customer[];
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}

const defaultExtractionReviewContext: ExtractionReviewContext = {
  files: [],
  accounts: [],
  vendors: [],
  customers: [],
  activeIndex: 0,
  setActiveIndex: () => {},
};

const ExtractionReviewContext = createContext<ExtractionReviewContext>(
  defaultExtractionReviewContext,
);

export const useReceiptExtractionReview = () => {
  return useContext(ExtractionReviewContext);
};

const ReceiptExtractionReview = ({ files }: { files: Receipt[] }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { getVendorList } = useVendor();
  const { getCustomerList } = useCustomer();
  const { getAccountList } = useAccount();

  useEffect(() => {
    if (!files) return;
    fetchVendors();
    fetchCustomers();
    fetchAccounts();
  }, [files]);

  const fetchVendors = async () => {
    const columns: (keyof Vendor)[] = ['DisplayName', 'Id'];
    await getVendorList(columns, null, setVendors);
  };

  const fetchCustomers = async () => {
    const columns: (keyof Customer)[] = ['DisplayName', 'Id'];
    await getCustomerList(columns, null, setCustomers);
  };

  const fetchAccounts = async () => {
    const columns: (keyof Account)[] = ['Name', 'Id'];
    const where = "Classification = 'Expense'";
    await getAccountList(columns, where, setAccounts);
  };

  const handleSetActiveIndex = (increment: 1 | -1) => {
    setActiveIndex((prev: number) => {
      const nextValue = prev + increment;
      if (nextValue < 0) return files.length - 1;
      if (nextValue >= files.length) return 0;
      return nextValue;
    });
  };

  return (
    <ExtractionReviewContext.Provider
      value={{
        files,
        accounts,
        vendors,
        customers,
        activeIndex,
        setActiveIndex,
      }}
    >
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
          <section className="flex h-full w-fit flex-col border-r">
            <DropdownMenu defaultOpen>
              <DropdownMenuTrigger asChild>
                <div className="flex h-10 min-h-10 cursor-pointer items-center justify-between border-b bg-wm-white-50 px-2 text-sm hover:bg-wm-white-100">
                  <div className="ellipsis flex items-center gap-1 ">
                    {files[activeIndex].fileName}
                    <CaretDownIcon />
                  </div>
                  <div>
                    {activeIndex + 1} of {files.length}
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
                    {file.fileName}
                    {activeIndex === index ? (
                      <Badge variant="success">Active</Badge>
                    ) : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="no-scrollbar h-full w-[545px] overflow-y-scroll bg-wm-white-50 p-4">
              <Image
                src={files[activeIndex].fileUrl}
                className="border"
                width={545}
                height={1000}
                alt={files[activeIndex].fileName}
              />
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
          </section>
          <ExtractionTabs handleSetActiveIndex={handleSetActiveIndex} />
        </div>
      </div>
    </ExtractionReviewContext.Provider>
  );
};

export default ReceiptExtractionReview;
