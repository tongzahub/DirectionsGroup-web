'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { JobListing } from '@/types';

interface MagicBentoGridProps {
  jobs: JobListing[];
  className?: string;
}

interface BentoItem extends JobListing {
  size: 'small' | 'medium' | 'large';
  featured?: boolean;
}

export default function MagicBentoGrid({ jobs, className = '' }: MagicBentoGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Function to parse markdown-like content to HTML
  const parseMarkdownContent = (content: string) => {
    if (!content || typeof content !== 'string') return '';
    
    return content
      // Headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-neutral-900 mt-6 mb-3 flex items-center"><div class="w-1 h-5 bg-accent-gold rounded-full mr-3"></div>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-neutral-900 mt-8 mb-4 flex items-center"><div class="w-1.5 h-6 bg-accent-gold rounded-full mr-3"></div>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-neutral-900 mt-8 mb-4">$1</h1>')
      
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-neutral-900">$1</strong>')
      
      // List items with gold bullets
      .replace(/^- (.*$)/gm, '<div class="flex items-start mb-3 pl-4"><div class="w-2 h-2 bg-accent-gold rounded-full mt-2 mr-4 flex-shrink-0"></div><span class="text-neutral-700 leading-relaxed">$1</span></div>')
      
      // Paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-neutral-700 leading-relaxed">')
      .replace(/^(?!<[h|d])/gm, '<p class="mb-4 text-neutral-700 leading-relaxed">')
      .replace(/$/g, '</p>')
      
      // Clean up extra tags
      .replace(/<p class="mb-4 text-neutral-700 leading-relaxed"><\/p>/g, '')
      .replace(/<p class="mb-4 text-neutral-700 leading-relaxed">(<h[1-6])/g, '$1')
      .replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  };

  // Create bento layout with different sizes
  const createBentoLayout = (jobList: JobListing[]): BentoItem[] => {
    return jobList.map((job, index) => {
      // Determine size based on position and content
      let size: 'small' | 'medium' | 'large' = 'medium';
      let featured = false;

      if (index === 0 || index === 3) {
        size = 'large';
        featured = true;
      } else if (index % 3 === 0) {
        size = 'medium';
      } else {
        size = 'small';
      }

      return {
        ...job,
        size,
        featured
      };
    });
  };

  const bentoItems = createBentoLayout(jobs);

  const getSizeClasses = (size: string, featured: boolean) => {
    const baseClasses = 'relative overflow-hidden rounded-2xl transition-all duration-500';
    
    switch (size) {
      case 'large':
        return `${baseClasses} col-span-2 row-span-2 min-h-[320px]`;
      case 'medium':
        return `${baseClasses} col-span-1 row-span-2 min-h-[240px]`;
      case 'small':
        return `${baseClasses} col-span-1 row-span-1 min-h-[160px]`;
      default:
        return `${baseClasses} col-span-1 row-span-1 min-h-[160px]`;
    }
  };

  const getBackgroundGradient = (index: number, featured: boolean) => {
    const gradients = [
      'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.98) 100%)', // Subtle White
      'linear-gradient(135deg, rgba(249, 250, 251, 0.95) 0%, rgba(243, 244, 246, 0.98) 100%)', // Light Gray
      'linear-gradient(135deg, rgba(254, 252, 232, 0.95) 0%, rgba(254, 249, 195, 0.98) 100%)', // Cream
      'linear-gradient(135deg, rgba(250, 245, 255, 0.95) 0%, rgba(243, 232, 255, 0.98) 100%)', // Light Purple
      'linear-gradient(135deg, rgba(240, 253, 250, 0.95) 0%, rgba(209, 250, 229, 0.98) 100%)', // Light Green
      'linear-gradient(135deg, rgba(239, 246, 255, 0.95) 0%, rgba(219, 234, 254, 0.98) 100%)', // Light Blue
    ];

    // Featured items get a subtle gold accent
    if (featured) {
      return 'linear-gradient(135deg, rgba(254, 252, 232, 0.98) 0%, rgba(253, 230, 138, 0.95) 100%)';
    }

    return gradients[index % gradients.length];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <motion.div
        ref={gridRef}
        className="grid grid-cols-3 auto-rows-min gap-4 md:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {bentoItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={getSizeClasses(item.size, item.featured || false)}
            variants={itemVariants}
            whileHover="hover"
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            onClick={() => setSelectedJob(item)}
            style={{
              background: getBackgroundGradient(index, item.featured || false),
              cursor: 'pointer',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-neutral-400/30 blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-neutral-300/25 blur-lg"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 h-full flex flex-col justify-between">
              {/* Header */}
              <div>
                {item.featured && (
                  <motion.div
                    className="inline-flex items-center px-3 py-1 rounded-full bg-accent-gold/20 backdrop-blur-sm mb-4 border border-accent-gold/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span className="text-xs font-semibold text-accent-gold">FEATURED</span>
                  </motion.div>
                )}

                <h3 className={`font-bold text-neutral-800 mb-2 ${
                  item.size === 'large' ? 'text-2xl md:text-3xl' : 
                  item.size === 'medium' ? 'text-xl md:text-2xl' : 
                  'text-lg md:text-xl'
                }`}>
                  {item.title}
                </h3>

                {item.size !== 'small' && (
                  <p className="text-neutral-600 text-sm md:text-base mb-4 line-clamp-3">
                    {typeof item.description === 'string' 
                      ? item.description.replace(/<[^>]*>/g, '') 
                      : JSON.stringify(item.description)
                    }
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {/* Show department and type as tags since requirements is RichText */}
                  <span className="px-3 py-1 rounded-full bg-neutral-100/80 backdrop-blur-sm text-xs text-neutral-700 font-medium">
                    {item.department}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-neutral-100/80 backdrop-blur-sm text-xs text-neutral-700 font-medium">
                    {item.type}
                  </span>
                  {item.location && (
                    <span className="px-3 py-1 rounded-full bg-neutral-100/80 backdrop-blur-sm text-xs text-neutral-700 font-medium">
                      {item.location}
                    </span>
                  )}
                </div>

                <motion.div
                  className="w-8 h-8 rounded-full bg-neutral-200/60 backdrop-blur-sm flex items-center justify-center shadow-sm"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <svg
                    className="w-4 h-4 text-neutral-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </motion.div>
              </div>
            </div>

            {/* Hover Overlay */}
            <AnimatePresence>
              {hoveredIndex === index && (
                <motion.div
                  className="absolute inset-0 bg-neutral-900/5 backdrop-blur-sm"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                />
              )}
            </AnimatePresence>

            {/* Floating Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-neutral-400/20"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${15 + i * 25}%`,
                  }}
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Job Detail Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedJob(null)}
          >
            <motion.div
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1 p-8 job-modal-scroll">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex-1 pr-4">
                  <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                    {selectedJob.title}
                  </h2>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="px-3 py-1 bg-accent-gold/10 text-accent-gold text-sm font-medium rounded-full">
                      {selectedJob.department}
                    </span>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                      {selectedJob.type}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
                      {selectedJob.location}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Job Description */}
              {selectedJob.description && (
                <div className="mb-8">
                  <div 
                    className="job-content"
                    dangerouslySetInnerHTML={{ 
                      __html: parseMarkdownContent(
                        typeof selectedJob.description === 'string' 
                          ? selectedJob.description 
                          : JSON.stringify(selectedJob.description)
                      )
                    }} 
                  />
                </div>
              )}

              {/* Requirements Section */}
              {selectedJob.requirements && (
                <div className="mb-8">
                  <div className="bg-gradient-to-br from-neutral-50 to-neutral-100/50 rounded-2xl p-8 border border-neutral-200/50">
                    <div 
                      className="job-content"
                      dangerouslySetInnerHTML={{ 
                        __html: parseMarkdownContent(
                          typeof selectedJob.requirements === 'string' 
                            ? selectedJob.requirements 
                            : JSON.stringify(selectedJob.requirements)
                        )
                      }} 
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-white pt-6 border-t border-neutral-100">
                <div className="flex gap-4">
                  <motion.button 
                    className="flex-1 bg-gradient-to-r from-accent-gold to-accent-gold-light text-neutral-900 py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Apply Now
                  </motion.button>
                  <motion.button 
                    onClick={() => setSelectedJob(null)}
                    className="px-8 py-4 border-2 border-neutral-200 rounded-xl font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                </div>
                
                {/* Contact Info */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-neutral-500">
                    Questions about this role? 
                    <a href="/contact" className="text-accent-gold hover:text-accent-gold-light font-medium ml-1">
                      Contact our team
                    </a>
                  </p>
                </div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}