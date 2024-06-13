import { Checkbox } from '@/components/ui/checkbox';
import {
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CaretRightIcon,
  EyeOpenIcon,
  PlusIcon,
  ResetIcon,
  ScissorsIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { Button } from '../../ui/button';
import PDFViewer from '../PDFViewer';
import React, { useEffect, useRef, useState } from 'react';
import { usePDFSplitter } from './PDFSplitter';
import { Input } from '@/components/ui/input';

const PDFSplitterFileSplit = () => {
  const { filesToSplit, setFilesToSplit } = usePDFSplitter();
  const PDFViewerParentRef = useRef<null | HTMLDivElement>(null);
  const [activeFile, setActiveFile] = useState<File>(filesToSplit[0]);
  const [PDFViewerWidth, setPDFViewerWidth] = useState<number>(500);

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

  return (
    <div className="flex h-full">
      <div className="relative flex h-full w-2/5 flex-col border-r">
        <DialogTitle className="h-12 border-b p-4">Split your PDFs</DialogTitle>
        <DialogDescription className="p-4">
          Split your PDFs into separate files. You can split them by page or
          range.
        </DialogDescription>
        <div className="no-scrollbar flex h-full w-full flex-col gap-4 overflow-y-scroll px-4">
          <div className="flex w-full justify-between rounded border px-4 py-3">
            <div className="flex items-center gap-2">
              Fixed Intervals? <Checkbox />{' '}
            </div>
            <div className="flex items-center gap-2">
              Split Every{' '}
              <Input className="w-16" size={1} defaultValue={1} type="number" />{' '}
              pages
            </div>
          </div>
        </div>
        <DialogFooter className="flex h-16 w-full flex-row items-center border-t px-4">
          <Button
            variant={'secondary'}
            onClick={() => console.log('uploading documents')}
          >
            Skip File
            <CaretRightIcon />
          </Button>
          <Button>
            <ResetIcon />
            Reset
          </Button>
          <Button>
            <ScissorsIcon />
            Split PDFs
          </Button>
        </DialogFooter>
      </div>
      <div className="w-3/5 bg-wm-white-50">
        <div className="flex h-12 min-h-12 items-center justify-between border-b px-4 text-sm">
          {activeFile?.name}
        </div>
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
    </div>
  );
};

export default PDFSplitterFileSplit;
