'use client';

import { useEffect, useState } from 'react';

import { EnvelopeClosedIcon } from '@radix-ui/react-icons';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

import { createClient } from '@/lib/utils/supabase/client';

const supabase = createClient();

const formSchema = z.object({
  email: z.string().email(),
  current_password: z.string().min(6),
});

const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      current_password: '',
    },
    criteriaMode: 'all',
  });

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      router.push('/bills');
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.current_password,
    });

    if (error) {
      setErrorMessage(
        `[${error.status} ${error.message}] Please try again or contact support.`,
      );
      setIsLoading(false);
      return;
    }

    router.push('/bills');
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-8 p-4 text-center">
      <WorkmanLogo variant="COMBO" className="w-64 lg:w-96" />
      <h3 className="text-lg ">
        Welcome to the Workman Pilot Program. We're so happy you're here.
      </h3>
      <div className="flex w-full max-w-[500px] flex-col gap-4 rounded-md border p-4">
        <h3 className="text-lg font-medium">Welcome Back!</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-2 flex w-full items-center gap-4">
                    <FormLabel className="w-[90px]">Email</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input placeholder="Email" type="text" {...field} />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage className="my-2  text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-2 flex w-full items-center gap-4">
                    <FormLabel className="w-[90px]">Password</FormLabel>
                    <div className="w-full">
                      <FormControl>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <FormMessage className="my-2 text-right text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex w-full items-center justify-end">
              <Button type="submit" className="ml-auto" disabled={isLoading}>
                Sign In
              </Button>
            </div>
          </form>
          {errorMessage && (
            <FormDescription className="text-red-500">
              {errorMessage}
            </FormDescription>
          )}
        </Form>
      </div>
      <p>
        Don't have an account? Contact us{' '}
        <a href="mailto:ethan@workman.so" className="underline">
          ethan@workman.so
        </a>
        .
      </p>
      <Button asChild>
        <a href="mailto:ethan@workman.so" target="_blank">
          <EnvelopeClosedIcon /> Contact
        </a>
      </Button>
    </div>
  );
};

export default SignIn;
