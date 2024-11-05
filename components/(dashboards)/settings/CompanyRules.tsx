import { useEffect, useState } from 'react';

import Container from '@/components/ui/container';
import LoadingState from '@/components/ui/empty-state';
import IfElseRender from '@/components/ui/if-else-renderer';
import { MultiComboBox } from '@/components/ui/multi-combo-box';

import { useApprovals } from '@/lib/hooks/supabase/useApprovals';
import { useCompany } from '@/lib/hooks/supabase/useCompany';
import { useUser } from '@/lib/hooks/supabase/useUser';

import { Company } from '@/models/Company';
import { User_Nested } from '@/models/User';

const CompanyRules = ({ company }: { company: Company }) => {
  const { getUsersByCompanyId } = useUser();
  const { getDefaultApprovers } = useCompany();
  const { createDefaultApprover, deleteDefaultApproverByCompanyAndApproverId } =
    useApprovals();

  const [defaultApprovers, setDefaultApprovers] = useState<User_Nested[]>([]);
  const [fetchingDefaultApprovers, setFetchingDefaultApprovers] =
    useState(true);

  useEffect(() => {
    getDefaultApprovers(company.id).then((data) => setDefaultApprovers(data));
    setFetchingDefaultApprovers(false);
  }, []);

  const handleSelect = (value: User_Nested) => {
    const user = defaultApprovers.find((approver) => approver.id === value.id);

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
    <Container
      header="Company Rules"
      innerClassName="p-3"
      className="max-w-[1000px]"
    >
      All Invoices must be reviewed by:
      <IfElseRender
        condition={!!company.id && !fetchingDefaultApprovers}
        ifTrue={
          <MultiComboBox
            className="mt-2 w-full"
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
