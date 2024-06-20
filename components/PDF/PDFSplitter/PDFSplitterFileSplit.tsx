import { Checkbox } from '@/components/ui/checkbox';
import Container from '@/components/ui/container';
import {
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CaretRightIcon,
  DownloadIcon,
  PlusIcon,
  ResetIcon,
  ScissorsIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import React, { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../../ui/button';
import PDFViewer from '../PDFViewer';
import { usePDFSplitter } from './PDFSplitter';
import { formatISO } from 'date-fns';
import { toast } from '@/components/ui/use-toast';
import { PDFDocument } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js';

const fileSpitSchema = z.object({
  fixedRanges: z.boolean(),
  splitInterval: z.number().nullable(),
  splitPages: z.array(
    z.object({
      fileName: z.string().trim().min(1, 'File name is required'),
      pageNumbers: z
        .array(z.any())
        .min(1, 'At least one page index is required'),
    }),
  ),
});

const PDFSplitterFileSplit = () => {
  const { filesToSplit, setFilesToSplit } = usePDFSplitter();
  const PDFViewerParentRef = useRef<null | HTMLDivElement>(null);
  const PDFViewerRef = useRef<any>(null);
  const form = useForm<z.infer<typeof fileSpitSchema>>({
    resolver: zodResolver(fileSpitSchema),
    defaultValues: {
      fixedRanges: false,
      splitInterval: null,
      splitPages: [
        {
          fileName: '',
          pageNumbers: [1],
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'splitPages',
  });
  const watchedFixedRanges = form.watch('fixedRanges');
  const watchedSplitInterval = form.watch('splitInterval');
  const watchedPages = form.watch('splitPages');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [PDFViewerWidth, setPDFViewerWidth] = useState<number>(500);
  const [currentlySelectedPage, setCurrentlySelectedPage] = useState<
    number | null
  >(null);

  const [newPDFs, setNewPDFs] = useState<any[]>([]);

  useEffect(() => {
    function updatePDFViewerWidth() {
      if (PDFViewerParentRef.current) {
        const parentWidth = PDFViewerParentRef.current.offsetWidth;
        const remInPixels = parseFloat(
          getComputedStyle(document.documentElement).fontSize,
        );
        setPDFViewerWidth(parentWidth - remInPixels * 3);
      }
    }

    updatePDFViewerWidth();
    window.addEventListener('resize', updatePDFViewerWidth);
    return () => {
      window.removeEventListener('resize', updatePDFViewerWidth);
    };
  }, []);

  useEffect(() => {
    handleReset();
  }, [activeIndex]);

  useEffect(() => {
    form.setValue('splitInterval', watchedFixedRanges ? 1 : null);
  }, [watchedFixedRanges]);

  useEffect(() => {
    if (watchedFixedRanges && watchedSplitInterval) {
      form.setValue('splitPages', []);

      const numPages = PDFViewerRef.current?.getNumPages();
      if (numPages) {
        const splitPages = Array.from({ length: numPages }).reduce(
          (
            acc: {
              fileName: string;
              pageNumbers: number[];
            }[],
            _,
            index,
          ) => {
            const page = Math.floor(index / watchedSplitInterval);
            if (!acc[page]) {
              acc[page] = {
                fileName: `${filesToSplit[activeIndex].name.split('.pdf')[0]}_${page}`,
                pageNumbers: [],
              };
            }
            acc[page].pageNumbers.push(index + 1);
            return acc;
          },
          [],
        );

        for (const page of splitPages) {
          append(page);
        }
      }
    } else {
      handleReset();
    }
  }, [watchedSplitInterval]);

  function handleReset() {
    form.reset({
      fixedRanges: false,
      splitInterval: null,
      splitPages: [
        {
          fileName: '',
          pageNumbers: [1],
        },
      ],
    });
  }

  function addFile() {
    append({
      fileName: '',
      pageNumbers: [],
    });
  }

  async function handleSplitPDFs() {
    const file = await filesToSplit[activeIndex];

    const arrayBuffer = await file.arrayBuffer();
    const pdfjsDoc = await pdfjs.getDocument(arrayBuffer).promise;

    const splitPages = form.getValues('splitPages');

    for (const page of splitPages) {
      toast({
        title: 'PDF Split',
        description: `Splitting file ${page.fileName}`,
      });

      const pdfDoc = await PDFDocument.create();

      //@todo, if the pdf is not encrypted just use PDFDocument.load and then split the pages

      for (const pageNumber of page.pageNumbers) {
        const pdfjsPage = await pdfjsDoc.getPage(pageNumber);
        const viewport = pdfjsPage.getViewport({ scale: 3.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
          throw new Error('Could not get canvas context');
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await pdfjsPage.render({ canvasContext: context, viewport }).promise;

        const imgData = canvas.toDataURL('image/png');
        const img = await pdfDoc.embedPng(imgData);
        const page = pdfDoc.addPage([viewport.width, viewport.height]);

        page.drawImage(img, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      }
      const pdfBytes = await pdfDoc.save();
      const fileName = `${page.fileName}_${formatISO(new Date())}.pdf`;

      setNewPDFs((prev) => [
        ...prev,
        new File([pdfBytes], fileName, { type: 'application/pdf' }),
      ]);

      toast({
        title: 'PDF Split',
        description: `File ${page.fileName} split successfully to form ${fileName}`,
      });
    }

    toast({
      title: 'PDF Split',
      description: `Splitting file`,
    });
  }

  function handleSkipFile() {
    setActiveIndex((prev) => prev + 1);
  }

  function handlePageSelect(pageNumber: number) {
    if (currentlySelectedPage === null) return;

    const oldPageNumbers = form.getValues(
      `splitPages.${currentlySelectedPage}.pageNumbers`,
    );

    const inOtherFile = watchedPages.find(
      (page) =>
        page.pageNumbers.includes(pageNumber) &&
        page.pageNumbers != oldPageNumbers,
    );

    if (inOtherFile) {
      toast({
        title: 'Page already in another file',
        description: `Page ${pageNumber} is already in file ${inOtherFile.fileName}`,
        variant: 'destructive',
      });
      return;
    }

    let newPageNumbers;
    if (oldPageNumbers.includes(pageNumber)) {
      newPageNumbers = oldPageNumbers.filter((number) => number !== pageNumber);
    } else {
      newPageNumbers = [...oldPageNumbers, pageNumber].sort();
    }

    form.setValue(
      `splitPages.${currentlySelectedPage}.pageNumbers`,
      newPageNumbers,
    );
  }

  return (
    <div className="flex h-full">
      <div className="relative flex h-full w-2/5 flex-col border-r">
        <DialogTitle className="h-12 border-b p-4">Split your PDFs</DialogTitle>
        <DialogDescription className="p-4">
          Split your PDFs into separate files. You can split them by page or
          range.
        </DialogDescription>
        <Form {...form}>
          <form className="no-scrollbar flex h-full w-full flex-col gap-4 overflow-y-scroll px-4">
            <Container
              innerClassName="flex w-full justify-between"
              header={
                <div className="flex w-full items-center justify-between">
                  Fixed Intervals?{' '}
                  <FormField
                    control={form.control}
                    name="fixedRanges"
                    render={({ field }) => (
                      <Checkbox
                        onCheckedChange={(val) => field.onChange(val)}
                      />
                    )}
                  />
                </div>
              }
            >
              <div className="flex items-center gap-2  p-4">
                Split Every{' '}
                <Input
                  className="w-16"
                  type="number"
                  disabled={!watchedFixedRanges}
                  {...form.register('splitInterval')}
                />
                pages
              </div>
            </Container>
            <Container
              innerClassName="gap-0 "
              header={'Invoices (After Split)'}
              footer={
                <Button
                  variant={'ghost'}
                  className="flex w-full justify-end rounded-t-none"
                  onClick={addFile}
                  type="button"
                >
                  <PlusIcon />
                  Add File
                </Button>
              }
            >
              {fields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={index}
                  name={`splitPages.${index}.fileName`}
                  render={({ field }) => (
                    <FormItem className="border-b p-4 last:border-0">
                      <div className="flex w-full items-center justify-between">
                        <FormLabel className="ml-2">File Name</FormLabel>
                        <FormMessage className="px-2" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder={`${filesToSplit[activeIndex].name.split('.pdf')[0]}_${index}`}
                          {...field}
                          {...form.register(field.name, {
                            onChange: (e) => {
                              form.setValue(field.name, e.target.value.trim(), {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            },
                          })}
                        />
                      </FormControl>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {watchedPages
                          .find((page) => page.fileName === field.value)
                          ?.pageNumbers.map((page, index) => (
                            <Button
                              className="!h-7 p-3 text-xs"
                              size={'sm'}
                              type="button"
                              key={index}
                            >
                              {page}
                            </Button>
                          ))}
                      </div>
                      <div className="mt-2 flex items-center justify-between ">
                        <Button
                          variant={
                            index === currentlySelectedPage
                              ? 'default'
                              : 'ghost'
                          }
                          size={'sm'}
                          value={index}
                          onClick={() =>
                            setCurrentlySelectedPage((prev) => {
                              if (prev === null) {
                                return index;
                              } else if (prev === index) {
                                return null;
                              } else {
                                return index;
                              }
                            })
                          }
                          disabled={watchedFixedRanges}
                          type="button"
                        >
                          Select Pages
                        </Button>
                        <Button
                          variant={'ghost'}
                          appearance={'destructive'}
                          size={'icon'}
                          type="button"
                          onClick={() => remove(index)}
                        >
                          <TrashIcon />
                        </Button>
                      </div>
                    </FormItem>
                  )}
                />
              ))}
            </Container>
          </form>
        </Form>
        {newPDFs.length > 0 &&
          newPDFs.map((pdf) => (
            <a
              key={pdf.name}
              href={URL.createObjectURL(pdf)}
              download={pdf.name}
              className="flex items-center gap-2 border-t p-4"
            >
              <Button variant={'outline'} size={'sm'} type="button">
                <DownloadIcon />
                Download
              </Button>
              <div>{pdf.name}</div>
            </a>
          ))}
        <DialogFooter className="flex h-16 w-full flex-row items-center border-t px-4">
          <div className="mr-auto flex items-center gap-2">
            <Button
              variant={'secondary'}
              onClick={handleSkipFile}
              type="button"
            >
              Skip File
              <CaretRightIcon />
            </Button>
            <Button variant={'outline'} onClick={handleReset} type="button">
              <ResetIcon />
              Reset
            </Button>
          </div>
          <Button
            type="button"
            onClick={handleSplitPDFs}
            disabled={Object.keys(form.formState.errors).length > 0}
          >
            <ScissorsIcon />
            Split PDFs
          </Button>
        </DialogFooter>
      </div>
      <div className="w-3/5 bg-wm-white-50">
        <div className="flex h-12 min-h-12 items-center justify-between border-b px-4 text-sm">
          {filesToSplit[activeIndex]?.name}
        </div>
        <div
          className="no-scrollbar h-full w-full overflow-y-scroll p-4"
          ref={PDFViewerParentRef}
        >
          <PDFViewer
            ref={PDFViewerRef}
            file={filesToSplit[activeIndex] ? filesToSplit[activeIndex] : ''}
            width={PDFViewerWidth}
            gridColumns={2}
            selectable
            selectedPages={watchedPages.map((page) => page.pageNumbers).flat()}
            onPageSelect={handlePageSelect}
            customPageOverlay={(index: number, numPages: number) => (
              <div className="h-full w-full">
                <Button
                  className="absolute left-0.5 top-0.5 !h-6 p-2 text-xs"
                  size={'sm'}
                  type="button"
                >
                  {index + 1}
                </Button>
              </div>
            )}
            customPageHeader={(index: number, numPages: number) => {
              const file = watchedPages.find((field) =>
                field.pageNumbers.includes(index + 1),
              );

              return file ? (
                <div className="mb-1 w-fit rounded border border-wm-orange bg-white p-1 text-xs leading-tight text-wm-orange">
                  {file.fileName.trim() ? (
                    file.fileName.trim()
                  ) : (
                    <i>No File Name</i>
                  )}
                </div>
              ) : (
                <div className="mb-1 w-fit rounded border  bg-white p-1 text-xs leading-tight text-wm-white-500">
                  Not Selected
                </div>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFSplitterFileSplit;
