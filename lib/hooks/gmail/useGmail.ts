import { toast } from "@/components/ui/use-toast";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";
import { SetStateAction } from "react";

export const useGmail = () => {
  const supabase = createSupabaseClient();

  const getEmails = async (
    setMailCallback?: React.Dispatch<SetStateAction<any[]>>,
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

  return {
    getEmails,
  };
};
