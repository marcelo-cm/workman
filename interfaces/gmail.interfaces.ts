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

export interface MessagePart {
  partId: string;
  mimeType: string;
  filename: string;
  headers: Header[];
  body: MessagePartBody;
  parts: MessagePart[];
}

export interface MessagePartBody {
  attachmentId: string;
  size: number;
  data?: string;
}

/**
 * Possible Names for Message type:
 * "Delivered-To",
 * "Received",
 * "X-Received",
 * "ARC-Seal",
 * "ARC-Message-Signature",
 * "ARC-Authentication-Results",
 * "Return-Path",
 * "Received-SPF",
 * "Authentication-Results",
 * "DKIM-Signature",
 * "X-Google-DKIM-Signature",
 * "X-Gm-Message-State",
 * "X-Google-Smtp-Source",
 * "MIME-Version",
 * "From",
 * "Date",
 * "Message-ID",
 * "Subject",
 * "To",
 * "Content-Type"
 */
export interface Header {
  name: string;
  value: string;
}

export interface Label_Basic {
  id: string;
  name: string;
  messageListVisibility: string;
  labelListVisibility: string;
  type: string;
}
