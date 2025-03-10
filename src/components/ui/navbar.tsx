"use client";

import Link from "next/link";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger,SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-mono text-gray-900 dark:text-white">
        Personal Finance Visualizer
        </Link>

        <div className="hidden md:flex gap-6">
          <Link href="/" className="text-gray-700 font-mono dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Home
          </Link>
          <Link href="/dashboard" className="text-gray-700 font-mono dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Dashboard
          </Link>
          <Link href="/budget" className="text-gray-700 font-mono dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Budget
          </Link>
        </div>

        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
            <SheetTitle></SheetTitle>
              <div className="flex flex-col gap-4 p-4">
                <Link href="/" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  Home
                </Link>
                <Link href="/dashboard" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/budget" className="text-lg font-semibold" onClick={() => setIsOpen(false)}>
                  Budget
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
