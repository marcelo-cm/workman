import { UUID } from 'crypto';

import { toast } from '@/components/ui/use-toast';

import { createClient as createNangoClient } from '@/lib/utils/nango/client';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';

const nango = createNangoClient();
const supabase = createSupabaseClient();

export const createGoogleMailIntegrationByCompanyID = async (
  companyID: UUID,
) => {
  try {
    await nango.auth('google-mail', companyID).then(async () => {
      await supabase.from('gmail_integrations').upsert({
        company: companyID,
      });
    });

    toast({
      title: 'Authorization Successful',
      description: 'You have successfully authorized Google Mail',
      variant: 'success',
    });
  } catch (error) {
    console.error(error);
    toast({
      title: 'Authorization Failed',
      description: 'An error occurred while authorizing Google Mail',
      variant: 'destructive',
    });
  }
};
