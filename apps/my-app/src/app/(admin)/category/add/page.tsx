'use client';

import { randomBytes } from 'crypto';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { AiFillPlusCircle, AiOutlineClose } from 'react-icons/ai';
import Breadcrumbs from '@/components/Breadcrumbs';
import CREATE_CATEGORY from '@/graphql/schema/mutations/createCategory.graphql';
import CATEGORIES from '@/graphql/schema/queries/categories.graphql';
import { BreadcrumbItem } from '@/types';
import Select from '../../../../components/Select';

// interface ICategoryImgText {
//   id: string;
//   altText: string;
//   order: string;
// }

interface IAttributes {
  id: string;
  attributeName: string;
  value: string;
}

const AddCategory = () => {
  const breadcrumbs: BreadcrumbItem[] = [{ label: '/Category/AddCategory', link: '/category/add' }];

  const router = useRouter();
  const [categoryDetails, setCategoryDetails] = useState({
    categoryName: '',
    description: '',
  });
  // const [categoryImageText, setCategoryImageText] = useState<ICategoryImgText[]>([]);
  const [categoryImage, setCategoryImage] = useState<string>('');
  const [attributes, setAttributes] = useState<IAttributes[]>([]);
  const [category, setCategory] = useState('');
  const { data: categoryData, loading: categoryLoading } = useQuery(CATEGORIES, {
    fetchPolicy: 'network-only',
  });
  console.log('abc');
  const [CreateCategory, { data, loading, error }] = useMutation(CREATE_CATEGORY, {
    fetchPolicy: 'network-only',
  });
  console.log(
    categoryData?.categories?.map((val: any) => ({
      label: val.categoryName,
      value: val._id,
    })),
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setCategoryDetails({
      ...categoryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(categoryDetails);
    CreateCategory({
      variables: {
        createCategoryInput: {
          categoryName: categoryDetails.categoryName,
          attributes,
          descreption: categoryDetails.description,
          icon: categoryImage,
          status: 'PUBLISHED',
          immediateParentId: category || null,
        },
      },
    })
      .then(() => {
        router.push('/category');
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setCategoryDetails({
      categoryName: '',
      description: '',
    });
    console.log('first', categoryDetails);
    router.push('/category');
  };

  // function for add image for category
  const handleAddCategoryImage = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    try {
      const id = randomBytes(16).toString('hex');
      if (event.target.files && event.target.files[0]) {
        // const valueText = { id, altText: '', order: '' };
        const formData = new FormData();
        const token = getCookie('token');
        formData.append('files', event.target.files[0]);
        const response = await axios.post(`${process.env.BASE_URL}/images/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/formData',
            Authorization: `Bearer ${token}`,
          },
        });
        const res = response.data;
        console.log(res);
        // const value = { imgId: id, file: res[0] };
        setCategoryImage(res[0]);
        // setCategoryImageText((prevImgText) => [...prevImgText, valueText]);
        console.log(res[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const handleAddCategoryTextImage = (
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  //   imgId: string,
  // ) => {
  //   const { name, value } = event.target;
  //   setCategoryImageText((prevImgText) =>
  //     prevImgText.map((val) => (val.id === imgId ? { ...val, [name]: value } : val)),
  //   );
  // };

  // remove function for category image
  const handleRemoveCategoryImage = () => {
    setCategoryImage('');
    // setCategoryImageText((prevImgText) => prevImgText.filter((val) => val.id !== imgId));
  };

  // function for Attributes
  const handleAddAttributes = () => {
    const id = randomBytes(16).toString('hex');
    const value = { id, attributeName: '', value: '' };
    setAttributes((prevVariant) => [...prevVariant, value]);
  };

  const handleRemoveAttributes = (attributeId: string) => {
    setAttributes((prevAttributes) => prevAttributes.filter((id) => id.id !== attributeId));
  };

  const handleAttributesChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    attributeId: string,
  ) => {
    const { name, value } = event.target;
    console.log('second', value);
    setAttributes((prevAttributes) =>
      prevAttributes.map((attribute) =>
        attribute.id === attributeId ? { ...attribute, [name]: value } : attribute,
      ),
    );
  };

  return (
    <div className="h-full">
      <div className="flex flex-col gap-4">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex justify-between ">
            <h1 className="font-bold text-2xl "> Add Category</h1>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="py-1 px-2 sm:px-6 text-gray-900 rounded-md bg-gray-300">
                Cancle
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="py-1 px-2 sm:px-6 h-auto text-sm text-gray-900 rounded-md bg-yellow-500">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 py-4 px-4 pb-6 min-w-full h-full bg-white border-0 rounded-md">
          <div className="font-bold">
            <h2> Basic Information for Category</h2>
          </div>
          <div className="py-4 grid sm:grid-cols-2 gap-2.5 sm:gap-4">
            <div className="space-y-6 ">
              <div className="mt-1 font-medium">
                <Select
                  className="block w-full h-11 rounded-md border-0 p-3 py-2.5 font-semibold bg-white text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  options={categoryData?.categories?.map((val: any) => ({
                    label: val.categoryName,
                    value: val._id,
                  }))}
                  placeholder="Select Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Parent Category"
                />
              </div>
            </div>

            <div className="space-y-6">
              <label htmlFor="phone" className="block text-sm font-bold leading-7 text-gray-900">
                Name
                <div className="mt-1 font-medium">
                  <input
                    required
                    id="categoryname"
                    name="categoryName"
                    type="text"
                    placeholder="Enter category name "
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 p-3 py-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </label>
            </div>
          </div>
          <div>
            <div className="space-y-6 mt-4">
              <label htmlFor="phone" className="block text-sm font-bold leading-6 text-gray-900">
                Description
                <div className="mt-1 font-medium">
                  <textarea
                    required
                    id="description"
                    name="description"
                    placeholder="Enter Description here "
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
              </label>
            </div>
          </div>
          <div>
            <h1 className="my-4 font-bold text-sm">Category Icon</h1>
            {categoryImage.length > 0 && categoryImage && (
              <div>
                <div className="ml-4 lg:ml-5 grid grid-cols-[55px,70%,auto] lg:grid-cols-[55px,75%,auto] gap-1">
                  <div className="text-gray-900 text-sm">
                    <h5>Icon</h5>
                  </div>
                </div>
                <div className="ml-3 mt-1 lg:ml-4 min-w-fit flex gap-3 ">
                  <div>
                    <Image
                      width={30}
                      height={30}
                      className=" w-12 h-9 mt-1 lg:w-12 lg:h-9 rounded-md border-1"
                      src={`${process.env.BASE_URL}/images/${categoryImage}`}
                      alt="user"
                    />
                  </div>

                  <div>
                    <button type="button" onClick={handleRemoveCategoryImage}>
                      <span className="sr-only">remove Category</span>
                      <div>
                        <AiOutlineClose className="mt-2.5 text-xl text-gray-500 " />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-fit">
            <label
              htmlFor="upload-button"
              className=" text-yellow-500 font-semibold cursor-pointer">
              <h5>Upload your Image</h5>
              <input
                type="file"
                id="upload-button"
                style={{ display: 'none' }}
                onChange={handleAddCategoryImage}
              />
            </label>
          </div>
        </div>

        {attributes.map((attribute) => (
          <div className="bg-white py-4 px-4 min-w-full border-0 rounded-md h-" key={attribute.id}>
            <div className="flex justify-between">
              <h2 className=" font-bold">Add Attributes</h2>
              <button
                className="py-1 px-2 sm:px-6 h-auto text-sm text-gray-900 rounded-md bg-yellow-500"
                type="button"
                onClick={() => handleRemoveAttributes(attribute.id)}>
                Remove
              </button>
            </div>
            <div className="mb-2 grid sm:grid-cols-2 gap-y-2 sm:gap-x-4">
              <div>
                <div className=" font-medium">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-bold leading-6 text-gray-900">
                    attributeName
                    <div className="mt-1 font-medium">
                      <input
                        required
                        id="attributes"
                        name="attributeName"
                        type="text"
                        placeholder="Enter key of attributes"
                        onChange={(e) => handleAttributesChange(e, attribute.id)}
                        className="block w-full rounded-md border-0 p-3 py-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <div className=" font-medium">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-bold leading-6 text-gray-900">
                    Value
                    <div className="mt-1 font-medium">
                      <input
                        required
                        id="attributesValue"
                        name="value"
                        type="text"
                        placeholder="Enter value of attributes "
                        onChange={(e) => handleAttributesChange(e, attribute.id)}
                        className="block w-full rounded-md border-0 p-3 py-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white w-full h-8 rounded-md mb-4">
          <button
            type="button"
            className="flex flex-row gap-2 mx-auto text-md  py-1"
            onClick={handleAddAttributes}>
            Add Attributes
            <div>
              <AiFillPlusCircle className="text-yellow-500 text-2xl" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;
