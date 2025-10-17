'use client';

import Link from 'next/link';
import { Home, Users, FileCode, Plus } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 h-screen border-r bg-white dark:bg-gray-900 p-4">
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      <nav className="flex flex-col gap-3">
        <Link href="/" className="flex items-center gap-2 hover:text-blue-600">
          <Home size={18} /> Home
        </Link>
        <Link href="/users" className="flex items-center gap-2 hover:text-blue-600">
          <Users size={18} /> Users
        </Link>
        <Link href="/users/create" className="flex items-center gap-2 hover:text-blue-600">
          <Plus size={18} /> Create User
        </Link>
        <Link href="/export" className="flex items-center gap-2 hover:text-blue-600">
          <FileCode size={18} /> Export Proto
        </Link>
      </nav>
    </aside>
  );
}
