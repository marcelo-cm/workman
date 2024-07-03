import { useEffect, useRef, useState } from 'react';
import React from 'react';

import {
  CaretRightIcon,
  EyeOpenIcon,
  PlusIcon,
  ScissorsIcon,
  TrashIcon,
} from '@radix-ui/react-icons';

import { Button } from '../../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import PDFViewer from '../PDFViewer';
import { usePDFSplitter } from './PDFSplitter';

const PDFSplitterFileSelection = () => {
  const {
    filesToUpload,
    setFilesToUpload,
    filesToSplit,
    setFilesToSplit,
    setStage,
    handleUpload,
  } = usePDFSplitter();
  const PDFViewerParentRef = useRef<null | HTMLDivElement>(null);
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const [PDFViewerWidth, setPDFViewerWidth] = useState<number>(500);
  const [activeFile, setActiveFile] = useState<File>(filesToUpload[0]);

  useEffect(() => {
    updatePDFViewerWidth();
    window.addEventListener('resize', updatePDFViewerWidth);
    return () => {
      window.removeEventListener('resize', updatePDFViewerWidth);
    };
  }, []);

  function updatePDFViewerWidth() {
    if (PDFViewerParentRef.current) {
      const parentWidth = PDFViewerParentRef.current.offsetWidth;
      const remInPixels = parseFloat(
        getComputedStyle(document.documentElement).fontSize,
      );
      setPDFViewerWidth(parentWidth - remInPixels * 3);
    }
  }

  const handleCheckedChange = (file: File, checked: boolean) => {
    if (checked) {
      setFilesToSplit((prevFiles) => [...prevFiles, file]);
    } else {
      setFilesToSplit((prevFiles) => prevFiles.filter((f) => f !== file));
    }
  };

  const removeFromQueue = (file: File) => {
    setFilesToUpload((prevFiles: File[]) =>
      prevFiles.filter((f) => f !== file),
    );
  };

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

  return (
    <div className="flex h-full">
      <div className="relative flex h-full w-2/5 flex-col border-r">
        <DialogTitle className="h-12 border-b p-4">
          Upload Documents
        </DialogTitle>
        <div className="h-full overflow-scroll p-4">
          {filesToUpload.map((file, index) => (
            <div className="mb-1 flex flex-row items-center gap-2" key={index}>
              <Checkbox
                onCheckedChange={(checked: boolean) =>
                  handleCheckedChange(file, checked)
                }
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="cursor-default overflow-hidden text-ellipsis text-nowrap text-left">
                    {file.name}
                  </TooltipTrigger>
                  <TooltipContent>{file.name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <div className="nowrap ml-auto flex gap-1">
                <Button
                  variant={'outline'}
                  size={'icon'}
                  onClick={() => setActiveFile(file)}
                >
                  <EyeOpenIcon />
                </Button>
                <Button
                  variant={'ghost'}
                  size={'icon'}
                  className="hover:text-red-500"
                  onClick={() => removeFromQueue(file)}
                >
                  <TrashIcon />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter className="flex h-16 w-full flex-row items-center border-t px-4">
          <Button
            variant={'outline'}
            className="mr-auto"
            onClick={handleButtonClick}
          >
            <PlusIcon />
            Add More Files
          </Button>
          <Button variant={'secondary'} onClick={handleUpload}>
            Skip Splitting
            <CaretRightIcon />
          </Button>
          <Button
            onClick={() => setStage('SPLITTING')}
            disabled={Boolean(filesToSplit.length === 0)}
          >
            <ScissorsIcon />
            Split PDFs
          </Button>
        </DialogFooter>
      </div>
      <div className="w-3/5 bg-wm-white-50">
        <DialogHeader className="flex h-12 min-h-12 flex-row items-center justify-between border-b px-4 text-sm">
          {activeFile?.name}
        </DialogHeader>
        <div
          className="no-scrollbar h-full w-full overflow-y-scroll p-4"
          ref={PDFViewerParentRef}
        >
          <PDFViewer
            file={activeFile ? activeFile : ''}
            width={PDFViewerWidth}
            gridColumns={3}
          />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="application/pdf"
        onChange={addToUploadQueue}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default PDFSplitterFileSelection;
