# Overview

This is a React-based mood quote application called "MoodQuote" that allows users to select their current mood and receive inspirational quotes tailored to that emotional state. The application features a clean, modern interface with predefined mood categories (happy, sad, inspired, angry, etc.) and displays curated quotes with authors. Users can interact with mood badges, copy quotes to clipboard, and navigate between a home page for mood selection and a results page displaying the chosen quote.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Built with React 18 using TypeScript and modern hooks
- **Routing**: Uses Wouter for lightweight client-side routing between home and quote result pages
- **State Management**: Local React state with props drilling for quote data sharing between components
- **UI Framework**: Implements shadcn/ui component library with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design system including CSS variables for theming
- **Build Tool**: Vite for fast development and production builds

## Backend Architecture
- **Express Server**: Node.js/Express API server with TypeScript
- **Database Layer**: Drizzle ORM configured for PostgreSQL with Neon database integration
- **Storage Interface**: Abstracted storage pattern with both memory and database implementations
- **API Design**: RESTful API structure with `/api` prefix routing
- **Development Setup**: Hot reloading with Vite integration in development mode

## Data Storage Solutions
- **Database**: PostgreSQL via Neon serverless database
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema**: User table with id, username, and password fields
- **Migrations**: Drizzle Kit for database schema management
- **Local Development**: In-memory storage fallback for development

## Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)
- **User Model**: Basic user entity with username/password authentication structure
- **Security**: Prepared for authentication implementation with user CRUD operations defined

## External Dependencies
- **Database Hosting**: Neon PostgreSQL serverless database
- **UI Components**: Radix UI primitives for accessible component foundation
- **Development Tools**: Replit-specific plugins for runtime error handling and development banner
- **Package Management**: npm with comprehensive UI component ecosystem
- **Fonts**: Google Fonts integration (Architects Daughter, DM Sans, Fira Code, Geist Mono)