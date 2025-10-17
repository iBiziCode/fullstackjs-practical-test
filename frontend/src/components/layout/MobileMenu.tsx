'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden bg-red-500">
      <Button className="" variant="outline" size="icon" onClick={() => setOpen(!open)}>
        <Menu size={20} />
      </Button>
      {open && (
        <div className="absolute top-12 right-0 left-0 w-full max-w-xs bg-white shadow-lg rounded-md border p-3 z-50 overflow-auto">
          <nav className="flex flex-col gap-2">
            <Link href="/" onClick={() => setOpen(false)}>Home</Link>
            <Link href="/users" onClick={() => setOpen(false)}>Users</Link>
            <Link href="/users/create" onClick={() => setOpen(false)}>Create User</Link>
            <Link href="/export" onClick={() => setOpen(false)}>Export Proto</Link>
          </nav>
        </div>
      )}
    </div>
  );
}
