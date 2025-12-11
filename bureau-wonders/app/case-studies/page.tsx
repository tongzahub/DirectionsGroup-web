import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import CaseStudyGrid from '@/components/grids/CaseStudyGrid';
import { ParallaxHero, ParallaxImageGallery, ErrorState, EmptyState } from '@/components/animations';

export const revalidate = 300; // ISR with 300s revalidation

export const metadata: Metadata = generatePageMetadata({
  title: 'Case Studies',
  description: 'Explore our portfolio of successful luxury brand campaigns and client success stories.',
  keywords: ['case studies', 'luxury brand campaigns', 'PR success stories', 'client portfolio'],
});

export default async function CaseStudiesPage() {
  let caseStudies;
  let error = null;

  try {
    caseStudies = await strapiClient.getCaseStudies();
  } catch (err) {
    console.error('Error fetching case studies:', err);
    error = err;
  }

  return (
    <main className="min-h-screen">
      {/* Hero Section with Parallax */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-neutral-900 via-neutral-800 to-primary-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-gold/20 to-accent-copper/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent-copper/5 rounded-full blur-2xl"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 text-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-shadow-lg">
                Case Studies
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed text-shadow-md text-neutral-100">
                Discover how we've helped luxury brands achieve exceptional results through strategic communications and creative excellence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Studies Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {error ? (
            <ErrorState
              type="server"
              title="Unable to Load Case Studies"
              message="We're having trouble loading our case studies. Please try again in a moment."
              onRetry={() => window.location.reload()}
              retryLabel="Reload Page"
            />
          ) : !caseStudies || caseStudies.length === 0 ? (
            <EmptyState
              title="Case Studies Coming Soon"
              message="We're preparing some amazing case studies to showcase our work. Check back soon!"
              icon={
                <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          ) : (
            <CaseStudyGrid caseStudies={caseStudies} />
          )}
        </div>
      </section>
    </main>
  );
}
