import React, { Dispatch, SetStateAction, useRef } from 'react';

import { TrashIcon } from '@radix-ui/react-icons';
import { X } from 'lucide-react';

import { UUID } from 'crypto';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useUser } from '@/lib/hooks/supabase/useUser';

import { User } from '@/models/User';

export default function RemoveUserButton({
  userName,
  userID,
  setUsersData,
}: {
  userName: string;
  userID: UUID;
  setUsersData: Dispatch<SetStateAction<User[]>>;
}) {
  const { deleteUserAuth } = useUser();
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const handleDeleteUser = async () => {
    try {
      await deleteUserAuth(userID);
      setUsersData((prevUsers) =>
        prevUsers.filter((user) => user.id !== userID),
      );
      dialogCloseRef.current?.click();
    } catch (error) {
      throw new Error(`Error deleting user ${error}`);
    }
  };

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
          <p className="inline font-medium">{userName}</p> from memory?
        </p>
        <DialogFooter>
          <DialogClose ref={dialogCloseRef}>
            <Button variant={'outline'}>
              Cancel
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
          <Button
            variant={'secondary'}
            appearance={'destructive'}
            onClick={handleDeleteUser}
          >
            Remove User
            <TrashIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
