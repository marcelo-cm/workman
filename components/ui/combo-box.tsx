'use client';

import { useEffect, useState } from 'react';

import { Check, ChevronsUpDown } from 'lucide-react';

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

import { cn, findMostSimilar, stringSimilarity } from '@/lib/utils';

export function ComboBox<
  T extends { Id?: string | number; id?: string | number },
>({
  options,
  valueToMatch,
  callBackFunction,
  getOptionLabel,
  getOptionValue = (option) => String(option?.Id ?? option?.id),
  className,
}: {
  options: T[];
  valueToMatch?: string;
  callBackFunction?: (value: T) => void;
  getOptionLabel: (option: T) => string;
  getOptionValue?: (option: T) => string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<T>(null!);

  useEffect(() => {
    if (valueToMatch && options.length) {
      const bestMatch = findMostSimilar(valueToMatch, options, getOptionLabel);

      if (bestMatch && getOptionLabel(bestMatch)) setValue(bestMatch);

      callBackFunction && callBackFunction(bestMatch);
    }
  }, [valueToMatch, options]);

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`h-9 w-fit min-w-[200px] justify-between ${className}`}
          type="button"
        >
          <p className="w-fit min-w-[155px] overflow-hidden text-ellipsis text-nowrap break-keep text-left">
            {value ? getOptionLabel(value) : 'Select...'}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max min-w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList className="no-scrollbar">
            <CommandEmpty>No Options found.</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={getOptionValue(option)}
                value={getOptionLabel(option)}
                onSelect={(currentValue) => {
                  handleSelect(currentValue);
                  setOpen(false);
                }}
                className="w-[200px] "
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
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
