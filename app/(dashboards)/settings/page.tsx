'use client';

import CompanyRules from '@/components/(dashboards)/settings/CompanyRules';
import ManageAccount from '@/components/(dashboards)/settings/ManageAccount';
import ManageGmailIntegration from '@/components/(dashboards)/settings/ManageGmailIntegration';
import ManageQuickBooksIntegration from '@/components/(dashboards)/settings/ManageQuickBooksIntegration';
import TeamDashboard from '@/components/(dashboards)/teams/TeamDashboard';
import { BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb';
import IfElseRender from '@/components/ui/if-else-renderer';

import { Roles } from '@/constants/enums';

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
      <IfElseRender
        condition={
          user.roles.includes(Roles['COMPANY_ADMIN']) ||
          user.roles.includes(Roles['PLATFORM_ADMIN'])
        }
        ifTrue={
          <TeamDashboard
            companyID={user.company.id}
            companyName={'Manage Team'}
          />
        }
        ifFalse={null}
      />
      <div className="flex flex-col gap-2">
        <div className="text-xl">Integrations</div>
        <div className="flex max-w-[1000px] flex-row gap-4">
          <ManageGmailIntegration />
          <ManageQuickBooksIntegration />
        </div>
      </div>
      <div className="text-white">.</div>
    </div>
  );
};

export default Account;
