import { Message } from '@/interfaces/gmail.interfaces';

export interface MessagesListResponse {
  messages: Message[];
  resultSizeEstimate: number;
  nextPageToken?: string;
}
