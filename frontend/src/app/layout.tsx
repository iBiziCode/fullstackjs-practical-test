import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileMenu } from '@/components/layout/mobilemenu';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex bg-gray-50 min-h-screen text-gray-900">
        <AppProvider>
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <header className="flex justify-between items-center p-4 border-b bg-white shadow-sm md:hidden">
              <h1 className="font-bold text-lg">Dashboard</h1>
              <MobileMenu />
            </header>
            <main className="p-4 flex-1">{children}</main>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
