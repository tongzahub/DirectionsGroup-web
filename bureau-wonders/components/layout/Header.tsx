'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationItem } from '@/types';
import { SITE_NAME } from '@/lib/constants';
import { StickyNavigation } from '@/components/animations';
import { MobileNavigation, MobileSearch } from '@/components/navigation';
import GooeyNavigation from '@/components/navigation/GooeyNavigation';
import { ClientOnly } from '@/components/utils';
import { useDeviceType } from '@/lib/responsive';

interface HeaderProps {
  navigation: NavigationItem[];
}

export default function Header({ navigation }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const deviceType = useDeviceType();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <StickyNavigation
      hideOnScrollDown={true}
      showOnScrollUp={true}
      threshold={100}
      backgroundBlur={true}
      shadowOnScroll={true}
    >
      <motion.div
        className="bg-white/95"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Enhanced Logo/Brand */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href="/"
              className="text-lg sm:text-xl lg:text-2xl font-bold text-neutral-gray-dark hover:text-primary transition-all duration-300 touch-manipulation relative"
            >
              <span className="relative z-10">{SITE_NAME}</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-100 to-primary-200 rounded-lg opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          </motion.div>

          {/* Enhanced Gooey Desktop Navigation */}
          <div className="hidden md:block">
            <ClientOnly fallback={
              <nav className="flex items-center space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="px-6 py-3 text-white font-medium hover:text-accent-gold transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            }>
              <GooeyNavigation 
                navigation={navigation}
                particleCount={15}
                particleDistances={[90, 10]}
                particleR={100}
                initialActiveIndex={0}
                animationTime={600}
                timeVariance={300}
                colors={[1, 2, 3, 1, 2, 3, 1, 4]}
              />
            </ClientOnly>
          </div>

          {/* Mobile Navigation and Search */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Search */}
            <MobileSearch
              placeholder="Search..."
              className="flex-1 max-w-[200px]"
            />
            
            {/* Enhanced Mobile Navigation */}
            <MobileNavigation
              navigation={navigation.map(item => ({
                href: item.href,
                label: item.label,
                description: `Navigate to ${item.label}`,
              }))}
              siteName={SITE_NAME}
              enableSearch={true}
              enableGestures={true}
            />
          </div>
        </div>


      </div>
      </motion.div>
    </StickyNavigation>
  );
}
