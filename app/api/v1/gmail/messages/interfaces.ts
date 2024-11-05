import { Message_Partial } from '@/interfaces/gmail.interfaces';

export interface MessagesListResponse {
  messages: Message_Partial[];
  resultSizeEstimate: number;
  nextPageToken?: string;
}

export interface BatchModifyPostBody {
  ids: string[];
  addLabelIds?: string[];
  removeLabelIds?: string[];
}

export type Email = {
  id: string;
  subject: string;
  date: string;
  from: string;
  attachments: ExtractedPDFData[];
  labelIds: string[];
};

export interface ExtractedPDFData {
  base64: string;
  fileName: string;
  size: number;
}
