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

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ComboBox } from '@/components/ui/combo-box';
import {
  Dialog,
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
import { MultiComboBox } from '@/components/ui/multi-combo-box';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  roles: z.array(z.string()).nonempty('At least one role is required'),
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
  const [selectedRoles, setSelectedRoles] = useState<string[] | null>(null);
  const [addUser, setAddUser] = useState<boolean>(false);
  const formEditUser = useForm<z.infer<typeof editAccountFormSchema>>();
  const formAddUser = useForm<z.infer<typeof createAccountFormSchema>>();

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
              roles: selectedRoles ? selectedRoles : user.roles,
              created_at: user.createdAt.toISOString(),
            })
          : user,
      ),
    );
    formEditUser.reset();
    setSelectedRoles(null);
    setEditingUserId(null);
  };

  const handleSelect = (selectedRole: { id: string }) => {
    setSelectedRoles((prevRoles) => {
      if (prevRoles && prevRoles.includes(selectedRole.id)) {
        // Remove role ID if it already exists
        const updatedRoles = prevRoles.filter((id) => id !== selectedRole.id);
        return updatedRoles.length > 0 ? updatedRoles : null; // Set to null if empty
      } else {
        // Add role ID if it's not already selected
        return prevRoles ? [...prevRoles, selectedRole.id] : [selectedRole.id];
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

                  {/* <Select onValueChange={(value) => setSelectedRole([value])}>
                    <SelectTrigger>
                      <SelectValue placeholder={user.roles} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {rolesList.map((role) => (
                          <SelectItem value={role}>{role}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
                  <MultiComboBox
                    className="w-full"
                    valuesToMatch={user.roles.map((role) => ({ id: role }))}
                    options={[
                      { id: 'PLATFORM_ADMIN' },
                      { id: 'COMPANY_ADMIN' },
                      { id: 'BOOKKEEPER' },
                    ]}
                    getOptionLabel={(option) => option?.id}
                    callBackFunction={handleSelect}
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
                    onClick={() => setEditingUserId(null)}
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

                <Dialog>
                  <DialogTrigger>
                    <Button variant="ghost">
                      <TrashIcon />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Requesting Confirmation</DialogTitle>
                    </DialogHeader>
                    <p>
                      Are you sure you want to remove{' '}
                      <p className="inline font-medium">{user.name}</p> from{' '}
                      <p className="inline font-medium">{companyName}</p>
                    </p>
                    <DialogFooter>
                      <Button variant={'outline'} appearance={'destructive'}>
                        Remove
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  onClick={() => setEditingUserId(user.id)}
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
      {addUser ? (
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
              name="roles"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <p className="text-base">Roles</p>
                  <FormControl>
                    <MultiComboBox
                      className="w-full"
                      options={[
                        { id: 'PLATFORM_ADMIN' },
                        { id: 'COMPANY_ADMIN' },
                        { id: 'BOOKKEEPER' },
                      ]}
                      getOptionLabel={(option) => option?.id}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button variant={'ghost'}>
                <CheckIcon />
              </Button>
              <Button
                variant={'ghost'}
                appearance={'destructive-strong'}
                onClick={() => setAddUser(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </Form>
      ) : null}
    </div>
  );
}
