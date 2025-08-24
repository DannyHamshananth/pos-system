"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./SideBar"; // your sidebar component
import { Providers } from './provider';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  //Routes to hide sidebar on `/login`
  const hideSidebarRoutes = ["/login"];

  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <div className="flex min-h-screen">
      <Providers>
        {!shouldHideSidebar && (<Sidebar />)}
        <div className="flex-1 min-w-[400px] overflow-none md:ml-20">
          {children}
        </div>
      </Providers>
    </div>
  );
}