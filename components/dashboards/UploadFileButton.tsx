import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CaretRightIcon,
  EyeOpenIcon,
  PlusIcon,
  ScissorsIcon,
  TrashIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import {
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Button } from '../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import PDFViewer from './PDFViewer';

const UploadFileButton = () => {
  const fileInputRef = useRef<null | HTMLInputElement>(null);
  const PDFViewerParentRef = useRef<null | HTMLDivElement>(null);
  const [PDFViewerWidth, setPDFViewerWidth] = useState<number>(500);
  const [filesUploading, setFilesUploading] = useState<File[]>([]);
  const [filesToSplit, setFilesToSplit] = useState<File[]>([]);
  const [activeFile, setActiveFile] = useState<File | null>(null);

  useEffect(() => {
    if (filesUploading.length) {
      setActiveFile(filesUploading[0]);
    }
  }, [filesUploading]);

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

    setFilesUploading((prevFiles) => [...prevFiles, ...files]);
  };

  const removeFromQueue = (file: File) => {
    setFilesUploading((prevFiles) => prevFiles.filter((f) => f !== file));
  };

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
      console.log('remInPixels', remInPixels);
      setPDFViewerWidth(parentWidth - remInPixels * 3);
    }
  }

  const handleCheckForSplitQueue = (file: File, checked: boolean) => {
    if (checked) {
      setFilesToSplit((prevFiles) => [...prevFiles, file]);
    } else {
      setFilesToSplit((prevFiles) => prevFiles.filter((f) => f !== file));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UploadIcon /> Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[90%] max-w-[90%] flex-col overflow-hidden p-0">
        {filesUploading.length ? (
          <div className="flex h-full">
            <div className="relative flex h-full w-2/5 flex-col border-r">
              <div className="flex flex-col gap-4 p-4">
                <DialogTitle>Upload Documents</DialogTitle>
                <div>
                  {filesUploading.map((file, index) => (
                    <div
                      className="mb-1 flex flex-row items-center gap-2"
                      key={index}
                    >
                      <Checkbox
                        onCheckedChange={(checked: boolean) =>
                          handleCheckForSplitQueue(file, checked)
                        }
                      />
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="overflow-hidden text-ellipsis text-nowrap text-left">
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
              </div>
              <div className="absolute bottom-0 flex h-16 w-full flex-row items-center gap-4 border-t px-4">
                <Button
                  variant={'outline'}
                  className="mr-auto"
                  onClick={handleButtonClick}
                >
                  <PlusIcon />
                  Add More Files
                </Button>
                <Button variant={'secondary'}>
                  Skip Splitting
                  <CaretRightIcon />
                </Button>
                <Button>
                  <ScissorsIcon />
                  Split PDFs
                </Button>
              </div>
            </div>
            <div className="w-2/3 bg-wm-white-50">
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
        ) : (
          <div className="flex h-full flex-col gap-4  p-4">
            <DialogTitle>Upload Documents</DialogTitle>
            <button
              className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-wm-white-500 bg-wm-white-50 text-wm-white-700 hover:border-wm-orange-500 hover:bg-wm-orange-50 hover:text-wm-orange-700"
              onClick={handleButtonClick}
            >
              Drag Files or Click to Upload
            </button>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          multiple
          accept="application/pdf"
          onChange={addToUploadQueue}
          style={{ display: 'none' }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileButton;
