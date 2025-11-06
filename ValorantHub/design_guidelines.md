# Valorant Tournament Hub - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from leading esports platforms (Faceit, ESL, Battlefy) and modern gaming communities (Discord). This gaming tournament platform requires bold visual impact, clear information hierarchy, and specialized components for brackets and team management.

## Core Design Principles

1. **Gaming-First Aesthetics**: Bold, energetic design that appeals to competitive gaming audience
2. **Information Clarity**: Tournament data, schedules, and brackets must be immediately scannable
3. **Action-Oriented**: Clear CTAs for joining, creating teams, and managing tournaments
4. **Community Feel**: Design should foster competitive spirit and team collaboration

## Typography System

**Font Stack**:
- Primary: "Inter" (via Google Fonts CDN) - clean, modern for UI elements
- Display: "Rajdhani" (via Google Fonts CDN) - bold, angular for headings and tournament titles

**Hierarchy**:
- Hero/Page Titles: Rajdhani Bold, text-5xl to text-6xl, uppercase, tight tracking
- Section Headings: Rajdhani SemiBold, text-3xl to text-4xl
- Tournament Names: Rajdhani Medium, text-2xl
- Body Text: Inter Regular, text-base
- Labels/Metadata: Inter Medium, text-sm, uppercase tracking-wide
- Action Text: Inter SemiBold, text-base

## Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Tight spacing: p-2, gap-2 (tags, badges)
- Standard spacing: p-4, gap-4, m-4 (cards, internal padding)
- Section spacing: py-8, py-12, py-16 (vertical rhythm)
- Large spacing: p-8, gap-8 (major sections)

**Grid System**:
- Desktop: max-w-7xl container
- Tournament cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Team listings: grid-cols-1 lg:grid-cols-2
- Profile sections: Single column max-w-4xl for readability

**Container Strategy**:
- Full-width background sections with inner max-w-7xl
- Content areas: px-4 md:px-6 lg:px-8

## Component Library

### Navigation
**Header**:
- Fixed top position with backdrop blur
- Logo + wordmark left-aligned
- Navigation links: Tournaments, My Teams, Profile, Leaderboard
- User avatar and notifications right-aligned
- Height: h-16, px-6

### Tournament Cards
- Card-based design with sharp corners (rounded-none or rounded-sm)
- Header: Tournament name with status badge (Live, Upcoming, Completed)
- Body: Prize pool (prominent), entry fee, participant count, format
- Footer: Join button or "Registered" status
- Hover: Subtle lift transform and border treatment
- Padding: p-6, gap-4

### Tournament Details Page
**Hero Section**:
- Full-width banner with tournament branding
- Tournament name as headline (Rajdhani, text-5xl)
- Quick stats row: Prize Pool | Entry Fee | Format | Participants
- Primary CTA: "Register Now" or "View Bracket"
- Height: 60vh with content vertically centered

**Info Grid**: 
- Two-column layout (lg:grid-cols-2)
- Left: Rules, Format, Schedule sections
- Right: Prize Distribution, Requirements, Contact

### Team Management
**Team Card**:
- Team name with role badge (Captain, Member)
- Member avatars in horizontal row (max 5 visible, +N indicator)
- Quick stats: Tournaments entered, Win rate
- Actions: Manage Team, Leave Team buttons
- Padding: p-6

**Team Creation Form**:
- Single column, max-w-2xl
- Fields: Team Name, Tag, Description
- Member invitation section with add/remove interface
- Spacing: gap-6 between form sections

### Bracket System
**Visual Bracket**:
- Horizontal scrollable container for large brackets
- Rounds displayed in columns with connecting lines
- Match cards: Team names, scores, timestamp
- Semi-transparent connecting lines between matches
- Mobile: Collapsible rounds with accordion pattern

**Match Card** (within bracket):
- Compact design: p-4
- Team names with icons
- Score display (large, bold when match complete)
- "TBD" state for upcoming matches

### Profile Page
**Profile Header**:
- Split layout: Avatar/info left, stats cards right
- Username (Rajdhani, text-4xl)
- Rank badge, join date, tournaments entered
- Action buttons: Edit Profile, Settings

**Activity Sections**:
- Tabs: Active Tournaments, Completed, Teams
- Card-based listings with consistent spacing (gap-4)
- Empty states with encouraging CTAs

### Form Components
**Input Fields**:
- Label above input (Inter Medium, text-sm, mb-2)
- Input height: h-12
- Padding: px-4
- Focus: Ring treatment with offset

**Buttons**:
- Primary CTA: px-8, h-12, Rajdhani Medium, text-base, uppercase
- Secondary: Same size, different treatment
- Icon buttons: Square, w-12 h-12
- Button groups: gap-3

**Status Badges**:
- Small, compact: px-3, py-1, text-xs, uppercase, tracking-wide
- Variants: Live (pulsing dot), Upcoming, Completed, Registered

### Data Display
**Stats Cards**:
- Grid of 3-4 cards showing key metrics
- Large number (text-4xl, Rajdhani Bold)
- Label below (text-sm, uppercase)
- Icon top-right corner
- Padding: p-6

**Tournament Schedule**:
- Timeline-style layout with connecting vertical line
- Match items: flex layout, time left, teams right
- Spacing: gap-4 between matches

### Footer
- Full-width with inner max-w-7xl
- Three columns: About/Links, Quick Links (Tournaments, Rules, FAQ), Social Media
- Copyright and legal links at bottom
- Padding: py-12

## Images

**Hero Images**:
- Tournament detail pages: Full-width hero (60vh) featuring Valorant game artwork or tournament branding
- Homepage: Optional hero banner (40vh) with platform branding

**Profile/Team Avatars**:
- Circular avatars, square fallback with initials
- Sizes: w-12 h-12 (standard), w-24 h-24 (profile header)

**Tournament Cards**:
- Optional thumbnail (16:9 aspect ratio) at card top
- 200-300px height, object-cover

**Placement**: Use gaming-themed imagery sparingly - focus on tournament branding and user-generated content rather than stock gaming photos

## Responsive Behavior

**Breakpoints**:
- Mobile: Stack all multi-column grids to single column
- Tablet (md): 2-column grids, maintain nav structure
- Desktop (lg+): Full multi-column layouts, expanded brackets

**Mobile Optimizations**:
- Bottom navigation bar for key actions
- Collapsible bracket rounds
- Simplified tournament cards (vertical stack)
- Hamburger menu for secondary navigation

## Animations

Use sparingly and purposefully:
- Page transitions: Subtle fade (200ms)
- Card hovers: Slight lift and shadow (150ms)
- Live tournament badges: Gentle pulse
- Bracket progression: Slide-in reveal when match completes
- NO scroll-triggered animations
- NO complex entrance animations

## Accessibility

- All interactive elements: min touch target 44x44px
- Form inputs: Proper labels, error states with descriptive text
- Status indicators: Never rely solely on visual treatment, include text/icons
- Keyboard navigation: Clear focus states with visible rings
- Screen reader: Proper semantic HTML, ARIA labels for tournament status

This design creates a bold, competitive atmosphere appropriate for esports while maintaining clarity for complex tournament data and bracket systems.