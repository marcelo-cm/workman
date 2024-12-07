import { NextRequest, NextResponse } from 'next/server';
import { zodResponseFormat } from 'openai/helpers/zod.mjs';
import { scanReceiptByURL } from '@/lib/hooks/useOpenAI';
import { internalServerError, ok } from '@/app/api/utils';
import { ReceiptDataSchema } from '@/interfaces/common.interfaces';
import { createClient as createOpenAIClient } from '@/lib/utils/openai/client';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const supabase = createSupabaseClient();
  const openai = createOpenAIClient();
  const data = await req.json();
  const parsed = extractAfterHeaders(data.body.body_html);

  try {
    const response = await supabase
      .from('temp')
      .insert({ payload: parsed })
      .select('*');

    const fileURL = data.file;
    const ReceiptDataFormat = zodResponseFormat(
      ReceiptDataSchema,
      'ReceiptData',
    );

    const scanResponse = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Scan this receipt and return a structured JSON of the provided schema. Total Net includes the total amount and total tax and fees with no currency symbol included. customerName should always be 'Unassigned'. Description should be concise. Date is in YYYY-MM-DD format.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: fileURL,
                detail: 'low',
              },
            },
          ],
        },
      ],
      response_format: ReceiptDataFormat,
    });

    const uploadScan = await supabase
      .from('temp')
      .insert({ data_scan: scanResponse })
      .select('*');

    return ok({ payload: response, scan: uploadScan });
  } catch (error) {
    return internalServerError(`${error}`);
  }


  
  function extractAfterHeaders(htmlContent: string) {
    // First normalize line breaks to make it easier to work with
    const normalizedHtml = htmlContent.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    
    // Find the last occurrence of common header patterns
    const headerPatterns = [
      /[Ff]rom:\s*.*?\n/,
      /[Ss]ent:\s*.*?\n/,
      /[Tt]o:\s*.*?\n/,
      /[Ss]ubject:\s*.*?\n/,
      /[Cc]c:\s*.*?\n/,
      /[Bb]cc:\s*.*?\n/
    ];
  
    let lastHeaderIndex = -1;
  
    // Find all occurrences of headers and get the last one
    headerPatterns.forEach(pattern => {
      let match;
      let lastIndex = 0;
      
      // Use a regex with the 'g' flag to find all matches
      const globalPattern = new RegExp(pattern.source, 'g');
      while ((match = globalPattern.exec(normalizedHtml)) !== null) {
        lastIndex = match.index + match[0].length;
        if (lastIndex > lastHeaderIndex) {
          lastHeaderIndex = lastIndex;
        }
      }
    });
  
    // If we found headers, take everything after the last one
    if (lastHeaderIndex !== -1) {
      // Find the first newline after the last header
      const contentStart = normalizedHtml.indexOf('\n', lastHeaderIndex);
      if (contentStart !== -1) {
        // Return everything after that newline, trimmed
        return normalizedHtml.slice(contentStart + 1).trim();
      }
    }
  
    // If no headers found, return the original content
    return normalizedHtml.trim();
  }
}
