# Animation Components Usage Guide

This document provides examples of how to use the enhanced animation components implemented for the Bureau of Wonders website.

## Core Entrance Animations

### FadeInUp
Smooth entrance animation that fades in content while sliding up from below.

```tsx
import { FadeInUp } from '@/components/animations';

<FadeInUp delay={0.2} distance={30} threshold={0.1}>
  <h2>Your Content Here</h2>
</FadeInUp>
```

### ScaleIn
Entrance animation that scales content from smaller to full size with fade.

```tsx
import { ScaleIn } from '@/components/animations';

<ScaleIn delay={0.1} scale={0.8} threshold={0.2}>
  <div className="card">Card Content</div>
</ScaleIn>
```

### StaggerReveal
Animates multiple child elements with a staggered delay.

```tsx
import { StaggerReveal } from '@/components/animations';

<StaggerReveal staggerDelay={0.1} distance={20}>
  <h1>Title</h1>
  <p>Subtitle</p>
  <button>Call to Action</button>
</StaggerReveal>
```

## Page Transitions

### PageWrapper
Wraps page content with smooth transitions between routes.

```tsx
import { PageWrapper } from '@/components/animations';

export default function MyPage() {
  return (
    <PageWrapper transitionType="fade" duration={0.3}>
      <main>Page Content</main>
    </PageWrapper>
  );
}
```

### RouteTransitionProvider
Provides loading states and transition context for the entire app.

```tsx
import { RouteTransitionProvider } from '@/components/animations';

export default function Layout({ children }) {
  return (
    <RouteTransitionProvider showLoadingScreen={true} loadingVariant="hero">
      {children}
    </RouteTransitionProvider>
  );
}
```

## Content Reveal Animations

### ProgressiveReveal
Reveals content based on scroll position with various animation types.

```tsx
import { ProgressiveReveal } from '@/components/animations';

<ProgressiveReveal 
  direction="up" 
  distance={50} 
  threshold={0.2}
  useScrollProgress={true}
>
  <section>Content that reveals on scroll</section>
</ProgressiveReveal>
```

### StaggeredGrid
Perfect for blog posts, case studies, and service listings.

```tsx
import { StaggeredGrid } from '@/components/animations';

<StaggeredGrid 
  columns={3} 
  staggerDelay={0.1} 
  direction="up"
  animateOnHover={true}
>
  {items.map(item => (
    <div key={item.id} className="card">
      {item.content}
    </div>
  ))}
</StaggeredGrid>
```

### ContentSectionReveal
Comprehensive section animation with title, subtitle, and content.

```tsx
import { ContentSectionReveal } from '@/components/animations';

<ContentSectionReveal
  title="Our Services"
  subtitle="Discover what we can do for your brand"
  animationType="slide"
  direction="up"
  staggerChildren={true}
>
  <div className="grid grid-cols-3 gap-6">
    {services.map(service => (
      <ServiceCard key={service.id} {...service} />
    ))}
  </div>
</ContentSectionReveal>
```

### ScrollProgressIndicator
Shows reading progress for long-form content.

```tsx
import { ScrollProgressIndicator } from '@/components/animations';

<ScrollProgressIndicator 
  position="top" 
  thickness={3}
  color="bg-gradient-to-r from-primary-500 to-accent-gold"
  showPercentage={true}
/>
```

## Performance Features

All animation components include:

- **Adaptive Performance**: Automatically adjusts based on device capabilities
- **Reduced Motion Support**: Respects user accessibility preferences
- **Animation Queue**: Prevents performance issues with multiple simultaneous animations
- **Intersection Observer**: Efficient scroll-based triggering
- **Battery Awareness**: Reduces animations on low battery devices

## Best Practices

1. **Use appropriate thresholds**: Set intersection thresholds based on content importance
2. **Stagger delays wisely**: Keep stagger delays between 0.05s - 0.2s for best UX
3. **Respect accessibility**: Always enable `accessibilityEnhanced` prop
4. **Performance first**: Enable `performanceOptimized` for better user experience
5. **Test on devices**: Verify animations work well across different device capabilities

## Integration Examples

### Blog Page with Staggered Posts
```tsx
import { StaggeredGrid, ScrollProgressIndicator } from '@/components/animations';

export default function BlogPage({ posts }) {
  return (
    <>
      <ScrollProgressIndicator position="top" showPercentage={true} />
      <main className="container mx-auto px-4 py-8">
        <StaggeredGrid columns={2} staggerDelay={0.1} animateOnHover={true}>
          {posts.map(post => (
            <BlogPostCard key={post.id} {...post} />
          ))}
        </StaggeredGrid>
      </main>
    </>
  );
}
```

### Service Page with Progressive Reveals
```tsx
import { ContentSectionReveal, ProgressiveReveal } from '@/components/animations';

export default function ServicesPage({ services }) {
  return (
    <main>
      <ContentSectionReveal
        title="Our Services"
        subtitle="Comprehensive luxury brand communications"
        animationType="slide"
        staggerChildren={true}
      >
        {services.map((service, index) => (
          <ProgressiveReveal 
            key={service.id}
            direction="up"
            delay={index * 0.1}
            threshold={0.2}
          >
            <ServiceSection {...service} />
          </ProgressiveReveal>
        ))}
      </ContentSectionReveal>
    </main>
  );
}
```