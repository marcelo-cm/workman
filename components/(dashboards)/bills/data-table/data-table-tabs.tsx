import React, {
  Dispatch,
  SetStateAction,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import { useAppContext } from '@/app/(dashboards)/context';
import { InvoiceCounts } from '@/interfaces/db.interfaces';

import { BILLS_DATA_TABLE_TABS, TabValue } from './constants';

export interface DataTableTabsRef {
  refreshInvoiceCounts: () => Promise<void>;
}

const DataTableTabs = forwardRef<
  DataTableTabsRef,
  {
    tabValue: TabValue | undefined;
    setTabValue: Dispatch<SetStateAction<TabValue | undefined>>;
  }
>(({ tabValue, setTabValue }, ref) => {
  const { user } = useAppContext();
  const { getInvoiceCounts } = useInvoice();
  const [invoiceCounts, setInvoiceCounts] = useState<InvoiceCounts>();

  const tabs = useMemo(
    () => (user && BILLS_DATA_TABLE_TABS(user)) || [],
    [user],
  );

  useEffect(() => {
    getInvoiceCounts().then(setInvoiceCounts);
  }, []);

  useEffect(() => {
    if (!tabs.length) return;

    setTabValue(tabs[0].value as TabValue);
  }, [tabs]);

  useImperativeHandle(ref, () => ({
    refreshInvoiceCounts: () => getInvoiceCounts().then(setInvoiceCounts),
  }));

  return (
    <Tabs
      defaultValue={tabs && (tabs[0]?.value as unknown as string)}
      onValueChange={(value) => setTabValue(value as unknown as TabValue)}
      value={tabValue as unknown as string}
    >
      <TabsList className="h-fit rounded-b-none rounded-t-md border border-b-0">
        {tabs &&
          tabs.map((tab) => (
            <TabsTrigger
              key={tab.title}
              value={tab.value as unknown as string}
              className="flex h-10 grow justify-start gap-2 data-[state=active]:border-b data-[state=active]:border-wm-orange data-[state=active]:text-wm-orange"
            >
              {tab.icon}
              {tab.title}
              {tab.countKey && invoiceCounts && (
                <Button
                  asChild
                  className={`ml-1 !h-6 !w-5 text-xs ${tabValue != tab.value ? 'bg-gray-400' : ''}`}
                  size={'sm'}
                  type="button"
                >
                  <span>{invoiceCounts[tab.countKey]}</span>
                </Button>
              )}
            </TabsTrigger>
          ))}
      </TabsList>
    </Tabs>
  );
});

export default memo(DataTableTabs);
