import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import PDFSplitterFileSelection from './PDFSplitterFileSelection';
import PDFSplitterFileSplit from './PDFSplitterFileSplit';

interface PDFSplitterContext {
  filesToUpload: File[];
  setFilesToUpload: Dispatch<SetStateAction<File[]>>;
  filesToSplit: File[];
  setFilesToSplit: Dispatch<SetStateAction<File[]>>;
  setStage: Dispatch<SetStateAction<'SELECTION' | 'SPLITTING'>>;
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
  const [stage, setStage] = useState<'SELECTION' | 'SPLITTING'>('SELECTION');

  const STAGES = {
    SELECTION: <PDFSplitterFileSelection />,
    SPLITTING: <PDFSplitterFileSplit />,
  };

  return (
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
  );
};

export default PDFSplitter;
