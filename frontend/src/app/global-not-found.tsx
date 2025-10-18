import './globals.css';

import { Sidebar } from '@/components/layout/sidebar';
import { MobileMenu } from '@/components/layout/mobilemenu';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex bg-gray-50 min-h-screen text-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm md:hidden">
              <h1 className="font-bold text-lg">Dashboard</h1>
              <MobileMenu />
            </header>
            <main className="p-3 flex-1 flex flex-col justify-center items-center text-center gap-4">
              <p className='text-sm md:text-md'>404 page not found</p>
              <p className='text-sm md:text-md'>But don't worry you are not lost, you can always go back, using the navigation menu or the button below.</p>
              <a href="/" className="inline-block  px-6 py-3 bg-primary text-white rounded-md transition">
                Take Me Home
              </a>
            </main>
          </div>
      </body>
    </html>
  );
}