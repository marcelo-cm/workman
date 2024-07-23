import { ChipVariants } from '@/components/ui/chip';

import { Approval } from '@/models/Approval';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const useApprovals = () => {
  const getApprovalsByApprovableId = async (
    approvableId: string,
    callBack?: (approvals: Approval[]) => void,
  ) => {
    const { data, error } = await supabase
      .from('approvals')
      .select('*, approver: approver_id(*)')
      .eq('approvable_id', approvableId);

    if (error) {
      console.error('Error fetching approvals:', error);
      return [];
    } else {
      const parsedData = data.map((approval) => {
        // Filter the unwanted fields from the approver object
        if (approval.approver) {
          const { id, email, created_at } = approval.approver;
          approval.approver = { id, email, created_at };
        }
        return new Approval(approval);
      });
      console.log('Approvals:', parsedData);
      console.log('User Name', parsedData[0].approver.email);
      callBack && callBack(parsedData);
      return parsedData;
    }
  };

  return { getApprovalsByApprovableId };
};
