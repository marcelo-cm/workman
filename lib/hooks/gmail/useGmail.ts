import { SetStateAction } from 'react';

import { toast } from '@/components/ui/use-toast';

import { useAppContext } from '@/app/(dashboards)/context';
import { Label, Label_Basic } from '@/interfaces/gmail.interfaces';
import { createClient as createSupabaseClient } from '@/lib/utils/supabase/client';

export const useGmail = () => {
  const { user } = useAppContext();
  const supabase = createSupabaseClient();

  const getLabelByID = async (labelId: string) => {
    try {
      const userId = user?.id;

      const response = await fetch(
        `/api/v1/gmail/labels/${labelId}?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        toast({
          title: 'Error fetching label',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to fetch label');
      }

      const label = await response.json();

      return label;
    } catch (error) {
      throw new Error(`Failed to get label, ${error}`);
    }
  };

  const getLabels = async (
    setLabelsCallback?: React.Dispatch<SetStateAction<Label_Basic[]>>,
  ) => {
    try {
      const userId = user?.id;

      const response = await fetch(`/api/v1/gmail/labels?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        toast({
          title: 'Error fetching labels',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to fetch labels');
      }

      const labels = await response.json();

      if (setLabelsCallback) {
        setLabelsCallback(labels);
        toast({
          title: 'Labels fetched successfully',
        });
      }

      return labels;
    } catch (error) {
      throw new Error(`Failed to get labels, ${error}`);
    }
  };

  const createLabel = async (label: Omit<Label_Basic, 'id'>) => {
    try {
      const userId = user?.id;

      const response = await fetch(`/api/v1/gmail/labels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label,
          userId,
        }),
      });

      const newLabel = await response.json();

      if (newLabel.error || !response.ok) {
        toast({
          title: 'Error creating label',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to create label');
      }

      toast({
        title: 'Label created successfully',
        description: `Label ${label.name} created successfully`,
        variant: 'success',
      });

      return newLabel;
    } catch (error) {
      throw new Error(`Failed to create label, ${error}`);
    }
  };

  const getIgnoredLabelByCompanyID = async (id: string): Promise<Label> => {
    const { data, error } = await supabase
      .from('gmail_integration')
      .select('ignored_label')
      .eq('company', id)
      .maybeSingle();

    if (error || !data) {
      throw new Error('Failed to get ignored label');
    }

    return data.ignored_label;
  };

  const getProcessedLabelByCompanyID = async (id: string): Promise<Label> => {
    const { data, error } = await supabase
      .from('gmail_integration')
      .select('processed_label')
      .eq('company', id)
      .maybeSingle();

    if (error || !data) {
      throw new Error('Failed to get processed label');
    }

    return data.processed_label;
  };

  const addLabelsToEmailsById = async (
    emailIDs: string[],
    labelIDs: string[],
  ) => {
    try {
      const userId = user?.id;

      const response = await fetch(`/api/v1/gmail/messages/batchModify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          emailIds: emailIDs,
          addLabelIds: labelIDs,
          removeLabelIds: [],
        }),
      });

      if (!response.ok) {
        toast({
          title: 'Error adding labels to email',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to add labels to email');
      }

      toast({
        title: 'Labels added to email',
      });

      return response;
    } catch (error: unknown) {
      throw new Error(`Failed to add labels to email, ${error}`);
    }
  };

  const removeLabelsFromEmailById = async (
    emailId: string,
    labelIDs: string[],
  ) => {
    try {
      const userId = user?.id;

      const response = await fetch(`/api/v1/gmail/messages/batchModify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          emailIds: [emailId],
          addLabelIds: [],
          removeLabelIds: labelIDs,
        }),
      });

      if (!response.ok) {
        toast({
          title: 'Error removing labels from email',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to remove labels from email');
      }

      toast({
        title: 'Labels removed from email',
      });

      return response;
    } catch (error: unknown) {
      throw new Error(`Failed to remove labels from email, ${error}`);
    }
  };

  const modifyLabelsOnEmailById = async (
    emailIDs: string[],
    labelIDsAdding: string[],
    labelIDsRemoving: string[],
  ) => {
    const userId = user?.id;

    try {
      const response = await fetch(`/api/v1/gmail/messages/batchModify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          emailIds: emailIDs,
          addLabelIds: labelIDsAdding,
          removeLabelIds: labelIDsRemoving,
        }),
      });

      if (!response.ok) {
        toast({
          title: 'Error modifying labels on email',
          description: response.statusText,
          variant: 'destructive',
        });
        throw new Error('Failed to modify labels on email');
      }

      toast({
        title: 'Labels modified on email',
      });

      return response;
    } catch (error: unknown) {
      throw new Error(`Failed to modify labels on email, ${error}`);
    }
  };

  const addIgnoreLabelToEmails = async (emailIDs: string[]) => {
    const ignoreLabel = await getIgnoredLabelByCompanyID(user?.company.id);

    return addLabelsToEmailsById(emailIDs, [ignoreLabel.id]);
  };

  const addProcessedLabelToEmails = async (emailIDs: string[]) => {
    const processedLabel = await getProcessedLabelByCompanyID(user?.company.id);

    return addLabelsToEmailsById(emailIDs, [processedLabel.id]);
  };

  return {
    getLabels,
    getLabelByID,
    createLabel,
    getIgnoredLabelByCompanyID,
    getProcessedLabelByCompanyID,
    addLabelsToEmailsById,
    removeLabelsFromEmailById,
    modifyLabelsOnEmailById,
    addIgnoreLabelToEmails,
    addProcessedLabelToEmails,
  };
};
