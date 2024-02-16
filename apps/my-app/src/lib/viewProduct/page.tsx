/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import React, { WheelEvent, WheelEventHandler, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit, CiImport } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa6';
import Breadcrumbs from '@/components/Breadcrumbs';
import GET_MASTERPRODUCT_BY_ID from '@/graphql/schema/queries/masterProductById.graphql';
import { BreadcrumbItem, ICategory, IMasterProduct } from '@/types';
import MyImage from '../../../public/IMG_20210330_194930.jpg';

export interface IMasterProductId {
  id: string;
}

const ViewProduct = ({ id }: IMasterProductId) => {
  const breadcrumbs: BreadcrumbItem[] = [{ label: '/Product/UserView', link: '/product/id' }];

  const router = useRouter();
  const searchParams = useSearchParams();

  const masterProductId = searchParams.get('id');
  console.log('search', masterProductId);

  console.log('viewId', id);

  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [selectedImage, setSelectedImage] = useState('');

  const handleMouseEnter = () => {
    setZoomLevel(1.5);
  };

  const handleMouseLeave = () => {
    setZoomLevel(0.75);
  };

  const handleMouseWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY;
    setZoomLevel((prevZoomLevel) => {
      const newZoomLevel = prevZoomLevel - delta / 1000;
      return Math.max(1, Math.min(newZoomLevel, 3));
    });
  };

  const { data: masterProductByIdData, loading: masterProductByIdLoading } = useQuery(
    GET_MASTERPRODUCT_BY_ID,
    {
      fetchPolicy: 'network-only',
      variables: { id },
      onCompleted(data) {
        const defaultImage = data?.getMasterProduct?.images[0]?.img;
        setSelectedImage(`${process.env.BASE_URL}/images/${defaultImage}`);
      },
    },
  );

  if (masterProductByIdLoading) {
    return <div>Loading....</div>;
  }

  if (!masterProductByIdData) {
    return <div>Error... data not found</div>;
  }

  console.log('Productid', masterProductByIdData);

  const handleSubmit = () => {
    router.push('/product/add');
  };

  // const handleImageSelect = (imageId: string) => {
  //   setSelectedImageId(imageId);
  // };

  const { images } = masterProductByIdData.getMasterProduct;
  console.log('selectedImageId:', selectedImage);
  console.log('images:', images);
  // const selectedImage = images?.find((img: any) => img.id === selectedImageId);
  // console.log('img', selectedImage);
  return (
    <div>
      <Breadcrumbs items={breadcrumbs} />
      <div className="flex justify-between ">
        <h1 className="font-bold text-2xl "> User View</h1>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            // onClick={handleClose}
            className="ml-6 py-1 px-2 w-24 text-gray-900 border-0 rounded-md bg-gray-300 flex gap-1">
            <CiImport className="text-lg  mt-0.5" />
            import
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="py-1.5 px-2 text-sm text-gray-900 border-0  rounded-md bg-yellow-500 flex gap-1">
            <FaPlus className="text-lg mt-0.5" />
            Add Product
          </button>
        </div>
      </div>
      <div className="mt-4 h-full  rounded-t-sm">
        <div className=" grid grid-cols-2">
          <div className=" my-6 md:my-6 items-center col-start-1 ">
            <div className="pl-32 flex flex-col">
              <div
                className="px-12 w-fit h-fit"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onWheel={handleMouseWheel}
                style={{ transform: `scale(${zoomLevel})` }}>
                {selectedImage && (
                  <Image
                    className=" rounded-md border-2 border-black"
                    src={selectedImage}
                    alt="user"
                    objectFit="cover"
                    width={250}
                    height={200}
                  />
                )}
              </div>
              <div className="mx-16 bg-red-300 text-gray-500 text-xs">rollover image zoom in</div>
              <div className="px-8 flex flex-row gap-4">
                {masterProductByIdData?.getMasterProduct?.images.map(
                  (image: any, index: number) => (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImage(`${process.env.BASE_URL}/images/${image?.img}`)
                      }>
                      <span className="sr-only">Image buttoon</span>
                      <Image
                        className="rounded-sm "
                        width={50}
                        height={60}
                        src={`${process.env.BASE_URL}/images/${image?.img}`}
                        alt={`Image ${index + 1}`}
                      />
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="ml-2 lg:ml-0 lg:my-6 col-start-2 text-left">
            <div>
              <div className="flex justify-between">
                <div className="text-gray-500 py-1">
                  <p>{masterProductByIdData?.getMasterProduct?.category?.categoryName}</p>
                </div>
                <div className="flex mx-4 gap-2">
                  <button type="button">
                    <CiEdit className="text-xl text-black" />
                  </button>
                  <button type="button">
                    <AiOutlineDelete className="text-xl text-black" />
                  </button>
                </div>
              </div>

              <div>
                <h1 className="font-bold text-lg">
                  {masterProductByIdData?.getMasterProduct?.masterProductName} <br />
                  <p className="text-xs text-gray-500 font-normal">
                    ID: {masterProductByIdData?.getMasterProduct?._id} | SKU:{' '}
                    {masterProductByIdData?.getMasterProduct?.sku}
                  </p>{' '}
                </h1>
              </div>
              <div>
                <p className="py-3 text-gray-500">
                  {masterProductByIdData?.getMasterProduct?.description}
                </p>
              </div>
              <hr className="border-[1px] border-gray-200" />
              <div className="flex flex-col pt-4">
                <div className="py- font-bold">
                  <h2> Rs.430/- </h2>
                </div>
                <div className="py-2">
                  <h5 className="font-semibold ">
                    Category :{masterProductByIdData?.getMasterProduct?.category?.categoryName}
                  </h5>
                  {masterProductByIdData?.getMasterProduct?.attriburtes.map((attribute: any) => {
                    console.log('attr', masterProductByIdData?.getMasterProduct?.attriburtes);
                    return (
                      <div key={attribute._id}>
                        <p className="flex gap-[57px]">
                          <b className="text-sm">{attribute?.attributeName} :</b> {attribute?.value}{' '}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewProduct;
