'use client';

import { 
  ParallaxHero, 
  ParallaxBackground, 
  ParallaxSection, 
  ParallaxContainer 
} from '@/components/animations';
import { HeroSection, ParallaxImageHeader, ParallaxServiceHeader } from '@/components/content';
import Button from '@/components/ui/Button';

/**
 * ParallaxDemo Component
 * 
 * This component demonstrates all the parallax features implemented in task 4.1:
 * 1. ParallaxHero - Multi-layer hero sections with different speeds
 * 2. ParallaxBackground - Performance-optimized background parallax
 * 3. ParallaxSection - Decorative elements with parallax movement
 * 4. Enhanced HeroSection with parallax support
 * 5. ParallaxImageHeader for case studies
 * 6. ParallaxServiceHeader for service pages
 */
export default function ParallaxDemo() {
  return (
    <div className="min-h-screen">
      {/* 1. Enhanced Hero Section with Parallax */}
      <HeroSection
        title="Parallax Hero Section"
        subtitle="Experience smooth multi-layer parallax scrolling with performance optimization"
        ctaText="Explore Features"
        ctaLink="#parallax-features"
        backgroundImage="/api/placeholder/1920/1080"
        backgroundImageAlt="Luxury brand showcase"
        useParallax={true}
        parallaxIntensity={0.6}
        className="mb-0"
      />

      {/* 2. ParallaxContainer with Custom Layers */}
      <ParallaxContainer
        height="min-h-[80vh]"
        className="bg-gradient-to-br from-blue-900 to-purple-900"
        intensity={0.8}
        layers={[
          {
            id: 'bg-pattern',
            speed: 0.2,
            zIndex: 1,
            content: (
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-blue-300 rounded-full blur-2xl" />
                <div className="absolute top-2/3 left-2/3 w-32 h-32 bg-purple-300 rounded-full blur-xl" />
              </div>
            ),
          },
          {
            id: 'mid-layer',
            speed: 0.5,
            zIndex: 2,
            content: (
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <div className="text-9xl font-bold text-white/10">PARALLAX</div>
              </div>
            ),
          },
        ]}
      >
        <div className="text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Multi-Layer Parallax
          </h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Multiple layers moving at different speeds create depth and visual interest
          </p>
        </div>
      </ParallaxContainer>

      {/* 3. ParallaxBackground Example */}
      <ParallaxBackground
        backgroundImage="/api/placeholder/1920/1200"
        backgroundImageAlt="Luxury office space"
        speed={0.4}
        className="py-24"
        overlayClassName="bg-black/50"
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Background Parallax
          </h2>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8">
            The background image moves at a different speed than the content, 
            creating a sophisticated depth effect while maintaining performance.
          </p>
          <Button variant="secondary" size="lg">
            Learn More
          </Button>
        </div>
      </ParallaxBackground>

      {/* 4. ParallaxSection with Decorative Elements */}
      <ParallaxSection
        className="py-24 bg-gradient-to-r from-gray-50 to-gray-100"
        elements={[
          {
            id: 'decoration-1',
            speed: 0.3,
            className: 'top-10 left-10 opacity-20',
            zIndex: 1,
            content: (
              <div className="w-96 h-96 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl" />
            ),
          },
          {
            id: 'decoration-2',
            speed: 0.6,
            className: 'bottom-10 right-10 opacity-15',
            zIndex: 1,
            content: (
              <div className="w-64 h-64 bg-gradient-to-br from-green-200 to-blue-200 rounded-full blur-2xl" />
            ),
          },
          {
            id: 'floating-element',
            speed: 0.8,
            className: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10',
            zIndex: 2,
            content: (
              <div className="text-8xl font-bold text-gray-400">✨</div>
            ),
          },
        ]}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Decorative Parallax Elements
          </h2>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            Subtle decorative elements that move at different speeds add visual 
            interest without overwhelming the content.
          </p>
        </div>
      </ParallaxSection>

      {/* 5. ParallaxImageHeader Example */}
      <ParallaxImageHeader
        backgroundImage="/api/placeholder/1920/800"
        backgroundImageAlt="Case study showcase"
        height="h-96"
        overlayIntensity="medium"
        parallaxSpeed={0.3}
      >
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Case Study Header
        </h2>
        <p className="text-lg md:text-xl opacity-90">
          Perfect for case study and project showcase pages
        </p>
      </ParallaxImageHeader>

      {/* 6. ParallaxServiceHeader Example */}
      <ParallaxServiceHeader
        title="Service Page Header"
        icon="🚀"
        backgroundPattern={true}
        className="mb-0"
      />

      {/* Performance Information Section */}
      <section id="parallax-features" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Performance-Optimized Parallax
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
              Our parallax system automatically adapts to device performance and user preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Hardware Acceleration</h3>
              <p className="text-gray-600">
                Uses transform3d and will-change properties for optimal GPU performance
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Device Adaptive</h3>
              <p className="text-gray-600">
                Automatically reduces complexity on low-end devices and mobile
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">♿</div>
              <h3 className="text-xl font-bold mb-2">Accessibility First</h3>
              <p className="text-gray-600">
                Respects prefers-reduced-motion and provides static fallbacks
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">🔋</div>
              <h3 className="text-xl font-bold mb-2">Battery Conscious</h3>
              <p className="text-gray-600">
                Reduces animation complexity when battery is low
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Performance Monitoring</h3>
              <p className="text-gray-600">
                Real-time FPS monitoring with automatic quality adjustment
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Multiple Layers</h3>
              <p className="text-gray-600">
                Support for multiple parallax layers with different speeds
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}