'use client';

import React, { use, useEffect, useState } from 'react';

import { UUID } from 'crypto';

import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

import { useCompany } from '@/lib/hooks/supabase/useCompany';

import TeamDashboard from './TeamDashboard';

interface Company {
  id: UUID;
  name: string;
}

export default function page() {
  const { fetchCompanyData } = useCompany();
  const [companyNames, setCompanyNames] = useState<string[]>([]);
  const [companyData, setCompanyData] = useState<Company[]>([]);
  useEffect(() => {
    fetchCompanyData().then((data) => setCompanyData(data));
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
      <BreadcrumbList className="text-wm-white-400">
        <BreadcrumbItem>Dashboard</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbLink className="text-black" href="/settings">
          Team
        </BreadcrumbLink>
      </BreadcrumbList>
      <h1 className="flex w-full flex-row justify-between font-poppins text-4xl">
        Team
      </h1>
      <section className="flex gap-2">
        {companyData.map((company) => (
          <Button variant={'outline'}>
            <a>{company.name}</a>
          </Button>
        ))}
      </section>
      <section className="flex flex-col gap-2">
        {companyData.map((company) => (
          <TeamDashboard companyID={company.id} companyName={company.name} />
        ))}
      </section>
    </div>
  );
}
