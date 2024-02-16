'use client';

import React, { MouseEvent, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { CiImport } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa6';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { Table } from '@/components';
import Popover from '@/components/Popover';
import REMOVE_CATEGORY from '@/graphql/schema/mutations/removeCategory.graphql';
import CATEGORIES from '@/graphql/schema/queries/categories.graphql';
import { BreadcrumbItem, ICategory, ISort, ITableColumn } from '@/types';
import Breadcrumbs from '../../../components/Breadcrumbs';

const Category = () => {
  const [sort, setSort] = useState<ISort>({ sortField: 'name', sortDirection: 'ASC' });
  const [selectedPopoverId, setSelectedPopoverId] = useState('');
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const breadcrumbs: BreadcrumbItem[] = [{ label: '/category', link: '/category' }];

  const {
    data: categoryData,
    loading: categoryLoading,
    refetch,
  } = useQuery(CATEGORIES, {
    fetchPolicy: 'network-only',
  });
  console.log('data', categoryData?.categories);

  const [RemoveCategory, { data, loading, error }] = useMutation(REMOVE_CATEGORY, {
    fetchPolicy: 'network-only',
  });

  const handleSearchCategory = (query: string) => {
    setSearchQuery(query);
  };

  const filteredCategorys = categoryData?.categories.filter((category: ICategory) =>
    category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  // const filteredCategorys = categoryData?.categories.filter(
  //   (category: ICategory) =>
  //     category.categoryName.toLowerCase().includes(searchQuery.toLowerCase()),
  //   // You can add more fields for searching if needed
  // );
  const handleAddCategory = () => {
    router.push('/category/add');
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPopoverId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditCategory = (categoryId: string) => {
    router.push(`category/update/${categoryId}`);
  };

  const handleDeleteCategory = (categoryId: string) => {
    RemoveCategory({
      variables: { id: categoryId },
    })
      .then((res) => {
        console.log('remove', res.data);
        refetch();
      })
      .catch((err) => console.log(err));
  };

  const columns: ITableColumn[] = [
    {
      key: 'categoryName',
      label: 'CategoryName',
      isSorting: true,
      sortType: sort.sortDirection,
      render: (key, value) => {
        const val = value as ICategory;
        return (
          <div className="flex gap-4 items-center">
            <Image
              width={30}
              height={30}
              className=" w-12 h-9 mt-1 lg:w-12 lg:h-9 rounded-md border-1"
              src={`${process.env.BASE_URL}/images/${val.icon}`}
              alt="user"
            />
            <div>{val.categoryName}</div>
          </div>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'CreatedAt',
      isSorting: true,
      sortType: sort.sortDirection,
      columnClass: 'text-center',
      headerClass: 'pl-8 lg:pl-48',
    },
    {
      key: 'updatedAt',
      label: 'UpdatedAt',
      isSorting: true,
      sortType: sort.sortDirection,
      // columnClass: 'text-center',
      // headClass: 'text-center',
    },
    {
      key: 'edit',
      label: '',
      render: (key, val) => {
        console.log('id', val._id);
        return (
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
        );
      },
    },
  ];

  return (
    <div>
      <div className="text-sm text-gray-500">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <div className="flex justify-between mt-0">
        <h1 className="font-bold text-2xl "> Category</h1>
        <div className="grid grid-cols-[100px,auto] ">
          <button
            type="button"
            // onClick={handleClose}
            className=" py-1 px-2 w-fit text-gray-900 border-0 rounded-md bg-gray-300 flex gap-1">
            <CiImport className="text-lg my-0.5" />
            import
          </button>
          <button
            type="submit"
            onClick={handleAddCategory}
            className="py-1.5 px-2 text-gray-900 border-0  rounded-md bg-yellow-500 flex gap-1">
            <FaPlus className="text-lg my-0.5" />
            Create Categopry
          </button>
        </div>
      </div>
      <div>
        {' '}
        <div className="mt-4">
          <div>
            <Table
              headClass="text-right"
              handleSearch={handleSearchCategory}
              columns={columns}
              data={filteredCategorys || []}
              rowsPerPageOption={[5, 10, 15, 25]}
              isPagination
              activeSortField={sort.sortField}
              onSortClick={(key, sortType) => {
                setSort({ sortField: key as string, sortDirection: sortType });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;
