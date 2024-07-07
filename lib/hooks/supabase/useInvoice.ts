import { UserResponse } from '@supabase/supabase-js';

import Invoice from '@/classes/Invoice';
import { createClient } from '@/utils/supabase/client';

import { useUser } from './useUser';

const supabase = createClient();
const { fetchUser } = useUser();

export const useInvoice = () => {
  async function getInvoices(callBack?: (invoices: Invoice[]) => void) {
    const user = await fetchUser();
    const id = user.data.user?.id;

    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('status', 'FOR_REVIEW')
      .eq('owner', `${id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invoices:', error);
    } else {
      callBack && callBack(data as Invoice[]);
      return data as Invoice[];
    }
  }

  return { getInvoices };
};
