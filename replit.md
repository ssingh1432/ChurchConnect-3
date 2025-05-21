# Church Web Application Project Guide

## Overview

This project is a full-stack web application for a church/religious community, built with:

- **Frontend**: React with TypeScript, using shadcn/ui components
- **Backend**: Express.js API server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based auth system
- **File Storage**: Cloudinary integration
- **Styling**: TailwindCSS

The application follows a monorepo structure with clear separation between client, server, and shared code. The frontend is a React SPA with multiple pages for users to access church information, events, sermons, blog posts, etc. The backend provides RESTful APIs for data management and user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, using a component-based architecture with shadcn/ui for UI components. Key architectural decisions:

1. **Component Library**: The project uses shadcn/ui components (built on Radix UI) for a consistent and accessible UI.
2. **Routing**: Uses wouter for lightweight client-side routing.
3. **State Management**: Combines React's Context API for global state (auth, modals) with React Query for server state.
4. **Styling**: TailwindCSS with a customized theme that includes colors specific to the church branding.
5. **Type Safety**: TypeScript integration throughout the application with shared types between frontend and backend.

### Backend Architecture

The backend is a Node.js Express server providing RESTful APIs. Key architectural decisions:

1. **API Structure**: RESTful endpoints organized by domain (auth, events, sermons, blog posts, etc.).
2. **Authentication**: JWT-based authentication with role-based access control (visitor, admin roles).
3. **Database Access**: Abstracted through a storage interface that uses Drizzle ORM.
4. **File Uploads**: Integrated with Cloudinary for media asset management.
5. **Error Handling**: Centralized error handling middleware.

### Data Model

The application uses a PostgreSQL database with tables for:

1. Users (authentication, profile information)
2. Events (church events and activities)
3. Additional models defined but not fully implemented in the codebase: Ministries, Sermons, Blog Posts, Prayer Requests, Volunteers, Donations, Site Content, and Media Assets.

## Key Components

### Client-Side Components

1. **Pages**: React components representing different sections of the site:
   - Home, About, Ministries, Events, Sermons, Blog, Visit, Contact
   - Prayer Requests, Volunteer, Donate
   - Admin dashboard with various management interfaces

2. **UI Components**: Reusable components from shadcn/ui:
   - Forms, buttons, cards, modals, navigation, etc.
   - Custom components for church-specific features

3. **Authentication**: Components for login/registration and user management

### Server-Side Components

1. **API Routes**: Express routes for data access and manipulation
2. **Authentication Middleware**: JWT verification and role-based access control
3. **Storage Interface**: Abstraction for database operations
4. **Cloudinary Integration**: Image and media upload functionality

### Shared Components

1. **Schema Definitions**: Drizzle schema and Zod validation schemas
2. **Type Definitions**: TypeScript interfaces shared between client and server

## Data Flow

1. **Client-Side Request Flow**:
   - React components fetch data using React Query hooks
   - API requests are sent to the Express backend
   - Authentication state is managed through context and local storage
   - Forms use React Hook Form with Zod validation

2. **Server-Side Request Flow**:
   - Express routes handle incoming requests
   - Authentication middleware validates user session
   - Business logic processes the request
   - Database operations performed through storage interface
   - Responses return JSON data to the client

3. **Authentication Flow**:
   - User registers or logs in with credentials
   - Server validates credentials and issues JWT token
   - Token is stored in local storage and included in subsequent requests
   - Protected routes check token validity before processing requests

## External Dependencies

### Frontend Dependencies

1. **UI Framework**: React with TypeScript
2. **Component Library**: shadcn/ui with Radix UI components
3. **Styling**: TailwindCSS
4. **Routing**: wouter
5. **Data Fetching**: @tanstack/react-query
6. **Form Handling**: react-hook-form with zod validation
7. **HTTP Client**: axios
8. **Animation**: framer-motion
9. **Date Handling**: date-fns

### Backend Dependencies

1. **Server Framework**: Express.js
2. **Database ORM**: Drizzle with PostgreSQL
3. **Authentication**: jsonwebtoken, bcrypt
4. **File Storage**: cloudinary
5. **Validation**: zod
6. **Session Management**: connect-pg-simple

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development Mode**: Uses `npm run dev` with Vite for hot-reloading
2. **Production Build**: Builds frontend with Vite and bundles backend with esbuild
3. **Database**: Uses PostgreSQL (NeonDB compatible) for both development and production
4. **Env Variables**: Required environment variables include:
   - `DATABASE_URL`: Database connection string
   - `JWT_SECRET`: Secret for JWT token signing
   - `CLOUDINARY_*`: Cloudinary configuration keys

## Getting Started

1. **Environment Setup**:
   - Ensure the PostgreSQL database is provisioned
   - Set the required environment variables

2. **Database Initialization**:
   - Run `npm run db:push` to create database tables

3. **Development**:
   - Run `npm run dev` to start the development server

4. **Production Build**:
   - Run `npm run build` to create production bundles
   - Run `npm run start` to start the production server