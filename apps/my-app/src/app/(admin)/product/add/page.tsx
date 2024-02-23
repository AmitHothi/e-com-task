'use client';

import { randomBytes } from 'crypto';
import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { AiFillPlusCircle, AiOutlineClose } from 'react-icons/ai';
import Breadcrumbs from '@/components/Breadcrumbs';
import Select from '@/components/Select';
import CREATE_MASTER_PRODUCT from '@/graphql/schema/mutations/createMasterProduct.graphql';
import GET_ALL_MASTERPRODUCTS from '@/graphql/schema/queries/allMasterProducts.graphql';
import GET_ALL_SUBPRODUCTS from '@/graphql/schema/queries/allSubProduct.graphql';
import CATEGORIES from '@/graphql/schema/queries/categories.graphql';
import SUBPRODUCT_BY_MASTERID from '@/graphql/schema/queries/getSubProductByMasterProductId.graphql';
import GET_MASTERPRODUCT_BY_ID from '@/graphql/schema/queries/masterProductById.graphql';
import SubProduct from '@/lib/product/sub-product';
import { BreadcrumbItem, ICategory } from '@/types';

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

const AddProduct = () => {
  const breadcrumbs: BreadcrumbItem[] = [{ label: '/Product/Addproduct', link: '/product/add' }];
  const router = useRouter();
  const searchParams = useSearchParams();
  const masterProductId = searchParams.get('id');
  console.log('masterProductId', masterProductId);

  const [productDetails, setProductDetails] = useState({});
  const [masterProductDetails, setMasterProductDetails] = useState({
    masterProductName: '',
    description: '',
    // price: '',
    sku: '',
  });
  const [masterImageText, setMasterImageText] = useState<IMasterImage[]>([]);
  const [variants, setVariants] = useState<IVariantForm[]>([]);
  const [category, setCategory] = useState('');

  // graphql Querry for Allcategory
  const { data: categoryData } = useQuery(CATEGORIES, {
    fetchPolicy: 'network-only',
  });
  console.log('allCategorys', categoryData);

  // graphql Querry for masterProduct-by-id
  const [masterProductById, { data: masterProductByIdData, loading: masterProductByIdLoading }] =
    useLazyQuery(GET_MASTERPRODUCT_BY_ID, {
      fetchPolicy: 'network-only',
      onCompleted(data) {
        console.log('data', data);
        setMasterProductDetails({
          masterProductName: data?.getMasterProduct?.masterProductName,
          description: data?.getMasterProduct?.description,
          sku: data?.getMasterProduct?.sku,
        });
        setCategory(data?.getMasterProduct?.category?._id);
        setMasterImageText(data?.getMasterProduct?.images);
      },
    });

  const [subProductByMasterId, { data: subProductData, loading: subProductLoading }] = useLazyQuery(
    SUBPRODUCT_BY_MASTERID,
    {
      fetchPolicy: 'network-only',
      onCompleted(data) {
        console.log('subProductData', data);
        setVariants(
          data?.getSubProductByMasterProductId.map((val) => ({
            id: val._id,
            subProductName: val.subProductName,
            price: val.prices,
            sku: val.sku,
            description: val.description,
            image: val.customImages,
          })),
        );
      },
    },
  );

  // mutation of create_masterProduct
  const [
    CreateMasterProduct,
    { data: masterProductData, loading: masterProductLoading, error: masterProductError },
  ] = useMutation(CREATE_MASTER_PRODUCT, {
    fetchPolicy: 'network-only',
  });

  // function for the create product
  const handleProductSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(productDetails);
    router.push('/product');
  };

  const handleMasterProductChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setMasterProductDetails({
      ...masterProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancelProduct = () => {
    setProductDetails({});
    console.log('first', productDetails);
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
      CreateMasterProduct({
        variables: {
          createMasterProductInput: {
            masterProductName: masterProductDetails.masterProductName,
            categoryId: category,
            attributes: categoryData?.categories?.categories?.find(
              (val: ICategory) => val?._id === category,
            )?.attributes,

            description: masterProductDetails.description,
            // price: masterProductDetails.price,
            sku: masterProductDetails.sku,
            images: masterImageText,
            status: 'PUBLISHED',
          },
        },
      })
        .then((res) => {
          console.log('response', res.data);
          router.push(`/product/add?id=${res.data.createMasterProduct._id}`);
        })
        .catch((err) => console.log(err));
    } else {
      alert('please enter all fileds');
    }
  };

  console.log(
    'attributes',
    categoryData?.categories?.categories?.find((val: ICategory) => val?._id === category)
      ?.attributes,
  );
  useEffect(() => {
    if (masterProductId) {
      masterProductById({
        variables: { id: masterProductId },
      });
      subProductByMasterId({
        variables: { masterProductId },
      });
    }
  }, [masterProductId]);

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
      console.log('img-resonse', res);
      const value = { id, altText: '', order: '', img: res[0] };
      // const value = { imgId: id, file: res[0] };
      // setMasterImage((prevImg) => [...prevImg, value]);
      setMasterImageText((prevImg) => [...prevImg, value]);
      console.log('img-value', value);
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
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancelProduct}
                className="py-1 px-2 sm:px-4 text-gray-900 rounded-md bg-gray-300">
                Cancle
              </button>
              <button
                type="submit"
                onClick={handleProductSubmit}
                className="py-1 px-2 sm:px-6  text-gray-900  rounded-md bg-yellow-500">
                Save
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="p-4 min-w-full h-full bg-white border-0 rounded-md">
            <div className="font-bold ">
              <div>Basic Information</div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="py-2 grid sm:grid-cols-2 gap-4">
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
                        type="text"
                        value={masterProductDetails.masterProductName}
                        placeholder="Enter product name "
                        onChange={handleMasterProductChange}
                        className="block w-full rounded-md border-0 p-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
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
                        type="number"
                        value={masterProductDetails.sku}
                        placeholder="Enter SKU number "
                        onChange={handleMasterProductChange}
                        className="block w-full rounded-md border-0 p-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </label>
                </div>
              </div>
              <div className="space-y-6">
                <div className="font-medium">
                  <Select
                    className="block w-full h-11 rounded-md border-0 p-2.5 font-semibold bg-white text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    options={categoryData?.categories?.categories?.map((val: any) => ({
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
              <div className="space-y-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-bold leading-6 text-gray-900">
                  Description
                  <div className="font-medium">
                    <textarea
                      required
                      disabled={!!masterProductId}
                      id="description"
                      name="description"
                      value={masterProductDetails.description}
                      placeholder="Enter Description here "
                      onChange={handleMasterProductChange}
                      className="block w-full rounded-md border-0 p-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                    />
                  </div>
                </label>
              </div>

              <div>
                <div className="flex justify-between my-3">
                  <div className="py-1 font-bold text-sm">Master Image</div>
                  <button
                    disabled={!!masterProductId}
                    className="
                  p-1.5 text-sm text-gray-900 rounded-md bg-yellow-500"
                    type="button"
                    onClick={handleMasterProductSubmit}>
                    Save MasterProduct
                  </button>
                </div>
                {masterImageText.length > 0 && (
                  <div className=" grid grid-cols-[56px,auto,150px] ">
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
                  <div className="min-w-fit flex gap-3" key={e.id}>
                    <div className="w-max">
                      {e.img && (
                        <Image
                          width={30}
                          height={30}
                          className=" w-12 h-9  rounded-md border-1"
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
                        className="block w-[50ch] lg:w-[110ch] rounded-md border-0 p-1.5 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm sm:text-sm sm:leading-6"
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
                        className="block w-28 rounded-md border-0 p-1.5 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-md sm:text-sm sm:leading-6"
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
                  className=" text-yellow-500 text-md font-semibold cursor-pointer">
                  <div>Upload Your Images</div>
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
        </div>
        <div>
          {masterProductId && (
            <div className="flex flex-col gap-4">
              {variants.map((variant) => {
                console.log('first', variant.description, variant.sku, variant.id);
                return (
                  <SubProduct
                    key={variant.id}
                    variantId={variant.id}
                    category={category}
                    categoryData={categoryData}
                    handleRemoveSubVariant={handleRemoveVariant}
                    // variant={variants[0]}
                  />
                  // <div
                  //   className="py-4 px-4 bg-white min-w-full border-0 rounded-md "
                  //   key={variant.id}>
                  //   <div className="flex justify-between">
                  //     <h2 className="font-bold">Add Variant</h2>
                  //     <button
                  //       className="py-1 px-2 sm:px-6 text-sm text-gray-900 font-semibold rounded-md bg-yellow-500"
                  //       type="button"
                  //       onClick={() => handleRemoveVariant(variant.id)}>
                  //       Remove
                  //     </button>
                  //   </div>
                  //   <div className="grid sm:grid-cols-2 gap-4">
                  //     {category &&
                  //       (
                  //         JSON.parse(
                  //           categoryData?.categories?.find(
                  //             (val: ICategory) => val?._id === category,
                  //           )?.attributes,
                  //         ) || []
                  //       )?.map((attribute) => (
                  //         <div key={attribute._id}>
                  //           <div className=" font-medium">
                  //             <Select
                  //               name={attribute.attributeName}
                  //               className="block w-full h-12 rounded-md border-0 mt-2 p-3 py-2.5 font-semibold bg-white text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  //               options={attribute.value.split(',').map((val: any) => ({
                  //                 label: val,
                  //                 value: val,
                  //               }))}
                  //               value={subVariants[attribute.attributeName]}
                  //               onChange={(e) => handleVariantChange(e, variant.id)}
                  //               label={attribute.attributeName}
                  //             />
                  //           </div>
                  //         </div>
                  //       ))}
                  //     <div className="space-y-6 ">
                  //       <label
                  //         htmlFor="sku"
                  //         className="block text-sm font-bold leading-7 text-gray-900">
                  //         SKU
                  //         <div className="mt-1 font-medium">
                  //           <input
                  //             required
                  //             id="sku"
                  //             name="sku"
                  //             type="number"
                  //             placeholder="Enter SKU number "
                  //             onChange={(e) => handleVariantChange(e, variant.id)}
                  //             className="block w-full rounded-md border-0 p-3 py-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  //           />
                  //         </div>
                  //       </label>
                  //     </div>

                  //     <div className="space-y-6 ">
                  //       <label
                  //         htmlFor="price"
                  //         className="block text-sm font-bold leading-7 text-gray-900">
                  //         Price
                  //         <div className="mt-1 font-medium">
                  //           <input
                  //             required
                  //             id="price"
                  //             name="price"
                  //             type="number"
                  //             placeholder="Enter price"
                  //             onChange={(e) => handleVariantChange(e, variant.id)}
                  //             className="block w-full rounded-md border-0 p-3 py-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  //           />
                  //         </div>
                  //       </label>
                  //     </div>
                  //   </div>
                  //   <div className="py-4">
                  //     <label
                  //       htmlFor="phone"
                  //       className="block text-sm font-bold leading-6 text-gray-900">
                  //       Description
                  //       <div className="mt-1 font-medium">
                  //         <textarea
                  //           required
                  //           id="description"
                  //           name="description"
                  //           placeholder="Enter Description here "
                  //           onChange={(e) => handleVariantChange(e, variant.id)}
                  //           className="block w-full rounded-md border-0 p-3 py-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                  //         />
                  //       </div>
                  //     </label>
                  //   </div>

                  //   <div className=" grid grid-cols-[55px,70%,auto] lg:grid-cols-[60px,82%,auto] ">
                  //     <label htmlFor="image" className="text-gray-900 text-sm">
                  //       Image
                  //     </label>
                  //     <label htmlFor="alt-text" className=" text-gray-900 text-sm">
                  //       Alt text
                  //     </label>
                  //     <label htmlFor="order" className="text-gray-900 text-sm">
                  //       Order
                  //     </label>
                  //   </div>
                  //   {variant?.image.map((img) => {
                  //     console.log('imageText', img);
                  //     // const imgVariant = variantImage.find(
                  //     //   (val) => val.imgId === img.id && val.variantId === variant.id,
                  //     // );
                  //     return (
                  //       <div className=" py-2 min-w-fit flex gap-3" key={img.id}>
                  //         <div>
                  //           {img.img && (
                  //             <Image
                  //               width={30}
                  //               height={30}
                  //               className=" w-12 h-9 lg:w-12 lg:h-9 rounded-md border-1"
                  //               src={`${process.env.BASE_URL}/images/${img.img}`}
                  //               alt="default alt"
                  //             />
                  //           )}
                  //         </div>
                  //         <div className="font-medium ">
                  //           <input
                  //             required
                  //             name="altText"
                  //             id="productname"
                  //             type="text"
                  //             value={img.altText}
                  //             placeholder="Enter Alt text "
                  //             onChange={(e) => handleImageTextVariant(e, variant.id, img.id)}
                  //             className="block w-[50ch] lg:w-[122ch] rounded-md border-0 p-3 py-1.5 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm sm:text-sm sm:leading-6"
                  //           />
                  //         </div>
                  //         <div className="font-medium ">
                  //           <input
                  //             required
                  //             name="order"
                  //             id="productname"
                  //             type="number"
                  //             value={img.order}
                  //             placeholder="Enter order "
                  //             onChange={(e) => handleImageTextVariant(e, variant.id, img.id)}
                  //             className="block w-28 rounded-md border-0 p-3 py-1.5 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-md sm:text-sm sm:leading-6"
                  //           />
                  //         </div>
                  //         <div>
                  //           <button
                  //             type="button"
                  //             onClick={() => handleRemoveImageVariant(variant.id, img.id)}>
                  //             <div>
                  //               <AiOutlineClose className="mt-2 text-xl text-gray-500 " />
                  //             </div>
                  //           </button>
                  //         </div>
                  //       </div>
                  //     );
                  //   })}

                  //   <div>
                  //     <label
                  //       htmlFor="upload-VariantImage"
                  //       className="text-yellow-500 font-semibold w-fit">
                  //       <h5>Upload Your Images</h5>
                  //     </label>
                  //     <input
                  //       id="upload-VariantImage"
                  //       type="file"
                  //       style={{ display: 'none' }}
                  //       accept="image/*"
                  //       onChange={(e) => handleAddVariantImage(e, variant.id)}
                  //     />
                  //   </div>
                  // </div>
                );
              })}

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

export default AddProduct;
