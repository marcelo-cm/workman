import { useState } from 'react';

import { Pencil1Icon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
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

import { useUser } from '@/lib/hooks/supabase/useUser';

import { useAppContext } from '@/app/(dashboards)/context';
import { User } from '@/models/User';

const accountFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
});

const ManageAccount = ({
  user,
  defaultEdit = false,
}: {
  user: User;
  defaultEdit?: boolean;
}) => {
  const { updateUser } = useUser();
  const { refetchUser } = useAppContext();
  const [edit, setEdit] = useState(defaultEdit);
  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
    },
  });

  const handleUpdateAccount = () => {
    updateUser({
      name: form.getValues('name'),
      email: form.getValues('email'),
    });
    setEdit(false);
    refetchUser(); //@todo this doesn't fetch a user when called
  };

  return (
    <Container
      header={
        <>
          Account
          <IfElseRender
            condition={edit}
            ifTrue={
              <Button
                variant={'ghost'}
                onClick={() => setEdit(false)}
                appearance="destructive-strong"
              >
                Cancel <X className="h-4 w-4" />
              </Button>
            }
            ifFalse={
              <Button variant={'ghost'} onClick={() => setEdit(true)}>
                Edit
                <Pencil1Icon />
              </Button>
            }
          />
        </>
      }
      footer={
        <Button
          variant={'ghost'}
          disabled={!edit || !form.formState.isDirty || !form.formState.isValid}
          onClick={() => handleUpdateAccount()}
        >
          Save
        </Button>
      }
      headerClassName="py-0 pr-0 justify-between"
      innerClassName="p-3"
      className="max-w-[1000px]"
    >
      <Form {...form}>
        <form className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 flex w-full justify-between">
                  <FormLabel>Name</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input
                    disabled={!edit}
                    placeholder="Name"
                    {...field}
                    {...form.register(field.name, {
                      onChange(event) {
                        form.setValue(field.name, event.target.value, {
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
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="mb-1 flex w-full justify-between">
                  <FormLabel>Email</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Input
                    disabled
                    placeholder="Email"
                    {...field}
                    {...form.register(field.name, {
                      onChange(event) {
                        form.setValue(field.name, event.target.value, {
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
          <p className="pl-2 text-xs">Company: {user.company.name}</p>
        </form>
      </Form>
    </Container>
  );
};

export default ManageAccount;
