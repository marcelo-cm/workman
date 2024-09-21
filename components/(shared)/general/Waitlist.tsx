'use client';

import React, { useState } from 'react';

import { LoaderIcon } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { LogSnagProvider, useLogSnag } from '@logsnag/next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import Container from '@/components/ui/container';
import { Form, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const waitlistSchema = z.object({
  email: z.string().email().min(1),
});
const Waitlist = () => {
  const { track } = useLogSnag();
  const form = useForm<z.infer<typeof waitlistSchema>>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: '',
    },
    reValidateMode: 'onChange',
  });

  const [isSubmitted, setSubmitted] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const email = formData.get('email') as string;

    const tags: {
      [key: string]: string;
    } = {
      email: email,
    };

    // Track an event
    track({
      channel: 'waitlist',
      event: 'New Inbound',
      icon: '⚒️',
      notify: true,
      tags: tags,
    });

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <LogSnagProvider
      token={process.env.NEXT_PUBLIC_LOGSNAG_API_KEY!}
      project="workman"
    >
      <Container className="w-full p-4 text-left shadow-sm focus-within:animate-none hover:animate-none motion-safe:animate-bounce md:w-1/2 md:min-w-[500px]">
        <p className="mb-2 text-center font-medium">
          Get started, we'll email you with next steps!
        </p>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex">
                    <Input
                      type="email"
                      placeholder="Email"
                      className="rounded-r-none"
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
                    <Button
                      className="h-9 rounded-l-none"
                      type="submit"
                      disabled={
                        isLoading || isSubmitted || !form.formState.isValid
                      }
                    >
                      {isSubmitted ? 'Submitted' : 'Submit!'}
                      {isLoading && <LoaderIcon className="animate-spin" />}
                    </Button>
                  </div>
                  <FormMessage className="mt-1" />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Container>
    </LogSnagProvider>
  );
};

export default Waitlist;
