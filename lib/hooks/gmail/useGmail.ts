import { Email } from "@/app/api/v1/gmail/messages/route";
import { toast } from "@/components/ui/use-toast";
import { Label_Basic } from "@/interfaces/gmail.interfaces";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { SetStateAction } from "react";

export const useGmail = () => {
  const supabase = createSupabaseClient();

  const getEmails = async (
    setMailCallback?: React.Dispatch<SetStateAction<Email[]>>,
  ) => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw new Error("Failed to get user");
      }

      const userId = data?.user?.id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(`/api/v1/gmail/messages?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast({
          title: "Error fetching mail",
          description: response.statusText,
          variant: "destructive",
        });
        throw new Error("Failed to fetch mail");
      }

      const emails = await response.json();
      if (setMailCallback) {
        setMailCallback(emails);
        toast({
          title: "Mail fetched successfully",
        });
      }

      return emails;
    } catch (error) {
      throw new Error(`Failed to get mail, ${error}`);
    }
  };

  const getLabels = async (
    setLabelsCallback?: React.Dispatch<SetStateAction<Label_Basic[]>>,
  ) => {
    try {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        throw new Error("Failed to get user");
      }

      const userId = data?.user?.id;

      if (!userId) {
        throw new Error("User ID not found");
      }

      const response = await fetch(`/api/v1/gmail/labels?userId=${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast({
          title: "Error fetching labels",
          description: response.statusText,
          variant: "destructive",
        });
        throw new Error("Failed to fetch labels");
      }

      const labels = await response.json();

      if (setLabelsCallback) {
        setLabelsCallback(labels);
        toast({
          title: "Labels fetched successfully",
        });
      }

      return labels;
    } catch (error) {
      throw new Error(`Failed to get labels, ${error}`);
    }
  };

  const updateLabels = async (messages: string[], addLabel: string) => {};

  return {
    getEmails,
    getLabels,
  };
};
