import { useEffect, useState } from 'react';

import { UUID } from 'crypto';

import Chip, { STATUS_CHIP_VARIANTS } from '@/components/ui/chip';
import LoadingState from '@/components/ui/empty-state';
import IfElseRender from '@/components/ui/if-else-renderer';
import { MultiComboBox } from '@/components/ui/multi-combo-box';

import { useApprovals } from '@/lib/hooks/supabase/useApprovals';
import { useUser } from '@/lib/hooks/supabase/useUser';

import { useAppContext } from '@/app/(dashboards)/context';
import {
  Approvable,
  ApprovalStatus,
  InvoiceStatus,
  ReceiptStatus,
} from '@/constants/enums';
import { toTitleCase } from '@/lib/utils';
import { Approval } from '@/models/Approval';
import Invoice from '@/models/Invoice';
import { User, User_Nested } from '@/models/User';

interface ApprovalOption {
  id: UUID;
  status: string;
  approver: User_Nested;
  removable: boolean;
}

interface ApprovableBasic {
  id: UUID;
  status: InvoiceStatus | ReceiptStatus;
}

const Approvals = <T extends ApprovableBasic>({
  approvable,
}: {
  approvable: T;
}) => {
  const { getApprovalsByApprovableId, createApproval, deleteApproval } =
    useApprovals();
  const { getUsersByCompanyId } = useUser();
  const { user } = useAppContext();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [fetchingApprovals, setFetchingApprovals] = useState(true);

  useEffect(() => {
    const id = approvable.id;
    getApprovalsByApprovableId(id, setApprovals).then(() =>
      setFetchingApprovals(false),
    );
  }, [approvable]);

  const determineApprovableType = (approvable: T) => {
    if (approvable instanceof Invoice) {
      return Approvable.INVOICE;
    }

    return Approvable.RECEIPT;
  };

  const handleSelect = async (newValue: ApprovalOption) => {
    const approval = approvals.find((a) => a.approver.id === newValue.id);
    const approvableType = determineApprovableType(approvable);

    if (approval) {
      if (approval.removable) {
        await deleteApproval(approval.id);
        setApprovals((prev) => prev.filter((a) => a.id !== approval.id));
      }
    } else {
      const createdApproval = await createApproval(
        approvable.id,
        approvableType,
        newValue.id,
        true,
      );
      setApprovals((prev) => [...prev, createdApproval]);
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
      condition={!!user && !fetchingApprovals}
      ifTrue={
        <>
          <MultiComboBox
            disabled={approvable.status === 'APPROVED'}
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
          <ApprovalAuditTrail approvals={approvals} />
        </>
      }
      ifFalse={<LoadingState />}
    />
  );
};

const ApprovalAuditTrail = ({ approvals }: { approvals: Approval[] }) => {
  return (
    <div className="pt-2">
      {approvals.map((approval) => {
        const style: Record<ApprovalStatus, string> = {
          [ApprovalStatus.APPROVED]: 'text-green-500',
          [ApprovalStatus.REJECTED]: 'text-red-500',
          [ApprovalStatus.PENDING]: 'hidden',
        };

        return (
          <p className={`${style[approval.status as ApprovalStatus]}`}>
            {toTitleCase(approval.status)} — {approval.approver.name}, on{' '}
            {approval.updatedAt.toLocaleDateString('US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            }) +
              ' at ' +
              approval.updatedAt.toLocaleTimeString('en', {
                hour: 'numeric',
                minute: '2-digit',
              })}
          </p>
        );
      })}
    </div>
  );
};

export default Approvals;
