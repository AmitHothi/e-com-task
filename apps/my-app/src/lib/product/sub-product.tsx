import { randomBytes } from 'crypto';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { AiOutlineClose } from 'react-icons/ai';
import Select from '@/components/Select';
import CREATE_SUB_PRODUCT from '@/graphql/schema/mutations/createSubProduct.graphql';
import GET_SUBPRODUCT_BY_ID from '@/graphql/schema/queries/subProductById.graphql';
import { ICategory } from '@/types';

interface IVariantForm {
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

export interface ISubProducts {
  variantId: string;
  category: string;
  categoryData: any;
  handleRemoveSubVariant: (id: string) => void;
}

const SubProduct = ({
  variantId,
  category,
  categoryData,
  handleRemoveSubVariant = () => null,
}: ISubProducts) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputFile = useRef<HTMLInputElement>(null);
  const masterProductId = searchParams.get('id');
  const [subVariants, setSubVariants] = useState([]);
  const [subValue, setSubValue] = useState<IVariantForm>({
    subProductName: '',
    price: '',
    description: '',
    sku: '',
    image: [],
  });

  const [
    CreateSubProduct,
    { data: subProductData, loading: subproductLoading, error: subProductError },
  ] = useMutation(CREATE_SUB_PRODUCT, {
    fetchPolicy: 'network-only',
  });

  // const [subProductById, { data: subProductByIdData, loading: subProductByIdLoading }] =
  //   useLazyQuery(GET_SUBPRODUCT_BY_ID, {
  //     fetchPolicy: 'network-only',
  //     onCompleted(data) {
  //       console.log('sub-Data-id', data);
  //       // setSubValue({
  //       //   subProductName: data.subProductName,
  //       //   description: data.description,
  //       //   sku: data.sku,
  //       //   price: data.prices,
  //       //   image: data.customImages,
  //       // });
  //       // setSubVariants(data.subVariant);
  //     },
  //   });
  // console.log('subid-data', subProductByIdData);

  const handleVariantSubmit = () => {
    if (
      subValue.subProductName &&
      subValue.description &&
      subValue.price &&
      subValue.sku &&
      subValue.image.length > 0 &&
      subValue.image[0].img
    ) {
      CreateSubProduct({
        variables: {
          createSubProductInput: {
            subProductName: subValue.subProductName,
            attributes: categoryData?.categories?.categories?.find(
              (val: ICategory) => val?._id === category,
            )?.attributes,
            subVariant: subVariants,
            description: subValue.description,
            customImages: subValue.image,
            sku: subValue.sku,
            prices: parseInt(subValue.price, 10),
            masterProductId,
          },
        },
      })
        .then((res) => {
          console.log(res.data);
          console.log('variantId', variantId);
        })
        .catch((err) => console.log(err));
    } else {
      alert('fill data');
    }
  };

  console.log('subValue', subValue);

  const handleSubVariantChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    console.log('second', value);
    setSubVariants((prevVariant) => ({ ...prevVariant, [name]: value }));
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    console.log('second', value);
    setSubValue((prevVariant) => ({ ...prevVariant, [name]: value }));
  };

  const handleAddVariantImage = async (event: ChangeEvent<HTMLInputElement>) => {
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
      const valueImage: IMasterImage = { id, altText: '', order: '', img: res[0] };
      // const value = { imgId: id, variantId, file: event.target.files[0] };
      console.log({ valueImage });
      setSubValue((prevVariant) => ({
        ...prevVariant,
        image: [...prevVariant.image, valueImage],
      }));
    }
  };

  const handleImageTextVariant = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    imgId: string,
  ) => {
    event.preventDefault();
    const { name, value } = event.target;
    console.log('second', value);
    // const imgArray = variants.find((val) => val.id === variantId);
    // const filterdImage = imgArray?.image.filter((arr) => arr.id !== imgId);
    let imgObject = subValue?.image.find((val) => val.id === imgId);
    console.log('h', value);

    if (imgObject) {
      imgObject = { ...imgObject, [name]: value };
    }
    if (imgObject) {
      setSubValue((prevVariant) => ({
        ...prevVariant,
        image:
          (subValue?.image || []).map((val) => (val.id === imgId && imgObject ? imgObject : val)) ||
          [],
      }));
    }
  };
  //   console.log('A', variants);

  const handleRemoveImageVariant = (imgVariantId: string) => {
    // const imgObject = variants.find((val) => val.id === variantId);
    // setVariantImage((varImg) => varImg.filter((img) => img.imgId !== imgVariantId));
    // console.log(imgObject);
    setSubValue((prevVariants) => ({
      ...prevVariants,
      image: subValue.image.filter((img) => img.id !== imgVariantId),
    }));
  };

  return (
    <div className="p-4 bg-white min-w-full border-0 rounded-md ">
      <div className="flex justify-between">
        <h2 className="font-bold">Add Variant</h2>
        <div className="flex gap-2">
          <button
            className="py-1 px-2 sm:px-6 text-sm text-gray-900 font-semibold rounded-md bg-yellow-500"
            type="button"
            onClick={() => handleVariantSubmit()}>
            Save subProduct
          </button>
          <button
            className="py-1 px-2 sm:px-6 text-sm text-gray-900 font-semibold rounded-md bg-gray-300"
            type="button"
            onClick={() => handleRemoveSubVariant(variantId)}>
            Remove
          </button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-6 ">
          <label
            htmlFor="subProductName"
            className="block text-sm font-bold leading-7 text-gray-900">
            SubProduct Name
            <div className="mt-1 font-medium">
              <input
                required
                id="subProductName"
                name="subProductName"
                type="text"
                value={subValue.subProductName}
                placeholder="Enter subProductName "
                onChange={(e) => handleChange(e)}
                className="block w-full rounded-md border-0 p-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </label>
        </div>
        {category &&
          categoryData?.categories?.categories
            ?.find((val: ICategory) => val?._id === category)
            ?.attributes?.map((attribute: any) => (
              <div key={attribute._id}>
                <div className=" font-medium">
                  <Select
                    name={attribute.attributeName}
                    className="block w-full h-11 rounded-md border-0 mt-2 p-3  font-semibold bg-white text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    options={attribute.value.split(',').map((val: any) => ({
                      label: val,
                      value: val,
                    }))}
                    value={subVariants[attribute?.attributeName] || ''}
                    onChange={(e) => handleSubVariantChange(e)}
                    label={attribute.attributeName}
                  />
                </div>
              </div>
            ))}
        <div className="space-y-6 ">
          <label htmlFor="sku" className="block text-sm font-bold leading-7 text-gray-900">
            SKU
            <div className="mt-1 font-medium">
              <input
                required
                id="sku"
                name="sku"
                type="number"
                value={subValue.sku}
                placeholder="Enter SKU number "
                onChange={(e) => handleChange(e)}
                className="block w-full rounded-md border-0 p-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </label>
        </div>

        <div className="space-y-6 ">
          <label htmlFor="price" className="block text-sm font-bold leading-7 text-gray-900">
            Price
            <div className="mt-1 font-medium">
              <input
                required
                id="price"
                name="price"
                type="number"
                value={subValue.price}
                placeholder="Enter price"
                onChange={(e) => handleChange(e)}
                className="block w-full rounded-md border-0 p-2.5 font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
              />
            </div>
          </label>
        </div>
      </div>
      <div className="py-4">
        <label htmlFor="phone" className="block text-sm font-bold leading-6 text-gray-900">
          Description
          <div className="mt-1 font-medium">
            <textarea
              required
              id="description"
              name="description"
              value={subValue.description}
              placeholder="Enter Description here "
              onChange={(e) => handleChange(e)}
              className="block w-full rounded-md border-0 p-2.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  sm:text-sm sm:leading-6"
            />
          </div>
        </label>
      </div>

      <div className=" grid grid-cols-[56px,auto,150px] ">
        <div className="text-gray-900 text-sm">Image</div>
        <div className=" text-gray-900 text-sm">Alt text</div>
        <div className="text-gray-900 text-sm">Order</div>
      </div>

      {subValue?.image.map((img) => {
        console.log('imageText', img);
        // const imgVariant = variantImage.find(
        //   (val) => val.imgId === img.id && val.variantId === variant.id,
        // );
        return (
          <div className=" py-2 min-w-fit flex gap-3" key={img.id}>
            <div className="w-max">
              {img.img && (
                <Image
                  width={30}
                  height={30}
                  className=" w-12 h-9  rounded-md border-1"
                  src={`${process.env.BASE_URL}/images/${img.img}`}
                  alt="default alt"
                />
              )}
            </div>
            <div className="font-medium ">
              <input
                required
                name="altText"
                id="productname"
                type="text"
                value={img.altText}
                placeholder="Enter Alt text "
                onChange={(e) => handleImageTextVariant(e, img.id)}
                className="block w-[50ch] lg:w-[110ch] rounded-md border-0 p-1.5 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-sm sm:text-sm sm:leading-6"
              />
            </div>
            <div className="font-medium ">
              <input
                required
                name="order"
                id="productname"
                type="number"
                value={img.order}
                placeholder="Enter order "
                onChange={(e) => handleImageTextVariant(e, img.id)}
                className="block w-28 rounded-md border-0 p-1.5 font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 placeholder:text-md sm:text-sm sm:leading-6"
              />
            </div>
            <div>
              <button
                type="button"
                aria-label="remove Image"
                onClick={() => handleRemoveImageVariant(img.id)}>
                <div>
                  <AiOutlineClose className="mt-2 text-xl text-gray-500 " />
                </div>
              </button>
            </div>
          </div>
        );
      })}

      <div>
        <input
          className="hidden"
          key={variantId}
          ref={inputFile}
          id="upload-VariantImage"
          type="file"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={(e) => {
            handleAddVariantImage(e);
          }}
        />
        <button
          type="button"
          className="text-yellow-500 font-semibold w-fit"
          onClick={(e) => {
            inputFile?.current?.click();
          }}>
          Upload Your Image
        </button>
      </div>
    </div>
  );
};

export default SubProduct;
