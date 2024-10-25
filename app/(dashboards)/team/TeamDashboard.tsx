'use client';

import React, { useEffect, useState } from 'react';

import { Pencil1Icon, PlusIcon } from '@radix-ui/react-icons';

import { UUID } from 'crypto';

import { Button } from '@/components/ui/button';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { User } from '@/models/User';

export default function TeamDashboard({
  companyID,
  companyName,
}: {
  companyID: UUID;
  companyName: string;
}) {
  const { getUsersByCompanyId } = useUser();
  const [usersData, setUsersData] = useState<User[]>();
  useEffect(() => {
    getUsersByCompanyId(companyID).then((data) => setUsersData(data));
  }, []);
  return (
    <div className="flex w-[900px] flex-col items-center justify-between rounded-md border">
      <header className="flex w-full flex-row items-center p-2">
        <p className="w-full">{companyName}</p>
        <Button variant={'secondary'}>
          <a className="w-20">Add Person</a>
          <PlusIcon />
        </Button>
      </header>
      <header className="flex w-full flex-row border-t bg-[#f5f5f5] p-2">
        <p className="w-full font-medium">Name</p>
        <div className="w-full font-medium">Email</div>
        <div className="w-full font-medium">Role</div>
        <div className="w-32" />
      </header>
      {usersData?.map((user) => (
        <div className="flex w-full flex-row items-center border-t pl-2">
          <p className="w-full">{user.name}</p>
          <div className="w-full">{user.email}</div>
          <div className="w-full">{user.roles}</div>
          <Button variant={'ghost'}>
            <Pencil1Icon />
          </Button>
        </div>
      ))}

      <footer className="flex w-full items-center justify-end gap-2 border-t p-2">
        <Button variant={'outline'}>Previous</Button>
        {'1'}
        <Button variant={'outline'}>Next</Button>
      </footer>
    </div>
  );
}
