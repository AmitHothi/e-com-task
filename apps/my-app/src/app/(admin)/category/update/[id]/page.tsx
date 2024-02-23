'use client';

import { randomBytes } from 'crypto';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { AiFillPlusCircle, AiOutlineClose } from 'react-icons/ai';
import Breadcrumbs from '@/components/Breadcrumbs';
import Select from '@/components/Select';
import UPDATE_CATEGORY from '@/graphql/schema/mutations/updateCategory.graphql';
import CATEGORIES from '@/graphql/schema/queries/categories.graphql';
import UPDATE_CATEGORY_BY_ID from '@/graphql/schema/queries/categoryById.graphql';
import { BreadcrumbItem, ICategory } from '@/types';

interface IAttributes {
  id: string;
  attributeName: string;
  value: string;
}

const UpdateCategory = ({ params }: { params: { id: string } }) => {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: '/Category/UpdateCategory', link: '/category/update' },
  ];
  const router = useRouter();

  const [categoryDetails, setCategoryDetails] = useState({
    categoryName: '',
    description: '',
  });
  const [categoryImage, setCategoryImage] = useState<string>('');
  const [attributes, setAttributes] = useState<IAttributes[]>([]);
  const [category, setCategory] = useState('');

  const { data: categoryData } = useQuery(CATEGORIES, {
    fetchPolicy: 'network-only',
  });
  console.log('Allcategories', categoryData);

  const { data: categoryByIdData, loading: categoryByIdLoading } = useQuery(UPDATE_CATEGORY_BY_ID, {
    fetchPolicy: 'network-only',
    variables: { id: params.id },
    onCompleted(data) {
      const updatedData: ICategory = data.category;
      console.log('updatedData', updatedData);
      setCategoryDetails({
        categoryName: updatedData.categoryName,
        description: updatedData.description,
      });
      setCategoryImage(updatedData.icon);
      setAttributes(updatedData.attributes);
      setCategory(updatedData.immediateParentId);
    },
  });

  const [UpdateCategoryByID] = useMutation(UPDATE_CATEGORY, {
    fetchPolicy: 'network-only',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setCategoryDetails({
      ...categoryDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    UpdateCategoryByID({
      variables: {
        updateCategoryInput: {
          categoryName: categoryDetails.categoryName,
          attributes,
          description: categoryDetails.description,
          icon: categoryImage,
          status: 'PUBLISHED',
          _id: params.id,
          immediateParentId: category || null,
        },
      },
    })
      .then((res) => {
        console.log('res', res.data);
        router.push('/category');
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    setCategoryDetails({
      categoryName: '',
      description: '',
    });
    router.push('/category');
  };

  // function for add image for category
  const handleUpdateCategoryImage = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    try {
      const id = randomBytes(16).toString('hex');
      if (event.target.files && event.target.files[0]) {
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
        setCategoryImage(res[0]);
        console.log('updateCategoryIcon', res[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // remove function for category image
  const handleRemoveCategoryImage = () => {
    setCategoryImage('');
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
    console.log('updateAttributeValue', value);
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
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleClose}
                className="py-1 px-2 sm:px-4 text-gray-900 rounded-md bg-gray-300">
                Cancle
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="py-1 px-2 sm:px-6 text-gray-900 rounded-md bg-yellow-500">
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 min-w-full h-full bg-white border-0 rounded-md">
          <div className="font-bold">
            <h2> Basic Information for Category</h2>
          </div>
          <div className="flex flex-col">
            <div className="py-4 grid sm:grid-cols-2 gap-2.5 sm:gap-4">
              <div className="space-y-6 ">
                <div className="font-medium">
                  <Select
                    className="block w-full h-11 rounded-md border-0 p-2.5 font-semibold bg-white text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    options={categoryData?.categories?.categories?.map((val: any) => ({
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
                  <div className=" font-medium">
                    <input
                      required
                      id="categoryname"
                      name="categoryName"
                      value={categoryDetails.categoryName}
                      type="text"
                      placeholder="Enter category name "
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 p-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </label>
              </div>
            </div>
            <div>
              <div className="space-y-6">
                <label htmlFor="phone" className="block text-sm font-bold leading-6 text-gray-900">
                  Description
                  <div className="mt-1 font-medium">
                    <textarea
                      required
                      id="description"
                      name="description"
                      value={categoryDetails.description}
                      placeholder="Enter Description here "
                      onChange={handleChange}
                      className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                    />
                  </div>
                </label>
              </div>
            </div>
            <div className="py-4">
              <h1 className="font-bold text-sm">Category Icon</h1>
              {categoryImage.length > 0 && categoryImage && (
                <div>
                  <div className="px-4">
                    <div className="text-gray-900 text-sm">
                      <h5>Icon</h5>
                    </div>
                  </div>
                  <div className="px-4 min-w-fit flex gap-3 ">
                    <div>
                      <Image
                        width={30}
                        height={30}
                        className=" w-12 h-9 mt-2 rounded-md border-1"
                        src={`${process.env.BASE_URL}/images/${categoryImage}`}
                        alt="user"
                      />
                    </div>

                    <div>
                      <button type="button" onClick={handleRemoveCategoryImage}>
                        <span className="sr-only">remove Category</span>
                        <div>
                          <AiOutlineClose className="mt-3 text-xl text-gray-500 " />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                onChange={handleUpdateCategoryImage}
              />
            </label>
          </div>
        </div>

        {attributes.map((attribute) => (
          <div className="bg-white p-4 min-w-full border-0 rounded-md " key={attribute.id}>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <div className=" font-bold">Add Attributes</div>
                <button
                  className="py-1 px-2 sm:px-4 h-auto text-sm text-gray-900 rounded-md bg-yellow-500"
                  type="button"
                  onClick={() => handleRemoveAttributes(attribute.id)}>
                  Remove
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-y-2 sm:gap-x-4">
                <div>
                  <div className=" font-medium">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold leading-6 text-gray-900">
                      attributeName
                      <div className="mt-1 font-medium">
                        <input
                          required
                          id="attributes"
                          name="attributeName"
                          type="text"
                          value={attribute.attributeName}
                          placeholder="Enter name of attributes"
                          onChange={(e) => handleAttributesChange(e, attribute.id)}
                          className="block w-full rounded-md border-0 p-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <div className=" font-medium">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-semibold leading-6 text-gray-900">
                      Value
                      <div className="mt-1 font-medium">
                        <input
                          required
                          id="attributesValue"
                          name="value"
                          value={attribute.value}
                          type="text"
                          placeholder="Enter value of attributes "
                          onChange={(e) => handleAttributesChange(e, attribute.id)}
                          className="block w-full rounded-md border-0 p-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="bg-white w-full h-8 rounded-md ">
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

export default UpdateCategory;
