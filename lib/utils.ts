import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useAppContext } from '@/app/(dashboards)/context';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const base64Decode = (base64String: string, filename: string) => {
  const buffer = Buffer.from(base64String, 'base64');
  return buffer;
};

export const sliceWithEllipsis = (
  str: string,
  length: number,
  suffix?: string,
) => {
  return str.length > length
    ? str.slice(0, length) + '...' + (suffix ? suffix : '')
    : str;
};

export function stringSimilarity(str1: string, str2: string): number {
  const distance = levenshtein(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / Math.max(str1.length, str2.length);
}

export function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) {
    return bn;
  }
  if (bn === 0) {
    return an;
  }
  const matrix = Array(an + 1);
  for (let i = 0; i <= an; i++) {
    matrix[i] = Array(bn + 1).fill(0);
    matrix[i][0] = i;
  }
  for (let j = 1; j <= bn; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1),
        );
      }
    }
  }
  return matrix[an][bn];
}

export function findMostSimilar<T>(
  target: string,
  options: T[],
  getOptionValue: (option: T) => string = (option) => String(option),
): T {
  return options.reduce((prev, curr) => {
    const prevSimilarity = stringSimilarity(getOptionValue(prev), target);
    const currSimilarity = stringSimilarity(getOptionValue(curr), target);
    return currSimilarity > prevSimilarity ? curr : prev;
  }, options[0]);
}

export function bytesToKB(bytes: number): string {
  return (bytes / 1024).toFixed(2);
}

export async function checkQuickBooksIntegration(companyId: string) {
  const response = await fetch(
    `/api/v1/quickbooks/healthcheck?companyId=${companyId}`,
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    throw new Error('Failed to check QuickBooks integration');
  }

  return response.json();
}

export function prettifyRole(role: string): string {
  let prettyRole = role.replace('_', ' ');
  prettyRole = prettyRole
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
  return prettyRole;
}
