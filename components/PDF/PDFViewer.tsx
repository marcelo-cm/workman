import { Loader2Icon } from 'lucide-react';
import React, { ReactNode, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js';

const PDFViewer = ({
  file,
  width = 550,
  gridColumns = 1,
  selectable = false,
  selectedPages,
  onPageSelect,
  customPageOverlay,
  customPageFooter,
  customPageHeader,
}: {
  file: File | string;
  width?: number;
  gridColumns?: 1 | 2 | 3;
  selectable?: boolean;
  selectedPages?: number[];
  onPageSelect?: (index: number) => void;
  customPageOverlay?: (index: number, numPages: number) => JSX.Element | null;
  customPageFooter?:
    | React.ReactNode
    | ((index: number, numPages: number) => JSX.Element);
  customPageHeader?:
    | React.ReactNode
    | ((index: number, numPages: number) => JSX.Element);
}) => {
  if (Boolean(selectable) !== Boolean(onPageSelect)) {
    throw new Error('selectable and onPageSelect must be used together.');
  }

  const [numPages, setNumPages] = useState<number>(0);

  function onDocumentLoadSuccess(document: any): void {
    const { numPages: nextNumPages } = document;
    setNumPages(nextNumPages);
  }

  let gridColumnsClass = '';
  if (gridColumns === 2) {
    gridColumnsClass = 'grid-cols-2';
  } else if (gridColumns === 3) {
    gridColumnsClass = 'grid-cols-3';
  }

  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={
        <div
          className={`flex w-[${width}] min-w-[${width}] animate-pulse items-center self-center`}
        >
          Loading PDF <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
        </div>
      }
      className={`grid w-fit gap-2 ${gridColumnsClass}`}
    >
      {Array.from({ length: numPages }, (_, index) => (
        <div>
          {customPageHeader &&
            (typeof customPageHeader === 'function'
              ? customPageHeader(index, numPages)
              : customPageHeader)}
          <Page
            key={index + 1}
            pageNumber={index + 1}
            pageIndex={index}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            height={width * (11 / 8.5)}
            width={width / gridColumns}
            className={`w-fit border border-wm-white-200 ${selectedPages && selectedPages.includes(index + 1) ? 'border-wm-orange' : null} ${onPageSelect ? 'cursor-pointer' : ''}`}
            onClick={() =>
              selectable && onPageSelect && onPageSelect(index + 1)
            }
          >
            {(customPageOverlay && customPageOverlay(index, numPages)) ?? (
              <div className="absolute left-1 top-1 rounded-sm border border-wm-white-200 bg-white p-1 text-xs leading-none text-wm-orange">
                {index + 1} of {numPages}
              </div>
            )}
          </Page>
          {customPageFooter &&
            (typeof customPageFooter == 'function'
              ? customPageFooter(index, numPages)
              : customPageFooter)}
        </div>
      ))}
      <div className="flex w-full items-center gap-2 pb-4 text-xs text-wm-white-300">
        <hr className="grow" />
        End of Document
        <hr className="grow" />
      </div>
    </Document>
  );
};

export default PDFViewer;
