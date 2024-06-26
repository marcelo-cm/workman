import React from 'react';

const PDFSplitterCustomHeader = ({
  index,
  numPages,
  watchedPages,
}: {
  index: number;
  numPages: number;
  watchedPages: {
    fileName: string;
    pageNumbers: any[];
  }[];
}) => {
  const file = watchedPages.find((field) =>
    field.pageNumbers.includes(index + 1),
  );

  return file ? (
    <div className="mb-1 w-fit rounded border border-wm-orange bg-white p-1 text-xs leading-tight text-wm-orange">
      {file.fileName.trim() ? file.fileName.trim() : <i>No File Name</i>}
    </div>
  ) : (
    <div className="mb-1 w-fit rounded border  bg-white p-1 text-xs leading-tight text-wm-white-500">
      Not Selected
    </div>
  );
};

export default PDFSplitterCustomHeader;
