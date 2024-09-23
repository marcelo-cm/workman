'use client';

import { useEffect, useMemo, useRef, useState, useTransition } from 'react';

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

import { cn, stringSimilarity } from '@/lib/utils';

export enum MatchMode {
  Fuzzy = 'fuzzy',
  Query = 'query',
}

export enum Pagination {
  DEFAULT_LIMIT = 25,
  DEFAULT_THRESHOLD = 5,
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
  fetchOnMount?: (id: string) => T;
}

interface ComboBoxPaginationProps<T> {
  /**
   * Boolean to determine if the PaginatedComboBox is paginated.
   */
  isPaginated?: boolean;
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
  ) => { values: T[]; canFetchMore: boolean };
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
  isPaginated,
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
      'If the PaginatedComboBox is matchOnMount with MatchMode.Query, then you must provide a fetchOnMount function.',
    );
  }
  if (isPaginated && !fetchNextPage) {
    throw new Error(
      'If the PaginatedComboBox is paginated, then you must provide a fetchNextPage function.',
    );
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
  const [prevQuery, setPrevQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const initialFetch = useRef(true);
  const canFetchMore = useRef(true);
  const endRef = useRef<HTMLDivElement>(null);
  const commandListRef = useRef<HTMLDivElement>(null);

  /**
   * Debounce search function to prevent multiple API calls.
   */
  const debouncedSearch = useMemo(
    () =>
      debounce((q) => {
        startTransition(() => {
          fetchNextPageHandler(q);
        });
      }, 300),
    [fetchNextPage],
  );

  /**
   * Fetch first page on mount.
   */
  useEffect(() => {
    if (initialFetch.current) {
      initialFetch.current = false;
      fetchNextPageHandler('');
    }
  }, [initialFetch]);

  /**
   * Match initial value on mount logic.
   */
  useEffect(() => {
    if (!(matchOnMount && initialValue && fetchOnMount)) return;

    const value = fetchOnMount(getOptionValue(initialValue));
    value && setValue(value);
  }, [initialValue]);

  const fetchNextPageHandler = (query: string) => {
    if (!fetchNextPage) return;

    if (prevQuery != query) {
      console.log(`%c--- New Query: #${query} ---`, 'color: #ff8800');
      setPage(1);

      const { values, canFetchMore: isNextPageAvailable } = fetchNextPage(
        1,
        query,
      );
      setOptions(values);
      canFetchMore.current = isNextPageAvailable;
    } else if (canFetchMore.current) {
      const { values, canFetchMore: isNextPageAvailable } = fetchNextPage(
        page,
        query,
      );
      setOptions((prev) => [...prev, ...values]);
      canFetchMore.current = isNextPageAvailable;
    }
    setPage((prev) => prev + 1);
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
    debouncedSearch(search);
  };

  const handleScroll = () => {
    const container = commandListRef.current;
    if (container) {
      const isAtBottom =
        container.scrollHeight - container.scrollTop === container.clientHeight;

      if (isAtBottom) {
        fetchNextPageHandler(query);
      }
    }
  };

  return (
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
            {value ? getOptionLabel(value) : 'Select Vendor...'}
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
            <CommandEmpty>No Vendor found.</CommandEmpty>
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
                  {getOptionLabel(option)}
                </p>
              </CommandItem>
            ))}
            <div ref={endRef} className="h-1 bg-red-500 py-1" />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
