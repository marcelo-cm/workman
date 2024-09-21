import React, {
  ChangeEvent,
  ChangeEventHandler,
  Dispatch,
  MouseEventHandler,
  SetStateAction,
  useRef,
  useState,
} from 'react';

function DragToUploadArea<T>({
  setFiles,
  files,
  className,
  hoverClassName,
  additive = true,
}: {
  setFiles: Dispatch<SetStateAction<T[]>>;
  files: T[];
  className?: string;
  hoverClassName?: string;
  additive?: boolean;
}) {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<null | HTMLInputElement>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);

    const filesDropped = Array.from(event.dataTransfer.files) as T[];
    if (!filesDropped) return;

    if (additive) {
      const newFiles = [...files, ...filesDropped];
      setFiles(newFiles);
      return;
    }

    setFiles(filesDropped);
  };

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList) return;

    const filesUploaded = Array.from(fileList) as T[];

    if (additive) {
      const newFiles = [...files, ...filesUploaded];
      setFiles(newFiles);
      return;
    }

    setFiles(files);
  };

  return (
    <>
      <button
        className={`flex h-full w-full items-center justify-center rounded-lg border border-dashed border-wm-white-500 bg-wm-white-50 text-wm-white-700 hover:border-wm-orange-500 hover:bg-wm-orange-50 hover:text-wm-orange-700 ${className} ${dragActive ? (hoverClassName ? hoverClassName : 'border-wm-orange-500 bg-wm-orange-50 text-wm-orange-700') : ''}`}
        onDragOver={(event) => event.preventDefault()}
        onClick={handleButtonClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        Drag Files or Click to Upload
      </button>{' '}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="application/pdf"
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
    </>
  );
}

export default DragToUploadArea;
