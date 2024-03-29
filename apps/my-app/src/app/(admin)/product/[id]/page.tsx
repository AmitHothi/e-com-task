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
import DELETE_MASTERPRODUCT from '@/graphql/schema/mutations/deleteMasterProduct.graphql';
import GET_MASTERPRODUCT_BY_ID from '@/graphql/schema/queries/masterProductById.graphql';
import { BreadcrumbItem } from '@/types';
import { cn } from '@/utils';

export interface IMasterProductId {
  id: string;
}

const ViewProduct = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const breadcrumbs: BreadcrumbItem[] = [{ label: '/Product/UserView', link: '/product/id' }];
  const router = useRouter();
  const searchParams = useSearchParams();
  // const masterProductId = searchParams.get('id');
  // console.log('search-id', masterProductId);
  console.log('viewM_Id', id);

  const [zoomLevel, setZoomLevel] = useState(0.75);
  const [selectedImage, setSelectedImage] = useState('');

  // function for image zoomIn
  const handleMouseEnter = () => {
    setZoomLevel(1.1);
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
      return Math.max(1, Math.min(newZoomLevel, 3));
    });
  };

  const [
    DeleteMasterProductById,
    {
      data: deleteMasterProductData,
      loading: deleteMasterProductLoading,
      error: deleteMasterProductError,
    },
  ] = useMutation(DELETE_MASTERPRODUCT, {
    fetchPolicy: 'network-only',
  });

  const handleEditMasterproduct = (masterProductById: string) => {
    router.push(`/product/update/${masterProductById}`);
  };

  const handleDeleteMasterproduct = (masterProductById: string) => {
    DeleteMasterProductById({
      variables: {
        id: masterProductById,
      },
    })
      .then((res) => {
        console.log('delete', res.data);
        alert('are you sure want to delete');
        router.push('/product');
      })
      .catch((err) => console.log(err));
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
  console.log('MasterProduct_ById', masterProductByIdData);

  if (masterProductByIdLoading) {
    return <div className="text-green-600 font-semibold">Loading....</div>;
  }

  if (!masterProductByIdData) {
    return <div>Error... data not found</div>;
  }

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
      <div className="h-fit  px-2 py-4 bg-white rounded-t-lg">
        <div className=" flex flex-row ">
          <div className={cn('px-16 flex flex-col')}>
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
                  width={350}
                  height={400}
                />
              )}
            </div>
            <div className="text-gray-500 text-center text-xs">rollover image zoom in</div>
            <div className=" mx-6 flex flex-row gap-4">
              {masterProductByIdData?.getMasterProduct?.images.map((image: any, index: number) => (
                <button
                  type="button"
                  onClick={() => setSelectedImage(`${process.env.BASE_URL}/images/${image?.img}`)}>
                  <span className="sr-only">Image buttoon</span>
                  <Image
                    className="rounded-sm "
                    width={70}
                    height={70}
                    src={`${process.env.BASE_URL}/images/${image?.img}`}
                    alt={`Image ${index + 1}`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between">
              <div className="text-gray-500 py-1">
                {masterProductByIdData?.getMasterProduct?.category?.categoryName}
              </div>
              <div className="flex mx-4 gap-2">
                <button type="button" onClick={() => handleEditMasterproduct(id)}>
                  <CiEdit className="text-xl text-black" />
                </button>
                <button type="button" onClick={() => handleDeleteMasterproduct(id)}>
                  <AiOutlineDelete className="text-xl text-black" />
                </button>
              </div>
            </div>
            <div className="font-bold text-lg">
              {masterProductByIdData?.getMasterProduct?.masterProductName}
              <div className="font-normal text-xs text-gray-500">
                ID: {masterProductByIdData?.getMasterProduct?._id} | SKU:
                {masterProductByIdData?.getMasterProduct?.sku}
              </div>
            </div>
            <div className="text-gray-500">
              {masterProductByIdData?.getMasterProduct?.description}
            </div>
            <hr className="border-[1px] border-gray-200" />
            <div className="font-semibold">Rs.430/-</div>

            <div className="font-semibold ">
              Category :&nbsp;
              {masterProductByIdData?.getMasterProduct?.category?.categoryName}
            </div>
            {masterProductByIdData?.getMasterProduct?.attributes.map((attribute: any) => (
              <div key={attribute._id} className="text-xs">
                <b>{attribute?.attributeName} :</b> &nbsp;
                {attribute?.value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ViewProduct;
