'use client';

import React, { useEffect, useState } from 'react';

import { PlusIcon } from '@radix-ui/react-icons';

import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';

import AddCompanyForm from '@/components/(dashboards)/teams/AddCompanyForm';
import CompanyChip from '@/components/(dashboards)/teams/CompanyChip';
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

import { Roles } from '@/constants/enums';
import { Company } from '@/models/Company';

import { useAppContext } from '../context';

export default function Page() {
  const { user } = useAppContext();
  const { fetchAllCompanies } = useCompany();
  const router = useRouter();

  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [showCompanyForm, setShowCompanyForm] = useState<boolean>(false);
  const [activeAddUserCompanyID, setActiveAddUserCompanyID] =
    useState<UUID | null>(null);
  const [selectedCompanyID, setSelectedCompanyID] = useState<UUID | null>(null);

  useEffect(() => {
    if (!user?.roles?.includes(Roles['PLATFORM_ADMIN'])) {
      router.push('/settings');
    }
    fetchAllCompanies().then((data) => setCompanyData(data));
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-6 px-4 py-8">
      <BreadcrumbList className="text-wm-white-400">
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbLink className="text-black" href="/settings">
          Companies
        </BreadcrumbLink>
      </BreadcrumbList>
      <div className="relative flex w-full gap-4">
        <div className="flex w-[1000px] items-center justify-between">
          <h1 className="font-poppins text-4xl">Companies</h1>

          <AddCompanyForm setCompanyData={setCompanyData} />
        </div>
      </div>

      <section className="no-scrollbar min-h-fit w-[1000px] overflow-x-auto">
        <div className="flex w-max gap-2">
          {companyData.map((company) => (
            <CompanyChip
              company={company}
              selectedCompanyID={selectedCompanyID}
              setSelectedCompanyID={setSelectedCompanyID}
            />
          ))}
        </div>
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
      <div className="text-white">.</div>
    </div>
  );
}
