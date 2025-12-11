# Parallax Scrolling System

This document describes the comprehensive parallax scrolling system implemented for the Bureau of Wonders website. The system provides performance-optimized parallax effects with automatic device adaptation and accessibility support.

## Components Overview

### 1. ParallaxContainer
The core container component that manages multiple parallax layers.

```tsx
import { ParallaxContainer } from '@/components/animations';

<ParallaxContainer
  layers={[
    {
      id: 'background',
      speed: 0.3,
      zIndex: 1,
      content: <BackgroundElement />
    },
    {
      id: 'midground',
      speed: 0.6,
      zIndex: 2,
      content: <MidgroundElement />
    }
  ]}
  height="min-h-screen"
  intensity={0.8}
>
  <YourContent />
</ParallaxContainer>
```

**Props:**
- `layers`: Array of parallax layers with different speeds
- `height`: Container height (CSS class)
- `intensity`: Global intensity multiplier (0-1)
- `disabled`: Force disable parallax
- `className`: Additional CSS classes

### 2. ParallaxHero
Specialized hero section with built-in parallax layers.

```tsx
import { ParallaxHero } from '@/components/animations';

<ParallaxHero
  backgroundImage="/path/to/image.jpg"
  backgroundImageAlt="Hero background"
  overlayGradient="from-black/40 via-black/20 to-black/40"
  intensity={0.5}
>
  <HeroContent />
</ParallaxHero>
```

**Features:**
- Automatic background image parallax
- Gradient overlay with parallax
- Decorative floating elements
- Performance-optimized scaling

### 3. ParallaxBackground
Simple background image parallax for sections.

```tsx
import { ParallaxBackground } from '@/components/animations';

<ParallaxBackground
  backgroundImage="/path/to/image.jpg"
  speed={0.5}
  overlayClassName="bg-black/50"
>
  <SectionContent />
</ParallaxBackground>
```

**Props:**
- `backgroundImage`: Image URL for parallax background
- `speed`: Parallax speed multiplier
- `overlayClassName`: CSS classes for overlay
- `offset`: Scroll trigger range

### 4. ParallaxSection
Section with decorative parallax elements.

```tsx
import { ParallaxSection } from '@/components/animations';

<ParallaxSection
  elements={[
    {
      id: 'decoration',
      speed: 0.4,
      className: 'top-10 right-10 opacity-20',
      content: <DecorationElement />
    }
  ]}
>
  <MainContent />
</ParallaxSection>
```

## Enhanced Content Components

### Enhanced HeroSection
The existing HeroSection component now supports parallax:

```tsx
import { HeroSection } from '@/components/content';

<HeroSection
  title="Your Title"
  subtitle="Your subtitle"
  backgroundImage="/hero-bg.jpg"
  useParallax={true}
  parallaxIntensity={0.6}
/>
```

### ParallaxImageHeader
For case study and project pages:

```tsx
import { ParallaxImageHeader } from '@/components/content';

<ParallaxImageHeader
  backgroundImage="/case-study-bg.jpg"
  height="h-96"
  overlayIntensity="medium"
  parallaxSpeed={0.3}
>
  <HeaderContent />
</ParallaxImageHeader>
```

### ParallaxServiceHeader
For service pages with decorative patterns:

```tsx
import { ParallaxServiceHeader } from '@/components/content';

<ParallaxServiceHeader
  title="Service Name"
  icon="🚀"
  backgroundPattern={true}
/>
```

## Hooks

### useParallax
Core parallax hook for custom implementations:

```tsx
import { useParallax } from '@/hooks/useParallax';

const MyComponent = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { y, isDisabled, shouldAnimate } = useParallax(ref, {
    speed: 0.5,
    intensity: 0.8
  });

  return (
    <motion.div
      ref={ref}
      style={{ y: shouldAnimate ? y : 0 }}
    >
      Content
    </motion.div>
  );
};
```

### useMultiParallax
For multiple elements in one container:

```tsx
import { useMultiParallax } from '@/hooks/useParallax';

const { transforms, isDisabled } = useMultiParallax(ref, [
  { id: 'bg', speed: 0.3 },
  { id: 'fg', speed: 0.7 }
]);
```

### useAdaptiveParallax
Automatically adapts to device performance:

```tsx
import { useAdaptiveParallax } from '@/hooks/useParallax';

const { y, isDisabled } = useAdaptiveParallax(ref, {
  speed: 0.5,
  intensity: 1
});
```

## Performance Features

### Automatic Device Detection
- **Low-end devices**: Parallax disabled automatically
- **Mid-range devices**: Reduced intensity and element count
- **High-end devices**: Full parallax experience

### Performance Monitoring
- Real-time FPS monitoring
- Memory usage tracking
- Battery level consideration
- Network speed adaptation

### Optimization Techniques
- Hardware acceleration with `transform3d`
- `will-change` property for GPU optimization
- Intersection Observer for efficient triggering
- Debounced scroll events
- Animation queue management

### Accessibility Support
- Respects `prefers-reduced-motion`
- Keyboard navigation support
- Screen reader compatibility
- Static fallbacks for all components

## Configuration

### Global Settings
Configure parallax behavior in `lib/animation-config.ts`:

```typescript
export const parallaxSettings = {
  defaultIntensity: 0.8,
  maxElements: 6,
  performanceThreshold: 45, // FPS
  batteryThreshold: 0.2
};
```

### Performance Thresholds
Adjust performance thresholds in `lib/performance-monitor.ts`:

```typescript
const thresholds = {
  minFPS: 45,
  maxMemoryUsage: 0.8,
  maxConcurrentAnimations: 6
};
```

## Best Practices

### Speed Values
- **Background elements**: 0.1 - 0.4 (slow)
- **Midground elements**: 0.4 - 0.7 (medium)
- **Foreground elements**: 0.7 - 1.0 (fast)

### Layer Management
- Limit to 3-5 layers for optimal performance
- Use lower speeds for background elements
- Higher z-index for faster-moving elements

### Image Optimization
- Use appropriate image sizes (scale up by 110% for parallax)
- Optimize images for web (WebP format recommended)
- Consider lazy loading for non-critical parallax images

### Mobile Considerations
- Reduce parallax intensity on mobile (0.3-0.5)
- Limit number of parallax elements (2-3 max)
- Test on actual devices for performance

## Browser Support

- **Chrome**: Full support with hardware acceleration
- **Firefox**: Full support with hardware acceleration
- **Safari**: Full support with hardware acceleration
- **Edge**: Full support with hardware acceleration
- **Mobile browsers**: Adaptive support with performance monitoring

## Troubleshooting

### Performance Issues
1. Check FPS in browser dev tools
2. Reduce number of parallax elements
3. Lower intensity values
4. Disable on low-end devices

### Visual Issues
1. Ensure images are scaled appropriately (110%+)
2. Check z-index layering
3. Verify transform origins
4. Test scroll offset ranges

### Accessibility Issues
1. Test with `prefers-reduced-motion` enabled
2. Verify keyboard navigation works
3. Check screen reader compatibility
4. Ensure static fallbacks are functional

## Examples

See `components/examples/ParallaxDemo.tsx` for comprehensive usage examples of all parallax components and features.