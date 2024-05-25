"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { formatDate, toTitleCase } from "@/lib/utils";
import {
  CaretDownIcon,
  CaretUpIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { InvoiceObject } from "@/interfaces/common.interfaces";

// define badge type by status type
type BadgeType = "success" | "destructive" | "warning" | "info";
function getBadgeType(status: string): BadgeType {
  switch (status) {
    case "SUCCESS":
      return "success";
    case "MISSING_FIELDS":
      return "destructive";
    case "MANUAL_REVIEW":
      return "warning";
    default:
      return "info";
  }
}

export const columns: ColumnDef<InvoiceObject>[] = [
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
    accessorFn: (row) =>
      decodeURI(
        row.fileUrl.split("/")[8]?.split(".pdf")[0] +
          " " +
          row.data.supplierName,
      ),
    header: ({ column }) => {
      return <div>Invoice Name & Company</div>;
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            {decodeURI(row.original.fileUrl.split("/")[8].split(".pdf")[0])}
            <p className="text-xs text-wm-white-200">[{row.original.id}]</p>
          </div>
          <div className="text-xs">{row.original.data.supplierName}</div>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "project_code",
  //   header: () => <div>Project</div>,
  //   cell: ({ row }) => (
  //     <Badge variant="info">{row.original.data.shippingAddress}</Badge>
  //   ),
  // },
  {
    accessorKey: "date_due",
    accessorFn: (row) => new Date(row.data.dueDate),
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
      <div>{formatDate(new Date(row.original.data.dueDate))}</div>
    ),
  },
  {
    accessorKey: "date_invoiced",
    accessorFn: (row) => new Date(row.data.date),
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
      <div>{formatDate(new Date(row.original.data.date))}</div>
    ),
  },
  {
    accessorKey: "balance",
    accessorFn: (row) => row.data.totalNet,
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
      }).format(row.original.data.totalNet);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "flag",
    header: ({ column }) => (
      <DropdownMenu>
        <div className="flex items-center justify-end gap-2">
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0 px-2">
              <p>Filter</p>{" "}
              <MixerHorizontalIcon
                className={`h-4 w-4 ${
                  column.getFilterValue() ? " text-wm-orange-500" : null
                }`}
              />
            </Button>
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent className="w-fit bg-white text-wm-white-500">
          <DropdownMenuRadioGroup
            value={column.getFilterValue() as string}
            onValueChange={(e) => {
              column.setFilterValue((prev: string) => (prev === e ? null : e));
            }}
          >
            <DropdownMenuRadioItem value="Success">
              <Badge variant={"success"}>Success</Badge>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Manual Review">
              <Badge variant={getBadgeType("MANUAL_REVIEW")}>
                Manual Review
              </Badge>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Missing Fields">
              <Badge variant={getBadgeType("MISSING_FIELDS")}>
                Missing Fields
              </Badge>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Pending">
              <Badge variant={getBadgeType("PENDING")}>Pending</Badge>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
    cell: ({ row }) => (
      <div className="flex justify-end pr-2">
        <Badge
          variant={getBadgeType(
            row.original.data.lineItems.some((item) => item.confidence < 0.95)
              ? "MANUAL_REVIEW"
              : "SUCCESS",
          )}
        >
          {toTitleCase(
            row.original.data.lineItems.some((item) => item.confidence < 0.9)
              ? "MANUAL_REVIEW"
              : "SUCCESS",
          )}
        </Badge>
      </div>
    ),
  },
];
