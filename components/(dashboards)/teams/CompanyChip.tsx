import React from 'react';

import { UUID } from 'crypto';

interface Company {
  id: UUID;
  name: string;
}

export default function CompanyChip({
  company,
  selectedCompanyID,
  setSelectedCompanyID,
}: {
  company: Company;
  selectedCompanyID: UUID | null;
  setSelectedCompanyID: React.Dispatch<React.SetStateAction<UUID | null>>;
}) {
  return (
    <button
      key={company.id}
      className={`${
        selectedCompanyID === company.id
          ? 'bg-[#f3f4f6] text-black'
          : 'bg-white '
      }  whitespace-nowrap rounded-full border border-[#e4e4e4] px-4 py-1`}
      onClick={() =>
        setSelectedCompanyID((prev) =>
          prev === company.id ? null : company.id,
        )
      }
    >
      {company.name}
    </button>
  );
}
