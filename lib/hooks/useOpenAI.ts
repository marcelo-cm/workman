'use server';

import { zodResponseFormat } from 'openai/helpers/zod';

import { ReceiptDataSchema } from '@/interfaces/common.interfaces';

import { createClient as createOpenAIClient } from '../utils/openai/client';

const openai = createOpenAIClient();

const ReceiptDataFormat = zodResponseFormat(ReceiptDataSchema, 'ReceiptData');

export const scanReceiptByURL = async (fileUrl: string) => {
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-2024-08-06',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Scan this receipt and return a structured JSON of the provided schema. Leave project to be 'Unassigned', and given between 1-3 categories`,
          },
          {
            type: 'image_url',
            image_url: {
              url: fileUrl,
              detail: 'low',
            },
          },
        ],
      },
    ],
    response_format: ReceiptDataFormat,
  });
  return JSON.stringify(res);
};
