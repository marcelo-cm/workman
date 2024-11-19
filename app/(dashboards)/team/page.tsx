'use client';

import React, { useEffect, useState } from 'react';

import { PlusIcon } from '@radix-ui/react-icons';

import { UUID } from 'crypto';

import AddCompanyForm from '@/components/(dashboards)/teams/AddCompanyForm';
import TeamDashboard from '@/components/(dashboards)/teams/TeamDashboard';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import IfElseRender from '@/components/ui/if-else-renderer';

import { useCompany } from '@/lib/hooks/supabase/useCompany';

interface Company {
  id: UUID;
  name: string;
}

export default function Page() {
  const { fetchCompanyData } = useCompany();

  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [addCompany, setAddCompany] = useState<boolean>(false);
  const [activeAddUserCompanyID, setActiveAddUserCompanyID] =
    useState<UUID | null>(null);
  const [selectedCompanyID, setSelectedCompanyID] = useState<UUID | null>(null);

  useEffect(() => {
    fetchCompanyData().then((data) => setCompanyData(data));
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-6 px-4 py-8">
      <BreadcrumbList className="text-wm-white-400">
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbLink className="text-black" href="/settings">
          Team
        </BreadcrumbLink>
      </BreadcrumbList>
      <div className="relative flex gap-4">
        <div className="flex w-[900px] items-center justify-between">
          <h1 className="font-poppins text-4xl">Team</h1>
          <Button onClick={() => setAddCompany(true)}>
            <p>Add Company</p> <PlusIcon />
          </Button>
        </div>
        <IfElseRender
          condition={addCompany}
          ifTrue={<AddCompanyForm setAddCompany={setAddCompany} />}
          ifFalse={null}
        />
      </div>

      <section className="scrollbar-hidden flex max-w-[900px] gap-2">
        {companyData.map((company) => (
          <Button
            key={company.id}
            variant="outline"
            className={`${
              selectedCompanyID === company.id
                ? 'bg-wm-white-100' // Example selected styles
                : 'bg-white text-black' // Default styles
            } whitespace-nowrap`}
            onClick={() =>
              setSelectedCompanyID((prev) =>
                prev === company.id ? null : company.id,
              )
            }
          >
            {company.name}
          </Button>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        {companyData
          .filter(
            (company) =>
              selectedCompanyID === null || company.id === selectedCompanyID,
          )
          .map((company) => (
            <TeamDashboard
              key={company.id}
              companyID={company.id}
              companyName={company.name}
              isAddUserActive={activeAddUserCompanyID === company.id}
              setActiveAddUserCompanyID={setActiveAddUserCompanyID}
            />
          ))}
      </section>
    </div>
  );
}
