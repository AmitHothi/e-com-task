import React from 'react';
import { useQuery } from '@apollo/client';
import CATEGORIES from '@/graphql/schema/queries/categories.graphql';

const Filter = () => {
  const { data: categoryData, loading: categoryLoading } = useQuery(CATEGORIES, {
    fetchPolicy: 'network-only',
  });
  console.log(categoryData);
  return (
    <div className="min-w-full h-full font-medium bg-white shadow-x-xl  border-0 rounded-t-lg">
      <div>
        <h2 className="px-2 py-2.5 h-12 text-xl border-b-2 border-zinc-200 rounded-t-lg shadow-sm ">
          Filters
        </h2>
      </div>
      <div className="border-b-2 border-zinc-200 shadow-sm px-2 py-2">
        <label htmlFor="price">
          Price
          <div className="static mb-6">
            <input
              id="price"
              type="range"
              // value="0"
              // min="0"
              // max="2000"
              className="w-full h-1 bg-yellow-500  rounded-lg appearance-none cursor-pointer "
            />
            {/* <span className=" text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6">
          0
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6">
          2000
        </span> */}
          </div>
        </label>
      </div>
      <div className="px-2 py-2 ">
        <p>Category</p>
        <div className="mt-2">
          <ul className="space-y-1">
            {categoryData?.categories?.map((category: any) => (
              <li>
                <label htmlFor="book" className="flex items-center">
                  <input
                    id={category._id}
                    name="categoryName"
                    type="checkbox"
                    value={category.categoryName}
                    className="h-4 w-4"
                    // defaultChecked={checkHandler("category", "Electronics")}
                  />
                  <span className="ml-2 text-gray-500"> {category.categoryName} </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Filter;
