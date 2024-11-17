export interface Message {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  payload: MessagePart;
  sizeEstimate: number;
  raw: string;
  internalDate: string;
}

export interface Message_Partial extends Pick<Message, 'id' | 'threadId'> {}

export interface MessagePart {
  partId: string;
  mimeType: string;
  filename: string;
  headers: Header[];
  body: MessagePartBody;
  parts: MessagePart[];
}

/**
 * @property {string} [attachmentId] - The ID of the attachment. If this is not present, the data is in the `data` field.
 * @property {string} [data] - Optional base64-encoded string containing the data of the message part.
 */
export interface MessagePartBody {
  attachmentId?: string;
  size: number;
  data?: string;
}

/**
 * `Delivered-To`,
 * `Received`,
 * `X-Received`,
 * `ARC-Seal`,
 * `ARC-Message-Signature`,
 * `ARC-Authentication-Results`,
 * `Return-Path`,
 * `Received-SPF`,
 * `Authentication-Results`,
 * `DKIM-Signature`,
 * `X-Google-DKIM-Signature`,
 * `X-Gm-Message-State`,
 * `X-Google-Smtp-Source`,
 * `MIME-Version`,
 * `From`,
 * `Date`,
 * `Message-ID`,
 * `Subject`,
 * `To`,
 * `Content-Type`
 */
export enum MessageHeaderName {
  DeliveredTo = 'Delivered-To',
  Received = 'Received',
  XReceived = 'X-Received',
  ARCSeal = 'ARC-Seal',
  ARCMessageSignature = 'ARC-Message-Signature',
  ARCAuthenticationResults = 'ARC-Authentication-Results',
  ReturnPath = 'Return-Path',
  ReceivedSPF = 'Received-SPF',
  AuthenticationResults = 'Authentication-Results',
  DKIMSignature = 'DKIM-Signature',
  XGoogleDKIMSignature = 'X-Google-DKIM-Signature',
  XGmMessageState = 'X-Gm-Message-State',
  XGoogleSmtpSource = 'X-Google-Smtp-Source',
  MIMEVersion = 'MIME-Version',
  From = 'From',
  Date = 'Date',
  MessageID = 'Message-ID',
  Subject = 'Subject',
  To = 'To',
  ContentType = 'Content-Type',
}
export interface Header {
  name: MessageHeaderName;
  value: string;
}

export interface Label_Basic {
  id: string;
  name: string;
  messageListVisibility: string;
  labelListVisibility: string;
  type: string;
}

export interface Label {
  id: string;
  name: string;
  type: string;
  messagesTotal: number;
  messagesUnread: number;
  threadsTotal: number;
  threadsUnread: number;
}
