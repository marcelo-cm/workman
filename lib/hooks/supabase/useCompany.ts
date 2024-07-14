import { Company } from '@/classes/Company';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const useCompany = () => {
  const createCompany = async (company_name: string): Promise<Company> => {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        company_name: company_name,
      })
      .select('*')
      .single();

    if (error) {
      throw new Error('Failed to create company');
    }

    return data;
  };

  return {
    createCompany,
  };
};
