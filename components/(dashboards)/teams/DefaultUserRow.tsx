import React, { Dispatch, SetStateAction } from 'react';

import { Pencil1Icon } from '@radix-ui/react-icons';

import { UUID } from 'crypto';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { prettifyRole } from '@/lib/utils';
import { User } from '@/models/User';

import RemoveUserButton from './RemoveUserButton';

export default function DefaultUserRow({
  user,
  onClick,
  onSubmit,
}: {
  user: User;
  onClick: (id: UUID) => void;
  onSubmit: Function;
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
          <Badge>{prettifyRole(role)}</Badge>
        ))}
      </div>

      <RemoveUserButton
        userName={user.name}
        userID={user.id}
        onSubmit={onSubmit}
      />
      <Button
        variant="ghost"
        onClick={() => {
          onClick(user.id);
        }}
      >
        <Pencil1Icon />
      </Button>
    </div>
  );
}
