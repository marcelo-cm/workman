import { toast } from '@/components/ui/use-toast';

import { Approvable, ApprovalStatus, ReceiptStatus } from '@/constants/enums';
import { ReceiptCountsResponse } from '@/interfaces/db.interfaces';
import { createClient } from '@/lib/utils/supabase/client';
import { Receipt } from '@/models/Receipt';

import { useUser } from './useUser';

const supabase = createClient();
const { fetchUserData } = useUser();

export const useReceipt = () => {
  async function getReceiptCounts() {
    const user = await fetchUserData();

    const receiptCounts = await supabase.rpc('get_receipt_counts', {
      requesting_user_id: user.id,
    });

    if (receiptCounts.error) {
      console.error('Error fetching counts');
      return;
    }

    const data: ReceiptCountsResponse = receiptCounts.data;

    return data;
  }

  async function getCompanyReceiptsByStates(
    states: ReceiptStatus[],
    callBack?: (receipts: Receipt[]) => void,
  ) {
    const user = await fetchUserData();
    const companyId = user.company.id;

    //@todo implement a store to cache this call
    const { data, error } = await supabase
      .from('receipts')
      .select('*, principal: users(name, email, id), company: companies(*)')
      .in('status', states)
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching receipts:', error);
      return [];
    } else {
      const parsedData = data.map((receipt) => new Receipt(receipt));
      callBack && callBack(parsedData);
      return parsedData;
    }
  }

  async function getReceiptsByStateApproverAndApprovalStatus(
    state: ReceiptStatus,
    approvalStatus: ApprovalStatus[],
    approverId: string,
    callBack?: (receipts: Receipt[]) => void,
  ) {
    const { data: approvalData, error: approvalError } = await supabase
      .from('approvals')
      .select('approvable_id')
      .eq('approver_id', approverId)
      .eq('approvable_type', Approvable.RECEIPT)
      .in('status', approvalStatus);

    if (approvalError) {
      return [];
    }

    //@todo implement a store to cache this call
    const { data, error } = await supabase
      .from('receipts')
      .select('*, principal: users(name, email, id), company: companies(*)')
      .eq('status', state)
      .in(
        'id',
        approvalData.map((approval) => approval.approvable_id),
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching receipts:', error);
      return [];
    } else {
      const parsedData = data.map((receipt) => new Receipt(receipt));
      callBack && callBack(parsedData);
      return parsedData;
    }
  }

  async function getReceiptsAwaitingUserApproval(
    approverId: string,
    callBack?: (receipts: Receipt[]) => void,
  ) {
    return getReceiptsByStateApproverAndApprovalStatus(
      ReceiptStatus.FOR_REVIEW,
      [ApprovalStatus.PENDING],
      approverId,
      callBack,
    );
  }

  async function uploadToReceiptBucket(file: File) {
    const { data, error } = await supabase.storage
      .from('receipts')
      .upload(`${file.name}_${new Date().getTime()}`, file);

    if (error) {
      toast({
        title: `Failed to upload file ${file.name}`,
        description: 'Please try to upload this document again',
        variant: 'destructive',
      });
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    toast({
      title: `${file.name} uploaded successfully`,
      description: 'You can now process this document',
      variant: 'success',
    });

    return data;
  }

  return {
    getReceiptCounts,
    getCompanyReceiptsByStates,
    getReceiptsByStateApproverAndApprovalStatus,
    getReceiptsAwaitingUserApproval,
    uploadToReceiptBucket,
  };
};
