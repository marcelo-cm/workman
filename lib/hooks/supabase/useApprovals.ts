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
      .select(
        '*, approver: approver_id(id, name, email), principal: principal_id(id, name, email)',
      )
      .eq('approvable_id', approvableId);

    if (error) {
      return [];
    } else {
      const parsedData = data.map((approval) => {
        return new Approval(approval);
      });
      callBack && callBack(parsedData);
      return parsedData;
    }
  };

  return { getApprovalsByApprovableId };
};
