# Valorant Tournament Hub

## Overview

A competitive gaming tournament platform built for Valorant esports, enabling players to join tournaments, form teams, and compete in organized brackets. The platform features a bold, gaming-first aesthetic inspired by leading esports platforms like Faceit, ESL, and Battlefy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter for a lightweight, hook-based navigation experience.

**State Management**: 
- TanStack Query (React Query) for server state management, data fetching, and caching
- Local component state using React hooks
- No global state management library required due to React Query's capabilities

**UI Component System**:
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Class Variance Authority (CVA) for component variant management
- Custom gaming-themed design system with Inter and Rajdhani fonts

**Design Philosophy**:
- Gaming-first aesthetics with bold, energetic visuals
- Information clarity for tournament data and schedules
- Action-oriented CTAs throughout the interface
- Responsive grid layouts optimized for desktop and mobile

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript support.

**API Design**: RESTful JSON API with endpoints organized by resource:
- `/api/tournaments` - Tournament management and listing
- `/api/teams` - Team creation and member management
- `/api/users` - User profiles and authentication
- `/api/tournaments/:id/registrations` - Tournament registration management
- `/api/tournaments/:id/matches` - Match and bracket data

**Validation**: Zod schema validation integrated with Drizzle ORM for type-safe data validation on both client and server.

**Session Management**: Express session handling with PostgreSQL session storage using connect-pg-simple.

### Data Layer

**Database**: PostgreSQL accessed via Neon serverless driver for connection pooling and serverless compatibility.

**ORM**: Drizzle ORM for type-safe database queries and schema management.

**Schema Design**:
- `users` - User authentication and profiles
- `tournaments` - Tournament metadata, rules, and prize pools
- `teams` - Team information and statistics
- `team_members` - Team membership with roles (captain/member)
- `tournament_registrations` - Links teams/users to tournaments
- `matches` - Match results and bracket progression

**Migrations**: Drizzle Kit for schema migrations stored in `/migrations` directory.

### External Dependencies

**Database Services**:
- Neon PostgreSQL - Serverless PostgreSQL hosting
- Connection pooling via @neondatabase/serverless

**UI Libraries**:
- Radix UI - Accessible component primitives (dialogs, dropdowns, tooltips, etc.)
- Tailwind CSS - Utility-first CSS framework
- Lucide React - Icon library for consistent iconography

**Development Tools**:
- Replit development plugins (cartographer, dev banner, runtime error overlay)
- tsx - TypeScript execution for development server
- esbuild - Production build bundling

**Google Fonts CDN**:
- Inter font family - UI and body text
- Rajdhani font family - Display headings and tournament titles

**Form Handling**:
- React Hook Form - Form state management
- @hookform/resolvers - Validation resolver integration with Zod

**Date Utilities**:
- date-fns - Date formatting and manipulation for tournament schedules