"use client";

import WorkmanLogo from "@/components/molecules/WorkmanLogo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
      email: "",
      current_password: "",
    },
    criteriaMode: "all",
  });

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      router.push("/for-approval");
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

    router.push("/for-approval");
  }

  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-8 p-4 text-center">
      <WorkmanLogo variant="COMBO" className="w-64 lg:w-96" />
      <h3 className="text-lg ">
        Welcome to the Workman Pilot Program. We're so happy you're here.
      </h3>
      <div className="flex w-full max-w-[500px] flex-col gap-4 rounded-md border p-4">
        <h3 className="text-lg font-medium">Create Account</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-2 flex w-full items-center gap-4">
                  <FormLabel className="w-[90px]">Email</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <Input placeholder="Email" type="text" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem className="mb-4 flex w-full items-center gap-4">
                  <FormLabel className="w-[90px]">Password</FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex w-full justify-end">
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
      <Button asChild>
        <a href="mailto:ethan@workman.so" target="_blank">
          <EnvelopeClosedIcon /> Contact
        </a>
      </Button>
    </div>
  );
};

export default SignIn;
