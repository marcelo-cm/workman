'use client';

import {
  Suspense,
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

import LoadingState from './empty-state';
import IfElseRender from './if-else-renderer';
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

  const [options, setOptions] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<T>(null!);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [initialFetchCompleted, setInitialFetchCompleted] =
    useState<boolean>(false);

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
    [fetchNextPage],
  );

  // /**
  //  * Fetch first page on mount.
  //  */
  useEffect(() => {
    if (!initialFetch.current) return;

    initialFetch.current = false;
    fetchNextPageHandler(query).then(() => {
      /**
       * Match initial value on mount logic.
       */
      if (!(matchOnMount && initialValue && fetchOnMount)) return;

      fetchOnMount(getOptionValue(initialValue))
        .then((value) => {
          setValue(value);
        })
        .finally(() => {
          setInitialFetchCompleted(true);
        });
    });
  }, []);

  const fetchNextPageHandler = async (
    query: string,
    resetPage: boolean = false,
  ) => {
    if (resetPage) {
      setPage(1);
      canFetchMore.current = true;
    }

    try {
      startTransition(async () => {
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
      });
    } catch (e) {
      console.error('Error fetching next page:', e);
      toast({
        title: 'Error fetching next page',
        description: 'Please try again later.',
        variant: 'destructive',
      });

      return false;
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
    <IfElseRender
      condition={initialFetchCompleted}
      ifTrue={
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
                {!isPending && <CommandEmpty>No options found.</CommandEmpty>}
                <LoadingState
                  isLoading={isPending}
                  className=" h-fit w-3/5 border-0 !bg-white py-2 text-xs text-wm-orange"
                  message="Loading Options..."
                />
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      }
      ifFalse={
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
    />
  );
}
