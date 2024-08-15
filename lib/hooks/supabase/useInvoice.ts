import { Approvable, ApprovalStatus, InvoiceStatus } from '@/constants/enums';
import { createClient } from '@/lib/utils/supabase/client';
import Invoice from '@/models/Invoice';

import { useUser } from './useUser';

const supabase = createClient();
const { fetchUserData } = useUser();

export const useInvoice = () => {
  async function getInvoicesByStates(
    states: InvoiceStatus[],
    callBack?: (invoices: Invoice[]) => void,
  ) {
    const user = await fetchUserData();
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

  return {
    getInvoicesByStates,
    getInvoicesByStateApproverAndApprovalStatus,
    getInvoicesAwaitingUserApproval,
  };
};
