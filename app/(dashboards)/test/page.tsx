'use client';

import React from 'react';

import {
  MatchMode,
  PaginatedComboBox,
} from '@/components/ui/paginated-combo-box';

const OPTIONS = [
  { id: 1, name: 'Option 1' },
  { id: 2, name: 'Option 2' },
  { id: 3, name: 'Option 3' },
  { id: 4, name: 'Option 4' },
  { id: 5, name: 'Option 5' },
];
const page = () => {
  const fetchTypeaheadSearch = (query: string) => {
    // For the time being we can just filter the options array
    // and return the filtered results
    const newOptions = OPTIONS.filter((option) =>
      option.name.toLowerCase().includes(query.toLowerCase()),
    );
    console.log('sent', newOptions);
    return newOptions;
  };

  const fetchOptionById = (id: string) => {
    const option = OPTIONS.filter((option) => option.id === parseInt(id));
    console.log('sent', option[0]);
    return option[0];
  };
  return (
    <div>
      <PaginatedComboBox
        getOptionLabel={(option) => option.name}
        initialValue={OPTIONS[0]}
        matchOnMount
        fetchOnMount={fetchOptionById}
        isPaginated
        fetchNextPage={(page: number) => {
          return OPTIONS;
        }}
        fetchTypeaheadSearch={fetchTypeaheadSearch}
        limit={10}
        threshold={5}
      />
    </div>
  );
};

export default page;
