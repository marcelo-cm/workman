import { Message, Message_Partial } from '@/interfaces/gmail.interfaces';

export interface MessagesListResponse {
  messages: Message_Partial[];
  resultSizeEstimate: number;
  nextPageToken?: string;
}
