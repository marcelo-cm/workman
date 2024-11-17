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
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

import { useInvoice } from '@/lib/hooks/supabase/useInvoice';

import { sliceWithEllipsis } from '@/lib/utils';
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

const UPLOAD_PROGRESS = 65;
const PROCESS_PROGRESS = 100;
const PROGRESS_INCREMENT = 1;
const INTERVAL_TIME = 200;

const PDFSplitter = () => {
  const { processInvoicesByFileURLs } = useInvoice();

  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [filesToSplit, setFilesToSplit] = useState<File[]>([]);
  const [stage, setStage] = useState<keyof typeof STAGES>('UPLOADING');
  const [isUploading, startUploading] = useTransition();
  const [progress, setProgress] = useState<number[]>([]);

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

  const startSmoothProgress = (index: number, target: number) => {
    return setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress.map((p, i) => {
          if (i === index && p < target) {
            return Math.min(p + PROGRESS_INCREMENT, target);
          }
          return p;
        }),
      );
    }, INTERVAL_TIME);
  };

  const updateProgress = (index: number, value: number) => {
    setProgress((prevProgress) =>
      prevProgress.map((p, i) => (i === index ? value : p)),
    );
  };

  const handleProcessFiles = async () => {
    if (!filesToUpload) {
      return;
    }

    const files = Array.from(filesToUpload) as File[];
    setProgress(new Array(files.length).fill(0));

    try {
      startUploading(async () => {
        const fileUrls = await Promise.all(
          files.map((file, index) => uploadFile(file, index)),
        );

        for (let i = 0; i < fileUrls.length; i += 4) {
          const batch = fileUrls
            .slice(i, i + 4)
            .map((fileUrl, index) => processFile(fileUrl, i + index));

          await Promise.all(batch);

          if (i + 4 < fileUrls.length) {
            await new Promise((resolve) => setTimeout(resolve, 5000));
          }
        }

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    } catch (error: unknown) {
      console.error('Error uploading files:', error);
    }
  };

  const uploadFile = async (file: File, index: number): Promise<string> => {
    const smoothIncrement = startSmoothProgress(index, UPLOAD_PROGRESS);

    try {
      const url = await Invoice.uploadToStorage(file);
      updateProgress(index, UPLOAD_PROGRESS);
      return url;
    } catch (error) {
      clearInterval(smoothIncrement);
      setProgress((prevProgress) =>
        prevProgress.map((p, i) => (i === index ? 0 : p)),
      );
      console.error(`Error uploading file at index ${index}:`, error);
      throw error;
    }
  };

  const processFile = async (fileUrl: string, index: number) => {
    startSmoothProgress(index, PROCESS_PROGRESS - 10);
    await processInvoicesByFileURLs([fileUrl]).then(() => {
      updateProgress(index, PROCESS_PROGRESS);
    });
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
            uploading your data.
          </AlertDialogDescription>
          {progress.map((p, idx) => (
            <div className="flex flex-row items-center justify-center gap-8">
              <Label className="w-[100px] text-nowrap">
                {sliceWithEllipsis(filesToUpload[idx].name, 15)}
              </Label>
              <Progress key={idx} value={p} />
            </div>
          ))}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PDFSplitter;
