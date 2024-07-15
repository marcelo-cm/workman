import React, {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { Loader2Icon } from 'lucide-react';

import { Document, Page, pdfjs } from 'react-pdf';

import { Button } from '../ui/button';
import Container from '../ui/container';

pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js';

const MIN_ZOOM = 1;
const MAX_ZOOM = 2;

interface PDFViewerProps {
  file: File | string;
  width?: number;
  gridColumns?: 1 | 2 | 3;
  zoomable?: boolean;
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
}

const PDFViewer = forwardRef(
  (
    {
      file,
      width = 550,
      gridColumns = 1,
      zoomable = false,
      selectable = false,
      selectedPages,
      onPageSelect,
      customPageOverlay,
      customPageFooter,
      customPageHeader,
    }: PDFViewerProps,
    ref,
  ) => {
    if (selectable && !onPageSelect) {
      throw new Error('onPageSelect is required when selectable is true');
    }

    const [zoom, setZoom] = useState<number>(1);

    useImperativeHandle(ref, () => {
      return {
        getNumPages() {
          return numPages;
        },
      };
    });

    const [numPages, setNumPages] = useState<number>(0);

    const increaseZoom = () => {
      setZoom((prev) => Math.min(prev + 0.25, MAX_ZOOM));
    };

    const decreaseZoom = () => {
      setZoom((prev) => Math.max(prev - 0.25, MIN_ZOOM));
    };

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
        className={`grid w-fit gap-2 ${gridColumnsClass} relative `}
      >
        {Array.from({ length: numPages }, (_, index) => (
          <div key={index + 1}>
            {customPageHeader &&
              (typeof customPageHeader === 'function'
                ? customPageHeader(index, numPages)
                : customPageHeader)}
            <Page
              pageNumber={index + 1}
              pageIndex={index}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              height={width * (11 / 8.5) * zoom}
              width={(width / gridColumns) * zoom}
              className={`w-fit border border-wm-white-200 ${selectedPages && selectedPages.includes(index + 1) ? 'border-wm-orange' : null} ${selectable && onPageSelect ? 'cursor-pointer hover:ring hover:ring-wm-orange-200' : ''}`}
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
        {zoomable && (
          <Container
            className="absolute right-2 top-2 z-50 bg-white text-xs"
            innerClassName="flex flex-row gap-2 items-center justify-center"
          >
            <button onClick={decreaseZoom} disabled={zoom <= MIN_ZOOM}>
              <Container className="cursor-pointer rounded-none border-0 border-r px-2 py-1 hover:bg-wm-white-50">
                <MinusIcon />
              </Container>
            </button>
            <div>{zoom}</div>
            <button onClick={increaseZoom} disabled={zoom >= MAX_ZOOM}>
              <Container className="cursor-pointer rounded-none border-0 border-l px-2 py-1 hover:bg-wm-white-50">
                <PlusIcon />
              </Container>
            </button>
          </Container>
        )}
        <div className="flex w-full items-center gap-2 pb-2 text-xs text-wm-white-300">
          <hr className="grow" />
          End of Document
          <hr className="grow" />
        </div>
      </Document>
    );
  },
);

export default PDFViewer;
