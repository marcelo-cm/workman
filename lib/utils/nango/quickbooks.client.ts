import { toast } from '@/components/ui/use-toast';

import { createClient as createNangoClient } from '@/lib/utils/nango/client';

const nango = createNangoClient();

export const createQuickBooksIntegrationByCompanyID = async (
  companyID: string,
) => {
  try {
    await nango.auth('quickbooks', companyID).then(() => {
      toast({
        title: 'Authorization Successful',
        description: 'You have successfully authorized Google Mail',
      });
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
