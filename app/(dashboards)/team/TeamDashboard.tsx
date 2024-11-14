'use client';

import React, { useEffect, useState } from 'react';

import {
  CheckIcon,
  Pencil1Icon,
  PlusIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import AddUserForm from '@/components/(dashboards)/teams/AddUserForm';
import RemovalButton from '@/components/(dashboards)/teams/RemovalButton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import IfElseRender from '@/components/ui/if-else-renderer';
import { Input } from '@/components/ui/input';
import { MultiComboBox } from '@/components/ui/multi-combo-box';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { Roles, rolesList } from '@/constants/enums';
import { User } from '@/models/User';

const editAccountFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
});

const createAccountFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  // roles: z.array(z.string()).nonempty('At least one role is required'),
  password: z.string().min(1),
});

export default function TeamDashboard({
  companyID,
  companyName,
}: {
  companyID: UUID;
  companyName: string;
}) {
  const { getUsersByCompanyId } = useUser();
  const { updateUserData } = useUser();

  const [usersData, setUsersData] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<UUID | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const [addUser, setAddUser] = useState<boolean>(false);
  const formEditUser = useForm<z.infer<typeof editAccountFormSchema>>();

  useEffect(() => {
    getUsersByCompanyId(companyID).then((data) => {
      setUsersData(data);
    });
  }, []);

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
    setSelectedRoles((prevRoles) => {
      const isSelected = prevRoles.includes(selectedRole.id);
      if (isSelected) {
        return prevRoles.filter((val) => val !== selectedRole.id);
      } else {
        return [...prevRoles, selectedRole.id];
      }
    });
  };

  return (
    <div className="relative flex gap-4">
      <div className="flex w-[900px] flex-col items-center justify-between rounded-md border">
        <header className="flex w-full flex-row items-center p-2">
          <p className="w-full">{companyName}</p>
          <Button variant="secondary" onClick={() => setAddUser(true)}>
            <a className="w-20">Add Person</a>
            <PlusIcon />
          </Button>
        </header>

        <header className="flex w-[900px] flex-row border-t bg-[#f5f5f5] p-2">
          <p className="w-full font-medium">Name</p>
          <div className="w-full font-medium">Email</div>
          <div className="w-full font-medium">Roles</div>
          <div className="w-64" />
        </header>

        {usersData.map((user) => (
          <>
            {editingUserId === user.id ? (
              <Form {...formEditUser} key={user.id}>
                <form className="flex w-full flex-row items-center gap-2 border-t pl-1">
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
                                formEditUser.setValue(
                                  field.name,
                                  event.target.value,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
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
                                formEditUser.setValue(
                                  field.name,
                                  event.target.value,
                                  {
                                    shouldValidate: true,
                                    shouldDirty: true,
                                  },
                                );
                              },
                            })}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <MultiComboBox
                    className="w-full"
                    valuesToMatch={selectedRoles.map((role) => ({ id: role }))}
                    options={[
                      { id: 'PLATFORM_ADMIN' },
                      { id: 'COMPANY_ADMIN' },
                      { id: 'BOOKKEEPER' },
                    ]}
                    getOptionLabel={(option) => option?.id}
                    callBackFunction={handleSelectedRoles}
                  />

                  <Button
                    variant="ghost"
                    onClick={() => handleSaveClick(user.id)}
                  >
                    <CheckIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    appearance="destructive-strong"
                    onClick={() => {
                      setEditingUserId(null);
                      setSelectedRoles([]);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              </Form>
            ) : (
              <div
                key={user.id}
                className="flex w-full flex-row items-center gap-2 border-t pl-2"
              >
                <p className="w-full">{user.name}</p>
                <p className="w-full">{user.email}</p>
                <div className="w-full">
                  {user.roles.map((role) => (
                    <Badge>{role.replaceAll('_', ' ')}</Badge>
                  ))}
                </div>

                <RemovalButton userName={user.name} companyName={companyName} />
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEditingUserId(user.id);
                    setSelectedRoles(user.roles);
                  }}
                >
                  <Pencil1Icon />
                </Button>
              </div>
            )}
          </>
        ))}

        <footer className="flex w-full items-center justify-end gap-2 border-t p-2">
          <Button disabled variant="outline">
            Previous
          </Button>
          {'1'}
          <Button disabled variant="outline">
            Next
          </Button>
        </footer>
      </div>
      <IfElseRender
        condition={addUser}
        ifTrue={<AddUserForm companyID={companyID} setAddUser={setAddUser} />}
        ifFalse={null}
      />
    </div>
  );
}
