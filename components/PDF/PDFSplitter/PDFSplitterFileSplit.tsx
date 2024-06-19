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

const fileSpitSchema = z.object({
  fixedRanges: z.boolean(),
  splitInterval: z.number().nullable(),
  splitPages: z.array(
    z.object({
      fileName: z.string().min(1, 'File name is required'),
      pageIndices: z
        .array(z.any())
        .min(1, 'At least one page index is required'),
    }),
  ),
});

const PDFSplitterFileSplit = () => {
  const { filesToSplit, setFilesToSplit } = usePDFSplitter();
  const PDFViewerParentRef = useRef<null | HTMLDivElement>(null);
  const form = useForm<z.infer<typeof fileSpitSchema>>({
    resolver: zodResolver(fileSpitSchema),
    defaultValues: {
      fixedRanges: false,
      splitInterval: null,
      splitPages: [
        {
          fileName: '',
          pageIndices: [1],
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'splitPages',
  });
  const watchedFixedRanges = form.watch('fixedRanges');
  const watchedPages = form.watch('splitPages');
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [PDFViewerWidth, setPDFViewerWidth] = useState<number>(500);
  const [currentlySelectedPage, setCurrentlySelectedPage] = useState<
    number | null
  >(null);

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

  function handleReset() {
    form.reset({
      fixedRanges: false,
      splitInterval: null,
      splitPages: [
        {
          fileName: 'Test_1',
          pageIndices: [1],
        },
        {
          fileName: 'Test_2',
          pageIndices: [2],
        },
      ],
    });
  }

  function addFile() {
    append({
      fileName: '',
      pageIndices: [],
    });
  }

  function handleSplitPDFs() {
    if (!form.formState.isValid) {
      form.trigger();
    }

    const file = filesToSplit[activeIndex];
  }

  function handleSkipFile() {
    setActiveIndex((prev) => prev + 1);
  }

  function handlePageSelect(index: number) {
    if (currentlySelectedPage === null) return;

    const oldPageIndices = form.getValues(
      `splitPages.${currentlySelectedPage}.pageIndices`,
    );

    let newPageIndices;
    if (oldPageIndices.includes(index)) {
      newPageIndices = oldPageIndices.filter((number) => number !== index);
    } else {
      newPageIndices = [...oldPageIndices, index].sort();
    }

    form.setValue(
      `splitPages.${currentlySelectedPage}.pageIndices`,
      newPageIndices,
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
                  name={`splitPages.${index}.fileName`}
                  render={({ field }) => (
                    <FormItem className="border-b p-4 last:border-0">
                      <div className="flex w-full items-center justify-between">
                        <FormLabel className="ml-2">File Name</FormLabel>
                        <FormMessage className="px-2" />
                      </div>
                      <FormControl>
                        <Input
                          placeholder={`Invoice_File_${index}`}
                          {...field}
                          {...form.register(field.name, {
                            onChange: (e) => {
                              form.setValue(field.name, e.target.value, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            },
                          })}
                        />
                      </FormControl>
                      <div className="mt-2 flex flex-wrap">
                        {watchedPages
                          .find((page) => page.fileName === field.value)
                          ?.pageIndices.map((page, index) => (
                            <Button
                              className="!h-7 p-3 text-xs"
                              size={'sm'}
                              type="button"
                            >
                              {page}
                            </Button>
                          ))}
                      </div>
                      <div className="mt-2 flex items-center justify-between ">
                        <Button
                          variant={'ghost'}
                          className={
                            index === currentlySelectedPage
                              ? 'border border-wm-orange text-wm-orange'
                              : ''
                          }
                          size={'sm'}
                          value={index}
                          onClick={() =>
                            setCurrentlySelectedPage((prev) =>
                              prev ? null : index,
                            )
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
          <Button type="button">
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
            file={filesToSplit[activeIndex] ? filesToSplit[activeIndex] : ''}
            width={PDFViewerWidth}
            gridColumns={2}
            selectable
            selectedPages={watchedPages.map((page) => page.pageIndices).flat()}
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
                field.pageIndices.includes(index + 1),
              );

              return file ? (
                <div className="mb-1 w-fit rounded border border-wm-orange bg-white p-1 text-xs leading-tight text-wm-orange">
                  {file.fileName ? file.fileName : <i>No File Name</i>}
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