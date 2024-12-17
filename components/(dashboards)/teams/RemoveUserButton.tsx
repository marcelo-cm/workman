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

export default function RemoveUserButton({
  userName,
  userID,
  onSubmit,
}: {
  userName: string;
  userID: UUID;
  onSubmit: Function;
}) {
  const { deleteUserAuth } = useUser();
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  const handleDeleteUser = async () => {
    try {
      await deleteUserAuth(userID);

      await onSubmit();

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
          Are you sure you want to permanently delete{' '}
          <p className="inline font-medium">{userName}</p> ?
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
            Delete
            <TrashIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
