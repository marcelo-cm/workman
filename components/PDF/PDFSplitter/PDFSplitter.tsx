import WorkmanLogo from '@/components/molecules/WorkmanLogo';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import PDFSplitterFileSelection from './PDFSplitterFileSelection';
import PDFSplitterFileSplit from './PDFSplitterFileSplit';
import { DialogContent } from '@/components/ui/dialog';
import Invoice from '@/classes/Invoice';

const STAGES = {
  SELECTION: <PDFSplitterFileSelection />,
  SPLITTING: <PDFSplitterFileSplit />,
  FINISHED: <div>Finished</div>,
};

interface PDFSplitterContext {
  filesToUpload: File[];
  setFilesToUpload: Dispatch<SetStateAction<File[]>>;
  filesToSplit: File[];
  setFilesToSplit: Dispatch<SetStateAction<File[]>>;
  setStage: Dispatch<SetStateAction<keyof typeof STAGES>>;
}

const defaultPDFSplitterContext: PDFSplitterContext = {
  filesToUpload: [],
  setFilesToUpload: () => {},
  filesToSplit: [],
  setFilesToSplit: () => {},
  setStage: () => {},
};

const PDFSplitterContext = createContext<PDFSplitterContext>(
  defaultPDFSplitterContext,
);

export const usePDFSplitter = () => {
  return useContext(PDFSplitterContext);
};

const PDFSplitter = ({
  filesToUpload,
  setFilesToUpload,
}: {
  filesToUpload: File[];
  setFilesToUpload: Dispatch<SetStateAction<File[]>>;
}) => {
  const [filesToSplit, setFilesToSplit] = useState<File[]>([]);
  const [stage, setStage] = useState<keyof typeof STAGES>('SELECTION');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (stage === 'FINISHED') {
      handleUpload();
    }
  });

  const handleUpload = async () => {
    setIsUploading(true);
    if (!filesToUpload) {
      return;
    }

    const files = Array.from(filesToUpload) as File[];

    try {
      const allFileUrlPromises = files.map(
        async (file) => await Invoice.upload(file),
      );
      const fileUrls = await Promise.all(allFileUrlPromises);

      const scanAllFilePromises = fileUrls.map(async (fileUrl) => {
        await Invoice.scanAndUpdate(fileUrl);
      });

      await Promise.all(scanAllFilePromises);

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
    setIsUploading(false);
  };

  return (
    <>
      {stage !== 'FINISHED' ? (
        <DialogContent className="flex h-[90%] max-w-[90%] flex-col overflow-hidden p-0">
          <PDFSplitterContext.Provider
            value={{
              filesToUpload,
              setFilesToUpload,
              filesToSplit,
              setFilesToSplit,
              setStage,
            }}
          >
            <>{STAGES[stage]}</>
          </PDFSplitterContext.Provider>
        </DialogContent>
      ) : (
        <AlertDialog open={isUploading}>
          <AlertDialogContent className="justify-center">
            <AlertDialogHeader className="items-center">
              <WorkmanLogo className="w-32 animate-pulse" />
              <AlertDialogTitle>Uploading your Data Now!</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-center">
              It's important that you don't close this window while we're
              uploading your data. We are uploading {filesToUpload.length}{' '}
              files.
            </AlertDialogDescription>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default PDFSplitter;