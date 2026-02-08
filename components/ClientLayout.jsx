"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ClientLayout({ children }) {
  const pathname = usePathname();

  // Hide navbar on /admin and all sub-routes
  const hideNavbar = pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && (
        <>
          <Navbar />
          <LanguageSwitcher />
        </>
      )}
      <SmoothScroll>
        <div className={!hideNavbar ? "pt-24" : ""}>
          {children}
        </div>
      </SmoothScroll>
    </>
  );
}
