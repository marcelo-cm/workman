import { z } from 'zod';

export const fileSpitSchema = z.object({
  fixedRanges: z.boolean(),
  splitInterval: z.number().nullable(),
  splitPages: z.array(
    z.object({
      fileName: z.string().trim().min(1, 'File name is required'),
      pageNumbers: z
        .array(z.number())
        .min(1, 'At least one page index is required'),
    }),
  ),
});

export const defaultFormValues = {
  fixedRanges: false,
  splitInterval: null,
  splitPages: [
    {
      fileName: '',
      pageNumbers: [],
    },
  ],
};
