import { Sidebar, Navbar } from '@/components';

const Provider = ({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) => (
  // <div
  //   className={`grid h-[100vh] transition-all ${
  //     true ? 'lg:grid-cols-[276px,auto]' : 'lg:grid-cols-[76px,auto]'
  //   } lg:grid-rows-[64px,auto,auto,64px] grid-cols-[1fr] grid-rows-[0px,64px,auto]`}>
  //   <div className="sticky top-0 z-40 lg:col-span-2  bg-[#c08bfd] lg:row-span-1">Header</div>
  //   <div className="lg:col-span-1 lg:row-span-4 ease-in-out duration-300 bg-yellow-300">
  //     Sidebar
  //   </div>
  //   <div className="lg:col-span-1 lg:row-span-4 bg-green-300">Main</div>
  //   <div className="lg:col-span-2 bg-[#c08bfd] lg:row-span-1">Footer</div>
  // </div>
  <div className=" grid grid-cols-[40px,auto] lg:grid-cols-[224px,auto] grid-rows-[40px,auto] lg:grid-rows-[58px,auto]">
    <div className="overflow-y-hidden h-screen fixed col-span-none lg:col-span-1 row-span-1 lg:row-span-2 ">
      <Sidebar />
    </div>
    <div className="sticky top-0 z-40 col-span-1 col-start-2 lg:col-start-2 lg:col-span-2 row-span-none">
      <Navbar />
    </div>
    <div className="p-3 sm:p-6 col-start-1 lg:col-start-2 col-span-2 lg:col-span-2 row-span-1 ">
      {children}
    </div>
  </div>
  // <div className="h-[100vh] grid lg:grid-cols-[224px,auto] grid-rows-[40px,auto] grid-cols-[40px,auto] lg:grid-rows-[76px,auto]">
  //   <div className="col-span-none lg:col-span-1 row-span-none lg:row-span-1">
  //     <Sidebar />
  //   </div>
  //   <div className="col-start-2 col-span-1 lg:col-span-1 lg:row-span-1">
  //     <Navbar />
  //   </div>
  //   <div className="lg:col-start-2  lg:row-span-1 col-span-2 lg:col-span-1 p-6">{children}</div>
  // </div>
);
export default Provider;

// {
//   /* <div
//   className={`grid h-[100vh] transition-all ${
//     true ? 'lg:grid-cols-[276px,auto]' : 'lg:grid-cols-[76px,auto]'
//   } lg:grid-rows-[64px,auto,auto,64px] grid-cols-[1fr] grid-rows-[0px,64px,auto]`}>
//   <div className="sticky top-0 z-40 lg:col-span-2  bg-[#c08bfd] lg:row-span-1">Header</div>
//   <div className="lg:col-span-1 lg:row-span-4 ease-in-out duration-300 bg-yellow-300">
//     Sidebar
//   </div>
//   <div className="lg:col-span-1 lg:row-span-4 bg-green-300">Main</div>
//   <div className="lg:col-span-2 bg-[#c08bfd] lg:row-span-1">Footer</div>
// </div> */
// }
