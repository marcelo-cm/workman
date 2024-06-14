import { Checkbox } from '@/components/ui/checkbox';
import {
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  CaretRightIcon,
  PlusIcon,
  ResetIcon,
  ScissorsIcon,
  TrashIcon,
} from '@radix-ui/react-icons';
import { Button } from '../../ui/button';
import PDFViewer from '../PDFViewer';
import React, { useEffect, useRef, useState } from 'react';
import { usePDFSplitter } from './PDFSplitter';
import { Input } from '@/components/ui/input';
import Container from '@/components/ui/container';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
          pageIndices: [],
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
  const [activeFile, setActiveFile] = useState<File>(filesToSplit[0]);
  const [PDFViewerWidth, setPDFViewerWidth] = useState<number>(500);

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
    form.reset({
      fixedRanges: false,
      splitInterval: null,
      splitPages: [],
    });
  }, [activeFile]);

  useEffect(() => {
    if (!watchedFixedRanges) {
      form.setValue('splitInterval', null);
    } else {
      form.setValue('splitInterval', 1);
    }
  }, [watchedFixedRanges]);

  useEffect(() => {
    console.log('fields', fields);
  }, [fields]);

  const watchedSplitPages = form.watch('splitPages.1.pageIndices');

  useEffect(() => {
    console.log('watched', watchedSplitPages);
  }, [watchedSplitPages]);

  function addFile() {
    append({
      fileName: '',
      pageIndices: [],
    });
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
                      <FormLabel className="ml-2">File Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`Invoice_File_${index}`}
                          {...field}
                          {...form.register(field.name)}
                        />
                      </FormControl>
                      <div className="mt-2 flex items-center justify-between ">
                        <Button
                          variant={'ghost'}
                          size={'sm'}
                          disabled={watchedFixedRanges}
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
              onClick={() => console.log('uploading documents')}
            >
              Skip File
              <CaretRightIcon />
            </Button>
            <Button variant={'outline'}>
              <ResetIcon />
              Reset
            </Button>
          </div>
          <Button>
            <ScissorsIcon />
            Split PDFs
          </Button>
        </DialogFooter>
      </div>
      <div className="w-3/5 bg-wm-white-50">
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
            selectable
            onPageSelect={(page: Blob) => {
              console.log(page);
              form.setValue('splitPages.1.pageIndices', [page]);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFSplitterFileSplit;
