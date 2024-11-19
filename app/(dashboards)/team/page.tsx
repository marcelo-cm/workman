'use client';

import React, { use, useEffect, useState } from 'react';

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  PlusIcon,
} from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import TeamDashboard from '@/components/(dashboards)/teams/TeamDashboard';
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useCompany } from '@/lib/hooks/supabase/useCompany';

const createCompanyFormSchema = z.object({
  name: z.string().min(1),
});

interface Company {
  id: UUID;
  name: string;
}

export default function page() {
  const { fetchCompanyData } = useCompany();
  const { createCompany } = useCompany();
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [addCompany, setAddCompany] = useState<boolean>(false);
  const formAddCompany = useForm<z.infer<typeof createCompanyFormSchema>>();
  useEffect(() => {
    fetchCompanyData().then((data) => setCompanyData(data));
    formAddCompany.reset();
  }, []);

  const handleCreateCompany = async () => {
    await createCompany(formAddCompany.getValues('name'));
  };

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
        {addCompany ? (
          <Form {...formAddCompany}>
            <form className="absolute right-0 flex w-[420px] flex-col gap-2 rounded border p-2 pl-2">
              <FormField
                control={formAddCompany.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex w-full items-center gap-2">
                    <p>Name</p>
                    <FormControl>
                      <Input
                        className="w-full"
                        {...field}
                        {...formAddCompany.register(field.name, {
                          onChange(event: { target: { value: any } }) {
                            formAddCompany.setValue(
                              field.name,
                              event.target.value,
                              { shouldValidate: true, shouldDirty: true },
                            );
                          },
                        })}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button variant={'ghost'} onClick={() => handleCreateCompany()}>
                  <CheckIcon />
                </Button>
                <Button
                  variant={'ghost'}
                  appearance={'destructive-strong'}
                  onClick={() => setAddCompany(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        ) : null}
      </div>

      <section className="flex gap-2">
        <Button variant={'outline'}>
          <ArrowLeftIcon />
        </Button>
        {companyData.map((company) => (
          <Button variant={'outline'}>
            <a>{company.name}</a>
          </Button>
        ))}
        <Button variant={'outline'}>
          <ArrowRightIcon />
        </Button>
      </section>
      <section className="flex flex-col gap-6">
        {companyData.map((company) => (
          <TeamDashboard
            key={company.id}
            companyID={company.id}
            companyName={company.name}
          />
        ))}
      </section>
    </div>
  );
}
