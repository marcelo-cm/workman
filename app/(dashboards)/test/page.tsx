'use client';

import React from 'react';

import {
  PaginatedComboBox,
  Pagination,
} from '@/components/ui/paginated-combo-box';

const OPTIONS = Array.from({ length: 200 }, (_, i) => ({
  id: i + 1,
  name: `Option ${i + 1}`,
}));

const page = () => {
  const fetchOptionById = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const option = OPTIONS.filter((option) => option.id === parseInt(id));
    return option[0];
  };

  const fetchNextPage = async (page: number, query: string) => {
    console.log(
      `%c--- Fetching Page #${page}, with query ${query} ---`,
      'color: #bada55',
    );

    await new Promise((resolve) => setTimeout(resolve, 500));

    const indices = [
      (page - 1) * Pagination.DEFAULT_LIMIT,
      (page - 1) * Pagination.DEFAULT_LIMIT + Pagination.DEFAULT_LIMIT,
    ];
    const paginatedOptions = OPTIONS.sort((a, b) => a.id - b.id)
      .filter((op) => op.name.toLowerCase().includes(query.toLocaleLowerCase()))
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
    <div className="flex h-full w-full flex-row items-center justify-center">
      <PaginatedComboBox
        getOptionLabel={(option) => option.name}
        initialValue={OPTIONS[99]}
        matchOnMount
        fetchOnMount={fetchOptionById}
        fetchNextPage={fetchNextPage}
        limit={10}
        threshold={5}
      />
    </div>
  );
};

export default page;
