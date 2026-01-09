 File Metadata Analysis Service

## Over

view

#This project is a full-stack web application that provides file metadata analysis capabilities. Users can upload files through a modern React frontend and receive detailed metadata information including file size, type, name and extension. The application features a clean, intuitive drag-and-drop interface for file uploads and displays comprehensive file analysis results.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent, accessible design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: CSS custom properties for theming with dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **File Handling**: Multer middleware for multipart/form-data file uploads with 50MB size limit
- **API Design**: RESTful API with single endpoint `/api/fileanalyse` for file metadata extraction
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Development**: Hot reload with Vite integration for seamless development experience

### Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL with migration support
- **File Storage**: In-memory processing only - files are analyzed but not persisted
- **Session Management**: PostgreSQL session store with connect-pg-simple for potential future authentication needs

### Validation and Type Safety
- **Schema Validation**: Zod for runtime type validation and schema definitions
- **Shared Types**: Common schema definitions between frontend and backend in shared directory
- **API Contracts**: Type-safe API responses with structured error handling

### Development and Build Process
- **Development**: Concurrent frontend (Vite) and backend (tsx) development servers
- **Production Build**: Vite builds frontend assets, esbuild bundles backend for Node.js deployment
- **Code Quality**: TypeScript strict mode with comprehensive type checking
- **Asset Management**: Vite handles static assets with optimized bundling

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection for Neon DB
- **express**: Web application framework for Node.js backend API
- **multer**: File upload handling middleware for Express
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL

### Frontend UI Dependencies
- **@radix-ui/***: Headless UI components for accessible, customizable interface elements
- **@tanstack/react-query**: Data fetching and caching library for API state management
- **wouter**: Minimalist routing library for React applications
- **tailwindcss**: Utility-first CSS framework for rapid UI development

### Development and Build Tools
- **vite**: Frontend build tool and development server with React plugin
- **tsx**: TypeScript execution engine for Node.js development
- **esbuild**: JavaScript bundler for production backend builds
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for Replit environment

### Utility Libraries
- **zod**: Schema validation library for type-safe data validation
- **clsx**: Conditional CSS class name utility
- **date-fns**: Date manipulation and formatting library
- **nanoid**: URL-safe unique ID generator

### Optional Integration Services
- **Database**: PostgreSQL via Neon serverless for potential future data persistence
- **File Processing**: Currently in-memory only, extensible for cloud storage integration
- **Authentication**: Session infrastructure ready for future user management features
