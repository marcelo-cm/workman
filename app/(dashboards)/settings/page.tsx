'use client';

import CompanyRules from '@/components/(dashboards)/settings/CompanyRules';
import ManageAccount from '@/components/(dashboards)/settings/ManageAccount';
import ManageGmailIntegration from '@/components/(dashboards)/settings/ManageGmailIntegration';
import ManageQuickBooksIntegration from '@/components/(dashboards)/settings/ManageQuickBooksIntegration';
import { BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';

import { useAppContext } from '../context';

const Account = () => {
  const { user } = useAppContext();

  return (
    <div className="flex h-full w-full flex-col gap-4 px-4 py-8">
      <BreadcrumbList className="text-wm-white-400">
        <BreadcrumbLink className="text-black" href="/settings">
          Settings
        </BreadcrumbLink>
      </BreadcrumbList>
      <div className="flex w-full flex-row justify-between font-poppins text-4xl">
        Manage your account and company
      </div>
      <ManageAccount user={user} />
      <CompanyRules company={user.company} />
      <div className="flex flex-col gap-2">
        <div className="text-xl">Integrations</div>
        <div className="flex max-w-[1000px] flex-row gap-4">
          <ManageGmailIntegration />
          <ManageQuickBooksIntegration />
        </div>
      </div>
    </div>
  );
};

export default Account;
