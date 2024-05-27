"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatDate } from "@/lib/utils";
import { CaretDownIcon, CaretUpIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { ExternalLinkIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Email } from "@/app/api/v1/gmail/messages/route";

export const columns: ColumnDef<Email>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
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
    accessorKey: "subject",
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
    accessorKey: "date",
    accessorFn: (row) => new Date(row.date),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Date Uploaded
        {column.getIsSorted() === "asc" ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => <div>{formatDate(new Date(row.original.date))}</div>,
  },
  {
    accessorKey: "attachments",
    header: ({ column }) => <div>Attachments</div>,
    cell: ({ row }) => (
      <div>
        {row.original.attachments.map((attachment) => (
          <div>{attachment.filename}</div>
        ))}
      </div>
    ),
  },
];
