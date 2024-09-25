'use client';

import {
  Suspense,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';

import { debounce } from 'lodash';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

import { ComboBox } from './combo-box';
import { Input } from './input';
import { PromiseWrapper } from './promise-wrapper';
import { toast } from './use-toast';

export enum Pagination {
  /**
   * Number of options per page.
   */
  DEFAULT_LIMIT = 25,
  /**
   * Pixels from the bottom of the list to trigger the next page.
   */
  DEFAULT_THRESHOLD = 10,
}

interface ComboBoxUtilityProps<T> {
  /**
   * The callback function to be called when an option is selected.
   */
  callBackFunction?: (value: T) => void;
  /**
   * The function to get the label of the option.
   */
  getOptionLabel: (option: T) => string;
  /**
   * The function to get the value of the option.
   * @default (option) => String(option?.Id ?? option?.id)
   */
  getOptionValue?: (option: T) => string;
  /**
   * The class name to be applied to the PaginatedComboBox.
   */
  className?: string;
}

interface ComboBoxMountBehaviourProps<T> {
  /**
   * The initial value to be set in the PaginatedComboBox.
   */
  initialValue?: T;
  /**
   * Whether to match on mount.
   * @default false
   */
  matchOnMount?: boolean;
  /**
   * The API to fetch the current option from
   */
  fetchOnMount?: (id: string) => Promise<T>;
}

interface ComboBoxPaginationProps<T> {
  /**
   * Number of options per page.
   */
  limit?: number;
  /**
   * The threshold to trigger the next page.
   */
  threshold?: number;
  /**
   * The function to fetch the next page.
   */
  fetchNextPage?: (
    page: number,
    query: string,
  ) => Promise<{ values: T[]; canFetchMore: boolean }>;
}

interface ComboBoxProps<T>
  extends ComboBoxUtilityProps<T>,
    ComboBoxMountBehaviourProps<T>,
    ComboBoxPaginationProps<T> {}

/**
 * Failure to follow these rules will result in an error.
 * 1. If the PaginatedComboBox is paginated, then you must provide a fetchNextPage function and a fetchTypeaheadSearch function.
 * 3. If the PaginatedComboBox is matchOnMount, then you must provide an initialValue.
 * 4. If the PaginatedComboBox is matchOnMount with MatchMode.Query, then you must provide a fetchOnMount function.
 */
export function PaginatedComboBox<
  T extends { Id?: string | number; id?: string | number },
>({
  initialValue,
  matchOnMount = false,
  fetchOnMount,
  limit = Pagination.DEFAULT_LIMIT,
  threshold = Pagination.DEFAULT_THRESHOLD,
  fetchNextPage,
  callBackFunction,
  getOptionLabel,
  getOptionValue = (option) => String(option?.Id ?? option?.id),
  className,
}: ComboBoxProps<T>) {
  if (matchOnMount && !initialValue) {
    throw new Error(
      'If the PaginatedComboBox is matchOnMount, then you must provide an initialValue.',
    );
  }
  if (matchOnMount && !fetchOnMount) {
    throw new Error(
      'PaginatedCombo, then you must provide a fetchOnMount function.',
    );
  }
  if (!fetchNextPage) {
    throw new Error(
      '"PaginatedComboBox is paginated, but fetchNextPage was not provided"',
    );
  }
  if (!(threshold >= 0 && limit >= 0)) {
    throw new Error('The threshold and limit must be a positive number.');
  }
  if (threshold >= limit) {
    throw new Error(
      'The threshold must be less than the limit to trigger the next page.',
    );
  }

  const [options, setOptions] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<T>(null!);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [initialFetchPromise, setInitialFetchPromise] =
    useState<Promise<void> | null>(null);

  const initialFetch = useRef(true);
  const canFetchMore = useRef(true);
  const commandListRef = useRef<HTMLDivElement>(null);

  /**
   * Debounce search function to prevent multiple API calls.
   */
  const debouncedSearch = useMemo(
    () =>
      debounce((q, resetPage) => {
        startTransition(() => {
          fetchNextPageHandler(q, resetPage);
        });
      }, 300),
    [fetchNextPage, query],
  );

  // /**
  //  * Fetch first page on mount.
  //  */
  useEffect(() => {
    if (!initialFetch.current) return;

    initialFetch.current = false;
    const promise = fetchNextPageHandler(query).then(() => {
      /**
       * Match initial value on mount logic.
       */
      if (!(matchOnMount && initialValue && fetchOnMount)) return;

      fetchOnMount(getOptionValue(initialValue)).then((value) => {
        console.log('--- Matched on mount ---');
        setValue(value);
      });
    });

    setInitialFetchPromise(promise);
  }, []);

  const fetchNextPageHandler = async (
    query: string,
    resetPage: boolean = false,
  ) => {
    if (!fetchNextPage) return;

    if (resetPage) {
      setPage(1);
      canFetchMore.current = true;
    }

    try {
      if (canFetchMore.current) {
        const { values, canFetchMore: isNextPageAvailable } =
          await fetchNextPage(resetPage ? 1 : page, query);
        console.log(
          `%c--- More Pages? -> ${isNextPageAvailable} ---`,
          'color: #ff8800',
        );

        if (resetPage) {
          setOptions(values);
        } else {
          setOptions((prev) => [...prev, ...values]);
        }
        canFetchMore.current = isNextPageAvailable;
        setPage((prev) => prev + 1);
      }
    } catch (e) {
      console.error('Error fetching next page:', e);
      toast({
        title: 'Error fetching next page',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleSelect = (currentValue: string | number) => {
    if (currentValue !== getOptionLabel(value)) {
      const newValue = options.find(
        (option) => getOptionLabel(option) === currentValue,
      );

      if (!newValue) return;

      setValue(newValue);

      callBackFunction && callBackFunction(newValue);
    }
  };

  const handleInputChange = (search: string) => {
    setQuery(search);
    debouncedSearch(search, true);
  };

  const handleScroll = () => {
    const container = commandListRef.current;
    if (container && canFetchMore.current && !isPending) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <=
        threshold;

      if (isAtBottom) {
        fetchNextPageHandler(query);
      }
    }
  };

  return (
    <Suspense
      fallback={
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-fit min-w-[200px] justify-between ${className}`}
          type="button"
          disabled
        >
          <div className="h-2 w-full rounded bg-wm-white-300"></div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      }
    >
      <PromiseWrapper promise={initialFetchPromise}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-fit min-w-[200px] justify-between ${className}`}
              type="button"
            >
              <p className="w-fit min-w-[155px] overflow-hidden text-ellipsis text-nowrap break-keep text-left">
                {value ? getOptionLabel(value) : 'Select Option...'}
              </p>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-max min-w-[200px] p-0">
            <Command>
              <CommandInput
                placeholder="Search..."
                value={query}
                onValueChange={handleInputChange}
              />
              <CommandList
                className="no-scrollbar"
                onScroll={handleScroll}
                ref={commandListRef}
              >
                {options.map((option) => (
                  <CommandItem
                    key={getOptionValue(option)}
                    value={getOptionLabel(option)}
                    onSelect={(currentValue) => {
                      handleSelect(currentValue);
                      setOpen(false);
                    }}
                    className="w-[200px] "
                    disabled={isPending}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 min-h-4 w-4 min-w-4',
                        getOptionValue(value) == getOptionValue(option)
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    <p className="w-[155px] overflow-hidden text-ellipsis text-nowrap break-keep">
                      {getOptionLabel(option)}{' '}
                    </p>
                  </CommandItem>
                ))}
                <CommandEmpty>No Vendor found.</CommandEmpty>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </PromiseWrapper>
    </Suspense>
  );
}
