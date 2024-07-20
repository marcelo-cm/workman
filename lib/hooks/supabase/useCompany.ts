import { Company } from '@/models/Company';
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

  const fetchCompanyData = async (
    columns: (keyof Company)[] | ['*'] = ['*'],
  ): Promise<Company> => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .single();

    if (error) {
      throw new Error('Failed to fetch company data');
    }

    return data;
  };

  return {
    createCompany,
    fetchCompanyData,
  };
};
