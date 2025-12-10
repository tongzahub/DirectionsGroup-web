import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import { JobListing } from '@/types';
import ContentSection from '@/components/content/ContentSection';
import JobListingGrid from '@/components/grids/JobListingGrid';

// Enable ISR with 60s revalidation
export const revalidate = 60;

// Generate metadata for the Careers page
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: 'Careers',
    description: 'Join The Bureau of Wonders team. Explore our culture, values, and open positions in luxury brand communications.',
    keywords: ['careers', 'jobs', 'luxury brand jobs', 'PR careers', 'communications careers'],
  });
}

export default async function CareersPage() {
  let siteSettings = null;
  let jobListings: JobListing[] = [];
  let error: string | null = null;

  try {
    // Fetch site settings for culture statement and values
    siteSettings = await strapiClient.getSiteSettings();
    // Fetch job listings
    jobListings = await strapiClient.getJobListings();
  } catch (err) {
    console.error('Error fetching Careers page data:', err);
    error = 'Unable to load content. Please try again later.';
  }

  if (error || !siteSettings) {
    return (
      <main className="min-h-screen">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-gray-dark mb-4">
            Careers
          </h1>
          <p className="text-error text-lg">
            {error || 'Content not available.'}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-light-blue py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-neutral-gray-dark mb-4 sm:mb-6">
            Join Our Team
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-neutral-gray leading-relaxed">
            Be part of a team that shapes the future of luxury brand communications
          </p>
        </div>
      </section>

      {/* Culture Statement */}
      {siteSettings.cultureStatement && (
        <ContentSection
          content={siteSettings.cultureStatement}
          layout="single"
          title="Our Culture"
          className="bg-white"
        />
      )}

      {/* Values Section */}
      {siteSettings.values && siteSettings.values.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-accent-mist">
          <div className="container mx-auto px-4 sm:px-6 md:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-gray-dark mb-6 sm:mb-8 md:mb-12 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
              {siteSettings.values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 shadow-card transition-all duration-300 hover:shadow-card-hover"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-blue/10 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 text-primary-blue"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-base sm:text-lg text-neutral-gray-dark font-medium flex-1">
                      {value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Open Positions */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-gray-dark mb-6 sm:mb-8 md:mb-12 text-center">
            Open Positions
          </h2>

          {jobListings.length > 0 ? (
            <JobListingGrid jobs={jobListings} />
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-accent-mist mb-3 sm:mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-neutral-gray"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-neutral-gray-dark mb-2">
                No Open Positions
              </h3>
              <p className="text-sm sm:text-base text-neutral-gray max-w-md mx-auto mb-4 sm:mb-6 px-4">
                We don't have any open positions at the moment, but we're always interested in hearing from talented individuals.
              </p>
              <a
                href="/contact"
                className="inline-block px-5 sm:px-6 py-2.5 sm:py-3 bg-primary-blue text-white font-semibold rounded-xl hover:bg-primary-darker transition-colors duration-200 min-h-[44px] flex items-center justify-center touch-manipulation"
              >
                Get in Touch
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
