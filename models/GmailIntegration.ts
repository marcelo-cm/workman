import { UUID } from 'crypto';

import { Label, Label_Basic } from '@/interfaces/gmail.interfaces';
import { createClient } from '@/lib/utils/supabase/client';

export const WORKMAN_IGNORE_LABEL_NAME = 'Ignored (WM)';
export const WORKMAN_PROCESSED_LABEL_NAME = 'Processed (WM)';

export const WORKMAN_IGNORE_LABEL_CREATE: Omit<Label_Basic, 'id'> = {
  name: WORKMAN_IGNORE_LABEL_NAME,
  messageListVisibility: 'show',
  labelListVisibility: 'labelShow',
  type: 'user',
};

export const WORKMAN_PROCESSED_LABEL_CREATE: Omit<Label_Basic, 'id'> = {
  name: WORKMAN_PROCESSED_LABEL_NAME,
  messageListVisibility: 'show',
  labelListVisibility: 'labelShow',
  type: 'user',
};

export class GmailIntegration {
  private _id: UUID;
  private _email: string;
  private _ignored_label: Label;
  private _processed_label: Label;
  private _created_at: Date;

  constructor({
    id,
    email,
    ignored_label,
    processed_label,
    created_at,
  }: {
    id: UUID;
    email: string;
    ignored_label: Label;
    processed_label: Label;
    created_at: Date;
  }) {
    this._id = id;
    this._email = email;
    this._ignored_label = ignored_label;
    this._processed_label = processed_label;
    this._created_at = new Date(created_at);
  }

  get id(): UUID {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get ignoredLabel(): Label {
    return this._ignored_label;
  }

  get processedLabel(): Label {
    return this._processed_label;
  }

  get createdAt(): Date {
    return this._created_at;
  }

  get ignoredLabelID(): string {
    return this._ignored_label.id;
  }

  get processedLabelID(): string {
    return this._processed_label.id;
  }

  async update(
    data: Partial<{
      email: string;
      ignored_label: Label;
      processed_label: Label;
    }>,
  ): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
      .from('gmail_integrations')
      .update(data)
      .eq('id', this.id);

    if (error) {
      throw error;
    }

    if (data.email) {
      this._email = data.email;
    }

    if (data.ignored_label) {
      this._ignored_label = data.ignored_label;
    }

    if (data.processed_label) {
      this._processed_label = data.processed_label;
    }
  }
}
