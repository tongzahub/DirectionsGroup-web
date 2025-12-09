import { Metadata } from 'next';
import { strapiClient } from '@/lib/strapi-client';
import { generatePageMetadata } from '@/lib/metadata';
import CaseStudyGrid from '@/components/grids/CaseStudyGrid';

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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-mist py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Case Studies
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Discover how we've helped luxury brands achieve exceptional results through strategic communications and creative excellence.
          </p>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {error ? (
            <div className="text-center py-12">
              <p className="text-neutral-gray text-lg">
                Unable to load case studies. Please try again later.
              </p>
            </div>
          ) : !caseStudies || caseStudies.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-gray text-lg">
                No case studies available yet. Check back soon!
              </p>
            </div>
          ) : (
            <CaseStudyGrid caseStudies={caseStudies} />
          )}
        </div>
      </section>
    </main>
  );
}
