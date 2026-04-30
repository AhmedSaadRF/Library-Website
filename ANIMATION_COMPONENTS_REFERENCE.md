# 🎨 Animation Components - Quick Reference

## Import Statement

```tsx
import {
  PageTransition,
  Reveal,
  StaggerContainer,
  StaggerItem,
  ScaleHover,
  AnimatedInput,
  RippleButton,
  LoadingSpinner,
  SuccessCheckmark,
  // Variants:
  fadeUpVariants,
  staggerContainerVariants,
  scaleVariants,
  bounceVariants,
  slideInFromLeftVariants,
  slideInFromRightVariants,
  pulseVariants,
  shimmerVariants
} from '@/components/AnimatedComponents';
```

---

## Component Examples

### PageTransition *(Already in layout.tsx)*

Wraps entire page content for route transitions.

```tsx
<PageTransition>
  {children}
</PageTransition>
```

**What it does**: Fade + slide-up on page change (0.3s)

---

### Reveal

Fades in and slides up when entering viewport.

```tsx
<Reveal delay={0.1}>
  <h2>Your Heading</h2>
  <p>This content will fade-in + slide-up</p>
</Reveal>
```

**Props**:

- `children` - Content to reveal
- `delay` - Optional delay (0.1, 0.2, etc.)
- `className` - Optional CSS class

---

### StaggerContainer + StaggerItem

Animates list items with stagger effect.

```tsx
<StaggerContainer className="grid gap-4 md:grid-cols-3">
  {items.map((item) => (
    <StaggerItem key={item.id}>
      <div className="bg-white p-4 rounded-lg">
        {item.name}
      </div>
    </StaggerItem>
  ))}
</StaggerContainer>
```

**What it does**: Each child animates with 0.1s delay between them

---

### ScaleHover

Scales on hover, shrinks on tap.

```tsx
<ScaleHover scale={1.05}>
  <button className="px-6 py-3 bg-brand text-white rounded-lg">
    Hover Me
  </button>
</ScaleHover>
```

**Props**:

- `children` - Content to scale
- `scale` - Scale factor on hover (default: 1.05)
- `className` - Optional CSS

---

### AnimatedInput *(NEW)*

Form input with floating label animation.

```tsx
const [email, setEmail] = useState('');

<AnimatedInput
  label="Email Address"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  type="email"
  placeholder="user@example.com"
/>
```

**Features**:

- Label floats up on focus or when has value
- Smooth focus ring transition
- RTL compatible

---

### RippleButton *(NEW)*

Button with Material Design ripple effect.

```tsx
<RippleButton 
  onClick={() => console.log('Clicked')}
  className="px-8 py-3 bg-brand text-white rounded-lg font-bold"
  disabled={false}
>
  Click Me
</RippleButton>
```

**Features**:

- Ripple spreads from click point
- Hover scale 1.02
- Tap scale 0.98
- Disabled state support

---

### LoadingSpinner *(NEW)*

Smooth rotating loading indicator.

```tsx
<div className="flex justify-center">
  <LoadingSpinner className="w-12 h-12" />
</div>
```

**Features**:

- Infinite rotation (1s per rotation)
- Respects reduced motion setting
- Customizable size via className

---

### SuccessCheckmark *(NEW)*

Animated success/completion indicator.

```tsx
<SuccessCheckmark className="w-20 h-20" />
```

**Features**:

- Spring-based scale entrance
- SVG path animation
- Green color scheme
- Full accessibility

---

## Animation Variants

### Using Variants in Custom Components

```tsx
import { motion } from 'framer-motion';
import { fadeUpVariants, bounceVariants } from '@/components/AnimatedComponents';

// Simple fade-up
<motion.div variants={fadeUpVariants} initial="hidden" animate="visible">
  Content
</motion.div>

// Bounce entrance
<motion.div variants={bounceVariants} initial="hidden" animate="visible">
  Bouncy Content
</motion.div>

// Stagger container
<motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
  {/* children inherit stagger timing */}
</motion.div>
```

### Available Variants

- `fadeUpVariants` - Opacity 0→1, Y 20→0
- `staggerContainerVariants` - Sets up stagger for children
- `scaleVariants` - Scale 0.9→1 with backOut easing
- `bounceVariants` - Spring-based entrance
- `slideInFromLeftVariants` - Slide from left (RTL-aware)
- `slideInFromRightVariants` - Slide from right (RTL-aware)
- `pulseVariants` - Infinite opacity pulse
- `shimmerVariants` - Infinite shimmer effect

---

## Common Patterns

### Pattern 1: Form with Animations

```tsx
import { AnimatedInput, RippleButton } from '@/components/AnimatedComponents';
import { useState } from 'react';

export function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <form className="space-y-4">
      <AnimatedInput 
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AnimatedInput 
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <RippleButton 
        disabled={loading}
        className="w-full bg-brand text-white py-3 rounded-lg"
      >
        {loading ? 'Loading...' : 'Sign Up'}
      </RippleButton>
    </form>
  );
}
```

### Pattern 2: Loading State

```tsx
import { LoadingSpinner, SuccessCheckmark } from '@/components/AnimatedComponents';
import { useState, useEffect } from 'react';

export function DataFetcher() {
  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => setState('success'), 2000);
  }, []);

  return (
    <div className="text-center py-20">
      {state === 'loading' && <LoadingSpinner className="w-16 h-16 mx-auto" />}
      {state === 'success' && <SuccessCheckmark className="w-20 h-20 mx-auto" />}
      {state === 'error' && <p className="text-red-500 font-bold">Error occurred</p>}
    </div>
  );
}
```

### Pattern 3: Card Grid with Stagger

```tsx
import { StaggerContainer, StaggerItem } from '@/components/AnimatedComponents';

export function CardGrid({ items }) {
  return (
    <StaggerContainer className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <StaggerItem key={item.id}>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold">{item.title}</h3>
            <p className="text-gray-600 mt-2">{item.description}</p>
          </div>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
```

### Pattern 4: Custom Animation with Variants

```tsx
import { motion } from 'framer-motion';
import { bounceVariants } from '@/components/AnimatedComponents';

export function BounceCard() {
  return (
    <motion.div
      variants={bounceVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl text-white"
    >
      <h2 className="text-3xl font-bold">Bouncy Content!</h2>
    </motion.div>
  );
}
```

### Pattern 5: Respecting Reduced Motion

```tsx
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function AccessibleAnimation() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5 }}
    >
      Accessible animation
    </motion.div>
  );
}
```

---

## Tailwind CSS Utilities for Quick Animations

Combined with Framer Motion:

```tsx
// Smooth transitions on state changes
<div className="transition-all duration-300">
  {/* Content */}
</div>

// Light animations for hover/focus
<button className="transition-transform hover:scale-105 active:scale-95">
  Click
</button>

// Color transitions for theme switching
<div className="bg-white dark:bg-slate-900 transition-colors duration-300">
  {/* Content */}
</div>
```

---

## Performance Tips

1. **Use `transform` and `opacity` only**

   ```tsx
   // ✅ Good - Uses GPU
   <motion.div animate={{ x: 100, opacity: 0.5 }} />
   
   // ❌ Avoid - Triggers layout
   <motion.div animate={{ left: '100px', width: '200px' }} />
   ```

2. **Debounce heavy animations**

   ```tsx
   // ✅ Good - Staggered
   <StaggerContainer>
     {items.map((item) => <StaggerItem key={item}>{item}</StaggerItem>)}
   </StaggerContainer>
   ```

3. **Use `layout` animations carefully**

   ```tsx
   // Only on containers, not individual items
   <motion.div layout>
     {children}
   </motion.div>
   ```

---

## Accessibility Checklist

- [ ] All animations check `useReducedMotion()`
- [ ] Focus states visible without animation
- [ ] Keyboard navigation works smoothly
- [ ] Animations don't auto-play without user action
- [ ] ARIA labels present on animated elements
- [ ] Screen reader announcements triggered by `aria-live`

---

## Common Issues & Solutions

### Issue: Animation doesn't play

**Solution**: Ensure `AnimatePresence` wraps list if using exit animations

```tsx
<AnimatePresence>
  {items.map(item => <div key={item.id}>{item}</div>)}
</AnimatePresence>
```

### Issue: Animation too slow on mobile

**Solution**: Check reduced motion isn't enabled, or use shorter duration

```tsx
const duration = shouldReduceMotion ? 0 : 0.3;
```

### Issue: RTL animations breaking

**Solution**: Use `dir` from useTranslation() to adjust animation direction

```tsx
const { dir } = useTranslation();
const x = dir === 'rtl' ? 100 : -100;
```

### Issue: Form input label overlapping text

**Solution**: Ensure AnimatedInput wrapper has proper positioning

```tsx
<div className="relative">
  <AnimatedInput label="Name" {...props} />
</div>
```

---

## Resources

- **Framer Motion Docs**: <https://www.framer.com/motion/>
- **Animation Best Practices**: <https://www.framer.com/motion/best-practices/>
- **React Performance**: <https://react.dev/learn/render-and-commit>

---

**Last Updated**: April 30, 2026
**Status**: ✅ Ready for Production
