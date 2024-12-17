import { z } from 'zod';

import Gmail from '@/components/molecules/Gmail';
import QuickBooks from '@/components/molecules/QuickBooks';

export const LANDING_PAGE_FEATURES: {
  title: string;
  description?: string;
}[] = [
  {
    title: 'Invoice Processing',
    description:
      'We use cutting edge computer vision to reduce manual data entry',
  },
  {
    title: 'Approval Workflow',
    description:
      'Involve your team and make sure the right people have approved the information before sending it off',
  },
  {
    title: 'Automatic Categorization',
    description:
      'We automatically categorize each line item according to your past filing habits',
  },
  {
    title: 'Flexible Pricing',
  },
  {
    title: '24/7 Support from Founders',
  },
];

export const INTEGRATION_DETAILS: {
  title: string;
  description: string;
  Icon: React.FC;
}[] = [
  {
    title: 'Integrated with QuickBooks',
    description:
      'In one-click, we activate a 2-way sync with QuickBooks, ensuring your information is always accurate',
    Icon: QuickBooks,
  },
  {
    title: 'Integrated with Gmail',
    description:
      'We can provide a dedicate forwarding email to make invoice uploading a breeze',
    Icon: Gmail,
  },
];

export const LANDING_BENEFITS = [
  {
    title: 'Processed in 20s',
    description: '6x faster than a manual process',
  },
  {
    title: '99% Accuracy',
    description: 'Reduce your human error',
  },
  {
    title: 'Automatic Categorization',
    description: 'We remember your filing habits',
  },
  {
    title: 'Approval Workflow',
    description: 'Involve your team, have the last say',
  },
];

export const CREATE_COMPANY_SCHEMA = z.object({
  name: z.string().min(3),
});

export const CREATE_USER_SCHEMA = z.object({
  name: z.string().min(3),
  password: z.string().min(8),
  email: z.string().email().min(1),
  roles: z.array(z.string()).min(1),
});
