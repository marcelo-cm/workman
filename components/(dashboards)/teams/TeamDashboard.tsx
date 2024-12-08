'use client';

import React, { useEffect, useState } from 'react';

import { UUID } from 'crypto';

import AddUserForm from '@/components/(dashboards)/teams/AddUserForm';
import { Button } from '@/components/ui/button';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { Roles } from '@/constants/enums';
import { User } from '@/models/User';

import DefaultUserRow from './DefaultUserRow';
import EditUserForm from './EditUserForm';

export default function TeamDashboard({
  companyID,
  companyName,
  isAddUserActive,
  setActiveAddUserCompanyID,
}: {
  companyID: UUID;
  companyName: string;
  isAddUserActive: boolean;
  setActiveAddUserCompanyID: (id: UUID | null) => void;
}) {
  const { getUsersByCompanyId } = useUser();

  const [usersData, setUsersData] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<UUID | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Roles[]>([]);

  useEffect(() => {
    getUsersByCompanyId(companyID).then((data) => {
      setUsersData(data);
    });
  }, []);

  return (
    <div className="relative flex gap-4">
      <div className="flex w-[1000px] flex-col items-center justify-between rounded-md border">
        <div className="flex w-full flex-row items-center p-2">
          <p className="w-full">{companyName}</p>
          <AddUserForm
            companyID={companyID}
            setAddUser={setActiveAddUserCompanyID}
            setUsersData={setUsersData}
            companyName={companyName}
          />
        </div>

        <header className="flex w-[1000px] flex-row border-t bg-[#f5f5f5] p-2">
          <p className="w-full font-medium">Name</p>
          <div className="w-full font-medium">Email</div>
          <div className="w-full font-medium">Roles</div>
          <div className="w-[320px]" />
        </header>

        {usersData.length > 0 ? (
          usersData.map((user) => (
            <>
              {editingUserId === user.id ? (
                <EditUserForm
                  key={user.id}
                  user={user}
                  setEditingUserId={setEditingUserId}
                  setUsersData={setUsersData}
                  selectedRoles={selectedRoles}
                  setSelectedRoles={setSelectedRoles}
                />
              ) : (
                <DefaultUserRow
                  key={user.id}
                  user={user}
                  setEditingUserId={setEditingUserId}
                  setSelectedRoles={setSelectedRoles}
                />
              )}
            </>
          ))
        ) : (
          <div className="flex h-16 items-center" key={1}>
            <p className="text-wm-white-300">Add members to this team</p>
          </div>
        )}

        <footer className="flex w-full items-center justify-end gap-2 border-t p-2">
          <Button disabled variant="outline">
            Previous
          </Button>
          {'1'}
          <Button disabled variant="outline">
            Next
          </Button>
        </footer>
      </div>
    </div>
  );
}
