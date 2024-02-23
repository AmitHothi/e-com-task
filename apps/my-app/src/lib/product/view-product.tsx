// /* eslint-disable jsx-a11y/control-has-associated-label */

// 'use client';

// import React, { WheelEvent, WheelEventHandler, useState } from 'react';
// import Image from 'next/image';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useQuery } from '@apollo/client';
// import { AiOutlineDelete } from 'react-icons/ai';
// import { CiEdit, CiImport } from 'react-icons/ci';
// import { FaPlus } from 'react-icons/fa6';
// import Breadcrumbs from '@/components/Breadcrumbs';
// import GET_MASTERPRODUCT_BY_ID from '@/graphql/schema/queries/masterProductById.graphql';
// import { BreadcrumbItem, ICategory, IMasterProduct } from '@/types';
// import { cn } from '@/utils';
// import MyImage from '../../../public/IMG_20210330_194930.jpg';

// export interface IMasterProductId {
//   id: string;
// }

// const ViewProduct = ({ id }: IMasterProductId) => {
//   const breadcrumbs: BreadcrumbItem[] = [{ label: '/Product/UserView', link: '/product/id' }];

//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const masterProductId = searchParams.get('id');
//   console.log('search', masterProductId);

//   console.log('viewId', id);

//   const [zoomLevel, setZoomLevel] = useState(0.75);
//   const [selectedImage, setSelectedImage] = useState('');

//   const handleMouseEnter = () => {
//     setZoomLevel(1.5);
//   };

//   const handleMouseLeave = () => {
//     setZoomLevel(0.75);
//   };

//   const handleMouseWheel = (event: WheelEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     const delta = event.deltaY;
//     setZoomLevel((prevZoomLevel) => {
//       const newZoomLevel = prevZoomLevel - delta / 1000;
//       return Math.max(1, Math.min(newZoomLevel, 3));
//     });
//   };

//   const { data: masterProductByIdData, loading: masterProductByIdLoading } = useQuery(
//     GET_MASTERPRODUCT_BY_ID,
//     {
//       fetchPolicy: 'network-only',
//       variables: { id },
//       onCompleted(data) {
//         const defaultImage = data?.getMasterProduct?.images[0]?.img;
//         setSelectedImage(`${process.env.BASE_URL}/images/${defaultImage}`);
//       },
//     },
//   );

//   if (masterProductByIdLoading) {
//     return <div>Loading....</div>;
//   }

//   if (!masterProductByIdData) {
//     return <div>Error... data not found</div>;
//   }

//   console.log('Productid', masterProductByIdData);

//   const handleSubmit = () => {
//     router.push('/product/add');
//   };

//   // const handleImageSelect = (imageId: string) => {
//   //   setSelectedImageId(imageId);
//   // };

//   const { images } = masterProductByIdData.getMasterProduct;
//   console.log('selectedImageId:', selectedImage);
//   console.log('images:', images);
//   // const selectedImage = images?.find((img: any) => img.id === selectedImageId);
//   // console.log('img', selectedImage);
//   return (
//     <div className={cn('flex flex-col gap-4')}>
//       <div>
//         <Breadcrumbs items={breadcrumbs} />

//         <div className="flex justify-between ">
//           <div className="font-bold text-2xl "> User View</div>
//           <div className="flex flex-row gap-4">
//             <button
//               type="button"
//               // onClick={handleClose}
//               className=" p-1.5 text-gray-900 border-0 rounded-md bg-gray-300 flex gap-1">
//               <CiImport className="text-lg  mt-0.5" />
//               import
//             </button>
//             <button
//               type="submit"
//               onClick={handleSubmit}
//               className="p-1.5 text-gray-900 border-0  rounded-md bg-yellow-500 flex gap-1">
//               <FaPlus className="text-lg mt-0.5" />
//               Add Product
//             </button>
//           </div>
//         </div>
//       </div>
//       <div className="h-fit p-2 bg-white rounded-t-lg">
//         <div className="flex flex-row justify-between">
//           <div className={cn('  bg-green-500 flex flex-col gap-4')}>
//             <div>
//               {/* // onMouseEnter={handleMouseEnter}
//               // onMouseLeave={handleMouseLeave}
//               // onWheel={handleMouseWheel}
//               // style={{ transform: `scale(${zoomLevel})` }}> */}
//               {selectedImage && (
//                 <Image
//                   className="rounded-md border-2 border-black"
//                   src={selectedImage}
//                   alt="user"
//                   objectFit="cover"
//                   width={200}
//                   height={200}
//                 />
//               )}
//             </div>
//             <div className="text-red-500 text-center text-xs">rollover image zoom in</div>
//             <div className="px-8 flex flex-row gap-4">
//               {masterProductByIdData?.getMasterProduct?.images.map((image: any, index: number) => (
//                 <button
//                   type="button"
//                   onClick={() => setSelectedImage(`${process.env.BASE_URL}/images/${image?.img}`)}>
//                   <span className="sr-only">Image buttoon</span>
//                   <Image
//                     className="rounded-sm "
//                     width={50}
//                     height={60}
//                     src={`${process.env.BASE_URL}/images/${image?.img}`}
//                     alt={`Image ${index + 1}`}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="flex flex-col gap-3 bg-purple-400">
//             <div className="flex justify-between">
//               <div className="text-gray-500 py-1">
//                 {masterProductByIdData?.getMasterProduct?.category?.categoryName}
//               </div>
//               <div className="flex mx-4 gap-2">
//                 <button type="button">
//                   <CiEdit className="text-xl text-black" />
//                 </button>
//                 <button type="button">
//                   <AiOutlineDelete className="text-xl text-black" />
//                 </button>
//               </div>
//             </div>
//             <div className="font-bold text-lg">
//               {masterProductByIdData?.getMasterProduct?.masterProductName}
//               <div className="font-semibold text-xs text-gray-500 font-normal">
//                 ID: {masterProductByIdData?.getMasterProduct?._id} | SKU:{' '}
//                 {masterProductByIdData?.getMasterProduct?.sku}
//               </div>
//             </div>
//             <div className="text-gray-500">
//               {masterProductByIdData?.getMasterProduct?.description}
//             </div>
//             <hr className="border-[1px] border-gray-200" />
//             <div className="font-semibold">Rs.430/-</div>

//             <div className="font-semibold ">
//               Category :&nbsp;
//               {masterProductByIdData?.getMasterProduct?.category?.categoryName}
//             </div>
//             {masterProductByIdData?.getMasterProduct?.attributes.map((attribute: any) => {
//               console.log('attr', masterProductByIdData?.getMasterProduct?.attributes);
//               return (
//                 <div key={attribute._id} className="text-xs">
//                   <b>{attribute?.attributeName} :</b> &nbsp;
//                   {attribute?.value}{' '}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default ViewProduct;
