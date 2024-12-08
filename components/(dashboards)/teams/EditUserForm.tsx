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

import { Roles } from '@/constants/enums';
import { User } from '@/models/User';

const editAccountFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
});

export default function EditUserForm({
  user,
  setEditingUserId,
  setUsersData,
  selectedRoles,
  setSelectedRoles,
}: {
  user: User;
  setEditingUserId: (id: UUID | null) => void;
  setUsersData: (userData: any) => void;
  selectedRoles: string[];
  setSelectedRoles: (role: any) => void;
}) {
  const { updateUserData } = useUser();
  const formEditUser = useForm<z.infer<typeof editAccountFormSchema>>({
    resolver: zodResolver(editAccountFormSchema),
  });

  const handleSaveClick = (id: UUID) => {
    const rowToUpdate = {
      ...(formEditUser.getValues('name') && {
        name: formEditUser.getValues('name'),
      }),
      ...(formEditUser.getValues('email') && {
        email: formEditUser.getValues('email'),
      }),
      ...(selectedRoles && { roles: selectedRoles }),
    };

    updateUserData(id, rowToUpdate);

    setUsersData((prevUsers: User[]) =>
      prevUsers.map((user) =>
        user.id === id
          ? new User({
              name: formEditUser.getValues('name') ?? user.name,
              id: user.id,
              email: formEditUser.getValues('email') ?? user.email,
              company: user.company,
              ignore_label_id: user.ignoreLabelId,
              scanned_label_id: user.scannedLabelId,
              gmail_integration_status: user.gmailIntegrationStatus,
              quickbooks_integration_status: user.quickbooksIntegrationStatus,
              roles: selectedRoles.length > 0 ? selectedRoles : user.roles,
              created_at: user.createdAt.toISOString(),
            })
          : user,
      ),
    );
    formEditUser.reset();
    setSelectedRoles([]);
    setEditingUserId(null);
  };

  const handleSelectedRoles = (selectedRole: { id: string }) => {
    setSelectedRoles((prevRoles: any) => {
      const isSelected = prevRoles.includes(selectedRole.id);
      if (isSelected) {
        return prevRoles.filter((val: any) => val !== selectedRole.id);
      } else {
        return [...prevRoles, selectedRole.id];
      }
    });
  };

  return (
    <Form {...formEditUser} key={user.id}>
      <form className="flex h-14 w-full flex-row items-center gap-2 border-t px-2">
        <FormField
          control={formEditUser.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className="w-full text-base"
                  defaultValue={user.name}
                  {...field}
                  {...formEditUser.register(field.name, {
                    onChange(event) {
                      formEditUser.setValue(field.name, event.target.value, {
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
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  className="w-full text-base"
                  defaultValue={user.email}
                  {...field}
                  {...formEditUser.register(field.name, {
                    onChange(event) {
                      formEditUser.setValue(field.name, event.target.value, {
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
        <MultiComboBox
          className="w-full"
          valuesToMatch={selectedRoles.map((role) => ({
            id: role,
          }))}
          options={Object.values(Roles).map((role) => ({
            id: role,
          }))}
          getOptionLabel={(option) => option?.id.replaceAll('_', ' ')}
          callBackFunction={handleSelectedRoles}
        />

        <Button
          variant="ghost"
          onClick={() => handleSaveClick(user.id)}
          disabled={!formEditUser.formState.isDirty}
        >
          <CheckIcon />
        </Button>
        <Button
          variant="ghost"
          appearance="destructive-strong"
          onClick={() => {
            setEditingUserId(null);
            setSelectedRoles([]);
            formEditUser.reset();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
