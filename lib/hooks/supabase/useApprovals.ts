import { toast } from '@/components/ui/use-toast';

import { Approvable, ApprovalStatus } from '@/constants/enums';
import { createClient } from '@/lib/utils/supabase/client';
import { Approval } from '@/models/Approval';

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

    if (error) {
      throw new Error('Failed to create approval');
    } else {
      const parsedData = new Approval(data[0]);
      return parsedData;
    }
  };

  const deleteApproval = async (approvalId: string) => {
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
        {
          approver_id: approverId,
          approvable_id: approvableId,
          approvable_type: Approvable.INVOICE,
          status,
        },
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

  const createDefaultApprover = async (
    company_id: string,
    approver_id: string,
  ) => {
    const { data, error } = await supabase
      .from('company_criterion')
      .upsert(
        {
          company_id,
          approver_id,
          type: 'DEFAULT_APPROVER',
        },
        {
          onConflict: 'company_id, approver_id',
        },
      )
      .select('*');

    if (error) {
      throw new Error('Failed to create default approver');
    }

    return data;
  };

  const deleteDefaultApproverByCompanyAndApproverId = async (
    company_id: string,
    approver_id: string,
  ) => {
    const { error } = await supabase
      .from('company_criterion')
      .delete()
      .eq('company_id', company_id)
      .eq('approver_id', approver_id);

    if (error) {
      throw new Error('Failed to delete default approver');
    }

    return true;
  };

  const deleteDefaultApproverById = async (id: string) => {
    const { error } = await supabase
      .from('company_criterion')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error('Failed to delete default approver');
    }

    return true;
  };

  return {
    createApproval,
    createDefaultApprover,
    deleteApproval,
    deleteDefaultApproverById,
    deleteDefaultApproverByCompanyAndApproverId,
    getApprovalsByApprovableId,
    updateApprovalByApprovableAndApproverId,
    updateApprovalById,
  };
};
