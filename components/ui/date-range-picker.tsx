'use client';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

export const DatePickerWithRange = forwardRef(function DatePickerWithRange(
  {
    placeholder,
    className,
    onDateChange,
  }: {
    placeholder?: string;
    onDateChange?: (date: any) => void;
    className?: string;
  },
  ref,
) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  useImperativeHandle(ref, () => {
    return {
      clearDate() {
        setDate({ from: undefined, to: undefined });
      },
    };
  }, []);

  useEffect(() => {
    if (!date?.from || !onDateChange) return;
    onDateChange(date);
  }, [date]);

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal text-black',
            )}
          >
            <CalendarIcon className="h-4 w-4 text-wm-white-500" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span className="text-wm-white-500">
                {placeholder || 'Select Date Range'}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="z-50 w-auto bg-white p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});
