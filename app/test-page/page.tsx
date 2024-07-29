'use client';

import { useState } from 'react';

import { decode } from 'base64-arraybuffer';

import PDFViewer from '@/components/PDF/PDFViewer';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

import { useGmail } from '@/lib/hooks/gmail/useGmail';

import { createClient as createNangoClient } from '@/lib/utils/nango/client';
import { handleGoogleMailIntegration } from '@/lib/utils/nango/google';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';

import { Email, PDFData } from '../api/v1/gmail/messages/route';

const nango = createNangoClient();
const supabase = createSupabaseClient();

const TestPage = () => {
  const { getEmails } = useGmail();
  const [emails, setEmails] = useState<Email[]>([]);

  const handleGetEmails = async () => {
    await getEmails(setEmails);
  };

  const handleUpload = async (attachments: PDFData[]) => {
    try {
      for (const attachment of attachments) {
        const { data, error } = await supabase.storage
          .from('invoices')
          .upload('TEST_FILE', decode(attachment.base64), {
            contentType: 'application/pdf',
          });

        if (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
      }

      toast({
        title: 'Files uploaded',
        description: 'Files uploaded successfully',
      });
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <div className="flex h-dvh w-full flex-col  gap-4 overflow-scroll">
      <div className="flex gap-2">
        <Button onClick={() => handleGoogleMailIntegration()}>
          Nango Auth
        </Button>
        <Button onClick={() => handleGetEmails()}>Get Emails</Button>
      </div>
      <div className="flex h-fit w-full flex-col gap-2 border">
        {emails.map((email, index) => (
          <div
            key={index}
            className="flex h-fit w-full gap-2 overflow-x-scroll border p-4"
          >
            <div className="flex flex-col">
              <div>{email.subject}</div>
              <div>{email.date}</div>
              <div>{email.from}</div>
              <div>{email.attachments[0].filename}</div>
              <Button onClick={() => handleUpload(email.attachments)}>
                Upload all to Supabase
              </Button>
            </div>
            <div className="flex w-full flex-row gap-2">
              {email.attachments.map((attachment, index) => (
                <PDFViewer
                  file={attachment.bufferData as unknown as string}
                  key={index}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
