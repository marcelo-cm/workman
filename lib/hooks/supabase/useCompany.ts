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
      .select('*')
      .maybeSingle();

    if (error) throw new Error(`Failed to create company, ${error}`);

    return data;
  };

  const fetchAllCompanies = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: true }); //fetchest earliest
    if (error) throw new Error(`Failed to fetch company data ${error}`);

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
    fetchAllCompanies,
    getDefaultApprovers,
  };
};
