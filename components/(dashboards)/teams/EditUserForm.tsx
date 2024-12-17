import React, { useEffect, useMemo, useState } from 'react';

import { CheckIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import Chip from '@/components/ui/chip';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { MultiComboBox } from '@/components/ui/multi-combo-box';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { Roles } from '@/constants/enums';
import { prettifyRole } from '@/lib/utils';
import { User } from '@/models/User';

const editAccountFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  roles: z.array(z.string()).min(1),
});

export default function EditUserForm({
  user,
  onSubmit,
  onClose,
}: {
  user: User;
  onSubmit: Function;
  onClose: Function;
}) {
  const { updateUserData } = useUser();
  const formEditUser = useForm<z.infer<typeof editAccountFormSchema>>({
    resolver: zodResolver(editAccountFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
  });
  const { watch, setValue, setError, clearErrors } = formEditUser;
  const roles = watch('roles');

  useEffect(() => {
    if (roles?.length === 0) {
      setError('roles', {
        message: 'Please select at least one role',
      });
    } else {
      clearErrors('roles');
    }
  }, [roles]);

  const handleSaveClick = async (id: UUID) => {
    const rowToUpdate = {
      ...(formEditUser.getValues('name') && {
        name: formEditUser.getValues('name'),
      }),
      ...(formEditUser.getValues('email') && {
        email: formEditUser.getValues('email'),
      }),
      ...(formEditUser.getValues('roles') && {
        roles: formEditUser.getValues('roles'),
      }),
    };

    await updateUserData(id, rowToUpdate);

    await onClose();
    await onSubmit();
  };

  const handleSelectedRoles = (selectedRole: { id: string }) => {
    const isSelected = roles?.includes(selectedRole.id);
    if (isSelected) {
      const newRoles = roles?.filter((role) => role !== selectedRole.id);
      return setValue('roles', newRoles);
    } else {
      let newRoles;
      if (roles) {
        newRoles = [...roles, selectedRole.id];
      } else {
        newRoles = [selectedRole.id];
      }
      return setValue('roles', newRoles);
    }
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
          control={formEditUser.control}
          name="roles"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <MultiComboBox
                  className="w-full"
                  valuesToMatch={roles.map((role) => ({ id: role }))}
                  options={Object.values(Roles).map((role) => ({
                    id: role,
                  }))}
                  getOptionLabel={(option) => prettifyRole(option?.id)}
                  callBackFunction={handleSelectedRoles}
                  renderValues={(value) => (
                    <Chip>
                      {prettifyRole(Roles[value.id as keyof typeof Roles])}{' '}
                      <X className="h-3 w-3 group-hover:text-red-500" />
                    </Chip>
                  )}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="button"
          variant="ghost"
          onClick={() => handleSaveClick(user.id)}
          disabled={!formEditUser.formState.isValid}
        >
          <CheckIcon />
        </Button>

        <Button
          type="button"
          variant="ghost"
          appearance="destructive-strong"
          onClick={() => {
            formEditUser.reset();
            onClose();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
