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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { getGoogleMailToken, getQuickBooksToken } from '@/lib/actions/actions';
import { createClient as createNangoClient } from '@/lib/utils/nango/client';
import { handleQuickBooksIntegration } from '@/lib/utils/nango/quickbooks';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';
import { User } from '@/models/User';

const supabase = createSupabaseClient();

const signUpSchema = z.object({
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
    fetchUserData().then((user) => {
      if (!user) return;

      setUserData(user);
      form.setValue('email', user.email);
      getNangoIntegrationsById(user.id).then((integrations) => {
        setIsAuthenticated(integrations);
      });
    });
  }, []);

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp(values);

    if (error) {
      setErrorMessage(
        `[${error.status} ${error.name}] Could not sign in. Please try again or contact support.`,
      );
      return;
    }

    router.refresh();
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
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-2 flex w-full items-center gap-4">
                    <FormLabel className="w-[90px]">Email</FormLabel>
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
                    <FormMessage className="text-red-500" />
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
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <div className="flex w-full justify-end">
                <Button
                  type="submit"
                  className="ml-auto"
                  disabled={!!userData || isLoading}
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
