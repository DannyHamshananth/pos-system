"use client";
import { usePathname } from "next/navigation";
import Sidebar from "./SideBar"; // your sidebar component

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  //Routes to hide sidebar on `/login`
  const hideSidebarRoutes = ["/login"];

  const shouldHideSidebar = hideSidebarRoutes.includes(pathname);

  return (
    <>
      {!shouldHideSidebar && (<Sidebar />)}
      <div className="flex-1 min-w-[400px] overflow-none">
        {children}
      </div>
    </>
  );
}