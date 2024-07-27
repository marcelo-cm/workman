'use client';

import { useEffect, useRef, useState } from 'react';

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

import Chip from './chip';

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

/**
 *
 * @param options List of options to display
 * @param valuesToMatch Singular default value to match in the options
 * @param callBackFunction Callback function to return the selected value
 * @param getOptionLabel Function to get the label of the option
 * @param className
 * @returns
 */
export function MultiComboBox<
  T extends { Id?: string | number; id?: string | number },
>({
  disabled,
  options,
  valuesToMatch,
  fetchValuesFunction,
  callBackFunction,
  getOptionLabel,
  renderValues,
  optionDisabledIf,
  className,
}: {
  disabled?: boolean;
  options?: T[];
  valuesToMatch?: T[];
  fetchValuesFunction?: () => Promise<T[]>;
  callBackFunction?: (value: T[]) => void | Promise<void>;
  getOptionLabel: (option: T) => string;
  renderValues?: (value: T) => JSX.Element;
  optionDisabledIf: (option: T) => boolean;
  className?: string;
}) {
  const firstMount = useRef(true);
  const [optionsList, setOptionsList] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<any[]>([]);

  useEffect(() => {
    if (firstMount.current) {
      if (fetchValuesFunction && !options) {
        fetchValuesFunction().then(setOptionsList);
      } else {
        options && setOptionsList(options);
      }
      firstMount.current = false;
    }
  }, [open]);

  useEffect(() => {
    if (valuesToMatch && valuesToMatch.length > 0 && optionsList.length > 0) {
      const bestMatches = valuesToMatch.map((valueToMatch) => {
        const bestMatch = optionsList.reduce((prev, curr) => {
          const prevSimilarity = stringSimilarity(
            getOptionLabel(prev) || '',
            getOptionLabel(valueToMatch),
          );
          const currSimilarity = stringSimilarity(
            getOptionLabel(curr) || '',
            getOptionLabel(valueToMatch),
          );
          return currSimilarity > prevSimilarity ? curr : prev;
        }, optionsList[0]);

        return bestMatch && getOptionLabel(bestMatch) ? bestMatch : null;
      });

      const filteredBestMatches = bestMatches.filter((value) => value !== null);

      setValues(filteredBestMatches);

      // callBackFunction && callBackFunction(filteredBestMatches);
    }
  }, [valuesToMatch, optionsList]);

  const handleSelect = (currentValue: string) => {
    const currentLabels = values.map(getOptionLabel);
    let newValues;

    if (currentLabels.includes(currentValue)) {
      newValues = values.filter(
        (value) => getOptionLabel(value) !== currentValue,
      );
    } else {
      const newValue = optionsList.find(
        (option) => getOptionLabel(option) === currentValue,
      );
      if (!newValue) return;
      newValues = [...values, newValue];
    }

    setValues(newValues);
    if (callBackFunction) {
      callBackFunction(newValues);
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
          disabled={disabled}
        >
          <p className="w-fit min-w-[155px] overflow-hidden flex flex-row gap-2 ">
            {values
              ? renderValues
                ? values.map((val) => (
                    <div
                      onClick={() =>
                        optionDisabledIf
                          ? !optionDisabledIf(val) &&
                            handleSelect(getOptionLabel(val))
                          : handleSelect(getOptionLabel(val))
                      }
                    >
                      {renderValues(val)}
                    </div>
                  ))
                : values.map((val) => (
                    <Chip
                      onClick={() =>
                        optionDisabledIf
                          ? !optionDisabledIf(val) &&
                            handleSelect(getOptionLabel(val))
                          : handleSelect(getOptionLabel(val))
                      }
                    >
                      {getOptionLabel(val)}
                    </Chip>
                  ))
              : 'Select Vendor...'}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max min-w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList className="no-scrollbar">
            <CommandEmpty>No Vendor found.</CommandEmpty>
            {optionsList.map((option) => (
              <CommandItem
                key={option.Id ?? option.id}
                value={getOptionLabel(option)}
                onSelect={(currentValue) => {
                  handleSelect(currentValue);
                }}
                className="w-[200px] "
                disabled={optionDisabledIf(option)}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 min-h-4 w-4 min-w-4 text-black',
                    values.includes(option) ? 'opacity-100' : 'opacity-0',
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
