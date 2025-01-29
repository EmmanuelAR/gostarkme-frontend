import { ReactNode } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { navItems } from "@/constants";

interface BoundedProps {
  children: ReactNode;
  className?: string;
}

const Bounded = ({ children, className }: BoundedProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        logoSrc={process.env.NEXT_PUBLIC_APP_ROOT + "icons/starklogo.png"}
        logoAlt="Go Stark Me logo"
        title="Go Stark Me"
        navItems={navItems}
      />
      <main
        className={`flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-6  rounded-lg ${className}`} // bg-gray-50 shadow-md
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Bounded;
