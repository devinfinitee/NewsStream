# News Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern news platforms like BBC News, CNN, and The Guardian, focusing on clean typography, clear information hierarchy, and professional presentation.

## Core Design Elements

### A. Color Palette
**Light Mode:**
- Primary: 15 15% 15% (dark charcoal for text)
- Background: 0 0% 98% (off-white)
- Card backgrounds: 0 0% 100% (pure white)
- Accent: 220 70% 50% (professional blue for links)
- Border: 0 0% 90% (light gray)

**Dark Mode:**
- Primary: 0 0% 95% (light text)
- Background: 220 13% 9% (dark background)
- Card backgrounds: 220 13% 12% (elevated dark)
- Accent: 220 70% 60% (lighter blue for contrast)
- Border: 0 0% 20% (dark gray)

### B. Typography
- **Headlines**: Inter or system fonts, 600-700 weight
- **Body text**: Inter, 400 weight, 16px base size
- **Navigation**: 500 weight, 14px
- **Article titles**: 600 weight, varying sizes (24px-32px for hero, 18px for cards)

### C. Layout System
**Tailwind Spacing**: Primary units of 4, 6, 8, 12, 16, 24
- Container max-width: 1200px
- Grid gaps: 6-8 units
- Component padding: 4-6 units
- Section spacing: 12-16 units

### D. Component Library

**Header/Navigation:**
- Fixed header with "Infinite News" logo (left)
- Horizontal navigation menu (Politics, Sports, Tech, Entertainment)
- Search bar with icon (right side)
- Mobile: Hamburger menu with overlay

**Hero Section:**
- Large background image with dark overlay
- Headline text overlay (white text, large typography)
- Subtitle text below headline
- Minimal padding, full-width image

**Article Cards:**
- Image thumbnail (16:9 aspect ratio)
- Title (2-3 lines max with ellipsis)
- "READ MORE" button (outline variant with blurred background when over images)
- Subtle shadow and hover effects

**Categories Sidebar:**
- Clean list layout
- Category names with subtle hover states
- Consistent spacing using 4-unit increments

**Footer:**
- Dark background (matching dark mode palette)
- Social media icons
- Site information and links
- Centered or grid layout

### E. Animations (GSAP)
**Minimal and Professional:**
- Subtle fade-in for article cards on scroll
- Smooth page transitions (0.3s duration)
- Gentle hover scale effects (1.02x max)
- Search bar focus expansion
- Mobile menu slide animations

## Images
**Hero Image**: Large building/architecture image as shown in reference (full-width, ~60vh height)
**Article Thumbnails**: Various news-related images (16:9 ratio, consistent sizing across cards)
**Placeholder Strategy**: Use high-quality stock photos from Unsplash for development

## Key Design Principles
1. **Information Hierarchy**: Clear distinction between headlines, subheadings, and body text
2. **Readability First**: Generous line spacing, adequate contrast ratios
3. **Consistent Spacing**: Stick to 4, 6, 8, 12, 16, 24 unit system
4. **Professional Aesthetic**: Clean, trustworthy design befitting a news platform
5. **Mobile-First**: Responsive breakpoints at 768px (tablet) and 1024px (desktop)