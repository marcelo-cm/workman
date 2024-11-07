import { createClient } from '@/lib/utils/supabase/client';
import { Company } from '@/models/Company';
import { User_Nested } from '@/models/User';

const supabase = createClient();

export const useCompany = () => {
  const createCompany = async (company_name: string) => {
    const { data, error } = await supabase
      .from('companies')
      .insert({
        name: company_name,
      })
      .select('*');

    if (error) {
      console.log('there was an error creating the company ', error);
      throw new Error('Failed to create company');
    }

    return data;
  };

  const fetchCompanyData = async () => {
    const { data, error } = await supabase.from('companies').select('*');
    if (error) {
      console.error('Error fetching company data: ', error);
      throw new Error('Failed to fetch company data');
    }

    return data;
  };

  const getDefaultApprovers = async (companyId: string) => {
    const { data: defaultApproversData, error } = await supabase
      .from('company_criterion')
      .select('*, approver: users(id, name, email)')
      .eq('company_id', companyId)
      .eq('type', 'DEFAULT_APPROVER');

    if (error) {
      return [];
    } else {
      const parsedData = defaultApproversData.map(
        (approval) => new User_Nested(approval.approver),
      );
      return parsedData;
    }
  };

  return {
    createCompany,
    fetchCompanyData,
    getDefaultApprovers,
  };
};
