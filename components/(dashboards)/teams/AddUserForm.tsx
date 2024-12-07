'use client';

import React, { useState } from 'react';

import { CheckIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'crypto';
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
import { MultiComboBox } from '@/components/ui/multi-combo-box';

import { useUser } from '@/lib/hooks/supabase/useUser';

const { createUser } = useUser();

const createAccountFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  // roles: z.array(z.string()).nonempty('At least one role is required'),
  password: z.string().min(1),
});

export default function AddUserForm({
  companyID,
  setAddUser,
}: {
  companyID: UUID;
  setAddUser: (id: UUID | null) => void;
}) {
  const [selectedNewUserRoles, setSelectedNewUserRoles] = useState<string[]>(
    [],
  );
  const formAddUser = useForm<z.infer<typeof createAccountFormSchema>>({
    resolver: zodResolver(createAccountFormSchema),
  });

  const handleSelectedNewUserRoles = (selectedRole: { id: string }) => {
    setSelectedNewUserRoles((prevRoles) => {
      const isSelected = prevRoles.includes(selectedRole.id);
      if (isSelected) {
        return prevRoles.filter((val) => val !== selectedRole.id);
      } else {
        return [...prevRoles, selectedRole.id];
      }
    });
  };

  const handleCreateUser = () => {
    createUser(
      companyID,
      formAddUser.getValues('name'),
      formAddUser.getValues('password'),
      formAddUser.getValues('email'),
      selectedNewUserRoles,
    );
  };

  return (
    <Form {...formAddUser}>
      <form
        className="absolute left-[916px] flex w-full max-w-[420px] flex-col gap-2 rounded-md border p-2 pl-2"
        onSubmit={formAddUser.handleSubmit(handleCreateUser)}
      >
        <FormField
          control={formAddUser.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <p className="w-[90px] text-base">Name</p>
              <FormControl>
                <Input
                  className="text-base"
                  {...field}
                  {...formAddUser.register(field.name, {
                    onChange(event: { target: { value: any } }) {
                      formAddUser.setValue(field.name, event.target.value, {
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
        <FormField
          control={formAddUser.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <p className="w-[90px] text-base">Email</p>
              <FormControl>
                <Input
                  className="text-base"
                  {...field}
                  {...formAddUser.register(field.name, {
                    onChange(event: { target: { value: any } }) {
                      formAddUser.setValue(field.name, event.target.value, {
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
        <FormField
          control={formAddUser.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <p className="w-[90px] text-base">Password</p>
              <FormControl>
                <Input
                  className="text-base"
                  {...field}
                  {...formAddUser.register(field.name, {
                    onChange(event: { target: { value: any } }) {
                      formAddUser.setValue(field.name, event.target.value, {
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

        <div className="flex items-center gap-2">
          <p className="w-[90px] text-base">Roles</p>

          <MultiComboBox
            className="w-full"
            options={[
              { id: 'PLATFORM_ADMIN' },
              { id: 'COMPANY_ADMIN' },
              { id: 'BOOKKEEPER' },
            ]}
            getOptionLabel={(option) => option?.id}
            callBackFunction={handleSelectedNewUserRoles}
          />
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            variant={'ghost'}
            disabled={
              !formAddUser.formState.isDirty || !formAddUser.formState.isValid
            }
          >
            <CheckIcon />
          </Button>
          <Button
            variant={'ghost'}
            appearance={'destructive-strong'}
            onClick={() => {
              setAddUser(null);
              setSelectedNewUserRoles([]);
              formAddUser.reset();
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
