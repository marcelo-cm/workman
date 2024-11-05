import { UUID } from 'crypto';

import { toast } from '@/components/ui/use-toast';

import { createClient as createNangoClient } from '@/lib/utils/nango/client';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';
import { GmailIntegration } from '@/models/GmailIntegration';

const nango = createNangoClient();
const supabase = createSupabaseClient();

export const createGoogleMailIntegrationByCompanyID = async (
  companyID: UUID,
) => {
  try {
    await nango.auth('google-mail', companyID);

    const response = await supabase
      .from('gmail_integrations')
      .upsert(
        {
          company: companyID,
        },
        {
          onConflict: 'company',
        },
      )
      .select('*')
      .single();

    toast({
      title: 'Authorization Successful',
      description: 'You have successfully authorized Google Mail',
      variant: 'success',
    });
    return new GmailIntegration(response.data);
  } catch (error) {
    console.error(error);
    toast({
      title: 'Authorization Failed',
      description: 'An error occurred while authorizing Google Mail',
      variant: 'destructive',
    });
    return null;
  }
};
