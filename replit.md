# CryptoTrace - Law Enforcement Cryptocurrency Investigation Platform

## Overview
CryptoTrace is a full-stack web application for law enforcement agencies to conduct cryptocurrency investigations. It enables officers to submit trace requests for transactions, manage cases, and receive detailed investigation reports. The platform offers both free and premium tiers, with premium traces providing expedited processing. Its vision is to streamline crypto crime investigations, offering a crucial tool for modern law enforcement.

## User Preferences
Preferred communication style: Simple, everyday language.
Auto-fill test credentials for streamlined testing workflow.

## System Architecture
The application is a monolithic full-stack TypeScript application, ensuring type safety and consistent development. It uses PostgreSQL with Drizzle ORM for robust, type-safe data management. Authentication is JWT-based with role-based access control (officer, admin, super_admin), integrating badge numbers for law enforcement identification.

**Frontend:** Built with React 18 and Vite, utilizing Shadcn/UI (Radix UI) for components, Tailwind CSS for styling, TanStack Query for server state, and Wouter for routing.
**Backend:** Powered by Express.js, handling database interactions via Drizzle ORM, JWT authentication with bcrypt, Stripe for payments, and static file serving.
**Database Schema:** Includes tables for Users (officer credentials, departments, roles), Traces (investigation requests), Departments (agency management), and Payment Records.
**UI/UX Decisions:** Features a comprehensive, personalized UI theme system with dark/light mode and 6 color themes, font size options, and a compact mode. These settings persist and are accessible from role-specific settings pages (OfficerSettings, AdminSettings, VictimSettings). There's a clear separation between Law Enforcement and Victim portals, each with tailored navigation and branding.

## Recent Changes (August 2025)
**ChatGPT/OpenAI Integration Added:**
- Built complete AI assistant for cryptocurrency investigation analysis
- Added backend API routes for case analysis, transaction pattern detection, and report generation
- Created frontend components for AI-powered case analysis with risk assessment
- Integrated AI Assistant page accessible from officer portal sidebar
- Supports case detail analysis, suspicious pattern detection, and investigation recommendations
- Requires OPENAI_API_KEY environment variable for functionality

## External Dependencies
*   **Database:** PostgreSQL (hosted on Neon Database for serverless deployment)
*   **ORM:** Drizzle ORM
*   **Web Framework:** Express.js
*   **Authentication:** jsonwebtoken, bcrypt
*   **Payment Processing:** Stripe
*   **AI Integration:** OpenAI GPT-4o for case analysis and investigation assistance
*   **Frontend State Management:** @tanstack/react-query
*   **UI Primitives:** @radix-ui/*
*   **Form Handling:** react-hook-form
*   **Schema Validation:** zod
*   **CSS Framework:** tailwindcss
*   **Routing:** wouter
*   **Build Tool:** vite
*   **Language:** typescript