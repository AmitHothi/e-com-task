// import ViewProduct from '@/lib/product/view-product';

// const ViewProductPage = ({ params }: { params: { id: string } }) => (
//   <ViewProduct id={params.id} key={params.id} />
// );

// export default ViewProductPage;

/* eslint-disable jsx-a11y/control-has-associated-label */

'use client';

import React, { WheelEvent, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@apollo/client';
import { AiOutlineDelete } from 'react-icons/ai';
import { CiEdit, CiImport } from 'react-icons/ci';
import { FaPlus } from 'react-icons/fa6';
import Breadcrumbs from '@/components/Breadcrumbs';
import DELETE_SUBPRODUCT from '@/graphql/schema/mutations/deleteSubProduct.graphql';
import CATEGORY_BY_ID from '@/graphql/schema/queries/categoryById.graphql';
import GET_MASTERPRODUCT_BY_ID from '@/graphql/schema/queries/masterProductById.graphql';
import GET_SUBPRODUCT_BY_ID from '@/graphql/schema/queries/subProductById.graphql';
import { BreadcrumbItem } from '@/types';
import { cn } from '@/utils';

export interface ISubProductId {
  id: string;
}

const ViewSubProduct = ({ params }: { params: { id: string } }) => {
  // const { id } = params;
  const breadcrumbs: BreadcrumbItem[] = [
    { label: '/SubProduct/ViewSubProduct', link: '/subProduct/id' },
  ];
  const router = useRouter();
  // const searchParams = useSearchParams();
  //   const subProductId = searchParams.get('id');
  //   console.log('suPrdouctsearch', subProductId);
  console.log('viewId', params.id);

  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [selectedImage, setSelectedImage] = useState('');

  // const data = { firstName: 'John', lastName: 'Doe', email: 'john.doe@gmail.com' };
  // const output = Object.entries(data).map(([key, value]) => ({ key: 'xyz', value: 'abc ' }));
  // console.log(output);

  // function for image zoomIn
  const handleMouseEnter = () => {
    setZoomLevel(1);
  };

  // function for image zoomOut
  const handleMouseLeave = () => {
    setZoomLevel(0.75);
  };

  // function for image zoom in-out
  const handleMouseWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    const delta = event.deltaY;
    setZoomLevel((prevZoomLevel) => {
      const newZoomLevel = prevZoomLevel - delta / 1000;
      return Math.max(1, Math.min(newZoomLevel, 2));
    });
  };

  const [DeleteSubProductById] = useMutation(DELETE_SUBPRODUCT, {
    fetchPolicy: 'network-only',
  });

  const handleDeleteSubproduct = (subProductId: string) => {
    DeleteSubProductById({
      variables: {
        id: subProductId,
      },
    })
      .then((res) => {
        console.log('del', res.data);
        router.push('/subproduct');
      })
      .catch((err) => console.log(err));
  };

  const { data: categoryByIdData, loading: categoryByIdLoading } = useQuery(CATEGORY_BY_ID, {
    fetchPolicy: 'network-only',
    variables: { id: params.id },
  });
  console.log('categoryByIdData', categoryByIdData);

  const { data: subProductByIdData, loading: subProductByIdLoading } = useQuery(
    GET_SUBPRODUCT_BY_ID,
    {
      fetchPolicy: 'network-only',
      variables: { id: params.id },
      onCompleted(data) {
        const defaultImage = data?.getOneSubProductById?.customImages[0]?.img;
        setSelectedImage(`${process.env.BASE_URL}/images/${defaultImage}`);
      },
    },
  );
  console.log('subid-data', subProductByIdData);

  if (subProductByIdLoading) {
    return <div className="text-green-600 font-semibold">Sub-product Loading....</div>;
  }

  if (!subProductByIdData) {
    return <div>Error... data not found</div>;
  }
  console.log('SubProductid', subProductByIdData);

  const handleSubmit = () => {
    router.push('/product/add');
  };

  // const handleImageSelect = (imageId: string) => {
  //   setSelectedImageId(imageId);
  // };

  const { images } = subProductByIdData.getOneSubProductById;
  console.log('selectedImageId:', selectedImage);
  console.log('images:', images);
  // const selectedImage = images?.find((img: any) => img.id === selectedImageId);
  // console.log('img', selectedImage);

  const subVariantArray = Object.entries(subProductByIdData?.getOneSubProductById?.subVariant);
  console.log('array', subVariantArray);

  return (
    <div className={cn('flex flex-col gap-4')}>
      <div>
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex justify-between ">
          <div className="font-bold text-2xl "> User View</div>
          <div className="flex flex-row gap-4">
            <button
              type="button"
              // onClick={handleClose}
              className=" p-1.5 text-gray-900 border-0 rounded-md bg-gray-300 flex gap-1">
              <CiImport className="text-lg  mt-0.5" />
              import
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="p-1.5 text-gray-900 border-0  rounded-md bg-yellow-500 flex gap-1">
              <FaPlus className="text-lg mt-0.5" />
              Add Product
            </button>
          </div>
        </div>
      </div>
      <div className="h-fit  p-2 bg-white rounded-t-lg">
        <div className=" flex flex-row ">
          <div className={cn('px-24 flex flex-col')}>
            <div
              className="mb-auto"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onWheel={handleMouseWheel}
              style={{ transform: `scale(${zoomLevel})` }}>
              {selectedImage && (
                <Image
                  className="rounded-md border-2 border-black"
                  src={selectedImage}
                  alt="user"
                  objectFit="cover"
                  width={300}
                  height={400}
                />
              )}
            </div>
            <div className="text-gray-500 text-center text-xs">rollover image zoom in</div>
            <div className=" mx-6 flex flex-row gap-4">
              {subProductByIdData?.getOneSubProductById?.customImages.map(
                (image: any, index: number) => (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(`${process.env.BASE_URL}/images/${image?.img}`)
                    }>
                    <span className="sr-only">Image buttoon</span>
                    <Image
                      className="rounded-sm "
                      width={70}
                      height={70}
                      src={`${process.env.BASE_URL}/images/${image?.img}`}
                      alt={`Image ${index + 1}`}
                    />
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="text-gray-500 py-1">
                {/* {subProductByIdData?.getMasterProduct?.category?.categoryName} */}
              </div>
              <div className="flex mx-4 gap-2">
                <button type="button">
                  <CiEdit className="text-xl text-black" />
                </button>
                <button type="button" onClick={() => handleDeleteSubproduct(params.id)}>
                  <AiOutlineDelete className="text-xl text-black" />
                </button>
              </div>
            </div>
            <div className="font-bold text-lg">
              {subProductByIdData?.getOneSubProductById?.subProductName}
              <div className="font-normal text-xs text-gray-500">
                ID: {subProductByIdData?.getOneSubProductById?._id} | SKU:
                {subProductByIdData?.getOneSubProductById?.sku}
              </div>
            </div>
            <div className="text-gray-500">
              {subProductByIdData?.getOneSubProductById?.description}
            </div>
            <hr className="border-[1px] border-gray-200" />
            <div className="font-semibold">
              Price:&nbsp;{subProductByIdData?.getOneSubProductById?.prices}/-
            </div>

            <div className="font-semibold ">
              {/* Category :&nbsp;
              {subProductByIdData?.getOneSubProductById?.category?.categoryName} */}
            </div>
            {subVariantArray.map(([key, value]: any) => {
              console.log('first', { key: 'xyz', value: 'amit' });
              return (
                <div className="text-xs">
                  <b>{key}</b>: &nbsp;{value}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewSubProduct;
