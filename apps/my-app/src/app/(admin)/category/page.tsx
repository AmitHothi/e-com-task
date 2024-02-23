'use client';

import React, { MouseEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { CiImport } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa6';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { Table } from '@/components';
import Popover from '@/components/Popover';
import REMOVE_CATEGORY from '@/graphql/schema/mutations/removeCategory.graphql';
import CATEGORIES from '@/graphql/schema/queries/categories.graphql';
import { BreadcrumbItem, ICategory, ISort, ITableColumn } from '@/types';
import Breadcrumbs from '../../../components/Breadcrumbs';

interface IFilter {
  page: number;
  limit: number;
  searchField?: string[];
  searchText: string;
  sortDirection: 'ASC' | 'DESC';
  sortField: string;
}

const Category = () => {
  const breadcrumbs: BreadcrumbItem[] = [{ label: '/category', link: '/category' }];
  const router = useRouter();

  const [selectedPopoverId, setSelectedPopoverId] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [filter, setFilter] = useState<IFilter>({
    page: 1,
    limit: 10,
    searchField: ['categoryName'],
    searchText: '',
    sortDirection: 'DESC',
    sortField: 'categoryName',
  });

  const {
    data: categoryData,
    loading: categoryLoading,
    refetch,
  } = useQuery(CATEGORIES, {
    fetchPolicy: 'network-only',
    variables: {
      paginationInput: {
        page: filter.page,
        limit: filter.limit,
        search: filter.searchText,
        sortField: filter.sortField,
        sortOrder: filter.sortDirection,
        minPrice: 0,
        maxPrice: 5000,
      },
      searchFields: filter.searchField,
    },
  });

  const [RemoveCategory, { data, loading, error }] = useMutation(REMOVE_CATEGORY, {
    fetchPolicy: 'network-only',
  });

  // function for createCategory
  const handleCreateCategory = () => {
    router.push('/category/add');
  };

  // function for category edit/delete popover
  const handleClick = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPopoverId(id);
  };

  // function for close popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // function for edit category
  const handleEditCategory = (categoryId: string) => {
    router.push(`category/update/${categoryId}`);
  };

  // function for remove category
  const handleDeleteCategory = (categoryId: string) => {
    RemoveCategory({
      variables: { id: categoryId },
    })
      .then((res) => {
        refetch();
      })
      .catch((err) => console.log('removeCategory-error', err));
  };

  const columns: ITableColumn[] = [
    {
      key: 'categoryName',
      label: 'CategoryName',
      isSorting: true,
      ...(filter.sortField === 'categoryName' && {
        sortType: filter.sortDirection,
      }),
      render: (key, value) => {
        const val = value as ICategory;
        return (
          <div key={val._id} className="flex gap-4 items-center">
            <Image
              width={30}
              height={100}
              className=" w-12  mt-1  rounded-md border-1"
              src={`${process.env.BASE_URL}/images/${val.icon}`}
              alt="user"
            />
            <div>{val.categoryName}</div>
          </div>
        );
      },
      columnClass: 'pl-2 text-center',
    },
    {
      key: 'createdAt',
      label: 'CreatedAt',
      render: (key, value) => {
        const val = value as ICategory;
        const createdAtDate = new Date(val.createdAt);
        const formattedCreatedAt = createdAtDate.toLocaleDateString('en-GB');
        return <div>{formattedCreatedAt}</div>;
      },
      isSorting: true,
      ...(filter.sortField === 'createdAt' && {
        sortType: filter.sortDirection,
      }),
      columnClass: 'pl-8 md:pl-0',
    },
    {
      key: 'updatedAt',
      label: 'UpdatedAt',
      render: (key, value) => {
        const val = value as ICategory;
        const updatedAtDate = new Date(val.updatedAt);
        const formattedUpdatedAt = updatedAtDate.toLocaleDateString('en-GB');
        return <div>{formattedUpdatedAt}</div>;
      },
      isSorting: true,
      ...(filter.sortField === 'updatedAt' && {
        sortType: filter.sortDirection,
      }),
    },
    {
      key: 'edit',
      label: '',
      render: (key, val) => (
        <div key={val._id}>
          <button key={val._id} type="button" onClick={(e) => handleClick(e, val._id)}>
            <HiOutlineDotsVertical />
            <span className="sr-only">Edit</span>
          </button>
          <Popover
            key={val._id}
            id={val._id}
            selectedId={selectedPopoverId}
            className=" mr-auto"
            anchorEl={anchorEl}
            handleOnClose={handleClose}
            adjustHorizontalPosition={10}>
            <ul className="bg-white rounded-md  text-sm flex flex-col ">
              <li className="w-full my-1 p-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-zinc-200 group">
                <button
                  type="button"
                  className="w-full"
                  onClick={() => handleEditCategory(val._id)}>
                  Edit
                </button>
              </li>
              <hr />
              <li className="w-full my-1 p-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-zinc-200 group">
                <button
                  type="button"
                  className="w-full"
                  onClick={() => handleDeleteCategory(val._id)}>
                  Delete
                </button>
              </li>
            </ul>
          </Popover>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-sm text-gray-500">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <div className="flex justify-between mt-0">
            <h1 className="font-bold text-2xl "> Category</h1>
            <div className="flex gap-4">
              <button
                type="button"
                className=" p-1.5 text-gray-900 border-0 rounded-md bg-gray-300 flex gap-1">
                <CiImport className="text-lg my-0.5" />
                import
              </button>
              <button
                type="submit"
                onClick={handleCreateCategory}
                className="p-1.5 text-gray-900 border-0 rounded-md bg-yellow-500 flex gap-1">
                <FaPlus className="text-lg my-0.5" />
                Create Categopry
              </button>
            </div>
          </div>
        </div>

        <div>
          <Table
            loading={categoryLoading}
            columns={columns}
            count={categoryData?.categories?.totalCount || 0}
            data={categoryData?.categories?.categories || []}
            apiPaginationEnable
            activeSortField={filter.sortField}
            page={filter.page}
            pageSize={filter.limit}
            rowsPerPageOption={[1, 2, 3, 5, 10, 15, 25]}
            isPagination
            handlePageChange={(newPage: number) => {
              setFilter({ ...filter, page: newPage });
            }}
            handleRowsPerPageChange={(e) => {
              setFilter({ ...filter, page: 1, limit: e });
            }}
            onHandleSearch={debounce((e) => {
              setFilter({ ...filter, page: 1, searchText: e.target.value });
            }, 500)}
            onSortClick={(key, sortType) => {
              setFilter({
                ...filter,
                page: 1,
                sortField: key as string,
                sortDirection: sortType,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;
