import { toast } from '@/components/ui/use-toast';

import { useAppContext } from '@/app/(dashboards)/context';
import { Email } from '@/app/api/v1/gmail/messages/interfaces';
import { Approvable, ApprovalStatus, InvoiceStatus } from '@/constants/enums';
import { InvoiceCountsResponse } from '@/interfaces/db.interfaces';
import { createClient } from '@/lib/utils/supabase/client';
import Invoice from '@/models/Invoice';

const supabase = createClient();

export const useInvoice = () => {
  const { user } = useAppContext();
  async function getInvoiceCounts() {
    const invoiceCounts = await supabase.rpc('get_invoice_counts', {
      requesting_user_id: user.id,
    });

    if (invoiceCounts.error) {
      console.error('Error fetching counts');
      return;
    }

    const data: InvoiceCountsResponse = invoiceCounts.data;

    return data;
  }

  async function getCompanyInvoicesByStates(
    states: InvoiceStatus[],
    callBack?: (invoices: Invoice[]) => void,
  ) {
    const companyId = user.company.id;

    //@todo implement a store to cache this call
    const { data, error } = await supabase
      .from('invoices')
      .select('*, principal: users(name, email, id), company: companies(*)')
      .in('status', states)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      return [];
    } else {
      const parsedData = data.map((invoice) => new Invoice(invoice));
      callBack && callBack(parsedData);
      return parsedData;
    }
  }

  async function getCompanyInvoicesFromGmailInbox(
    companyId: string,
    callBack?: (invoices: Email[]) => void,
  ) {
    try {
      const response = await fetch(
        `/api/v1/gmail/messages?companyId=${companyId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        toast({
          title: 'Error fetching emails',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to fetch mail');
      }

      const emails = await response.json();

      callBack?.(emails);
    } catch (error) {
      throw new Error(`Failed to get emails, ${error}`);
    }
  }

  async function getInvoicesByStateApproverAndApprovalStatus(
    state: InvoiceStatus,
    approvalStatus: ApprovalStatus[],
    approverId: string,
    callBack?: (invoices: Invoice[]) => void,
  ) {
    const { data: approvalData, error: approvalError } = await supabase
      .from('approvals')
      .select('approvable_id')
      .eq('approver_id', approverId)
      .eq('approvable_type', Approvable.INVOICE)
      .in('status', approvalStatus);

    if (approvalError) {
      return [];
    }

    //@todo implement a store to cache this call
    const { data, error } = await supabase
      .from('invoices')
      .select('*, principal: users(name, email, id), company: companies(*)')
      .eq('status', state)
      .in(
        'id',
        approvalData.map((approval) => approval.approvable_id),
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      return [];
    } else {
      const parsedData = data.map((invoice) => new Invoice(invoice));
      callBack && callBack(parsedData);
      return parsedData;
    }
  }

  async function getInvoicesAwaitingUserApproval(
    approverId: string,
    callBack?: (invoices: Invoice[]) => void,
  ) {
    return getInvoicesByStateApproverAndApprovalStatus(
      InvoiceStatus.FOR_REVIEW,
      [ApprovalStatus.PENDING],
      approverId,
      callBack,
    );
  }

  async function processInvoicesByFileURLs(fileURLs: string[]) {
    const res = await fetch('/api/v1/workman/bill', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileURLs, userId: user.id }),
    });

    const response = await res.json();

    return response;
  }

  async function deleteInvoices(invoiceIds: string[]) {
    const { data, error } = await supabase
      .from('invoices')
      .delete()
      .in('id', invoiceIds);

    if (error) {
      console.error('Error deleting invoices:', error);
      toast({
        title: 'Error',
        description: 'Error deleting invoices',
        variant: 'destructive',
      });
      return false;
    } else {
      return data;
    }
  }

  return {
    getInvoiceCounts,
    getCompanyInvoicesByStates,
    getCompanyInvoicesFromGmailInbox,
    getInvoicesByStateApproverAndApprovalStatus,
    getInvoicesAwaitingUserApproval,
    processInvoicesByFileURLs,
    deleteInvoices,
  };
};
