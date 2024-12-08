import React from 'react';

import { Pencil1Icon } from '@radix-ui/react-icons';

import { UUID } from 'crypto';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { User } from '@/models/User';

import RemoveUserButton from './RemoveUserButton';

export default function DefaultUserRow({
  user,
  setEditingUserId,
  setSelectedRoles,
}: {
  user: User;
  setEditingUserId: (id: UUID) => void;
  setSelectedRoles: (roles: string[]) => void;
}) {
  return (
    <div
      key={user.id}
      className="flex h-14 w-full flex-row items-center gap-2 border-t px-2"
    >
      <p className="w-full">{user.name}</p>
      <p className="w-full">{user.email}</p>
      <div className="w-full">
        {user.roles.map((role) => (
          <Badge>{role.replaceAll('_', ' ')}</Badge>
        ))}
      </div>

      <RemoveUserButton userName={user.name} userID={user.id} />
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
