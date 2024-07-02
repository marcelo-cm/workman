import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UploadIcon } from '@radix-ui/react-icons';
import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import PDFSplitter from '../PDF/PDFSplitter/PDFSplitter';

const UploadFileButton = () => {
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isDragActive, setDragActive] = useState(false);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const addToUploadQueue = (event: any) => {
    const filesList = event.target.files;
    if (!filesList) {
      return;
    }

    const files = Array.from(filesList) as File[];

    setFilesToUpload((prevFiles) => [...prevFiles, ...files]);
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    const files = Array.from(event.dataTransfer.files) as File[];

    setFilesToUpload((prevFiles) => [...prevFiles, ...files]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UploadIcon /> Upload Document
        </Button>
      </DialogTrigger>
      {filesToUpload.length ? (
        <PDFSplitter
          filesToUpload={filesToUpload}
          setFilesToUpload={setFilesToUpload}
        />
      ) : (
        <DialogContent className="flex h-[90%] max-w-[90%] flex-col overflow-hidden p-0">
          <div className="flex h-full flex-col gap-4  p-4">
            <DialogTitle>Upload Documents</DialogTitle>
            <button
              className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-wm-white-500 bg-wm-white-50 text-wm-white-700 hover:border-wm-orange-500 hover:bg-wm-orange-50 hover:text-wm-orange-700"
              onClick={handleButtonClick}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              Drag Files or Click to Upload
            </button>
          </div>
        </DialogContent>
      )}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="application/pdf"
        onChange={addToUploadQueue}
        style={{ display: 'none' }}
      />
    </Dialog>
  );
};

export default UploadFileButton;
