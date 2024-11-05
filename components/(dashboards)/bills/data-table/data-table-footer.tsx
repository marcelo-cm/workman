import { memo } from 'react';

import { Table as TableType } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { TableCell, TableFooter, TableRow } from '@/components/ui/table';

import { Email } from '@/app/api/v1/gmail/messages/interfaces';
import Invoice from '@/models/Invoice';

const DataTableFooter = ({
  table,
  numCols,
  numRows,
}: {
  table: TableType<Invoice | Email>;
  numCols: number;
  numRows: number;
}) => {
  const { pageSize, pageIndex } = table.getState().pagination;
  const startIndex = numRows === 0 ? 0 : pageSize * pageIndex + 1; // Set to 0 if there are no invoices, otherwise start counting from 1
  const endIndex = Math.min(pageSize * (pageIndex + 1), numRows); // Ensure it doesn't exceed total rows

  return (
    <TableFooter>
      <TableRow>
        <TableCell colSpan={numCols}>
          <div className="flex items-center justify-end space-x-2 ">
            <div className="flex-1">
              <div className="text-muted-foreground items-center text-sm">
                {table.getFilteredSelectedRowModel().rows.length} of{' '}
                {table.getFilteredRowModel().rows.length} item(s) selected.
              </div>
              <div className="text-xs font-normal">
                Viewing Items {startIndex}-{endIndex}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="w-4 text-center">
              {table.getState().pagination.pageIndex + 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export default DataTableFooter;
