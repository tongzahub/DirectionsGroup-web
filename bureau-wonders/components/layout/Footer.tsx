import { SocialLink } from '@/types';
import { SITE_NAME } from '@/lib/constants';

interface FooterProps {
  contactEmail?: string;
  contactPhone?: string;
  officeAddress?: string;
  socialLinks?: SocialLink[];
}

export default function Footer({
  contactEmail,
  contactPhone,
  officeAddress,
  socialLinks = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-snow border-t border-neutral-gray-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand and Description */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-neutral-gray-dark mb-3 sm:mb-4">
              {SITE_NAME}
            </h3>
            <p className="text-sm text-neutral-gray leading-relaxed">
              Luxury brand communications and PR agency specializing in high-end
              industries.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-neutral-gray-dark mb-3 sm:mb-4">
              Contact
            </h3>
            <div className="space-y-2 text-sm text-neutral-gray">
              {officeAddress && (
                <p className="leading-relaxed">{officeAddress}</p>
              )}
              {contactEmail && (
                <p>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="hover:text-primary transition-colors duration-200 break-words touch-manipulation inline-block min-h-[44px] flex items-center"
                  >
                    {contactEmail}
                  </a>
                </p>
              )}
              {contactPhone && (
                <p>
                  <a
                    href={`tel:${contactPhone}`}
                    className="hover:text-primary transition-colors duration-200 touch-manipulation inline-block min-h-[44px] flex items-center"
                  >
                    {contactPhone}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="sm:col-span-2 lg:col-span-1">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-gray-dark mb-3 sm:mb-4">
                Follow Us
              </h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-gray hover:text-primary transition-colors duration-200 min-h-[44px] flex items-center touch-manipulation"
                    aria-label={link.platform}
                  >
                    <span className="text-sm font-medium">{link.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-neutral-gray-light">
          <p className="text-xs sm:text-sm text-neutral-gray text-center">
            © {currentYear} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
