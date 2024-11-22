import React from 'react';

import { TrashIcon } from '@radix-ui/react-icons';

import { UUID } from 'crypto';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useUser } from '@/lib/hooks/supabase/useUser';

export default function RemovalUserButton({
  userName,
  userID,
  companyName,
  companyID,
  setUsersData,
}: {
  userName: string;
  userID: UUID;
  companyName: string;
  companyID: UUID;
  setUsersData: (data: any) => void;
}) {
  const { deleteUserAuth } = useUser();

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost">
          <TrashIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Requesting Confirmation</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to remove{' '}
          <p className="inline font-medium">{userName}</p> from memory
        </p>
        <DialogFooter>
          <Button
            variant={'outline'}
            appearance={'destructive-strong'}
            onClick={() => deleteUserAuth(userID)}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
