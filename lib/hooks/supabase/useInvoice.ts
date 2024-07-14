import { InvoiceState } from '@/constants/enums';
import Invoice from '@/models/Invoice';
import { createClient } from '@/utils/supabase/client';

import { useUser } from './useUser';

const supabase = createClient();
const { fetchUser } = useUser();

export const useInvoice = () => {
  async function getInvoicesByState(
    state: InvoiceState,
    callBack?: (invoices: Invoice[]) => void,
  ) {
    const user = await fetchUser();
    const id = user.data.user?.id;

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('status', state)
      .eq('owner', `${id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
      return [];
    } else {
      callBack && callBack(data as Invoice[]);
      return data as Invoice[];
    }
  }

  return { getInvoicesByState };
};
