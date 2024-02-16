'use client';

import { randomBytes } from 'crypto';
import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useCallback,
  useMemo,
  FormEventHandler,
} from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { AiFillPlusCircle, AiOutlineClose } from 'react-icons/ai';
import Breadcrumbs from '@/components/Breadcrumbs';
import Select from '@/components/Select';
import CREATE_SUB_PRODUCT from '@/graphql/schema/mutations/createSubProduct.graphql';
import UPDATE_MASTER_PRODUCT from '@/graphql/schema/mutations/updateMasterProduct.graphql';
import GET_ALL_MASTERPRODUCTS from '@/graphql/schema/queries/allMasterProducts.graphql';
import GET_ALL_SUBPRODUCTS from '@/graphql/schema/queries/allSubProduct.graphql';
import CATEGORIES from '@/graphql/schema/queries/categories.graphql';
import GET_MASTERPRODUCT_BY_ID from '@/graphql/schema/queries/masterProductById.graphql';
import SubProduct from '@/lib/product/sub-product';
import { BreadcrumbItem, ICategory, IMasterProduct } from '@/types';
import MyImage from '../../../../../../public/IMG_20210330_194930.jpg';

interface IVariantForm {
  id: string;
  subProductName: string;
  price: string;
  sku: string;
  description: string;
  image: IMasterImage[];
}

interface IMasterImage {
  id: string;
  altText: string;
  order: string;
  img: string;
}

const UpdateProduct = ({ params }: { params: { id: string } }) => {
  const breadcrumbs: BreadcrumbItem[] = [{ label: '/Product/UpdateProduct', link: '/product/add' }];

  const searchParams = useSearchParams();

  const masterProductId = searchParams.get('id');
  console.log('search', masterProductId);

  //   const [productDetails, setProductDetails] = useState({});
  const [masterProductDetails, setMasterProductDetails] = useState({
    masterProductName: '',
    description: '',
    // price: '',
    sku: '',
  });
  const router = useRouter();
  const [masterImageText, setMasterImageText] = useState<IMasterImage[]>([]);
  const [variants, setVariants] = useState<IVariantForm[]>([]);
  const [category, setCategory] = useState('');

  const { data: allMasterProductData, loading: allMasterProductLoading } = useQuery(
    GET_ALL_MASTERPRODUCTS,
    {
      fetchPolicy: 'network-only',
    },
  );
  console.log(allMasterProductData);

  const { data: allSubproductData, loading: allSubproductloading } = useQuery(GET_ALL_SUBPRODUCTS, {
    fetchPolicy: 'network-only',
  });
  console.log(allSubproductData);

  const { data: masterProductByIdData, loading: masterProductByIdLoading } = useQuery(
    GET_MASTERPRODUCT_BY_ID,
    {
      fetchPolicy: 'network-only',
      variables: { id: params.id },
      onCompleted(data) {
        const updatedData: IMasterProduct = data.getMasterProduct;
        console.log('updatedData', updatedData);
        setMasterProductDetails({
          masterProductName: updatedData.masterProductName,
          description: updatedData.description,
          sku: updatedData.sku,
        });
        setCategory(updatedData.category._id);
        setMasterImageText(updatedData.images);
      },
    },
  );
  console.log('masterProductByIdData', masterProductByIdData);

  const [
    UpdateMasterProduct,
    { data: masterProductData, loading: masterProductLoading, error: masterProductError },
  ] = useMutation(UPDATE_MASTER_PRODUCT, {
    fetchPolicy: 'network-only',
  });

  const { data: categoryData, loading: categoryLoading } = useQuery(CATEGORIES, {
    fetchPolicy: 'network-only',
  });
  console.log(categoryData);

  // const [
  //   CreateSubProduct,
  //   { data: subProductData, loading: subproductLoading, error: subProductError },
  // ] = useMutation(CREATE_SUB_PRODUCT, {
  //   fetchPolicy: 'network-only',
  // });

  // function for add product
  const handleMasterProductChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMasterProductDetails({
      ...masterProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  // function for the create product
  const handleProductSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // console.log(productDetails);
    // for (let i = 0; variants.length > i; i) {
    //   CreateSubProduct({
    //     variables: {
    //       createSubProductInput: {
    //         subProductName: null,
    //         attributes: JSON.stringify(
    //           categoryData?.categories?.find((val: ICategory) => val?._id === category)?.attributes,
    //         ),
    //         description: variants[i],
    //         customImages: variants[i],
    //         sku: variants[i],
    //         prices: variants[i],
    //         masterProduct: null,
    //       },
    //     },
    //   })
    //     .then((res) => {
    //       console.log(res.data);
    //       router.push('/product');
    //     })
    //     .catch((err) => console.log(err));
    // }
  };

  const handleCancelProduct = () => {
    // setProductDetails({});
    // console.log('first', productDetails);
    router.push('/product');
  };

  // function for masterProduct
  const handleMasterProductSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(masterProductDetails);
    if (
      masterProductDetails.masterProductName &&
      masterProductDetails.description &&
      masterProductDetails.sku &&
      category &&
      masterImageText.length > 0 &&
      masterImageText[0].img
    ) {
      UpdateMasterProduct({
        variables: {
          updateMasterProductInput: {
            masterProductName: masterProductDetails.masterProductName,
            description: masterProductDetails.description,
            images: masterImageText,
            sku: masterProductDetails.sku,
            status: 'PUBLISHED',
            categoryId: category,
            attriburtes: categoryData?.categories?.find((val: ICategory) => val?._id === category)
              ?.attributes,
            _id: params.id,
          },
        },
      })
        .then((res) => {
          console.log('abc', res.data);
          router.push(
            `/product/update/${params.id}?id=${res.data.updateMasterProductById._id}&name=amit`,
          );
        })
        .catch((err) => console.log(err));
    } else {
      alert('please enter filed');
    }
  };
  console.log(
    'ecom',
    categoryData?.categories?.find((val: ICategory) => val?._id === category)?.attributes,
  );

  // function for add image for masterproduct
  const handleAddMasterImage = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
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
      console.log(res);
      const value = { id, altText: '', order: '', img: res[0] };
      // const value = { imgId: id, file: res[0] };
      // setMasterImage((prevImg) => [...prevImg, value]);
      setMasterImageText((prevImg) => [...prevImg, value]);
      console.log(value);
    }
  };

  // function for add image text for masterproduct
  const handleAddMasterTextImage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    imgId: string,
  ) => {
    const { name, value } = event.target;
    setMasterImageText((prevImgText) =>
      prevImgText.map((val) => (val.id === imgId ? { ...val, [name]: value } : val)),
    );
  };

  // function for remove image for masterproduct
  const handleRemoveMasterImage = (imgId: string) => {
    // setMasterImage((prevImages) => prevImages.filter((id) => id.imgId !== imgId));
    setMasterImageText((prevImages) => prevImages.filter((id) => id.id !== imgId));
  };

  // function for variant
  const handleAddVariant = () => {
    const id = randomBytes(16).toString('hex');
    const value = { id, subProductName: '', description: '', price: '', sku: '', image: [] };
    setVariants((prevVariant) => [...prevVariant, value]);
  };

  const handleRemoveVariant = (variantId: string) => {
    setVariants((prevVariants) => prevVariants.filter((id) => id.id !== variantId));
  };

  return (
    <div className="h-full">
      <div className="flex flex-col gap-4">
        <div>
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex justify-between ">
            <h1 className="font-bold text-xl sm:text-2xl "> Add Product</h1>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCancelProduct}
                className="py-1 px-2 sm:px-6 text-gray-900 font-semibold rounded-md bg-gray-300">
                Cancle
              </button>
              <button
                type="submit"
                onClick={handleProductSubmit}
                className="py-1 px-2 sm:px-6  text-sm text-gray-900 font-semibold rounded-md bg-yellow-500">
                Save
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="mt-4 px-6 py-4 min-w-full h-full bg-white border-0 rounded-md">
            <div className="font-bold ">
              <h2>Basic Information</h2>
            </div>
            <div className="py-4 grid sm:grid-cols-2 gap-4">
              <div className="space-y-6">
                <label
                  htmlFor="masterProductName"
                  className="block text-sm font-bold leading-7 text-gray-900">
                  Name
                  <div className="mt-1 font-medium">
                    <input
                      required
                      disabled={!!masterProductId}
                      id="masterProductName"
                      name="masterProductName"
                      value={masterProductDetails.masterProductName}
                      type="text"
                      placeholder="Enter product name "
                      onChange={handleMasterProductChange}
                      className="block w-full rounded-md border-0 p-3 py-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </label>
              </div>

              <div className="space-y-6 ">
                <label htmlFor="sku" className="block text-sm font-bold leading-7 text-gray-900">
                  SKU
                  <div className="mt-1 font-medium">
                    <input
                      required
                      disabled={!!masterProductId}
                      id="sku"
                      name="sku"
                      value={masterProductDetails.sku}
                      type="number"
                      placeholder="Enter SKU number "
                      onChange={handleMasterProductChange}
                      className="block w-full rounded-md border-0 p-3 py-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                  </div>
                </label>
              </div>

              <div className="space-y-6 col-span-2">
                <div className="mt-1 font-medium">
                  <Select
                    className="block w-full h-11 rounded-md border-0 p-3 py-2.5 font-semibold bg-white text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    options={categoryData?.categories?.map((val: any) => ({
                      label: val.categoryName,
                      value: val._id,
                    }))}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={!!masterProductId}
                    label="Category"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <label htmlFor="phone" className="block text-sm font-bold leading-6 text-gray-900">
                Description
                <div className="mt-1 font-medium">
                  <textarea
                    required
                    disabled={!!masterProductId}
                    id="description"
                    name="description"
                    value={masterProductDetails.description}
                    placeholder="Enter Description here "
                    onChange={handleMasterProductChange}
                    className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  />
                </div>
              </label>
            </div>

            <div>
              <div className="flex justify-between my-3">
                <h2 className=" font-bold text-sm">Master Image</h2>
                <button
                  disabled={!!masterProductId}
                  className="
                  py-1 px-2 sm:px-6 text-sm text-gray-900 font-semibold rounded-md bg-yellow-500"
                  type="button"
                  onClick={handleMasterProductSubmit}>
                  Save MasterProduct
                </button>
              </div>
              {masterImageText.length > 0 && (
                <div className=" grid grid-cols-[55px,70%,auto] lg:grid-cols-[60px,82%,auto] ">
                  <div className="text-gray-900 text-sm">Image</div>
                  <div className=" text-gray-900  text-sm ">Alt text</div>
                  <div className="text-gray-900 text-sm">Order</div>
                </div>
              )}
            </div>
            {masterImageText.map((e) => {
              console.log('first', e);
              // const img = masterImage.find((val) => val.imgId === e.id);
              return (
                <div className=" py-2  min-w-fit flex gap-3" key={e.id}>
                  <div>
                    {e.img && (
                      <Image
                        width={30}
                        height={30}
                        className=" w-12 h-9 lg:w-12 lg:h-9 rounded-md border-1"
                        src={`${process.env.BASE_URL}/images/${e.img}`}
                        alt="user"
                      />
                    )}
                  </div>
                  <div className="font-medium ">
                    <input
                      required
                      disabled={!!masterProductId}
                      name="altText"
                      id="productname"
                      type="text"
                      placeholder="Enter Alt text "
                      value={e.altText}
                      onChange={(val) => handleAddMasterTextImage(val, e.id)}
                      className="block w-[50ch] lg:w-[122ch] rounded-md border-0 p-3 py-1.5 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="font-medium ">
                    <input
                      required
                      disabled={!!masterProductId}
                      name="order"
                      id="productname"
                      type="number"
                      placeholder="Enter order "
                      value={e.order}
                      onChange={(val) => handleAddMasterTextImage(val, e.id)}
                      className="block w-28 rounded-md border-0 p-3 py-1.5 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-md sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <button
                      disabled={!!masterProductId}
                      type="button"
                      onClick={() => handleRemoveMasterImage(e.id)}>
                      <span className="sr-only">remove masterImage</span>
                      <div>
                        <AiOutlineClose className="mt-2 text-xl text-gray-500 " />
                      </div>
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="w-fit">
              <label
                htmlFor="uploadImage"
                className=" text-yellow-500 font-semibold cursor-pointer">
                <h5>Upload Your Images</h5>
                <input
                  disabled={!!masterProductId}
                  id="uploadImage"
                  type="file"
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleAddMasterImage}
                />
              </label>
            </div>
          </div>
        </div>
        <div>
          {masterProductId && (
            <div className="flex flex-col gap-4">
              <div className=" flex flex-col gap-4">
                {variants.map((variant) => {
                  console.log('first', variant.description, variant.sku, variant.price);
                  return (
                    <SubProduct
                      key={variant.id}
                      variantId={variant.id}
                      category={category}
                      categoryData={categoryData}
                      handleRemoveSubVariant={handleRemoveVariant}
                    />
                  );
                })}
              </div>
              <div className="bg-white w-full h-8 rounded-md ">
                <button
                  type="button"
                  className="flex flex-row gap-2 mx-auto text-md  py-1"
                  onClick={handleAddVariant}>
                  Add Variant
                  <div>
                    <AiFillPlusCircle className="text-yellow-500 text-2xl" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
