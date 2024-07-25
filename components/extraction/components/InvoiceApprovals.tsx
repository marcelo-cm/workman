import React, { useEffect, useState } from 'react';

import { UUID } from 'crypto';

import Chip, { STATUS_CHIP_VARIANTS } from '@/components/ui/chip';
import LoadingState from '@/components/ui/empty-state';
import IfElseRender from '@/components/ui/if-else-renderer';
import { MultiComboBox } from '@/components/ui/multi-combo-box';

import { useApprovals } from '@/lib/hooks/supabase/useApprovals';
import { useUser } from '@/lib/hooks/supabase/useUser';

import { Approvable } from '@/constants/enums';
import { Approval } from '@/models/Approval';
import Invoice from '@/models/Invoice';
import { User, User_Nested } from '@/models/User';

const { getApprovalsByApprovableId, createApproval, deleteApproval } =
  useApprovals();
const { getUsersByCompanyId, fetchUserData } = useUser();

interface ApprovalOption {
  id: UUID;
  status: string;
  approver: User_Nested;
  removable: boolean;
}

const InvoiceApprovals = ({ invoice }: { invoice: Invoice }) => {
  const [user, setUser] = useState<User>();
  const [approvals, setApprovals] = useState<Approval[]>([]);

  useEffect(() => {
    fetchUserData().then(setUser);
  }, []);

  useEffect(() => {
    const id = invoice.id;
    getApprovalsByApprovableId(id, setApprovals);
  }, [invoice]);

  const handleSelect = async (newValues: ApprovalOption[]) => {
    console.log(newValues, approvals);
    if (newValues.length < approvals.length) {
      const removedApproval = approvals.find(
        (a) => !newValues.map((nv) => nv.id).includes(a.id),
      );

      if (removedApproval) {
        await deleteApproval(removedApproval.id);
        setApprovals((prev) => prev.filter((a) => a.id !== removedApproval.id));
      }
    } else if (newValues.length > approvals.length) {
      const approvalIds = approvals.map((a) => a.approver.id);
      const addedApproval = newValues.find(
        (nv) => !approvalIds.includes(nv.id),
      );

      if (addedApproval) {
        const createdApproval = await createApproval(
          invoice.id,
          Approvable.INVOICE,
          addedApproval.id,
          true,
        );
        setApprovals((prev) => [...prev, createdApproval]);
      }
    }
  };

  const userToApproverOption = (user: User): ApprovalOption => {
    const userFound = approvals.find(
      (approval) => user.id == approval.approver.id,
    );

    return {
      id: user.id,
      status: userFound?.status ?? 'PENDING',
      approver: new User_Nested(user),
      removable: userFound?.removable ?? true,
    };
  };

  const renderApprovalValues = (approval: ApprovalOption) => {
    const variantKey =
      approval.status === 'PENDING'
        ? approval.removable
          ? 'PENDING'
          : 'NON_REMOVABLE'
        : approval.status;

    const icon_variant = STATUS_CHIP_VARIANTS[variantKey];

    return (
      <Chip key={approval.id} variant={icon_variant.variant}>
        {approval.approver.name} {icon_variant.icon}
      </Chip>
    );
  };

  return (
    <IfElseRender
      condition={!!user}
      ifTrue={
        <MultiComboBox
          className="w-full"
          fetchValuesFunction={() =>
            getUsersByCompanyId(user?.company.id!).then((users) =>
              users.map(userToApproverOption),
            )
          }
          valuesToMatch={approvals.map((approval) => ({
            id: approval.approver.id,
            status: approval.status,
            approver: approval.approver,
            removable: approval.removable,
          }))}
          getOptionLabel={(option) => option.approver.name}
          callBackFunction={handleSelect}
          renderValues={renderApprovalValues}
          optionDisabledIf={(option) =>
            !option.removable || !(option.status === 'PENDING')
          }
        />
      }
      ifFalse={<LoadingState />}
    />
  );
};

export default InvoiceApprovals;
