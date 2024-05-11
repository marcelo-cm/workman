import React, { useState } from "react";
import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js";

const PDFViewer = ({ fileUrl }: { fileUrl: string }) => {
  console.log(fileUrl);
  const [numPages, setNumPages] = useState<number>(0);

  function onDocumentLoadSuccess(document: any): void {
    const { numPages: nextNumPages } = document;
    setNumPages(nextNumPages);
  }

  return (
    <Document
      file={fileUrl}
      onLoadSuccess={onDocumentLoadSuccess}
      className="flex flex-col gap-2 w-full h-full overflow-auto relative"
    >
      {Array.from({ length: numPages }, (_, index) => (
        <Page
          key={index + 1}
          pageNumber={index + 1}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          width={575}
        >
          <div className="text-xs absolute top-1 left-1 bg-white text-wm-orange rounded-sm border border-wm-white-200 p-1 leading-none">
            {index + 1} of {numPages}
          </div>
        </Page>
      ))}
    </Document>
  );
};

export default PDFViewer;
