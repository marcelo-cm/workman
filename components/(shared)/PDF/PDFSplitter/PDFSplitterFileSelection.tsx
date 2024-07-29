import { useEffect, useRef, useState } from 'react';
import React from 'react';

import {
  CaretRightIcon,
  EyeOpenIcon,
  PlusIcon,
  ScissorsIcon,
  TrashIcon,
} from '@radix-ui/react-icons';

import DragToUploadArea from '@/components/(shared)/general/DragToUploadArea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
    isUploading,
  } = usePDFSplitter();
  const PDFViewerParentRef = useRef<null | HTMLDivElement>(null);
  const uploadButtonRef = useRef<null | HTMLButtonElement>(null);
  const [PDFViewerWidth, setPDFViewerWidth] = useState<number>(500);
  const [activeFile, setActiveFile] = useState<File>(filesToUpload[0]);

  useEffect(() => {
    updatePDFViewerWidth();
    window.addEventListener('resize', updatePDFViewerWidth);
    return () => {
      window.removeEventListener('resize', updatePDFViewerWidth);
    };
  }, []);

  useEffect(() => {
    if (uploadButtonRef.current) {
      uploadButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [filesToUpload]);

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

  return (
    <div className="flex h-full">
      <section className="relative flex h-full w-2/5 flex-col border-r">
        <DialogTitle className="h-12 border-b p-4">
          Upload Documents
        </DialogTitle>
        <div className="h-full flex flex-col overflow-scroll p-4">
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
              <div className="nowrap ml-auto flex gap-1 ">
                <Button
                  variant={'outline'}
                  size={'icon'}
                  onClick={() => setActiveFile(file)}
                  className={
                    activeFile === file
                      ? 'text-wm-orange-500 border-wm-orange-300'
                      : ''
                  }
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
          <DragToUploadArea
            setFiles={setFilesToUpload}
            files={filesToUpload}
            className="mt-2"
          />
        </div>
        <DialogFooter className="flex h-16 w-full flex-row items-center border-t px-4">
          <DialogClose>
            <Button
              variant={'secondary'}
              onClick={() => handleUpload()}
              disabled={isUploading}
            >
              Continue without Splitting
              <CaretRightIcon />
            </Button>
          </DialogClose>
          <Button
            onClick={() => setStage('SPLITTING')}
            disabled={Boolean(filesToSplit.length === 0) || isUploading}
          >
            <ScissorsIcon />
            Split PDFs
          </Button>
        </DialogFooter>
      </section>
      <section className="w-3/5 bg-wm-white-50">
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
      </section>
    </div>
  );
};

export default PDFSplitterFileSelection;
