import { Approvable, ApprovalStatus, InvoiceStatus } from '@/constants/enums';
import Invoice from '@/models/Invoice';
import { createClient } from '@/utils/supabase/client';

import { useUser } from './useUser';

const supabase = createClient();
const { fetchUser } = useUser();

export const useInvoice = () => {
  async function getInvoicesByStates(
    states: InvoiceStatus[],
    callBack?: (invoices: Invoice[]) => void,
  ) {
    const user = await fetchUser();
    const id = user.data.user?.id;

    const { data, error } = await supabase
      .from('invoices')
      .select('*, principal: users(name, email, id), company: companies(*)')
      .in('status', states)
      .eq('principal_id', `${id}`)
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
    console.log('approverId', approverId);
    const { data: approvalData, error: approvalError } = await supabase
      .from('approvals')
      .select('approvable_id')
      .eq('approver_id', approverId)
      .eq('approvable_type', Approvable.INVOICE)
      .in('status', approvalStatus);

    if (approvalError) {
      console.error('Error fetching approvals:', approvalError);
      return [];
    }

    console.log('approvalData', approvalData);

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
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
