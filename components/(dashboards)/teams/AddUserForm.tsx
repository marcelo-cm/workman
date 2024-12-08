'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';

import { CheckIcon, PlusIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { UUID } from 'crypto';
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
import { MultiComboBox } from '@/components/ui/multi-combo-box';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { Roles } from '@/constants/enums';
import { User } from '@/models/User';

const { createUser } = useUser();

const createAccountFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  // roles: z.array(z.string()).nonempty('At least one role is required'),
  password: z.string().min(1),
});

export default function AddUserForm({
  companyID,
  companyName,
  setAddUser,
  setUsersData,
}: {
  companyID: UUID;
  companyName: string;
  setAddUser: (id: UUID | null) => void;
  setUsersData: Dispatch<SetStateAction<User[]>>;
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

  const handleCreateUser = async () => {
    try {
      const createdUser: User = await createUser(
        companyID,
        formAddUser.getValues('name'),
        formAddUser.getValues('password'),
        formAddUser.getValues('email'),
        selectedNewUserRoles,
      );

      setUsersData((prevUsers) => [createdUser, ...prevUsers]);
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline">
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
            className="flex w-full flex-col gap-2"
            onSubmit={formAddUser.handleSubmit(handleCreateUser)}
          >
            <FormField
              control={formAddUser.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
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
                <FormItem className="flex flex-col gap-2">
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

            <div className=" flex flex-col gap-2">
              <p className="text-base">Roles</p>

              <MultiComboBox
                className="w-full"
                options={Object.values(Roles).map((role) => ({ id: role }))}
                getOptionLabel={(option) => option?.id.replaceAll('_', ' ')}
                callBackFunction={handleSelectedNewUserRoles}
              />
            </div>

            <FormField
              control={formAddUser.control}
              name="password"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2">
                  <p className=" text-base">Password</p>
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
              <DialogClose>
                <Button
                  variant={'outline'}
                  appearance={'destructive'}
                  onClick={() => {
                    setAddUser(null);
                    // setSelectedNewUserRoles([]);
                    formAddUser.reset({
                      name: '',
                      email: '',
                      password: '',
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
