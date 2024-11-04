'use client';

import { Table as TableType, flexRender } from '@tanstack/react-table';

import PDFViewer from '@/components/(shared)/PDF/PDFViewer';
import { Checkbox } from '@/components/ui/checkbox';
import Container from '@/components/ui/container';
import IfElseRender from '@/components/ui/if-else-renderer';
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
                    <IfElseRender
                      condition={row.getIsSelected()}
                      ifTrue={
                        <div className="pb-1 text-wm-white-400">
                          Select Attachments to Process
                        </div>
                      }
                    />
                    {row.original?.attachments?.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex flex-row items-center gap-2 "
                      >
                        <IfElseRender
                          condition={row.getIsSelected()}
                          ifTrue={<Checkbox defaultChecked disabled />}
                        />

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipContent side="right">
                              <div className="no-scrollbar max-h-[600px] overflow-x-hidden overflow-y-scroll">
                                <PDFViewer
                                  file={attachment.base64}
                                  width={400}
                                />
                              </div>
                            </TooltipContent>
                            <TooltipTrigger>
                              {attachment.fileName}
                            </TooltipTrigger>
                          </Tooltip>
                        </TooltipProvider>
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
