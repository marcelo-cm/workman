import React from 'react';

import { InvoiceData } from '@/interfaces/common.interfaces';

const InvoiceDetails = ({ invoice }: { invoice: InvoiceData }) => {
  return (
    <div className="flex w-full flex-row p-2">
      <div className="mr-auto flex flex-col leading-tight">
        <p>
          <span className="font-medium">Total: </span>
          {invoice.totalNet} (incl. tax)
        </p>
        <p>
          <span className="font-medium">Vendor: </span>
          {invoice.supplierName}
        </p>
        <p>
          <span className="font-medium">Customer: </span>
          {invoice.customerAddress}
        </p>
      </div>
      <div className="ml-auto flex flex-col text-right leading-tight">
        <p>
          <span className="font-medium">Transaction Date: </span>
          {invoice.date}
        </p>
        <p>
          <span className="font-medium">Date Due: </span>
          {invoice.dueDate}
        </p>
      </div>
    </div>
  );
};

export default InvoiceDetails;
