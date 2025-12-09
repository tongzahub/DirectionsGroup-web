# Animation Implementation Summary

This document describes the animations and micro-interactions implemented across the Bureau of Wonders website.

## Animation Components

### Core Animation Utilities (`components/animations/`)

1. **FadeIn** - Simple fade-in animation with configurable delay and duration
2. **SlideUp** - Slide-up animation with fade-in effect
3. **ScrollReveal** - Scroll-triggered animations that activate when elements enter viewport
4. **StaggerContainer** - Container for staggered child animations
5. **StaggerItem** - Individual items within a stagger container

## Implemented Animations

### 1. Page Content Animations

#### Hero Section (`components/content/HeroSection.tsx`)
- **Title**: Fade-in with slide-up (500ms duration)
- **Subtitle**: Fade-in with slide-up (500ms duration, 100ms delay)
- **CTA Button**: Fade-in with slide-up (500ms duration, 200ms delay)

#### Content Sections (`components/content/ContentSection.tsx`)
- **Section Title**: Scroll-triggered fade-in with slide-up
- **Content**: Scroll-triggered fade-in with slide-up (100ms delay)

### 2. Card Animations

All card components use Framer Motion for smooth 60fps animations:

#### Card Component (`components/ui/Card.tsx`)
- **Hover Effect**: Lifts 4px upward with enhanced shadow (200ms ease-out)
- **Transition**: Smooth box-shadow change

#### Blog Post Card (`components/cards/BlogPostCard.tsx`)
- **Hover Effect**: Lifts 4px upward with enhanced shadow (200ms ease-out)
- **Grid Display**: Staggered entrance animations (100ms delay between items)

#### Case Study Card (`components/cards/CaseStudyCard.tsx`)
- **Hover Effect**: Lifts 4px upward with enhanced shadow (200ms ease-out)
- **Grid Display**: Staggered entrance animations (100ms delay between items)

#### Job Listing Card (`components/cards/JobListingCard.tsx`)
- **Hover Effect**: Lifts 4px upward with enhanced shadow (200ms ease-out)
- **Grid Display**: Staggered entrance animations (100ms delay between items)

### 3. Button Animations (`components/ui/Button.tsx`)

- **Hover Effect**: 
  - Lifts 2px upward
  - Primary variant: Enhanced blue shadow
  - Secondary variant: Light blue background
  - Duration: 200ms ease-out
- **Tap Effect**: Scale down to 0.98 (200ms)
- **Loading State**: Rotating spinner animation (1s linear, infinite)

### 4. Grid Animations

#### BlogGrid, CaseStudyGrid, JobListingGrid (`components/grids/`)
- Uses StaggerContainer and StaggerItem for sequential entrance animations
- Each item fades in and slides up with 100ms stagger delay
- Creates a cascading effect across the grid

### 5. Image Gallery (`components/content/ImageGallery.tsx`)

- **Gallery Items**: Smooth scale-up on hover (300ms)
- **Overlay**: Fade-in dark overlay on hover (300ms)
- **Lightbox**: Fade-in animation when opening (300ms)

### 6. Navigation (`components/layout/Navigation.tsx`)

- **Mobile Drawer**: Slide-in from right (400ms)
- **Backdrop**: Fade-in animation (300ms)
- **Smooth Scroll**: Enabled for anchor links

## CSS Animations (`app/globals.css`)

### Keyframe Animations

1. **fadeIn**: Simple opacity transition (300ms)
2. **slideUp**: Opacity + translateY transition (400ms)
3. **slideDown**: Opacity + translateY transition (400ms)

### Utility Classes

- `.animate-fade-in` - Apply fade-in animation
- `.animate-slide-up` - Apply slide-up animation
- `.animate-slide-down` - Apply slide-down animation

### Performance Optimizations

- **will-change**: Applied to animated elements for GPU acceleration
- **60fps Target**: All animations optimized for 60fps performance
- **Reduced Motion**: Respects user's `prefers-reduced-motion` preference
- **Smooth Scrolling**: Enabled globally via `scroll-behavior: smooth`

## Animation Timing

All animations follow the design system specifications:

- **Fast interactions**: 200ms (button hovers, taps)
- **Standard animations**: 300-400ms (fades, slides)
- **Stagger delays**: 100ms between items
- **Easing**: `ease-out` for natural deceleration

## Browser Compatibility

- Uses Framer Motion for cross-browser compatibility
- Fallback CSS animations for basic effects
- Respects accessibility preferences (reduced motion)

## Performance Considerations

1. **Hardware Acceleration**: Animations use transform and opacity for GPU acceleration
2. **Lazy Loading**: Scroll-triggered animations only activate when in viewport
3. **Debouncing**: Scroll events are optimized to prevent performance issues
4. **Minimal Repaints**: Animations avoid properties that trigger layout recalculation

## Testing

To verify animations are working correctly:

1. Check hover effects on cards and buttons
2. Scroll through pages to see scroll-reveal animations
3. Test mobile navigation drawer animation
4. Verify staggered grid animations on blog/case studies/careers pages
5. Test with `prefers-reduced-motion` enabled to ensure accessibility
