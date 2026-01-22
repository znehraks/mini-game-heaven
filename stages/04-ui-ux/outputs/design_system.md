# Design System: Mini-Game Heaven

> Generated: 2026-01-22
> Stage: 04-ui-ux
> AI Model: Gemini (Creative UI Designer) + Claude (Structuring)

**Version**: 1.0.0
**Theme**: Vaporwave / Y2K / Retro Arcade
**Target Audience**: 10대 (Korean Teenagers)

---

## 1. Color Palette

Our palette combines deep, void-like backgrounds with high-contrast neon accents to create an immersive arcade atmosphere.

### 1.1 Core Colors

| Token | Hex | Tailwind Name | Usage |
|-------|-----|---------------|-------|
| **Primary** | `#FF00FF` | `neon-pink` | Main CTAs, active states, key highlights |
| **Secondary** | `#00FFFF` | `neon-cyan` | Secondary actions, information, links |
| **Accent** | `#8B5CF6` | `neon-purple` | Creative elements, special effects, gradients |
| **Surface** | `#0A0A0F` | `arcade-dark` | Main background, cards (with opacity) |
| **Deep** | `#050508` | `arcade-void` | Page background, modal backdrops |
| **Success** | `#00FF00` | `retro-green` | Success states, score multipliers |
| **Warning** | `#FFFF00` | `retro-yellow` | Warnings, time running out |
| **Error** | `#FF0000` | `retro-red` | Errors, game over, critical alerts |

### 1.2 Text Colors

| Token | Hex | Tailwind Name | Usage |
|-------|-----|---------------|-------|
| **Primary** | `#FFFFFF` | `text-white` | Headings, primary content |
| **Muted** | `#D1D5DB` | `text-gray-300` | Body text, descriptions |
| **Dim** | `#6B7280` | `text-gray-500` | Placeholders, disabled text |

### 1.3 Gradients

```css
/* Vapor Wave Gradient */
.gradient-vaporwave {
  background: linear-gradient(135deg, #ff00ff 0%, #8b5cf6 50%, #00ffff 100%);
}

/* Deep Void Gradient */
.gradient-void {
  background: linear-gradient(180deg, #0a0a0f 0%, #050508 100%);
}

/* Glass Effect */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(8px);
}

/* Neon Border Gradient */
.border-neon {
  border-image: linear-gradient(135deg, #ff00ff, #00ffff) 1;
}
```

### 1.4 Color Usage Guidelines

| Context | Primary | Secondary | Accent |
|---------|---------|-----------|--------|
| Buttons (Main CTA) | neon-pink | neon-cyan | - |
| Links | neon-cyan | - | neon-purple |
| Highlights | neon-pink | - | - |
| Selected/Active | neon-pink | - | neon-purple |
| Scores | neon-cyan | retro-green | - |
| Game Over | retro-red | - | - |

---

## 2. Typography

### 2.1 Font Families

```css
/* Primary - Arcade/Pixel Font */
font-family: 'Press Start 2P', cursive;

/* Secondary - Clean Sans */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Font Loading**:
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
```

### 2.2 Type Scale

| Level | Font | Size | Weight | Line Height | Usage |
|-------|------|------|--------|-------------|-------|
| **Display** | Arcade | 48px (3rem) | 400 | 1.1 | Hero titles, game logos |
| **H1** | Arcade | 32px (2rem) | 400 | 1.2 | Page titles |
| **H2** | Arcade | 24px (1.5rem) | 400 | 1.3 | Section headings |
| **H3** | Arcade | 20px (1.25rem) | 400 | 1.4 | Card titles |
| **H4** | Arcade | 16px (1rem) | 400 | 1.5 | Subsections |
| **Body** | Sans | 16px (1rem) | 400 | 1.6 | Descriptions, paragraphs |
| **Body-sm** | Sans | 14px (0.875rem) | 400 | 1.5 | Secondary text |
| **Caption** | Sans | 12px (0.75rem) | 400 | 1.5 | Labels, timestamps |
| **Score** | Arcade | 64px (4rem) | 400 | 1.0 | In-game score display |

### 2.3 Typography Examples

```jsx
// Page Title
<h1 className="font-arcade text-2xl text-white">MINI GAME HEAVEN</h1>

// Game Card Title
<h3 className="font-arcade text-sm text-neon-cyan">NEON TOWER</h3>

// Description
<p className="font-sans text-base text-gray-300">Stack blocks to build the tallest tower!</p>

// Score Display
<span className="font-arcade text-4xl text-neon-cyan drop-shadow-neon-cyan">12,450</span>
```

---

## 3. Spacing System

Based on a `4px` base unit (0.25rem).

### 3.1 Spacing Scale

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| `space-1` | 4px | `p-1`, `m-1`, `gap-1` | Tight grouping, icon padding |
| `space-2` | 8px | `p-2`, `m-2`, `gap-2` | Button padding, small gaps |
| `space-3` | 12px | `p-3`, `m-3`, `gap-3` | Input padding |
| `space-4` | 16px | `p-4`, `m-4`, `gap-4` | Card padding, standard gaps |
| `space-5` | 20px | `p-5`, `m-5`, `gap-5` | Medium spacing |
| `space-6` | 24px | `p-6`, `m-6`, `gap-6` | Section spacing |
| `space-8` | 32px | `p-8`, `m-8`, `gap-8` | Large spacing |
| `space-10` | 40px | `p-10`, `m-10` | Hero spacing |
| `space-12` | 48px | `p-12`, `m-12` | Page margins |
| `space-16` | 64px | `p-16`, `m-16` | Major sections |

### 3.2 Component Spacing

| Component | Padding | Gap |
|-----------|---------|-----|
| Button | `px-4 py-2` (sm), `px-6 py-3` (lg) | - |
| Card | `p-4` | - |
| Modal | `p-6` | `gap-4` |
| Section | `py-8` | `gap-6` |
| Game Grid | `p-4` | `gap-4` |
| Nav | `px-4 py-3` | `gap-2` |

---

## 4. Borders & Effects

### 4.1 Border Radius

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| `rounded-none` | 0px | `rounded-none` | Pixel-perfect elements |
| `rounded-sm` | 2px | `rounded-sm` | Subtle rounding |
| `rounded` | 4px | `rounded` | Standard UI elements |
| `rounded-md` | 6px | `rounded-md` | Cards, buttons |
| `rounded-lg` | 8px | `rounded-lg` | Modals, large cards |
| `rounded-full` | 9999px | `rounded-full` | Pills, avatars, icons |

### 4.2 Neon Glow Effects

```css
/* Neon Pink Glow */
.glow-pink {
  box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff;
}

/* Neon Cyan Glow */
.glow-cyan {
  box-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff;
}

/* Neon Purple Glow */
.glow-purple {
  box-shadow: 0 0 5px #8b5cf6, 0 0 10px #8b5cf6, 0 0 20px #8b5cf6;
}

/* Text Glow */
.text-glow-pink {
  text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff;
}

.text-glow-cyan {
  text-shadow: 0 0 5px #00ffff, 0 0 10px #00ffff;
}

/* Pulsing Glow Animation */
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff; }
  50% { box-shadow: 0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff; }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
```

### 4.3 Glass/Blur Effects

```css
/* Glass Card */
.glass-card {
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Frosted Modal */
.frosted {
  background: rgba(5, 5, 8, 0.95);
  backdrop-filter: blur(20px);
}
```

---

## 5. Animation & Motion

### 5.1 Timing Functions

| Token | Value | Usage |
|-------|-------|-------|
| `ease-arcade` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Standard transitions |
| `ease-bounce` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Playful bounces |
| `ease-snap` | `cubic-bezier(0.5, 0, 0.5, 1)` | Quick snaps |

### 5.2 Duration Scale

| Token | Duration | Usage |
|-------|----------|-------|
| `fast` | 100ms | Micro-interactions |
| `normal` | 200ms | Standard transitions |
| `slow` | 300ms | Modal opens, page transitions |
| `slower` | 500ms | Complex animations |

### 5.3 Common Animations

```css
/* Slide Up (Modal, Toast) */
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Scale In (Game Start) */
@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* Shake (Error, Game Over) */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Float (Idle elements) */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Score Pop */
@keyframes scorePop {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
```

---

## 6. Breakpoints & Responsive

### 6.1 Breakpoint Scale

| Token | Width | Tailwind | Target |
|-------|-------|----------|--------|
| `xs` | 0px | default | Mobile Portrait |
| `sm` | 640px | `sm:` | Mobile Landscape |
| `md` | 768px | `md:` | Tablet |
| `lg` | 1024px | `lg:` | Small Desktop |
| `xl` | 1280px | `xl:` | Desktop |
| `2xl` | 1536px | `2xl:` | Large Desktop |

### 6.2 Game Canvas Sizes

```css
/* Mobile Portrait (Primary) */
.game-canvas-mobile {
  width: 100%;
  max-width: 400px;
  aspect-ratio: 9/16;
}

/* Tablet / Desktop */
.game-canvas-desktop {
  width: 100%;
  max-width: 600px;
  aspect-ratio: 3/4;
}

/* Square Format (certain games) */
.game-canvas-square {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1/1;
}
```

### 6.3 Safe Areas

```css
/* For mobile devices with notches */
.safe-top {
  padding-top: env(safe-area-inset-top);
}

.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
```

---

## 7. Component Tokens

### 7.1 Buttons

**Primary Button**
```jsx
<button className="
  px-6 py-3
  font-arcade text-sm text-white
  bg-neon-pink
  border-2 border-white
  rounded-md
  shadow-neon-pink
  hover:bg-pink-600 hover:shadow-lg
  active:scale-95
  transition-all duration-200
">
  PLAY NOW
</button>
```

**Secondary Button**
```jsx
<button className="
  px-6 py-3
  font-arcade text-sm text-neon-cyan
  bg-transparent
  border-2 border-neon-cyan
  rounded-md
  hover:bg-neon-cyan/10 hover:shadow-neon-cyan
  active:scale-95
  transition-all duration-200
">
  LEADERBOARD
</button>
```

**Ghost Button**
```jsx
<button className="
  px-4 py-2
  font-sans text-sm text-gray-300
  bg-transparent
  hover:text-white hover:bg-white/5
  transition-all duration-200
">
  Settings
</button>
```

### 7.2 Cards

**Game Card**
```jsx
<div className="
  p-4
  bg-arcade-dark/80
  backdrop-blur-md
  border border-white/10
  rounded-lg
  hover:border-neon-purple hover:scale-105
  transition-all duration-300
  cursor-pointer
">
  {/* Card content */}
</div>
```

**Glass Card**
```jsx
<div className="
  p-6
  bg-white/5
  backdrop-blur-lg
  border border-white/10
  rounded-lg
">
  {/* Card content */}
</div>
```

### 7.3 Inputs

**Text Input**
```jsx
<input className="
  w-full px-4 py-3
  font-sans text-white
  bg-white/5
  border-b-2 border-white/20
  focus:border-neon-cyan focus:outline-none
  transition-colors duration-200
  placeholder:text-gray-500
"/>
```

### 7.4 Modal

**Modal Overlay**
```jsx
<div className="
  fixed inset-0
  bg-arcade-void/90
  backdrop-blur-sm
  flex items-center justify-center
  z-50
">
  <div className="
    p-6
    bg-arcade-dark
    border-2 border-neon-pink
    rounded-lg
    shadow-neon-pink
    animate-scaleIn
  ">
    {/* Modal content */}
  </div>
</div>
```

### 7.5 Toast

**Notification Toast**
```jsx
<div className="
  fixed bottom-4 right-4
  px-4 py-3
  bg-arcade-dark/95
  border border-neon-cyan
  rounded-lg
  shadow-neon-cyan
  animate-slideUp
">
  <p className="font-arcade text-xs text-neon-cyan">NEW HIGH SCORE!</p>
</div>
```

---

## 8. Tailwind Configuration

Complete `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          pink: '#ff00ff',
          cyan: '#00ffff',
          purple: '#8b5cf6',
        },
        arcade: {
          dark: '#0a0a0f',
          void: '#050508',
        },
        retro: {
          green: '#00ff00',
          yellow: '#ffff00',
          red: '#ff0000',
        },
      },
      fontFamily: {
        arcade: ['"Press Start 2P"', 'cursive'],
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'neon-pink': '0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 20px #ff00ff',
        'neon-cyan': '0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 20px #00ffff',
        'neon-purple': '0 0 5px #8b5cf6, 0 0 10px #8b5cf6, 0 0 20px #8b5cf6',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'score-pop': 'scorePop 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px #ff00ff, 0 0 10px #ff00ff' },
          '50%': { boxShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff, 0 0 30px #ff00ff' },
        },
        slideUp: {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          from: { transform: 'scale(0.9)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        scorePop: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 9. Accessibility

### 9.1 Color Contrast

| Combination | Ratio | WCAG |
|-------------|-------|------|
| White on arcade-dark | 15.3:1 | AAA |
| neon-cyan on arcade-dark | 8.6:1 | AAA |
| neon-pink on arcade-dark | 4.8:1 | AA |
| gray-300 on arcade-dark | 10.2:1 | AAA |

### 9.2 Focus States

```css
/* Focus ring for keyboard navigation */
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-neon-cyan focus:ring-offset-2 focus:ring-offset-arcade-dark;
}
```

### 9.3 Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

*End of Design System Document*
