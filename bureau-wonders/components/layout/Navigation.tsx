'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationItem } from '@/types';

interface NavigationProps {
  items: NavigationItem[];
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export default function Navigation({
  items,
  isMobile,
  isOpen,
  onClose,
}: NavigationProps) {
  const pathname = usePathname();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isOpen]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Handle smooth scroll for anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      onClose();
    } else {
      onClose();
    }
  };

  if (!isMobile) {
    // Desktop navigation (inline)
    return (
      <nav className="flex items-center space-x-1 lg:space-x-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={(e) => handleLinkClick(e, item.href)}
            className={`px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-all duration-200 ${
              isActive(item.href)
                ? 'text-primary-dark bg-primary-light'
                : 'text-neutral-gray hover:text-primary hover:bg-neutral-snow'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  // Mobile navigation (drawer)
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-neutral-gray-dark bg-opacity-50 z-40 transition-opacity duration-300 animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-neutral-white shadow-xl z-50 transform transition-transform duration-400 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-neutral-gray hover:text-primary hover:bg-neutral-snow transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 py-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className={`block px-4 py-3 rounded-md text-base font-medium transition-all duration-200 mb-1 ${
                isActive(item.href)
                  ? 'text-primary-dark bg-primary-light'
                  : 'text-neutral-gray hover:text-primary hover:bg-neutral-snow'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
