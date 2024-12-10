import React, { useMemo, useState } from 'react';

import { CheckIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import Chip from '@/components/ui/chip';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
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
  onSubmit,
  onClose,
}: {
  user: User;
  onSubmit: Function;
  onClose: Function;
}) {
  const { updateUserData } = useUser();
  const [selectedRoles, setSelectedRoles] = useState<Roles[]>(user.roles);
  const formEditUser = useForm<z.infer<typeof editAccountFormSchema>>({
    resolver: zodResolver(editAccountFormSchema),
  });

  const handleSaveClick = async (id: UUID) => {
    const rowToUpdate = {
      ...(formEditUser.getValues('name') && {
        name: formEditUser.getValues('name'),
      }),
      ...(formEditUser.getValues('email') && {
        email: formEditUser.getValues('email'),
      }),
      ...(selectedRoles && { roles: selectedRoles }),
    };

    await updateUserData(id, rowToUpdate);

    await onClose();
    await onSubmit();
    formEditUser.reset();
    setSelectedRoles([]);
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
          renderValues={(value) => (
            <Chip>
              {Roles[value.id].replaceAll('_', ' ')}{' '}
              <X className="h-3 w-3 group-hover:text-red-500" />
            </Chip>
          )}
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => handleSaveClick(user.id)}
          disabled={!formEditUser.formState.isDirty}
        >
          <CheckIcon />
        </Button>

        <Button
          type="button"
          variant="ghost"
          appearance="destructive-strong"
          onClick={() => {
            setSelectedRoles([]);
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
