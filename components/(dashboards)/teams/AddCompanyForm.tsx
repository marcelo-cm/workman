import React from 'react';

import { CheckIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  name: z.string().min(3),
});

export default function AddCompanyForm({
  setAddCompany,
}: {
  setAddCompany: (truth: boolean) => void;
}) {
  const { createCompany } = useCompany();
  const formAddCompany = useForm<z.infer<typeof createCompanyFormSchema>>({
    resolver: zodResolver(createCompanyFormSchema),
  });

  const handleCreateCompany = async () => {
    await createCompany(formAddCompany.getValues('name'));
    window.location.reload();
  };
  return (
    <Form {...formAddCompany}>
      <form
        className="absolute left-[916px] flex w-full max-w-[420px] flex-col gap-2 rounded-md border p-2 pl-2"
        onSubmit={formAddCompany.handleSubmit(handleCreateCompany)}
      >
        <FormField
          control={formAddCompany.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-2">
              <p className="w-[90px]">Name</p>
              <FormControl>
                <Input
                  className="w-full"
                  {...field}
                  {...formAddCompany.register(field.name, {
                    onChange(event: { target: { value: any } }) {
                      formAddCompany.setValue(field.name, event.target.value, {
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
        <div className="flex gap-2">
          <Button
            variant={'ghost'}
            type="submit"
            disabled={
              !formAddCompany.formState.isDirty ||
              !formAddCompany.formState.isValid
            }
          >
            <CheckIcon />
          </Button>
          <Button
            variant={'ghost'}
            appearance={'destructive-strong'}
            onClick={() => {
              setAddCompany(false);
              formAddCompany.reset();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
