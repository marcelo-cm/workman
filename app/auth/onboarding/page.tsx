"use client";

import Gmail from "@/components/molecules/Gmail";
import QuickBooks from "@/components/molecules/QuickBooks";
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
import { Label_Basic } from "@/interfaces/gmail.interfaces";
import { getGoogleMailToken, getQuickBooksToken } from "@/lib/actions/actions";
import { useGmail } from "@/lib/hooks/gmail/useGmail";
import { useUser } from "@/lib/hooks/supabase/useUser";
import { createClient as createNangoClient } from "@/utils/nango/client";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const supabase = createSupabaseClient();
const nango = createNangoClient();

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const Onboarding = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState({
    gmail: false,
    quickbooks: false,
  });
  const { getLabels, createLabel } = useGmail();
  const { updateUser } = useUser();
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    getUser().then((user) => {
      if (user) {
        setIsLoggedIn(true);
      }
    });

    getNangoIntegrations().then((integrations) => {
      setIsAuthenticated(integrations);
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

    await upsertWorkmanLabels();

    router.refresh();
  }

  const upsertWorkmanLabels = async () => {
    const labels = await getLabels();

    const workmanLabelExists = labels.find(
      (label: Label_Basic) => label.name === "WORKMAN SCANNED",
    );

    const ignoreLabelExists = labels.find(
      (label: Label_Basic) => label.name === "WORKMAN IGNORE",
    );
    // @todo search for the ignore label, create it if not there, and update the user configs with the new label if successful

    if (!workmanLabelExists) {
      const WORKMAN_SCANNED_LABEL: Omit<Label_Basic, "id"> = {
        name: "WORKMAN SCANNED",
        messageListVisibility: "show",
        labelListVisibility: "labelShow",
        type: "user",
      };
      const newLabel = await createLabel(WORKMAN_SCANNED_LABEL);

      if (newLabel) {
        const valuesToUpdate = {
          scanned_label_id: newLabel.id,
        };

        await updateUser(valuesToUpdate);
      }
    }

    if (!ignoreLabelExists) {
      const WORKMAN_IGNORE_LABEL: Omit<Label_Basic, "id"> = {
        name: "WORKMAN IGNORE",
        messageListVisibility: "show",
        labelListVisibility: "labelShow",
        type: "user",
      };
      const newLabel = await createLabel(WORKMAN_IGNORE_LABEL);

      if (newLabel) {
        const valuesToUpdate = {
          ignore_label_id: newLabel.id,
        };

        await updateUser(valuesToUpdate);
      }
    }
  };

  async function getUser() {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      return null;
    }
    return user;
  }

  async function getNangoIntegrations() {
    const gmailToken = await getGoogleMailToken();
    const quickbooksToken = await getQuickBooksToken();
    return {
      gmail: Boolean(gmailToken),
      quickbooks: Boolean(quickbooksToken),
    };
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
                      <Input placeholder="Email" type="text" {...field} />
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
                    <FormLabel className="w-[90px]">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type="password"
                        {...field}
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
                  disabled={isLoggedIn || isLoading}
                >
                  Sign Up
                </Button>
                {errorMessage && (
                  <FormDescription className="text-red-500">
                    {errorMessage}
                  </FormDescription>
                )}
              </div>
            </form>
          </Form>
        </div>
        <div className="flex flex-col gap-2 rounded-md border p-4">
          <h3 className="text-lg font-medium">Connect your Gmail</h3>
          <p className="text-sm">
            We integrate with Gmail so you process invoices straight from your
            inbox to Quickbooks in minutes
          </p>
          <Button
            className="w-fit self-end"
            variant={"secondary"}
            disabled={!isLoggedIn || isAuthenticated.gmail || isLoading}
          >
            <Gmail />
            Authenticate Gmail
          </Button>
        </div>
        <div className="flex flex-col gap-2 rounded-md border p-4">
          <h3 className="text-lg font-medium">Connect your QuickBooks</h3>
          <p className="text-sm">
            The Workman directly creates bills in your QuickBooks in just one
            click.
          </p>
          <Button
            className="w-fit self-end"
            variant={"secondary"}
            disabled={!isLoggedIn || isAuthenticated.quickbooks || isLoading}
          >
            <QuickBooks />
            Authenticate QuickBooks
          </Button>
        </div>
      </div>
      <Button
        disabled={
          !isAuthenticated.gmail || !isAuthenticated.quickbooks || isLoading
        }
        onClick={() => router.push("/demo")}
      >
        Launch Workman
      </Button>
    </div>
  );
};

export default Onboarding;
