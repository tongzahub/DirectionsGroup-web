import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import ContactForm from '@/components/forms/ContactForm';

// Use static generation (no revalidation needed)
export const revalidate = false;

// Generate metadata for the Contact page
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Contact',
    description: 'Get in touch with The Bureau of Wonders. We\'d love to hear about your project and discuss how we can help.',
    keywords: ['contact', 'get in touch', 'luxury brand inquiry', 'PR consultation'],
  });
}

export default async function ContactPage() {
  let siteSettings = null;
  let error: string | null = null;

  try {
    // Fetch site settings for contact information
    siteSettings = await strapiClient.getSiteSettings();
  } catch (err) {
    console.error('Error fetching Contact page data:', err);
    error = 'Unable to load contact information. Please try again later.';
  }

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-light-blue py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            We'd love to hear about your project and discuss how we can help
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          {error ? (
            <div className="text-center">
              <p className="text-error text-base sm:text-lg">{error}</p>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Two-column layout: Form and Contact Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
                {/* Contact Form */}
                <div className="order-2 lg:order-1">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-gray-dark mb-4 sm:mb-6">
                    Send us a message
                  </h2>
                  <ContactForm />
                </div>

                {/* Contact Information */}
                <div className="order-1 lg:order-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-gray-dark mb-4 sm:mb-6">
                    Contact Information
                  </h2>

                  {siteSettings ? (
                    <div className="space-y-6 sm:space-y-8">
                      {/* Office Address */}
                      {siteSettings.officeAddress && (
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-blue/10 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 sm:w-6 sm:h-6 text-primary-blue"
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
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-neutral-gray-dark mb-1">
                              Office Address
                            </h3>
                            <p className="text-sm sm:text-base text-neutral-gray whitespace-pre-line">
                              {siteSettings.officeAddress}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      {siteSettings.contactEmail && (
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-blue/10 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 sm:w-6 sm:h-6 text-primary-blue"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-neutral-gray-dark mb-1">
                              Email
                            </h3>
                            <a
                              href={`mailto:${siteSettings.contactEmail}`}
                              className="text-sm sm:text-base text-primary-blue hover:text-primary-darker transition-colors duration-200 break-words touch-manipulation inline-block min-h-[44px] flex items-center"
                            >
                              {siteSettings.contactEmail}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Phone */}
                      {siteSettings.contactPhone && (
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary-blue/10 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 sm:w-6 sm:h-6 text-primary-blue"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-base sm:text-lg font-semibold text-neutral-gray-dark mb-1">
                              Phone
                            </h3>
                            <a
                              href={`tel:${siteSettings.contactPhone.replace(/\s/g, '')}`}
                              className="text-sm sm:text-base text-primary-blue hover:text-primary-darker transition-colors duration-200 touch-manipulation inline-block min-h-[44px] flex items-center"
                            >
                              {siteSettings.contactPhone}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Social Links */}
                      {siteSettings.socialLinks && siteSettings.socialLinks.length > 0 && (
                        <div className="pt-4 border-t border-neutral-border">
                          <h3 className="text-base sm:text-lg font-semibold text-neutral-gray-dark mb-3 sm:mb-4">
                            Follow Us
                          </h3>
                          <div className="flex flex-wrap gap-3">
                            {siteSettings.socialLinks.map((link, index) => (
                              <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-lg bg-primary-blue/10 hover:bg-primary-blue text-primary-blue hover:text-white flex items-center justify-center transition-all duration-200 touch-manipulation"
                                aria-label={link.platform}
                              >
                                <span className="text-sm font-semibold">
                                  {link.platform.charAt(0).toUpperCase()}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-neutral-gray">Loading contact information...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
