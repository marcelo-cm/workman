'use client';

import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import { CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'crypto';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import Chip from '@/components/ui/chip';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogPortal,
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

import { useUser } from '@/lib/hooks/supabase/useUser';

import { CREATE_USER_SCHEMA } from '@/constants/constants';
import { Roles } from '@/constants/enums';
import { prettifyRole } from '@/lib/utils';
import { User } from '@/models/User';

export default function AddUserForm({
  companyID,
  companyName,
  setUsersData,
}: {
  companyID: UUID;
  companyName: string;
  setUsersData: Dispatch<SetStateAction<User[]>>;
}) {
  const { createUser } = useUser();
  const formAddUser = useForm<z.infer<typeof CREATE_USER_SCHEMA>>({
    resolver: zodResolver(CREATE_USER_SCHEMA),
  });
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const { watch, setValue, setError, clearErrors } = formAddUser;
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

  //This code is necessary because the MultiComboBox component does not have a built-in way to handle the selected values
  const handleSelectedNewUserRoles = (selectedRole: { id: string }) => {
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

  const handleCreateUser = async () => {
    try {
      const createdUser: User = await createUser(
        companyID,
        formAddUser.getValues('name'),
        formAddUser.getValues('password'),
        formAddUser.getValues('email'),
        formAddUser.getValues('roles'),
      );

      setUsersData((prevUsers) => [createdUser, ...prevUsers]);

      dialogCloseRef.current?.click();
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  };

  const handleFormReset = () => {
    formAddUser.reset({
      name: '',
      email: '',
      password: '',
      roles: undefined,
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" onClick={handleFormReset}>
          <a className="text-nowrap">Add Member</a>
          <PlusIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new member to {companyName}</DialogTitle>
        </DialogHeader>
        <Form {...formAddUser}>
          <form
            className="flex w-full flex-col gap-3"
            onSubmit={formAddUser.handleSubmit(handleCreateUser)}
          >
            <FormField
              control={formAddUser.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="mb-1 flex w-full justify-between">
                    <FormLabel>Name</FormLabel> <FormMessage />
                  </div>
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
                <FormItem className="flex flex-col">
                  <div className="mb-1 flex w-full justify-between">
                    <FormLabel>Email</FormLabel> <FormMessage />
                  </div>
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
                <FormItem className="flex flex-col">
                  <div className="mb-1 flex w-full justify-between">
                    <FormLabel>Roles</FormLabel> <FormMessage />
                  </div>
                  <MultiComboBox
                    className="w-full"
                    options={Object.values(Roles).map((role) => ({
                      id: role,
                    }))}
                    getOptionLabel={(option) => prettifyRole(option?.id)}
                    callBackFunction={handleSelectedNewUserRoles}
                    renderValues={(value) => (
                      <Chip>
                        {prettifyRole(Roles[value.id])}{' '}
                        <X className="h-3 w-3 group-hover:text-red-500" />
                      </Chip>
                    )}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={formAddUser.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <div className="mb-1 flex w-full justify-between">
                    <FormLabel>Password</FormLabel> <FormMessage />
                  </div>
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
            <DialogFooter>
              <DialogClose ref={dialogCloseRef}>
                <Button
                  variant={'outline'}
                  onClick={() => {
                    formAddUser.reset({
                      name: '',
                      email: '',
                      password: '',
                      roles: undefined,
                    });
                  }}
                >
                  Cancel
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>

              <Button
                type="submit"
                variant={'secondary'}
                disabled={
                  !formAddUser.formState.isDirty ||
                  !formAddUser.formState.isValid
                }
              >
                Add User
                <CheckIcon />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
