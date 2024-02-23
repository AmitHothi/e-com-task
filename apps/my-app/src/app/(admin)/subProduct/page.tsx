'use client';

import { MouseEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { CiImport } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa6';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import Breadcrumbs from '@/components/Breadcrumbs';
import Filter from '@/components/Filter';
import Popover from '@/components/Popover';
import Table from '@/components/Table';
import DELETE_SUBPRODUCT from '@/graphql/schema/mutations/deleteSubProduct.graphql';
import GET_ALL_SUBPRODUCTS from '@/graphql/schema/queries/allSubProduct.graphql';
import { BreadcrumbItem, IMasterProduct, ISubProduct, ITableColumn } from '@/types';

interface IFilter {
  page: number;
  limit: number;
  searchField?: string[];
  searchText: string;
  sortDirection: 'ASC' | 'DESC';
  sortField: string;
}

const Product = () => {
  const router = useRouter();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedPopoverId, setSelectedPopoverId] = useState('');
  const [isCheck, setIsCheck] = useState<string[]>([]);
  const [filter, setFilter] = useState<IFilter>({
    page: 1,
    limit: 10,
    searchField: ['subProductName'],
    searchText: '',
    sortDirection: 'DESC',
    sortField: 'subProductName',
  });

  const [DeleteSubProductById] = useMutation(DELETE_SUBPRODUCT, {
    fetchPolicy: 'network-only',
  });

  const {
    data: allSubproductData,
    loading,
    refetch,
  } = useQuery(GET_ALL_SUBPRODUCTS, {
    fetchPolicy: 'network-only',
    variables: {
      paginationInput: {
        page: filter.page,
        limit: filter.limit,
        search: filter.searchText,
        sortField: filter.sortField,
        sortOrder: filter.sortDirection,
        minPrice: 0,
        maxPrice: 50000,
      },
      searchFields: filter.searchField,
    },
  });
  console.log('subProductslist', allSubproductData?.getAllSubProducts?.subProducts);
  console.log('subProducts-totalcount', allSubproductData?.getAllSubProducts?.totalcount);

  const handleEditSubproduct = (subProductId: string) => {
    router.push(`/subproduct/update/${subProductId}`);
  };

  const handleDeleteSubproduct = (subProductId: string) => {
    DeleteSubProductById({
      variables: {
        id: subProductId,
      },
    })
      .then((res) => {
        console.log('del', res.data);
        refetch();
      })
      .catch((err) => console.log(err));
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPopoverId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectAll = (checked: boolean, checkedData: string[]) => {
    if (!checked) {
      setIsCheck(checkedData);
    } else {
      setIsCheck(checkedData);
    }
  };
  const breadcrumbs: BreadcrumbItem[] = [{ label: 'Dashboard/Product', link: '/product/add' }];

  const handleAddProduct = () => {
    router.push('/product/add');
  };

  const columns: ITableColumn[] = [
    {
      key: 'subProductName',
      label: 'SubProduct Name',
      render: (key, value) => {
        const val = value as ISubProduct;
        return (
          <div className="flex gap-4">
            <Link href={`/subProduct/${val._id}`}>
              <img
                src={`${process.env.BASE_URL}/images/${val?.customImages[0]?.img}`}
                alt="sunbproductImage"
                width={30}
                className="rounded-md w-10 h-10"
              />
            </Link>
            <div>
              <p>{val.subProductName}</p>
              <p className="text-gray-500 text-xs">
                Id:{val._id} | SKU:{val.sku}
              </p>
            </div>
          </div>
        );
      },
      isSorting: true,
      ...(filter.sortField === 'subProductName' && {
        sortType: filter.sortDirection,
      }),
    },
    {
      key: 'prices',
      label: 'Price',
      render: (key, value) => {
        const val = value as ISubProduct;
        return <div>{val?.prices}</div>;
      },
      isSorting: true,
      ...(filter.sortField === 'prices' && {
        sortType: filter.sortDirection,
      }),
    },
    {
      key: 'createdAt',
      label: 'CreatedAt',
      render: (key, value) => {
        const val = value as ISubProduct;
        const createdAtDate = new Date(val.createdAt);
        const formattedCreatedAt = createdAtDate.toLocaleDateString('en-GB');
        return <div>{formattedCreatedAt}</div>;
      },
      isSorting: true,
      ...(filter.sortField === 'createdAt' && {
        sortType: filter.sortDirection,
      }),
    },
    {
      key: 'updatedAt',
      label: 'UpdatedAt',
      render: (key, value) => {
        const val = value as ISubProduct;
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
      render: (key, val) => {
        console.log(val._id);
        return (
          <div>
            <button type="button" onClick={(e) => handleClick(e, val._id)}>
              <HiOutlineDotsVertical />
              <span className="sr-only">Edit</span>
            </button>
            <Popover
              className="static mr-auto overflow-x-hidden"
              id={val._id}
              selectedId={selectedPopoverId}
              anchorEl={anchorEl}
              handleOnClose={handleClose}
              adjustHorizontalPosition={10}>
              <ul className="bg-white rounded-md  text-sm flex flex-col ">
                <li className="w-full my-1 p-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-zinc-200 group">
                  <button
                    type="button"
                    className="w-full"
                    onClick={() => handleEditSubproduct(val._id)}>
                    Edit
                  </button>
                </li>
                <hr />
                <li className="w-full my-1 p-2 text-gray-900 hover:bg-gray-100 dark:hover:bg-zinc-200 group">
                  <button
                    type="button"
                    className="w-full"
                    onClick={() => handleDeleteSubproduct(val._id)}>
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
      <div className="flex flex-col gap-4">
        <div>
          <div className="text-sm text-gray-500">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          <div className="flex justify-between">
            <h1 className="font-bold text-2xl "> Products</h1>
            <div className="flex gap-4">
              <button
                type="button"
                // onClick={handleClose}
                className="p-1.5 text-gray-900 border-0 rounded-md bg-gray-300 flex gap-1">
                <CiImport className="text-lg my-0.5" />
                import
              </button>
              <button
                type="submit"
                onClick={handleAddProduct}
                className="p-1.5 text-gray-900 border-0  rounded-md bg-yellow-500 flex gap-1">
                <FaPlus className="text-lg my-0.5" />
                Add Product
              </button>
            </div>
          </div>
        </div>
        <div>
          {' '}
          <div className="grid grid-cols-[120px,auto] md:grid-cols-[220px,auto] gap-2">
            <div className="col-span-1">
              <Filter />
            </div>
            <div className="col-span-1">
              <Table
                loading={loading}
                columns={columns}
                data={allSubproductData?.getAllSubProducts?.subProducts || []}
                count={allSubproductData?.getAllSubProducts?.totalcount || 0}
                apiPaginationEnable
                page={filter.page}
                pageSize={filter.limit}
                rowsPerPageOption={[1, 2, 3, 5, 10, 15, 25]}
                isPagination
                handlePageChange={(newPage: number) => {
                  setFilter({ ...filter, page: newPage });
                }}
                handleRowsPerPageChange={(e) => {
                  setFilter({ ...filter, page: 1, limit: parseInt(e, 10) });
                }}
                onHandleSearch={debounce((e) => {
                  setFilter({ ...filter, page: 1, searchText: e.target.value });
                }, 500)}
                checkedRow={isCheck}
                handleCheckBox={(checked, checkedData) => handleSelectAll(checked, checkedData)}
                selectionField="_id"
                isCheckBox
                activeSortField={filter.sortField}
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
      </div>
    </div>
  );
};
export default Product;
