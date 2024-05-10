"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CaretDownIcon,
  CaretUpIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { Invoice } from "@/interfaces/common.interfaces";
import { formatDate } from "@/lib/utils";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// define badge type by status type
type BadgeType = "success" | "destructive" | "warning" | "info";
function getBadgeType(status: string): BadgeType {
  switch (status) {
    case "Successful":
      return "success";
    case "Missing Fields":
      return "destructive";
    case "Manual Review":
      return "warning";
    default:
      return "info";
  }
}

export const columns: ColumnDef<Invoice>[] = [
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
    accessorKey: "file_name&sender",
    accessorFn: (row) => row.file_name + " " + row.sender,
    header: ({ column }) => {
      return <div>Invoice Name & Company</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div>{row.original.file_name}</div>
          <div className="text-xs">{row.original.sender}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "project_code",
    header: () => <div>Project</div>,
    cell: ({ row }) => (
      <Badge variant="info">{row.original.data.project_code}</Badge>
    ),
  },
  {
    accessorKey: "date_due", // Unique accessor key for date due
    accessorFn: (row) => new Date(row.data.date_due),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Date Due
        {column.getIsSorted() === "asc" ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div>{formatDate(new Date(row.original.data.date_due))}</div>
    ),
  },
  {
    accessorKey: "date_invoiced", // Unique accessor key for date invoiced
    accessorFn: (row) => new Date(row.data.date_invoiced),
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Date Invoiced
        {column.getIsSorted() === "asc" ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => (
      <div>{formatDate(new Date(row.original.data.date_invoiced))}</div>
    ),
  },
  // {
  //   accessorKey: "date_uploaded", // Unique accessor key for date uploaded
  //   accessorFn: (row) => new Date(row.data.date_uploaded),
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       className="p-0"
  //     >
  //       Date Uploaded
  //       {column.getIsSorted() === "asc" ? (
  //         <CaretUpIcon className="h-4 w-4" />
  //       ) : (
  //         <CaretDownIcon className="h-4 w-4" />
  //       )}
  //     </Button>
  //   ),
  //   cell: ({ row }) => (
  //     <div>{formatDate(new Date(row.original.data.date_uploaded))}</div>
  //   ),
  // },
  {
    accessorKey: "balance", // Unique accessor key for balance
    accessorFn: (row) => row.data.balance,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="p-0"
      >
        Balance
        {column.getIsSorted() === "asc" ? (
          <CaretUpIcon className="h-4 w-4" />
        ) : (
          <CaretDownIcon className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(row.original.data.balance);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DropdownMenu>
        <div className="flex justify-end gap-2 items-center">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 px-2">
              <p>Filter by Status</p>{" "}
              <MixerHorizontalIcon
                className={`h-4 w-4 ${
                  column.getFilterValue() ? " text-wm-orange-500" : null
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent className="bg-white w-fit text-wm-white-500">
          <DropdownMenuRadioGroup
            value={column.getFilterValue() as string}
            onValueChange={(e) => {
              column.setFilterValue((prev: string) => (prev === e ? null : e));
            }}
          >
            <DropdownMenuRadioItem value="Success">
              <Badge variant={"success"}>Successful</Badge>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Manual Review">
              <Badge variant={getBadgeType("Manual Review")}>
                Manual Review
              </Badge>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Missing Fields">
              <Badge variant={getBadgeType("Missing Fields")}>
                Missing Fields
              </Badge>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Pending">
              <Badge variant={getBadgeType("Pending")}>Pending</Badge>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <Badge variant={getBadgeType(row.original.status)}>
          {row.original.status}
        </Badge>
      </div>
    ),
  },
];
