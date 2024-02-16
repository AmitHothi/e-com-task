/* eslint-disable react/void-dom-elements-no-children */

'use client';

import { ReactNode, HTMLAttributes, forwardRef, useState, ReactElement, useEffect } from 'react';
import { CiSearch } from 'react-icons/ci';
import { ICategory, IMasterProduct, ITableColumn, ITableData } from '@/types';
import { cn } from '@/utils';
import Checkbox from '../Checkbox';
import Select from '../Select';
import SvgIcon from '../SvgIcon';

export interface ITableProps extends HTMLAttributes<HTMLTableElement> {
  /**
   * data
   */
  loading?: boolean;

  /**
   * data
   */
  data?: ITableData[] | ICategory[] | IMasterProduct[];

  /**
   * column name
   */
  columns?: ITableColumn[];

  /**
   *  pagination Count (Data length)
   */
  count?: number;

  /**
   * Pagination
   */
  isPagination?: boolean;

  /**
   * Pagination
   */
  page?: number;

  /**
   * Page Change handling
   */
  handlePageChange?: (newPage: number) => void;

  /**
   * icons class
   */
  iconClass?: string;

  /**
   * Label for rows per page
   */
  labelRowsPerPage?: string;

  /**
   * record in per page option
   */
  rowsPerPageOption?: number[];

  /**
   * record in per page
   */
  pageSize?: number;

  /**
   * Rows per Page handle
   */
  handleRowsPerPageChange?: (pageSize: number) => void;

  /**
   * Checkbox for select data
   */
  isCheckBox?: boolean;

  /**
   * selection field for checkbox
   */
  selectionField?: keyof ITableData | ICategory | IMasterProduct;

  /**
   * checked Rows
   */
  checkedRow?: string[];

  /**
   * handle single checkbox
   */
  handleCheckBox?: (checked: boolean, selectedData: string[]) => void;

  /**
   * handle search fuction
   */
  handleSearch?: (query: string) => void;
  /**
   * classes for styling
   */
  className?: string;

  /**
   * table above children
   */
  aboveTableChildren?: ReactNode;

  /**
   * For API handling pagination
   */
  apiPaginationEnable?: boolean;

  /**
   * container class
   */
  containerClass?: string;

  /**
   * container class
   */
  headClass?: string;

  /**
   * active SortField
   */
  activeSortField?: string;

  /**
   * on sort click
   */
  onSortClick?: (columnName: string | ReactElement | ReactNode, sortType: 'ASC' | 'DESC') => void;
}

const Table = forwardRef<HTMLTableElement, ITableProps>(
  (
    {
      loading = false,
      data = [],
      columns = [],
      count = data.length,
      isPagination = false,
      page = 1,
      handlePageChange = () => null,
      labelRowsPerPage = 'Rows per page',
      pageSize = 10,
      rowsPerPageOption = [10, 20, 30, 40],
      handleRowsPerPageChange = () => null,
      isCheckBox = false,
      selectionField,
      checkedRow = [],
      handleCheckBox = () => null,
      handleSearch,
      className = '',
      aboveTableChildren,
      apiPaginationEnable = false,
      containerClass,
      headClass,
      activeSortField,
      onSortClick = () => null,
      ...restProps
    },
    ref,
  ): JSX.Element => {
    const [tableData, setTableData] = useState(data);
    const [sortOrder, setSortOrder] = useState('ASC');
    const [pageNo, setPageNo] = useState(page);
    const [rowsPerPage, setRowsPerPage] = useState(pageSize);
    const lastIndex = (apiPaginationEnable ? page : pageNo) * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;
    const tableRecords = tableData.slice(firstIndex, lastIndex);

    useEffect(() => {
      if (data) {
        setTableData(data);
      }
    }, [data]);

    const prePage = () => {
      if (pageNo !== 1) {
        setPageNo(pageNo - 1);
        handlePageChange(pageNo - 1);
      }
    };

    const nextPage = () => {
      if (lastIndex < count) {
        setPageNo(pageNo + 1);
        handlePageChange(pageNo + 1);
      }
    };

    // Single checkbox handler
    const handleSingleCheckbox = (
      checked: boolean,
      tableValue: ITableData | ICategory | IMasterProduct,
    ) => {
      if (checked) {
        const selectedRow = [
          ...checkedRow,
          tableValue[`${selectionField as keyof Partial<ITableData | ICategory | IMasterProduct>}`],
        ];
        handleCheckBox(checked, selectedRow as string[]);
      } else {
        const selectedRow = checkedRow.filter(
          (prevSelectedRow) =>
            prevSelectedRow !==
            tableValue[
              `${selectionField as keyof Partial<ITableData | ICategory | IMasterProduct>}`
            ],
        );
        handleCheckBox(checked, selectedRow as string[]);
      }
    };

    // All checkbox selection handler
    const handleAllCheckBox = (checked: boolean) => {
      if (selectionField) {
        if (checked) {
          const selectionData = ((!apiPaginationEnable && tableRecords) || data).map(
            (val) => val[`${selectionField as keyof Partial<ITableData>}`],
          );
          handleCheckBox(checked, selectionData as string[]);
        } else {
          handleCheckBox(checked, []);
        }
      }
    };

    const handleRowsPerPage = (val: number) => {
      handleRowsPerPageChange(val);
      setPageNo(1);
      setRowsPerPage(val);
    };

    const sorting = (
      col: keyof ITableData | ICategory | IMasterProduct,
      sortType: 'ASC' | 'DESC',
    ) => {
      if (!apiPaginationEnable) {
        if (sortOrder === 'ASC') {
          const sorted = [...data].sort((a, b) => {
            if (typeof a[col] === 'number') return a[`${col}`] > b[col] ? 1 : -1;
            return (a[`${col}`] as string).toLowerCase() > (b[col] as string).toLowerCase()
              ? 1
              : -1;
          });
          setTableData(sorted);
          setSortOrder('DSC');
        }
        if (sortOrder === 'DSC') {
          const sorted = [...data].sort((a, b) => {
            if (typeof a[col] === 'number') return a[`${col}`] < b[col] ? 1 : -1;
            return (a[`${col}`] as string).toLowerCase() < (b[col] as string).toLowerCase()
              ? 1
              : -1;
          });
          setTableData(sorted);
          setSortOrder('ASC');
        }
      }
      onSortClick(col, sortType);
    };

    console.log(data, tableData);
    return (
      <div>
        <div className={cn('px-0', containerClass)}>
          <div>{aboveTableChildren}</div>
          <div className=" flow-root ">
            <div className="overflow-x-auto">
              <div className="inline-block min-w-full h-full py-0 rounded-t-lg bg-white shadow-x-xl border-0 align-middle ">
                <div className="w-full flex p-4  border-0 rounded-t-lg relative">
                  <div>
                    <CiSearch className="text-gray-500 mx-2 my-1 w-6 h-6 absolute" />
                  </div>
                  <input
                    type="text"
                    id="search-navbar"
                    onChange={(e) => handleSearch?.(e.target.value)}
                    className="  w-full h-8 p-2  ps-10 text-s text-gray-900 border border-gray-300 rounded-full bg-white  dark:placeholder-gray-400 dark:focus:border-gray-500"
                    placeholder="Search by productName or category..."
                  />
                </div>
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 ">
                  <table ref={ref} className="min-w-full  bg-white" {...restProps}>
                    <thead className="bg-neutral-200 ">
                      <tr className={cn('h-12 ', headClass)}>
                        {isCheckBox && (
                          <th scope="col" className="w-6 px-4 md:px-8">
                            <span className="sr-only">checkbox</span>
                            <Checkbox
                              className=" mt-1 rounded-full"
                              positionClass="block"
                              checked={
                                !loading &&
                                checkedRow?.length ===
                                  (apiPaginationEnable ? data : tableRecords)?.length
                              }
                              handleCheck={(checked) => handleAllCheckBox(checked)}
                            />
                          </th>
                        )}
                        {columns.map((column, index) => {
                          const { key, label, isSorting, sortType, columnClass, headerClass } =
                            column;
                          return (
                            <th
                              scope="col"
                              key={`index_${index + 1}`}
                              onClick={() =>
                                isSorting &&
                                sorting(
                                  key as keyof ITableData | ICategory | IMasterProduct,
                                  activeSortField === key && sortType === 'DESC' ? 'ASC' : 'DESC',
                                )
                              }>
                              <div
                                className={cn('flex items-center group', headerClass)}
                                style={{
                                  marginLeft: isSorting ? '0' : undefined,
                                  cursor: isSorting ? 'pointer' : 'default',
                                }}>
                                <div className={cn('text-red-500', columnClass)}>{label}</div>
                                {isSorting && (
                                  <SvgIcon
                                    icon="DOWN_ARROW"
                                    viewBox="0 0 16 16"
                                    className={cn('h-3 opacity-0', {
                                      'opacity-100': activeSortField === key,
                                      'group-hover:opacity-70': isSorting,
                                      'transform rotate-180':
                                        activeSortField === key && sortType === 'DESC',
                                    })}
                                  />
                                )}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {(apiPaginationEnable ? data : tableRecords).map((tableValue, tableIndex) => (
                        <tr
                          key={`table-index_${tableIndex + 1}`}
                          className="border-b-2 border-[#F4F4F4] shadow-sm h-16">
                          {isCheckBox && selectionField && (
                            <td className="px-4 md:px-8">
                              <span className="sr-only">checkbox</span>
                              <Checkbox
                                positionClass="block"
                                checked={checkedRow.includes(
                                  tableValue[
                                    `${
                                      selectionField as keyof Partial<
                                        ITableData | ICategory | IMasterProduct
                                      >
                                    }`
                                  ] as string,
                                )}
                                handleCheck={(checked) => {
                                  handleSingleCheckbox(checked, tableValue);
                                }}
                              />
                            </td>
                          )}
                          {columns.map((column, index) => {
                            const { key, render, columnClass } = column;
                            const value = render
                              ? render(
                                  tableValue[
                                    `${
                                      key as keyof Partial<ITableData | ICategory | IMasterProduct>
                                    }`
                                  ] as string,
                                  tableValue as ITableData | ICategory | IMasterProduct,
                                )
                              : tableValue[
                                  `${key as keyof Partial<ITableData | ICategory | IMasterProduct>}`
                                ];

                            return (
                              <td
                                className={cn('text-blue-400 text-left font-poppins', columnClass)}
                                key={`index_${index + 1}`}>
                                {value}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {isPagination && (
                    <div className="border-t border-[#F4F4F4] h-14 bg-white  shadow flex items-center justify-between px-4 py-2 sm:px-6 gap-2">
                      <div className="flex items-center gap-2">
                        <p className="hidden lg:flex">{labelRowsPerPage}</p>
                        <Select
                          label=""
                          className="w-14 h-7 bg-white my-2.5 pt-0.5"
                          options={rowsPerPageOption.map((val) => ({
                            label: val.toString(),
                            value: val,
                          }))}
                          value={rowsPerPage}
                          onChange={(e) => handleRowsPerPage(e.target.value as unknown as number)}
                        />
                      </div>

                      <div className="flex items-center">
                        <p className="py-2 text-sm font-semibold text-[#06052D]">
                          {firstIndex + 1} - {lastIndex >= count ? count : lastIndex} of {count}
                        </p>
                        <div className="y-2">
                          <button
                            type="button"
                            onClick={prePage}
                            disabled={firstIndex === 0}
                            style={{ cursor: firstIndex === 0 ? 'not-allowed' : 'pointer' }}>
                            <span className="sr-only">previous Page</span>
                            <SvgIcon
                              className="transform rotate-180 h-4 text-black"
                              style={{ opacity: firstIndex === 0 ? 0.3 : 1 }}
                              icon="RIGHT_BUTTON"
                            />
                          </button>
                        </div>
                        <div className="y-2">
                          <button
                            type="button"
                            onClick={nextPage}
                            disabled={lastIndex >= count}
                            style={{ cursor: lastIndex >= count ? 'not-allowed' : 'pointer' }}>
                            <span className="sr-only">next Page</span>
                            <SvgIcon
                              icon="RIGHT_BUTTON"
                              className="h-4 text-black"
                              style={{ opacity: lastIndex >= count ? 0.3 : 1 }}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Table.displayName = 'Table';

export default Table;

// import React from 'react';

// const Table = () => (
//   <div>
//     <div>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Category</th>
//             <th>Variant</th>
//             <th>Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           <tr>
//             <td>Book1</td>
//             <td>Book</td>
//             <td>6</td>
//             <td>rs: 350/-</td>
//           </tr>
//           <tr>
//             <td>Book1</td>
//             <td>Book</td>
//             <td>6</td>
//             <td>rs: 350/-</td>
//           </tr>{' '}
//           <tr>
//             <td>Book1</td>
//             <td>Book</td>
//             <td>6</td>
//             <td>rs: 350/-</td>
//           </tr>{' '}
//           <tr>
//             <td>Book1</td>
//             <td>Book</td>
//             <td>6</td>
//             <td>rs: 350/-</td>
//           </tr>{' '}
//           <tr>
//             <td>Book1</td>
//             <td>Book</td>
//             <td>6</td>
//             <td>rs: 350/-</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// export default Table;
