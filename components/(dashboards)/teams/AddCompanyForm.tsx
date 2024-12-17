import React, { Dispatch, SetStateAction, useRef } from 'react';

import { CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

import { CREATE_COMPANY_SCHEMA } from '@/constants/constants';
import { Company } from '@/models/Company';

export default function AddCompanyForm({
  setCompanyData,
}: {
  setCompanyData: Dispatch<SetStateAction<Company[]>>;
}) {
  const { createCompany } = useCompany();
  const form = useForm<z.infer<typeof CREATE_COMPANY_SCHEMA>>({
    resolver: zodResolver(CREATE_COMPANY_SCHEMA),
  });

  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const handleCreateCompany = async () => {
    try {
      const createdCompany = await createCompany(form.getValues('name'));

      setCompanyData((prevCompanies) => [...prevCompanies, createdCompany]);
      dialogCloseRef.current?.click();
    } catch (error) {
      throw new Error(`Error creating Company: ${error}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={'secondary'} onClick={() => form.reset({ name: '' })}>
          <p>Add Company</p> <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new Company</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-2"
            onSubmit={form.handleSubmit(handleCreateCompany)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col gap-2">
                  <div className="mb-1 flex w-full justify-between">
                    <FormLabel>Name</FormLabel> <FormMessage />
                  </div>
                  <FormControl>
                    <Input
                      className="w-full"
                      {...field}
                      {...form.register(field.name, {
                        onChange(event: { target: { value: any } }) {
                          form.setValue(field.name, event.target.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        },
                      })}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose
                asChild
                ref={dialogCloseRef}
                onClick={() => {
                  form.reset({ name: '' });
                }}
              >
                <Button variant={'outline'}>
                  Cancel
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>

              <Button
                variant={'secondary'}
                type="submit"
                disabled={!form.formState.isDirty || !form.formState.isValid}
              >
                Add Company
                <CheckIcon />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
