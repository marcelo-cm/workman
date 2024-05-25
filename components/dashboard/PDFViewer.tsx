import { Loader2Icon } from "lucide-react";
import { Suspense, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js";

const PDFViewer = ({ fileUrl }: { fileUrl: string }) => {
  const [numPages, setNumPages] = useState<number>(0);

  function onDocumentLoadSuccess(document: any): void {
    const { numPages: nextNumPages } = document;
    setNumPages(nextNumPages);
  }

  return (
    <Document
      file={fileUrl}
      onLoadSuccess={onDocumentLoadSuccess}
      loading={
        <div className="flex w-[575px] min-w-[575px] animate-pulse items-center self-center">
          Loading PDF <Loader2Icon className="ml-2 h-4 w-4 animate-spin" />
        </div>
      }
      className="relative flex h-full w-fit flex-col gap-2"
    >
      {Array.from({ length: numPages }, (_, index) => (
        <Page
          key={index + 1}
          pageNumber={index + 1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={575}
          className="w-fit border border-wm-white-200 "
        >
          <div className="absolute left-1 top-1 rounded-sm border border-wm-white-200 bg-white p-1 text-xs leading-none text-wm-orange">
            {index + 1} of {numPages}
          </div>
        </Page>
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
