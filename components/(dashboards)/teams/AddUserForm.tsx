'use client';

import React, { useState } from 'react';

import { CheckIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

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
  setAddUser: (truth: boolean) => void;
}) {
  const [selectedNewUserRoles, setSelectedNewUserRoles] = useState<string[]>(
    [],
  );
  const formAddUser = useForm<z.infer<typeof createAccountFormSchema>>();

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
  return (
    <Form {...formAddUser}>
      <form className="absolute right-0 flex w-[420px] flex-col gap-2 rounded-md border p-2 pl-2">
        <FormField
          control={formAddUser.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <p className="text-base">Name</p>
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
              <p className="text-base">Email</p>
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
              <p className="text-base">Password</p>
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
          <p className="text-base">Roles</p>

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
            variant={'ghost'}
            onClick={() =>
              createUser(
                companyID,
                formAddUser.getValues('name'),
                formAddUser.getValues('password'),
                formAddUser.getValues('email'),
                selectedNewUserRoles,
              )
            }
          >
            <CheckIcon />
          </Button>
          <Button
            variant={'ghost'}
            appearance={'destructive-strong'}
            onClick={() => {
              setAddUser(false);
              setSelectedNewUserRoles([]);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
