'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiCoinStack } from 'react-icons/bi';
import { BsBoxSeam } from 'react-icons/bs';
import { HiMenu } from 'react-icons/hi';
import { MdOutlineCategory, MdOutlineDashboardCustomize } from 'react-icons/md';
import { PiHouse, PiStorefrontDuotone } from 'react-icons/pi';
import { cn } from '@/utils';

interface IList {
  path: string;
  title: string;
  icon: ReactNode;
}

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const currentPath = usePathname();
  const list: IList[] = [
    {
      path: '/',
      title: 'Dashboard',
      icon: (
        <MdOutlineDashboardCustomize
          className={cn('text-xl text-gray-400 group-hover:text-yellow-500', {
            'text-yellow-500 ': currentPath === '/',
            'text-gray-900 dark:text-white': currentPath !== '/',
          })}
        />
      ),
    },
    {
      path: '/inventory',
      title: 'Inventory',
      icon: (
        <PiStorefrontDuotone
          className={cn('text-xl text-gray-400 group-hover:text-yellow-500', {
            'text-yellow-500 ': currentPath === '/inventory',
            'text-gray-900 dark:text-white': currentPath !== '/inventory',
          })}
        />
      ),
    },
    {
      path: '/warehouse',
      title: 'Warehouse',
      icon: (
        <PiHouse
          className={cn('text-xl text-gray-400 group-hover:text-yellow-500', {
            'text-yellow-500 ': currentPath === '/warehouse',
            'text-gray-900 dark:text-white': currentPath !== '/warehouse',
          })}
        />
      ),
    },
    {
      path: '/category',
      title: 'Category',
      icon: (
        <MdOutlineCategory
          className={cn('text-xl text-gray-400 group-hover:text-yellow-500', {
            'text-yellow-500 ': currentPath === '/category',
            'text-gray-900 dark:text-white': currentPath !== '/category',
          })}
        />
      ),
    },
    {
      path: '/product',
      title: 'Product',
      icon: (
        <BsBoxSeam
          className={cn('text-xl text-gray-400 group-hover:text-yellow-500', {
            'text-yellow-500 ': currentPath === '/product',
            'text-gray-900 dark:text-white': currentPath !== '/product',
          })}
        />
      ),
    },
    {
      path: '/subProduct',
      title: 'Sub Product',
      icon: (
        <BiCoinStack
          className={cn('text-xl text-gray-400 group-hover:text-yellow-500', {
            'text-yellow-500 ': currentPath === '/subProduct',
            'text-gray-900 dark:text-white': currentPath !== '/subProduct',
          })}
        />
      ),
    },
  ];
  return (
    <div className="h-full">
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        id="sidebar"
        onClick={handleToggleMenu}
        className="inline-flex items-center  ms-0 bg-white text-sm text-gray-400 lg:hidden focus:outline-none hover:bg-gray-400 hover:text-white">
        <span className="sr-only">Open sidebar</span>
        <HiMenu className=" w-10 h-10 " />
      </button>
      <aside
        id="default-sidebar"
        className="w-56 h-full overflow-y-hidden  top-0 left-0 z-40 hidden lg:inline-block transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar">
        <div className="h-14 py-4 px-12 border-0 bg-yellow-500 font-bold ">
          <h2>LOGO ADMIN</h2>
          {/* <button
            type="button"
            className={` absolute w-8 h-8  -right-3.5 border-0 font-extrabold bg-neutral-600 text-yellow-500 text-center rounded-full ${
              !isSidebarOpen && 'rotate-180'
            }`}
            onClick={handleToggleMenu}>
            <span className="sr-only">sidbar</span>
            <IoIosArrowBack className="m-px text-3xl" />
          </button> */}
        </div>
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-zinc-700">
          <div className="text-gray-400 text-xs ">
            <p>INVANTORY MANAGEMENT</p>
          </div>
          <ul className="space-y-2 font-medium pt-2.5 ">
            {list.map((val) => (
              <li key={val.path}>
                <Link
                  href={val.path}
                  className={cn(
                    'flex items-center p-2  rounded-lg  hover:bg-gray-100 dark:hover:bg-gray-700  hover:text-yellow-500 group',
                    {
                      'text-yellow-500 ': currentPath === val.path,
                      'text-gray-900 dark:text-white': currentPath !== val.path,
                    },
                  )}>
                  {val.icon}
                  <span className="flex-1 ms-3 whitespace-nowrap">{val.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
};
export default Sidebar;
