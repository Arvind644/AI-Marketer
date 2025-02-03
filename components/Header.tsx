'use client'

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <Image
                src="/buildclub-long.png"
                alt="Build Club"
                width={120}
                height={32}
                className="h-12 w-auto"
              />
            </Link>
          </div>

          <nav className="flex items-center space-x-8">
            <Link
              href="/create"
              className={`text-gray-600 hover:text-blue-600 transition-colors text-sm ${
                pathname === '/create' ? 'text-blue-600' : ''
              }`}
            >
              Create
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
