import React, { Dispatch, SetStateAction } from 'react';

import { Pencil1Icon } from '@radix-ui/react-icons';

import { UUID } from 'crypto';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { Roles } from '@/constants/enums';
import { User } from '@/models/User';

import RemoveUserButton from './RemoveUserButton';

export default function DefaultUserRow({
  user,
  setEditingUserId,
  setSelectedRoles,
  setUsersData,
}: {
  user: User;
  setEditingUserId: (id: UUID) => void;
  setSelectedRoles: (roles: Roles[]) => void;
  setUsersData: Dispatch<SetStateAction<User[]>>;
}) {
  return (
    <div
      key={user.id}
      className="flex h-14 w-full flex-row items-center gap-2 border-t px-2"
    >
      <p className="w-full">{user.name}</p>
      <p className="w-full">{user.email}</p>
      <div className="flex w-full gap-2">
        {user.roles.map((role) => (
          <Badge>{role.replaceAll('_', ' ')}</Badge>
        ))}
      </div>

      <RemoveUserButton
        userName={user.name}
        userID={user.id}
        setUsersData={setUsersData}
      />
      <Button
        variant="ghost"
        onClick={() => {
          setEditingUserId(user.id);
          setSelectedRoles(user.roles);
        }}
      >
        <Pencil1Icon />
      </Button>
    </div>
  );
}
