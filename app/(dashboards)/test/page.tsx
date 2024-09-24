'use client';

import React from 'react';

import {
  MatchMode,
  PaginatedComboBox,
  Pagination,
} from '@/components/ui/paginated-combo-box';

const OPTIONS = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `Option ${i + 1}`,
}));

const page = () => {
  const fetchTypeaheadSearch = (query: string) => {
    // For the time being we can just filter the options array
    // and return the filtered results
    const newOptions = OPTIONS.filter((option) =>
      option.name.toLowerCase().includes(query.toLowerCase()),
    );
    return newOptions;
  };

  const fetchOptionById = (id: string) => {
    const option = OPTIONS.filter((option) => option.id === parseInt(id));
    return option[0];
  };

  const fetchNextPage = (page: number, query: string) => {
    console.log(
      `%c--- Fetching Page #${page}, with query ${query} ---`,
      'color: #bada55',
    );
    const indices = [
      (page - 1) * Pagination.DEFAULT_LIMIT,
      (page - 1) * Pagination.DEFAULT_LIMIT + Pagination.DEFAULT_LIMIT,
    ];
    const paginatedOptions = OPTIONS.sort((a, b) => a.id - b.id)
      .filter((op) => op.name.includes(query))
      .slice(indices[0], indices[1]);
    console.log(
      `%c--- Fetched ${paginatedOptions.map((op) => op.name)} ---`,
      'color: #bada55',
    );
    return {
      values: paginatedOptions,
      canFetchMore:
        indices[1] < OPTIONS.filter((op) => op.name.includes(query)).length,
    };
  };

  return (
    <div>
      <PaginatedComboBox
        getOptionLabel={(option) => option.name}
        initialValue={OPTIONS[0]}
        matchOnMount
        fetchOnMount={fetchOptionById}
        isPaginated
        fetchNextPage={fetchNextPage}
        limit={10}
        threshold={5}
      />
    </div>
  );
};

export default page;
