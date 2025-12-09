'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface CardProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  link?: string;
  children?: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  description,
  image,
  imageAlt = '',
  link,
  children,
  className = '',
}) => {
  const baseStyles = 'rounded-2xl p-4 sm:p-5 md:p-6 shadow-card bg-white';
  const cardClassName = `${baseStyles} ${className}`;

  const CardContent = () => (
    <>
      {image && (
        <div className="relative w-full h-44 sm:h-48 mb-3 sm:mb-4 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
          />
        </div>
      )}
      
      {title && (
        <h3 className="text-lg sm:text-xl font-semibold text-neutral-gray-dark mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-sm sm:text-base text-neutral-gray leading-relaxed">
          {description}
        </p>
      )}
      
      {children}
    </>
  );

  if (link) {
    return (
      <Link href={link} className="block">
        <motion.div
          className={cardClassName}
          whileHover={{ 
            y: -4, 
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' 
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <CardContent />
        </motion.div>
      </Link>
    );
  }

  return (
    <motion.div
      className={cardClassName}
      whileHover={{ 
        y: -4, 
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)' 
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <CardContent />
    </motion.div>
  );
};

export default Card;
