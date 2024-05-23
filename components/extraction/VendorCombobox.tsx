"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Vendor } from "@/app/(dashboards)/account/page";
import { useEffect, useState } from "react";

function stringSimilarity(str1: string, str2: string) {
  // Simple similarity function based on common character count
  const commonChars = str1
    .toLowerCase()
    .split("")
    .filter((char) => str2.toLowerCase().includes(char)).length;
  return commonChars / Math.max(str1.length, str2.length);
}

export function VendorComboBox({
  options,
  valueToMatch,
}: {
  options: Vendor[];
  valueToMatch?: string;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Vendor | null>(null);

  useEffect(() => {
    if (valueToMatch) {
      const bestMatch = options.reduce((prev, curr) => {
        const prevSimilarity = stringSimilarity(
          prev?.DisplayName || "",
          valueToMatch,
        );
        const currSimilarity = stringSimilarity(
          curr?.DisplayName || "",
          valueToMatch,
        );
        return currSimilarity > prevSimilarity ? curr : prev;
      }, options[0]);

      if (bestMatch && bestMatch.DisplayName) setValue(bestMatch);
    }
  }, [valueToMatch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-fit min-w-[200px] justify-between"
        >
          <p className="w-fit min-w-[155px] overflow-hidden text-ellipsis text-nowrap break-keep text-left">
            {value ? value.DisplayName : "Select Vendor..."}
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
                value={option.DisplayName}
                onSelect={(currentValue) => {
                  setValue(
                    currentValue === value?.DisplayName
                      ? null
                      : options?.find(
                          (option) => option.DisplayName === currentValue,
                        ) || null,
                  );
                  setOpen(false);
                }}
                className="w-[200px] "
              >
                <Check
                  className={cn(
                    "mr-2 h-4 min-h-4 w-4 min-w-4",
                    value === option ? "opacity-100" : "opacity-0",
                  )}
                />
                <p className="w-[155px] overflow-hidden text-ellipsis text-nowrap break-keep">
                  {option.DisplayName}
                </p>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
