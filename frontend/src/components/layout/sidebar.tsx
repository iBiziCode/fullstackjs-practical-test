'use client';

import Link from 'next/link';
import { Home, Users, FileCode, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation'; 

export function Sidebar() {
  const pathname = usePathname(); 

  const isActive = (path: string) => pathname === path ? 'text-blue-600' : '';

  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r bg-white dark:bg-gray-900 p-4">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      <nav className="flex flex-col gap-3">
        <Link
          href="/"
          className={`flex items-center gap-2 hover:text-blue-600 ${isActive('/')}`}
        >
          <Home size={18} /> Home
        </Link>
        <Link
          href="/users/list"
          className={`flex items-center gap-2 hover:text-blue-600 ${isActive('/users/list')}`}
        >
          <Users size={18} /> Users
        </Link>
        <Link
          href="/users/create"
          className={`flex items-center gap-2 hover:text-blue-600 ${isActive('/users/create')}`}
        >
          <Plus size={18} /> Create User
        </Link>
        <Link
          href="/users/proto"
          className={`flex items-center gap-2 hover:text-blue-600 ${isActive('/users/proto')}`}
        >
          <FileCode size={18} /> Verified Users Proto
        </Link>
      </nav>
    </aside>
  );
}
