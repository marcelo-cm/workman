import React from 'react';

import { UUID } from 'crypto';

import TeamDashboard from '../teams/TeamDashboard';

export default function ManageCompany({ companyID }: { companyID: UUID }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xl">Manage Company</div>
      <TeamDashboard
        companyID={companyID}
        companyName={'hi'}
        isAddUserActive={false}
        setActiveAddUserCompanyID={() => {}}
      />
    </div>
  );
}
