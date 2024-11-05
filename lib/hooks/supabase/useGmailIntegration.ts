import { useAppContext } from '@/app/(dashboards)/context';
import { Label } from '@/interfaces/gmail.interfaces';
import { createClient } from '@/lib/utils/supabase/client';
import { GmailIntegration } from '@/models/GmailIntegration';

export const useGmailIntegration = () => {
  const { user } = useAppContext();
  const supabase = createClient();

  const getGmailIntegrationByCompanyID = async (id: string) => {
    const { data, error } = await supabase
      .from('gmail_integrations')
      .select('*')
      .eq('company', id)
      .maybeSingle();

    if (error || !data) {
      throw new Error('Failed to get gmail integration');
    }

    return new GmailIntegration(data);
  };

  const getIgnoredLabelByCompanyID = async (id: string): Promise<Label> => {
    const { data, error } = await supabase
      .from('gmail_integrations')
      .select('ignored_label')
      .eq('company', id)
      .maybeSingle();

    if (error || !data) {
      throw new Error('Failed to get ignored label');
    }

    return data.ignored_label;
  };

  const getProcessedLabelByCompanyID = async (id: string): Promise<Label> => {
    const { data, error } = await supabase
      .from('gmail_integrations')
      .select('processed_label')
      .eq('company', id)
      .maybeSingle();

    if (error || !data) {
      throw new Error('Failed to get processed label');
    }

    return data.processed_label;
  };

  return {
    getGmailIntegrationByCompanyID,
    getIgnoredLabelByCompanyID,
    getProcessedLabelByCompanyID,
  };
};
