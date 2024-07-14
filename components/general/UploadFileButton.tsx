import { UploadIcon } from '@radix-ui/react-icons';

import { Button } from '../ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import PDFSplitter from '../PDF/PDFSplitter/PDFSplitter';

const UploadFileButton = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UploadIcon /> Upload Document
        </Button>
      </DialogTrigger>
      <PDFSplitter />
    </Dialog>
  );
};

export default UploadFileButton;
