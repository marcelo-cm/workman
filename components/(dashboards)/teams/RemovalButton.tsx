import React from 'react';

import { TrashIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function RemovalButton({
  userName,
  companyName,
}: {
  userName: string;
  companyName: string;
}) {
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
          <p className="inline font-medium">{userName}</p> from{' '}
          <p className="inline font-medium">{companyName}</p>
        </p>
        <DialogFooter>
          <Button variant={'outline'} appearance={'destructive'}>
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
