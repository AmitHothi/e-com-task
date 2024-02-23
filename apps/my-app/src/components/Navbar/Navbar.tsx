'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deleteCookie } from 'cookies-next';
import MyImage from '../../../public/IMG_20210330_194930.jpg';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    deleteCookie('token');
    deleteCookie('refreshToken');
    router.push('/login');
    // onLogout();
    // handleToggleMenu();
  };

  return (
    <div className=" w-full shadow-md">
      <nav className="h-10 lg:h-14 bg-white border-gray-20 shadow-b-md">
        <div className="flex justify-between">
          <div className="w-6/12 p-2 lg:p-4 ">
            <div className="  inset-y-0 start-0 flex ps-3 pointer-events-none">
              <svg
                className="absolute my-1.5 w-3 h-3 text-gray-500 dark:text-gray-400 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20">
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search icon</span>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="w-full h-6 ps-8 text-s text-gray-900 border border-gray-300 rounded-full bg-white  dark:placeholder-gray-400 dark:focus:border-gray-500"
              placeholder="Search..."
            />
          </div>
          <div>
            <div>
              <button
                type="button"
                className="flex ml-auto py-1 lg:py-2 px-2  w-fit  rounded-full md:me-0 "
                id="user-menu-button"
                onClick={handleToggleMenu}
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown">
                <span className="sr-only">Open user menu</span>
                <Image className=" w-8 lg:w-10 rounded-full" src={MyImage} alt="user" />
              </button>
            </div>

            <div className="relative">
              {isOpen && (
                <div className="bg-white border-2 rounded-md  shadow-y-2xl text-sm w-32 flex flex-col py-1 px-2">
                  <button
                    type="button"
                    className="items-center my-1 p-2 text-gray-900  rounded-md hover:bg-gray-100 dark:hover:bg-zinc-200 group">
                    Profile
                  </button>
                  <hr />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="items-center my-1 p-2 text-gray-900 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-200 group">
                    LogOut
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
