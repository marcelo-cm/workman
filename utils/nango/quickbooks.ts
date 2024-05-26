import { toast } from "@/components/ui/use-toast";
import { createClient as createNangoClient } from "@/utils/nango/client";
import { createClient as createSupabaseClient } from "@/utils/supabase/client";

const nango = createNangoClient();
const supabase = createSupabaseClient();

export const handleQuickBooksIntegration = async () => {
  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id;

  if (!userId) {
    console.error("User not found");
    return;
  }

  nango
    .auth("quickbooks", userId)
    .then((result: { providerConfigKey: string; connectionId: string }) => {
      toast({
        title: "Authorization Successful",
        description: "You have successfully authorized QuickBooks",
      });
    })
    .catch((err: { message: string; type: string }) => {
      toast({
        title: "Authorization Failed",
        description: err.message,
        variant: "destructive",
      });
    });
};