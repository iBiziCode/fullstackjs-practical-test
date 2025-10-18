'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation'; // to get the current path

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // Get the current path

  const isActive = (path: string) => pathname === path ? 'text-blue-600' : '';

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </Button>

      {open && (
        <>
        
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setOpen(false)}
          />

          <div
            className={`fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg border-l p-5 flex flex-col justify-between transform transition-transform duration-300 ${
              open ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={20} />
                </Button>
              </div>

              <nav className="flex flex-col gap-3">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium hover:text-blue-600 ${isActive('/')}`}
                >
                  Home
                </Link>
                <Link
                  href="/users/list"
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium hover:text-blue-600 ${isActive('/users/list')}`}
                >
                  Users
                </Link>
                <Link
                  href="/users/create"
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium hover:text-blue-600 ${isActive('/users/create')}`}
                >
                  Create User
                </Link>
                <Link
                  href="/users/proto"
                  onClick={() => setOpen(false)}
                  className={`text-sm font-medium hover:text-blue-600 ${isActive('/users/proto')}`}
                >
                  Verified Users Proto
                </Link>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
