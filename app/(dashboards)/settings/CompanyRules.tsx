import React, { useEffect, useState } from 'react';

import Container from '@/components/ui/container';
import LoadingState from '@/components/ui/empty-state';
import IfElseRender from '@/components/ui/if-else-renderer';
import { MultiComboBox } from '@/components/ui/multi-combo-box';

import { useApprovals } from '@/lib/hooks/supabase/useApprovals';
import { useCompany } from '@/lib/hooks/supabase/useCompany';
import { useUser } from '@/lib/hooks/supabase/useUser';

import { Company } from '@/models/Company';
import { User, User_Nested } from '@/models/User';

import { useAppContext } from '../layout';

const { getUsersByCompanyId } = useUser();
const { getDefaultApprovers } = useCompany();
const { createDefaultApprover, deleteDefaultApproverByCompanyAndApproverId } =
  useApprovals();

const CompanyRules = ({ company }: { company: Company }) => {
  const [defaultApprovers, setDefaultApprovers] = useState<User_Nested[]>([]);
  const [fetchingDefaultApprovers, setFetchingDefaultApprovers] =
    useState(true);

  useEffect(() => {
    getDefaultApprovers(company.id).then((data) => setDefaultApprovers(data));
    setFetchingDefaultApprovers(false);
  }, []);

  const handleSelect = (value: User_Nested) => {
    console.log(
      value,
      defaultApprovers.map((approver) => approver),
    );
    const user = defaultApprovers.find((approver) => approver.id === value.id);
    console.log(user);

    if (user) {
      deleteDefaultApproverByCompanyAndApproverId(company.id, value.id).then(
        () =>
          setDefaultApprovers(
            defaultApprovers.filter((approver) => approver.id !== value.id),
          ),
      );
    } else {
      createDefaultApprover(company.id, value.id).then(() =>
        setDefaultApprovers([...defaultApprovers, value]),
      );
    }
  };

  return (
    <Container header="Company Rules" innerClassName="p-3">
      All Invoices must be reviewed by:
      <IfElseRender
        condition={!!company.id && !fetchingDefaultApprovers}
        ifTrue={
          <MultiComboBox
            className="w-full"
            fetchValuesFunction={() =>
              getUsersByCompanyId(company.id!).then((data) =>
                data.map((user) => new User_Nested(user)),
              )
            }
            valuesToMatch={defaultApprovers}
            getOptionLabel={(option) => option.name}
            callBackFunction={handleSelect}
          />
        }
        ifFalse={<LoadingState />}
      />
    </Container>
  );
};

export default CompanyRules;
