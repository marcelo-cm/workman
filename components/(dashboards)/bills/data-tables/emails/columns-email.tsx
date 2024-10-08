'use client';

import { CaretDownIcon, CaretUpIcon } from '@radix-ui/react-icons';

import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { useGmail } from '@/lib/hooks/gmail/useGmail';

import { Email } from '@/app/api/v1/gmail/messages/route';
import { formatDate } from '@/lib/utils';

const { markAsIgnore } = useGmail();

export const columns: ColumnDef<Email>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'subject',
    accessorFn: (row) => row.subject,
    header: ({ column }) => {
      return <div>Subject</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-row items-center gap-1">
          {row.original.subject}
        </div>
      );
    },
  },
  {
    accessorKey: 'from',
    accessorFn: (row) => row.from,
    header: ({ column }) => {
      return <div>From</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="items-left flex flex-col gap-1 leading-none">
          <p>{row.original.from.split('<')[0]}</p>
          <p>{row.original.from.split('<')[1].split('>')[0]}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'date',
    accessorFn: (row) => new Date(row.date),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="px-2 py-0"
      >
        Date Uploaded
        {column.getIsSorted() === 'asc' ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(new Date(row.original.date))}</div>,
  },
  {
    accessorKey: 'attachments',
    header: ({ column }) => <div>Attachments</div>,
    cell: ({ row }) => (
      <div>
        {row.original.attachments.map((attachment, index) => (
          <div key={index} className="flex items-center gap-2">
            <p className="w-8 text-xs text-wm-white-200">({index + 1}) </p>
            {attachment.filename}
          </div>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'ignore',
    header: ({ column }) => <div />,
    cell: ({ row }) => (
      <>
        <Button
          variant="ghost"
          onClick={async () => await markAsIgnore(row.original.id)}
        >
          Ignore
        </Button>
      </>
    ),
  },
];
