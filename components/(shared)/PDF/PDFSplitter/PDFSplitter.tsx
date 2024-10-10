import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from 'react';

import WorkmanLogo from '@/components/molecules/WorkmanLogo';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DialogContent } from '@/components/ui/dialog';

import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import { InvoiceData } from '@/interfaces/common.interfaces';
import Invoice from '@/models/Invoice';

import PDFSplitterFileSelection from './PDFSplitterFileSelection';
import PDFSplitterFileSplit from './PDFSplitterFileSplit';
import PDFSplitterUpload from './PDFSplitterUpload';

const STAGES = {
  UPLOADING: <PDFSplitterUpload />,
  SELECTION: <PDFSplitterFileSelection />,
  SPLITTING: <PDFSplitterFileSplit />,
  FINISHED: <></>,
};

interface PDFSplitterContext {
  filesToUpload: File[];
  setFilesToUpload: Dispatch<SetStateAction<File[]>>;
  filesToSplit: File[];
  setFilesToSplit: Dispatch<SetStateAction<File[]>>;
  setStage: Dispatch<SetStateAction<keyof typeof STAGES>>;
  handleUpload: () => void;
  isUploading: boolean;
}

const defaultPDFSplitterContext: PDFSplitterContext = {
  filesToUpload: [],
  setFilesToUpload: () => {},
  filesToSplit: [],
  setFilesToSplit: () => {},
  setStage: () => {},
  handleUpload: async () => {},
  isUploading: false,
};

const PDFSplitterContext = createContext<PDFSplitterContext>(
  defaultPDFSplitterContext,
);

export const usePDFSplitter = () => {
  return useContext(PDFSplitterContext);
};

const { processInvoicesByFileURLs } = useInvoice();

const PDFSplitter = () => {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [filesToSplit, setFilesToSplit] = useState<File[]>([]);
  const [stage, setStage] = useState<keyof typeof STAGES>('UPLOADING');
  const [isUploading, startUploading] = useTransition();

  useEffect(() => {
    if (filesToUpload.length > 0) {
      setStage('SELECTION');
    } else {
      setStage('UPLOADING');
    }
  }, [filesToUpload]);

  useEffect(() => {
    if (stage === 'FINISHED') {
      handleProcessFiles();
    }
  }, [stage]);

  const handleProcessFiles = async () => {
    if (!filesToUpload) {
      return;
    }

    const files = Array.from(filesToUpload) as File[];

    try {
      startUploading(async () => {
        const fileUrls = await Promise.all(
          files.map(async (file) => await Invoice.uploadToStorage(file)),
        );

        processInvoicesByFileURLs(fileUrls);
      });
    } catch (error: unknown) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <>
      <DialogContent className="flex h-[90%] max-w-[90%] flex-col overflow-hidden p-0">
        <PDFSplitterContext.Provider
          value={{
            filesToUpload,
            setFilesToUpload,
            filesToSplit,
            setFilesToSplit,
            setStage,
            handleUpload: handleProcessFiles,
            isUploading,
          }}
        >
          {STAGES[stage]}
        </PDFSplitterContext.Provider>
      </DialogContent>
      <AlertDialog open={isUploading}>
        <AlertDialogContent className="justify-center">
          <AlertDialogHeader className="items-center">
            <WorkmanLogo className="w-32 animate-pulse" />
            <AlertDialogTitle>Uploading your Data Now!</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-center">
            It's important that you don't close this window while we're
            uploading your data. We are uploading {filesToUpload.length} files.
          </AlertDialogDescription>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PDFSplitter;
