'use client';

import { JobListing } from '@/types';
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface JobListingModalProps {
  job: JobListing;
  isOpen: boolean;
  onClose: () => void;
}

export default function JobListingModal({ job, isOpen, onClose }: JobListingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Get department icon
  const getDepartmentIcon = (department: string) => {
    switch (department.toLowerCase()) {
      case 'client services':
        return '👥';
      case 'creative':
        return '🎨';
      case 'digital':
        return '💻';
      case 'public relations':
        return '📢';
      case 'events & experiences':
        return '✨';
      case 'content & strategy':
        return '📝';
      case 'business development':
        return '📈';
      default:
        return '💼';
    }
  };

  // Get job type color
  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-green-100 text-green-800';
      case 'Part-time':
        return 'bg-blue-100 text-blue-800';
      case 'Contract':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format markdown-like content to HTML
  const formatContent = (content: string) => {
    // Split content into lines for better processing
    const lines = content.split('\n');
    const processedLines: string[] = [];
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        // Empty line - close any open list and add spacing
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push('<div class="mb-4"></div>');
        continue;
      }
      
      // Headers
      if (line.startsWith('### ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<h3 class="text-lg font-medium text-neutral-gray-dark mb-2 mt-4">${line.substring(4)}</h3>`);
      } else if (line.startsWith('## ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<h2 class="text-xl font-semibold text-neutral-gray-dark mb-3 mt-6">${line.substring(3)}</h2>`);
      } else if (line.startsWith('# ')) {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        processedLines.push(`<h1 class="text-2xl font-bold text-neutral-gray-dark mb-4">${line.substring(2)}</h1>`);
      } 
      // List items
      else if (line.startsWith('- ')) {
        if (!inList) {
          processedLines.push('<ul class="list-disc list-inside space-y-1 mb-4 ml-4">');
          inList = true;
        }
        const listContent = line.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-neutral-gray-dark">$1</strong>');
        processedLines.push(`<li class="text-neutral-gray mb-1">${listContent}</li>`);
      } 
      // Regular paragraphs
      else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        const paragraphContent = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-neutral-gray-dark">$1</strong>');
        processedLines.push(`<p class="text-neutral-gray mb-4">${paragraphContent}</p>`);
      }
    }
    
    // Close any remaining open list
    if (inList) {
      processedLines.push('</ul>');
    }
    
    return processedLines.join('\n');
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-gray-light">
          <div className="flex items-start gap-4 flex-1">
            <div className="text-3xl" role="img" aria-label={`${job.department} department`}>
              {getDepartmentIcon(job.department)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-neutral-gray-dark mb-2">
                {job.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className="text-primary-blue font-medium">
                  {job.department}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getJobTypeColor(job.type)}`}>
                  {job.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-gray">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm">
                  {job.location}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-gray-light rounded-xl transition-colors duration-200 flex-shrink-0"
            aria-label="Close job details"
          >
            <svg
              className="w-6 h-6 text-neutral-gray"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Job Description */}
            <div>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContent(String(job.description)) }}
              />
            </div>

            {/* Requirements */}
            <div>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formatContent(String(job.requirements)) }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-gray-light bg-accent-mist">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="text-sm text-neutral-gray">
              <p>Interested in this position?</p>
              <p>Send your application to our HR team.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-neutral-gray-light text-neutral-gray-dark font-semibold rounded-xl hover:bg-white transition-colors duration-200"
              >
                Close
              </button>
              <a
                href={`/contact?subject=${encodeURIComponent(`Application for ${job.title}`)}`}
                className="px-6 py-3 bg-primary-blue text-white font-semibold rounded-xl hover:bg-primary-darker transition-colors duration-200 text-center"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Use portal to render modal at document body level
  return typeof document !== 'undefined' 
    ? createPortal(modalContent, document.body)
    : null;
}