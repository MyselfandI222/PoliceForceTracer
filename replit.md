# CryptoTrace - Law Enforcement Cryptocurrency Investigation Platform

## Overview

CryptoTrace is a full-stack web application designed for law enforcement agencies to conduct cryptocurrency investigations. The platform allows officers to submit trace requests for cryptocurrency transactions, manage cases, and receive detailed investigation reports. It features both free and premium tiers, with premium traces offering expedited processing (1-2 hours vs 3-7 days).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack TypeScript Application
The application is built as a monolithic full-stack solution using TypeScript throughout, providing type safety and consistent development experience across frontend and backend.

**Rationale**: TypeScript ensures type safety across the entire stack, reducing runtime errors and improving developer productivity. The monolithic approach simplifies deployment and development for this law enforcement-focused application.

**Alternatives Considered**: Separate frontend/backend repositories, JavaScript instead of TypeScript
**Pros**: Single codebase, shared types, easier deployment
**Cons**: Potentially more complex scaling, larger bundle sizes

### Database Layer - PostgreSQL with Drizzle ORM
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes tables for users, traces, departments, and payment records.

**Rationale**: PostgreSQL provides ACID compliance and robust features needed for law enforcement data. Drizzle offers excellent TypeScript integration and type-safe queries.

**Alternatives Considered**: MongoDB, Prisma ORM, raw SQL queries
**Pros**: Type safety, excellent PostgreSQL features, performance
**Cons**: More complex setup than NoSQL solutions

### Authentication & Authorization
JWT-based authentication with role-based access control (officer, admin, super_admin). Users belong to departments and have badge numbers for proper law enforcement identification.

**Rationale**: JWT tokens provide stateless authentication suitable for distributed deployments. Role-based access ensures proper security boundaries for law enforcement use.

**Alternatives Considered**: Session-based auth, OAuth integration
**Pros**: Stateless, scalable, secure
**Cons**: Token management complexity, logout challenges

## Key Components

### Frontend Architecture (React + Vite)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture (Express.js)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Payment Processing**: Stripe integration for premium traces
- **Email Service**: Mock email service (ready for real implementation)
- **File Serving**: Static file serving for reports and assets

### Database Schema
- **Users**: Officer credentials, department association, roles
- **Traces**: Investigation requests with crypto addresses and case details
- **Departments**: Law enforcement agency management
- **Payment Records**: Premium trace payment tracking

### External Integrations
- **Stripe**: Payment processing for premium traces
- **Neon Database**: Serverless PostgreSQL hosting
- **Mock Services**: Cryptocurrency tracing service simulation

## Data Flow

### Authentication Flow
1. Officer receives signup token from department admin
2. Officer creates account with badge verification
3. JWT token issued for authenticated sessions
4. Role-based access control enforced on all endpoints

### Trace Investigation Flow
1. Officer submits cryptocurrency trace request
2. System validates input and creates trace record
3. Free traces enter standard queue (3-7 days)
4. Premium traces process payment and enter priority queue (1-2 hours)
5. Mock tracing service processes cryptocurrency analysis
6. Results stored and reports generated
7. Officer receives notification and can download report

### Payment Flow (Premium Traces)
1. Officer selects premium trace option
2. Stripe payment intent created for $995
3. Payment processing through Stripe Elements
4. Successful payment triggers premium processing
5. Payment record stored for audit trail

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **express**: Web server framework
- **jsonwebtoken**: JWT authentication
- **bcrypt**: Password hashing
- **stripe**: Payment processing (mocked in development)

### Frontend Dependencies
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form handling with validation
- **zod**: Schema validation
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for development

## Deployment Strategy

### Development Environment
- Vite development server for frontend with HMR
- Express server with automatic restart using tsx
- Database migrations using Drizzle Kit
- Environment variables for configuration

### Production Build
- Vite builds optimized frontend bundle
- ESBuild bundles backend for Node.js execution
- Static files served from Express server
- Single deployment artifact approach

### Environment Configuration
- Database URL configuration for PostgreSQL
- JWT secret for authentication security
- Stripe keys for payment processing
- Email service configuration (when implemented)

### Database Management
- Drizzle migrations in `./migrations` directory
- Schema definitions in `./shared/schema.ts`
- Push-based deployment with `drizzle-kit push`

The application is designed for law enforcement use with security, audit trails, and proper user management as primary concerns. The architecture supports both development efficiency and production reliability while maintaining the specialized requirements of cryptocurrency investigation workflows.