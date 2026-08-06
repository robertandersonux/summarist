"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import SearchBar from "./SearchBar";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome = pathname === "/" || pathname === "/choose-plan";

  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <div className="app__shell">
      <Sidebar />
      <div className="app__main">
        <SearchBar />
        <div className="app__content">{children}</div>
      </div>
    </div>
  );
}