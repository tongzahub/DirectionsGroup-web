'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AboutSection } from '@/types';

interface AboutSubmenuProps {
  sections: AboutSection[];
}

export default function AboutSubmenu({ sections }: AboutSubmenuProps) {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-neutral-gray-light sticky top-0 z-40">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex overflow-x-auto scrollbar-hide">
          <Link
            href="/about"
            className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              pathname === '/about'
                ? 'border-primary-blue text-primary-blue'
                : 'border-transparent text-neutral-gray-dark hover:text-primary-blue hover:border-neutral-gray-light'
            }`}
          >
            Overview
          </Link>
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/about/${section.slug}`}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                pathname === `/about/${section.slug}`
                  ? 'border-primary-blue text-primary-blue'
                  : 'border-transparent text-neutral-gray-dark hover:text-primary-blue hover:border-neutral-gray-light'
              }`}
            >
              {section.title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
