import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { strapiClient, getStrapiMediaUrl } from '@/lib/strapi-client';
import { generateCaseStudyMetadata } from '@/lib/metadata';
import { RichText } from '@/types';
import ImageGallery from '@/components/content/ImageGallery';

export const revalidate = 300; // ISR with 300s revalidation

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the case study
export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  try {
    const caseStudy = await strapiClient.getCaseStudy(params.slug);
    return generateCaseStudyMetadata(caseStudy);
  } catch (error) {
    console.error('Error fetching case study metadata:', error);
    return {
      title: 'Case Study',
      description: 'Explore our successful luxury brand campaigns.',
    };
  }
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  let caseStudy;

  try {
    caseStudy = await strapiClient.getCaseStudy(params.slug);
  } catch (error) {
    console.error('Error fetching case study:', error);
    notFound();
  }

  const formattedDate = new Date(caseStudy.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Render rich text content
  const renderContent = (content: RichText) => {
    if (typeof content === 'string') {
      return (
        <div
          className="prose prose-lg max-w-none text-neutral-gray-dark leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    // Handle structured rich text if needed
    return (
      <div className="prose prose-lg max-w-none text-neutral-gray-dark">
        {JSON.stringify(content)}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Featured Image */}
      {caseStudy.featuredImage && getStrapiMediaUrl(caseStudy.featuredImage.url) && (
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
          <Image
            src={getStrapiMediaUrl(caseStudy.featuredImage.url)!}
            alt={caseStudy.featuredImage.alternativeText || caseStudy.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Enhanced Case Study Content */}
      <article className="container mx-auto px-4 max-w-6xl py-12 md:py-16 lg:py-20">
        {/* Enhanced Client Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center px-6 py-3 rounded-full text-sm font-bold bg-gradient-to-r from-primary-blue to-primary-darker text-white uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="w-2 h-2 bg-white rounded-full mr-3 opacity-80"></div>
            {caseStudy.client}
          </span>
        </div>

        {/* Enhanced Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-gray-dark mb-6 leading-tight tracking-tight">
          {caseStudy.title}
        </h1>

        {/* Enhanced Meta Information */}
        <div className="flex flex-wrap items-center gap-6 text-neutral-gray mb-16 pb-8 border-b border-gradient-to-r from-transparent via-neutral-soft-gray to-transparent">
          <time dateTime={caseStudy.publishedAt} className="text-base font-medium flex items-center">
            <svg className="w-4 h-4 mr-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formattedDate}
          </time>
        </div>

        {/* Enhanced Challenge Section */}
        <section className="mb-16 scroll-mt-24" id="challenge">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 md:p-12 border border-red-100/50">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-gray-dark mb-8 flex items-center">
              <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 mr-6 rounded-full"></div>
              <span className="flex items-center">
                <svg className="w-8 h-8 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                Challenge
              </span>
            </h2>
            <div className="prose prose-lg md:prose-xl max-w-none text-neutral-gray-dark">
              {renderContent(caseStudy.challenge)}
            </div>
          </div>
        </section>

        {/* Enhanced Strategy Section */}
        <section className="mb-16 scroll-mt-24" id="strategy">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-12 border border-blue-100/50">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-gray-dark mb-8 flex items-center">
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mr-6 rounded-full"></div>
              <span className="flex items-center">
                <svg className="w-8 h-8 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Strategy
              </span>
            </h2>
            <div className="prose prose-lg md:prose-xl max-w-none text-neutral-gray-dark">
              {renderContent(caseStudy.strategy)}
            </div>
          </div>
        </section>

        {/* Enhanced Execution Section */}
        <section className="mb-16 scroll-mt-24" id="execution">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl p-8 md:p-12 border border-green-100/50">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-gray-dark mb-8 flex items-center">
              <div className="w-16 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mr-6 rounded-full"></div>
              <span className="flex items-center">
                <svg className="w-8 h-8 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Execution
              </span>
            </h2>
            <div className="prose prose-lg md:prose-xl max-w-none text-neutral-gray-dark">
              {renderContent(caseStudy.execution)}
            </div>
          </div>
        </section>

        {/* Enhanced Results Section */}
        <section className="mb-16 scroll-mt-24" id="results">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-purple-100/50">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-gray-dark mb-8 flex items-center">
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mr-6 rounded-full"></div>
              <span className="flex items-center">
                <svg className="w-8 h-8 mr-3 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Results
              </span>
            </h2>
            <div className="prose prose-lg md:prose-xl max-w-none text-neutral-gray-dark">
              {renderContent(caseStudy.results)}
            </div>
          </div>
        </section>

        {/* Enhanced Visual Gallery Section */}
        {caseStudy.gallery && caseStudy.gallery.length > 0 && (
          <section className="mb-16 pt-16 border-t border-gradient-to-r from-transparent via-neutral-soft-gray to-transparent scroll-mt-24" id="gallery">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-neutral-gray-dark mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 mr-3 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Visual Gallery
              </h2>
              <p className="text-lg text-neutral-gray max-w-2xl mx-auto">
                Explore the visual elements and creative executions from this campaign
              </p>
            </div>
            <ImageGallery images={caseStudy.gallery} columns={3} />
          </section>
        )}

        {/* Case Study Navigation */}
        <nav className="mt-16 pt-8 border-t border-neutral-soft-gray/50">
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#challenge" className="px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-medium hover:bg-red-200 transition-colors">
              Challenge
            </a>
            <a href="#strategy" className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
              Strategy
            </a>
            <a href="#execution" className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
              Execution
            </a>
            <a href="#results" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
              Results
            </a>
            {caseStudy.gallery && caseStudy.gallery.length > 0 && (
              <a href="#gallery" className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Gallery
              </a>
            )}
          </div>
        </nav>
      </article>
    </main>
  );
}
