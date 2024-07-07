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

import { cn } from '@/lib/utils';

function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) {
    return bn;
  }
  if (bn === 0) {
    return an;
  }
  const matrix = Array(an + 1);
  for (let i = 0; i <= an; i++) {
    matrix[i] = Array(bn + 1).fill(0);
    matrix[i][0] = i;
  }
  for (let j = 1; j <= bn; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
        );
      }
    }
  }
  return matrix[an][bn];
}

function stringSimilarity(str1: string, str2: string): number {
  const distance = levenshtein(str1, str2);
  return 1 - distance / Math.max(str1.length, str2.length);
}

export function ComboBox<T extends { Id: string | number }>({
  options,
  valueToMatch,
  callBackFunction,
  getOptionLabel,
  className,
}: {
  options: T[];
  valueToMatch?: string;
  callBackFunction?: (value: T) => void;
  getOptionLabel: (option: T) => string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<any | null>(null);

  useEffect(() => {
    if (valueToMatch) {
      const bestMatch = options.reduce((prev, curr) => {
        const prevSimilarity = stringSimilarity(
          getOptionLabel(prev) || '',
          valueToMatch,
        );
        const currSimilarity = stringSimilarity(
          getOptionLabel(curr) || '',
          valueToMatch,
        );
        return currSimilarity > prevSimilarity ? curr : prev;
      }, options[0]);

      if (bestMatch && getOptionLabel(bestMatch)) setValue(bestMatch);

      callBackFunction && callBackFunction(bestMatch);
    }
  }, [valueToMatch]);

  const handleSelect = (currentValue: string) => {
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
          <CommandInput placeholder="Search framework..." />
          <CommandList className="no-scrollbar">
            <CommandEmpty>No Vendor found.</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.Id}
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
                    getOptionLabel(value) == getOptionLabel(option)
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
