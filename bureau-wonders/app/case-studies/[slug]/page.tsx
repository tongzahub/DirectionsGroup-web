import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { strapiClient } from '@/lib/strapi-client';
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
      {caseStudy.featuredImage && (
        <div className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden">
          <Image
            src={caseStudy.featuredImage.url}
            alt={caseStudy.featuredImage.alternativeText || caseStudy.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Case Study Content */}
      <article className="container mx-auto px-4 max-w-5xl py-12 md:py-16 lg:py-20">
        {/* Client Badge */}
        <div className="mb-4">
          <span className="inline-block px-4 py-2 rounded-full text-sm font-medium bg-primary-blue text-white uppercase tracking-wide">
            {caseStudy.client}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-gray-dark mb-4">
          {caseStudy.title}
        </h1>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-neutral-gray mb-12 pb-8 border-b border-neutral-soft-gray">
          <time dateTime={caseStudy.publishedAt} className="text-sm md:text-base">
            {formattedDate}
          </time>
        </div>

        {/* Challenge Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-gray-dark mb-6 flex items-center">
            <span className="w-12 h-1 bg-primary-blue mr-4"></span>
            Challenge
          </h2>
          <div className="pl-16">
            {renderContent(caseStudy.challenge)}
          </div>
        </section>

        {/* Strategy Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-gray-dark mb-6 flex items-center">
            <span className="w-12 h-1 bg-primary-blue mr-4"></span>
            Strategy
          </h2>
          <div className="pl-16">
            {renderContent(caseStudy.strategy)}
          </div>
        </section>

        {/* Execution Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-gray-dark mb-6 flex items-center">
            <span className="w-12 h-1 bg-primary-blue mr-4"></span>
            Execution
          </h2>
          <div className="pl-16">
            {renderContent(caseStudy.execution)}
          </div>
        </section>

        {/* Results Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-gray-dark mb-6 flex items-center">
            <span className="w-12 h-1 bg-primary-blue mr-4"></span>
            Results
          </h2>
          <div className="pl-16">
            {renderContent(caseStudy.results)}
          </div>
        </section>

        {/* Visual Gallery Section */}
        {caseStudy.gallery && caseStudy.gallery.length > 0 && (
          <section className="mb-12 pt-12 border-t border-neutral-soft-gray">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-gray-dark mb-8 flex items-center">
              <span className="w-12 h-1 bg-primary-blue mr-4"></span>
              Visual Gallery
            </h2>
            <ImageGallery images={caseStudy.gallery} columns={3} />
          </section>
        )}
      </article>
    </main>
  );
}
