'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import QuickBooks from '@/components/molecules/QuickBooks';
import WorkmanLogo from '@/components/molecules/WorkmanLogo';
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

import { useUser } from '@/lib/hooks/supabase/useUser';

import { handleQuickBooksIntegration } from '@/lib/utils/nango/quickbooks';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';
import { User } from '@/models/User';

const supabase = createSupabaseClient();

const signUpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

const Onboarding = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<User>();
  const [isAuthenticated, setIsAuthenticated] = useState<
    Record<string, unknown>
  >({
    gmail: null,
    quickbooks: null,
  });
  const { fetchUserData, getNangoIntegrationsById } = useUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    checkIfUserExists();
  }, []);

  const checkIfUserExists = async () => {
    const { data: user } = await supabase.auth.getUser();

    if (user.user) {
      fetchUserData().then((user) => {
        setUserData(user);
        form.setValue('email', user.email);
        form.setValue('name', user.name);
        getNangoIntegrationsById(user.id).then((integrations) => {
          setIsAuthenticated(integrations);
        });
      });
    }
  };

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: { data: { name: values.name } },
    });
    const { user } = data;
    const createData = { id: user?.id, name: values.name, email: user?.email };
    const { data: createRes, error: createError } = await supabase
      .from('users')
      .insert(createData)
      .select('*')
      .maybeSingle();

    if (error) {
      setErrorMessage(
        `[${error.status} ${error.name}] Could not sign up. Please try again or contact support.`,
      );
      setIsLoading(false);
      return;
    }

    if (createError) {
      setErrorMessage(
        `[${createError.code} ${createError.message}] Could not create user. Please try again or contact support.`,
      );
      setIsLoading(false);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="w-dvh flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-12">
      <WorkmanLogo variant="COMBO" className="w-96" />
      <h3 className="text-lg ">
        Welcome to the Workman Pilot Program. We're so happy you're here.
      </h3>
      <div className="flex w-full max-w-[500px] flex-col gap-4">
        <div className="flex flex-col gap-4 rounded-md border p-4 ">
          <h3 className="text-lg font-medium">Create Account</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-2 flex w-full items-center gap-4">
                    <FormLabel className="w-[90px]">Name</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          disabled={!!userData || isLoading}
                          placeholder="Workman"
                          type="text"
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
                      <FormMessage className="pt-1 text-red-500" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-2 flex w-full items-center gap-4">
                    <FormLabel className="w-[90px]">Email</FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          disabled={!!userData || isLoading}
                          placeholder="Email"
                          type="text"
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
                      <FormMessage className="pt-1 text-red-500" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-4 flex w-full items-center gap-4">
                    <FormLabel className="w-[90px]">
                      Password (6+ chars.)
                    </FormLabel>
                    <div className="flex w-full flex-col">
                      <FormControl>
                        <Input
                          disabled={!!userData || isLoading}
                          placeholder="Password"
                          type="password"
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
                      <FormMessage className="pt-1 text-red-500" />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-end">
                {errorMessage && (
                  <p className="text-xs text-red-500">{errorMessage}</p>
                )}
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={!!userData || isLoading || !form.formState.isValid}
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="flex flex-col gap-2 rounded-md border p-4">
          <h3 className="text-lg font-medium">Connect your QuickBooks</h3>
          <p className="text-sm">
            Workman directly creates bills in your QuickBooks in just one click.
          </p>
          <Button
            className="w-fit self-end"
            variant={'secondary'}
            disabled={!userData || !!isAuthenticated.quickbooks || isLoading}
            onClick={handleQuickBooksIntegration}
          >
            <QuickBooks />
            Authenticate QuickBooks
          </Button>
        </div>
      </div>
      <Button
        disabled={!isAuthenticated.quickbooks || isLoading}
        onClick={() => router.push('/demo')}
      >
        Launch Workman
      </Button>
    </div>
  );
};

export default Onboarding;

// const upsertWorkmanLabels = async () => {
//   const labels = await getLabels();

//   const workmanLabelExists = labels.find(
//     (label: Label_Basic) => label.name === 'WORKMAN SCANNED',
//   );

//   const ignoreLabelExists = labels.find(
//     (label: Label_Basic) => label.name === 'WORKMAN IGNORE',
//   );

//   if (!workmanLabelExists) {
//     const WORKMAN_SCANNED_LABEL: Omit<Label_Basic, 'id'> = {
//       name: 'WORKMAN SCANNED',
//       messageListVisibility: 'show',
//       labelListVisibility: 'labelShow',
//       type: 'user',
//     };
//     const newLabel = await createLabel(WORKMAN_SCANNED_LABEL);

//     if (newLabel) {
//       const valuesToUpdate = {
//         scanned_label_id: newLabel.id,
//       };

//       await updateUser(valuesToUpdate);
//     }
//   }

//   if (!ignoreLabelExists) {
//     const WORKMAN_IGNORE_LABEL: Omit<Label_Basic, 'id'> = {
//       name: 'WORKMAN IGNORE',
//       messageListVisibility: 'show',
//       labelListVisibility: 'labelShow',
//       type: 'user',
//     };
//     const newLabel = await createLabel(WORKMAN_IGNORE_LABEL);

//     if (newLabel) {
//       const valuesToUpdate = {
//         ignore_label_id: newLabel.id,
//       };

//       await updateUser(valuesToUpdate);
//     }
//   }
// };
