import { toast } from '@/components/ui/use-toast';

import { Approvable, ApprovalStatus } from '@/constants/enums';
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

  const createApproval = async (
    approvable_id: string,
    approvable_type: Approvable,
    approver_id: string,
    removable: boolean,
  ): Promise<Approval> => {
    console.log('creating approval', approver_id);
    const { data, error } = await supabase
      .from('approvals')
      .insert([
        {
          approvable_id,
          approvable_type,
          approver_id,
          status: ApprovalStatus.PENDING,
          removable,
        },
      ])
      .select(
        '*, approver: approver_id(id, name, email), principal: principal_id(id, name, email)',
      );

    console.log('data', data);

    if (error) {
      throw new Error('Failed to create approval');
    } else {
      const parsedData = new Approval(data[0]);
      return parsedData;
    }
  };

  const deleteApproval = async (approvalId: string) => {
    console.log('deleting approval');
    const { error } = await supabase
      .from('approvals')
      .delete()
      .eq('id', approvalId);

    if (error) {
      toast({
        title: 'Failed to delete approval',
      });
    } else {
      return true;
    }
  };

  const updateApprovalByApprovableAndApproverId = async (
    approvableId: string,
    approverId: string,
    status: ApprovalStatus,
  ) => {
    const { error } = await supabase
      .from('approvals')
      .upsert(
        { status },
        {
          onConflict: 'approvable_id, approver_id',
        },
      )
      .eq('approvable_id', approvableId)
      .eq('approver_id', approverId);

    if (error) {
      toast({
        title: 'Failed to update approval',
      });
    } else {
      return true;
    }
  };

  const updateApprovalById = async (
    approvalId: string,
    status: ApprovalStatus,
  ) => {
    const { error } = await supabase
      .from('approvals')
      .update({ status })
      .eq('id', approvalId);

    if (error) {
      toast({
        title: 'Failed to update approval',
      });
    } else {
      return true;
    }
  };

  return {
    createApproval,
    deleteApproval,
    getApprovalsByApprovableId,
    updateApprovalByApprovableAndApproverId,
    updateApprovalById,
  };
};
