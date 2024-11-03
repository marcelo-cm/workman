'use client';

import { Table as TableType, flexRender } from '@tanstack/react-table';

import Container from '@/components/ui/container';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Email } from '@/app/api/v1/gmail/messages/route';

export const EmailTableBody = ({ table }: { table: TableType<Email> }) => {
  const columns = table.getAllColumns();

  return (
    <>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows?.map((row) => (
            <>
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className="border-none"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell colSpan={columns.length} className="pt-0">
                  <Container innerClassName="py-2 px-4">
                    {row.original?.attachments?.map((attachment, index) => (
                      <div key={index}>
                        {attachment.filename} {String(row.getIsSelected())}
                      </div>
                    ))}
                  </Container>
                </TableCell>
              </TableRow>
            </>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </>
  );
};
