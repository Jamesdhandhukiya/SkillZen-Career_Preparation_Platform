# SkillZen - Complete Technical Documentation

## Table of Contents
1. [Complete Tech Stack](#1-complete-tech-stack)
2. Main Module List
3. Module → Function List
4. API List (Full)
5. Data Flow & Supabase / Database Logic
6. Full Logic Explanation of Each Module
7. Authentication Logic — Complete
8. Overall Project Interactivity
9. Explain All Major Concepts Used in This Project
10. Module-wise Code Explanation

---

## 1. COMPLETE TECH STACK

This section explains every technology, framework, library, and tool used in the SkillZen project, along with why each one was chosen.

### 1.1 Frontend Technologies

#### **Next.js 15 (Framework)**
- **What it is**: Next.js is a React framework that provides server-side rendering, routing, and optimized performance.
- **Why it's used**: 
  - **App Router**: Next.js 15 uses the App Router, which provides file-based routing. Each folder in `/app` becomes a route automatically.
  - **Server Components**: Allows rendering components on the server, reducing client-side JavaScript and improving performance.
  - **API Routes**: Next.js can create API endpoints in the same project (inside `/app/api`), eliminating the need for a separate backend server.
  - **Built-in Optimizations**: Automatic code splitting, image optimization, and prefetching for better performance.
  - **TypeScript Support**: Full TypeScript support out of the box for type safety.
- **Where it's used**: 
  - Entire project structure is built on Next.js
  - All pages are in `/app` directory (dashboard, login, modules, etc.)
  - All API routes are in `/app/api` directory

#### **React 18.3.1 (UI Library)**
- **What it is**: React is a JavaScript library for building user interfaces using components.
- **Why it's used**:
  - **Component-Based Architecture**: Breaks UI into reusable pieces (buttons, cards, forms).
  - **Virtual DOM**: Efficiently updates only changed parts of the UI, making the app faster.
  - **Hooks**: Provides `useState`, `useEffect`, `useContext` for managing state and side effects.
  - **Community Support**: Large ecosystem with many ready-made components.
- **Where it's used**:
  - All UI components (buttons, cards, forms, inputs)
  - State management within components
  - Context providers (AuthContext, ResumeContext)
  - All pages in the `/app` directory

#### **TypeScript 5 (Programming Language)**
- **What it is**: TypeScript is JavaScript with static type checking - it adds types to JavaScript.
- **Why it's used**:
  - **Type Safety**: Catches errors during development before runtime (e.g., passing wrong data types).
  - **Better IDE Support**: Auto-completion and IntelliSense in code editors.
  - **Documentation**: Types serve as inline documentation showing what data structures are expected.
  - **Refactoring**: Safer code changes with type checking preventing breaking changes.
- **Where it's used**:
  - All `.tsx` and `.ts` files in the project
  - Type definitions for components, API responses, and data structures
  - Function parameters and return types

#### **Tailwind CSS 3.4.17 (Styling Framework)**
- **What it is**: Tailwind CSS is a utility-first CSS framework - you apply classes directly in HTML instead of writing separate CSS files.
- **Why it's used**:
  - **Rapid Development**: Write `className="bg-red-600 text-white p-4"` instead of creating CSS classes.
  - **Consistency**: Pre-defined spacing, colors, and sizes ensure design consistency.
  - **Responsive Design**: Built-in responsive utilities (`md:`, `lg:`) make mobile-first design easy.
  - **Small Bundle Size**: Unused styles are automatically removed during build.
- **Where it's used**:
  - All component styling in the project
  - Layout components (headers, cards, buttons)
  - Responsive design breakpoints
  - Custom theme in `tailwind.config.ts`

#### **shadcn/ui (UI Component Library)**
- **What it is**: A collection of high-quality, accessible React components built on Radix UI primitives.
- **Why it's used**:
  - **Accessibility**: Components follow ARIA guidelines for screen readers and keyboard navigation.
  - **Customizable**: Components are copied into your project, so you can modify them.
  - **Modern Design**: Pre-styled with Tailwind CSS, looks professional out of the box.
  - **Type-Safe**: Built with TypeScript for type safety.
- **Where it's used**:
  - All components in `/components/ui` directory (Button, Card, Input, Select, etc.)
  - Form components (Input, Textarea, Select, Checkbox)
  - Layout components (Card, Dialog, Sheet, Tabs)
  - Navigation components (Breadcrumb, Navigation Menu)

#### **Radix UI (Headless UI Primitives)**
- **What it is**: Low-level, unstyled, accessible component primitives that shadcn/ui builds upon.
- **Why it's used**:
  - **Accessibility**: Handles keyboard navigation, focus management, and ARIA attributes automatically.
  - **Headless**: Provides functionality without styling, allowing full design control.
  - **Unstyled**: No default styles, you add your own with Tailwind.
- **Where it's used**:
  - Under the hood of all shadcn/ui components
  - Dialog, Dropdown, Select, Checkbox, Radio components
  - Navigation Menu, Accordion, Tabs, Tooltip

#### **Monaco Editor (Code Editor)**
- **What it is**: The same code editor used in VS Code, made available as a React component.
- **Why it's used**:
  - **Feature-Rich**: Syntax highlighting, auto-completion, code folding, multi-cursor editing.
  - **Language Support**: Supports many programming languages (JavaScript, Python, Java, etc.).
  - **Familiar UX**: Users recognize it from VS Code, making it intuitive.
  - **Customizable**: Themes, font sizes, and editor settings can be customized.
- **Where it's used**:
  - `/components/CodeEditor.tsx` - Main code editor component
  - `/app/modules/coding/page.tsx` - Coding practice module
  - `/app/modules/coding/test/page.tsx` - Coding test interface

#### **Lucide React (Icon Library)**
- **What it is**: A modern icon library with hundreds of SVG icons.
- **Why it's used**:
  - **Tree-Shakeable**: Only imports icons you use, keeping bundle size small.
  - **Consistent Design**: All icons follow the same design language.
  - **Customizable**: Easy to change size and color with props.
  - **TypeScript Support**: Full TypeScript definitions.
- **Where it's used**:
  - Throughout all pages for icons (Brain, Code, BookOpen, etc.)
  - Button icons, navigation icons, feature icons
  - Status indicators (CheckCircle, XCircle, AlertCircle)

### 1.2 Backend Technologies

#### **Next.js API Routes (Backend Framework)**
- **What it is**: Next.js allows creating API endpoints in the same project without a separate backend server.
- **Why it's used**:
  - **Full-Stack in One**: Frontend and backend in the same codebase simplifies deployment.
  - **Server-Side Execution**: API routes run on the server, keeping API keys and secrets secure.
  - **File-Based Routing**: API routes follow the same routing pattern as pages (`/app/api/compile/route.ts` → `/api/compile`).
  - **TypeScript Support**: Full TypeScript support for type-safe APIs.
- **Where it's used**:
  - All API endpoints in `/app/api` directory
  - Compile API (`/app/api/compile/route.ts`)
  - Resume Parser API (`/app/api/resume-parser-v2/route.ts`)
  - Gemini AI API (`/app/api/gemini/route.ts`)
  - Question Generation API (`/app/api/generate-questions/route.ts`)

#### **Node.js Runtime (JavaScript Runtime)**
- **What it is**: Node.js allows running JavaScript on the server instead of just in the browser.
- **Why it's used**:
  - **Same Language**: Use JavaScript for both frontend and backend, reducing context switching.
  - **NPM Ecosystem**: Access to millions of packages via npm.
  - **Asynchronous I/O**: Handles multiple requests efficiently without blocking.
- **Where it's used**:
  - Runtime for all Next.js API routes
  - Server-side rendering
  - File system operations
  - HTTP requests to external APIs

### 1.3 Databases & Data Storage

#### **Supabase (Backend-as-a-Service)**
- **What it is**: Supabase is an open-source Firebase alternative providing PostgreSQL database, authentication, and real-time features.
- **Why it's used**:
  - **PostgreSQL Database**: Powerful relational database with SQL support.
  - **Built-in Authentication**: User signup, login, password reset, email verification.
  - **Row Level Security (RLS)**: Database-level security policies ensure users only access their own data.
  - **Real-time Updates**: Can listen to database changes in real-time (not used in this project but available).
  - **Easy Setup**: No need to manage database servers, Supabase handles it.
  - **Free Tier**: Generous free tier for development and small projects.
- **Where it's used**:
  - User authentication (`lib/supabase.ts`)
  - User profiles storage
  - Resume data storage (`lib/resumeService.ts`)
  - Session management (`contexts/AuthContext.tsx`)

#### **PostgreSQL (Database)**
- **What it is**: PostgreSQL is a powerful, open-source relational database management system.
- **Why it's used**:
  - **Relational Data**: Perfect for structured data (users, profiles, resume data) with relationships.
  - **ACID Compliance**: Ensures data integrity with transactions.
  - **SQL Support**: Use familiar SQL queries for complex data operations.
  - **JSON Support**: Can store JSON data alongside relational data.
- **Where it's used**:
  - Provided by Supabase as the underlying database
  - Tables: `auth.users`, `profiles`, `resume_data`
  - All database queries through Supabase client

#### **LocalStorage (Browser Storage)**
- **What it is**: Browser's built-in key-value storage that persists data even after closing the browser.
- **Why it's used**:
  - **Client-Side Caching**: Store resume data locally for fast access without API calls.
  - **Quota Management**: Track API quota usage client-side.
  - **User Preferences**: Store user-specific settings and data.
  - **Offline Support**: Access cached data even when offline.
- **Where it's used**:
  - Resume data caching (`app/contexts/ResumeContext.tsx`)
  - API quota tracking (`lib/quota-manager.ts`)
  - User-specific data storage with user ID as key

### 1.4 External APIs & Services

#### **Google Gemini AI API (AI Service)**
- **What it is**: Google's generative AI API that can generate text, analyze content, and answer questions.
- **Why it's used**:
  - **Question Generation**: Automatically generates aptitude and coding questions.
  - **Content Analysis**: Analyzes resumes and provides insights.
  - **Natural Language Processing**: Understands and generates human-like text.
  - **Cost-Effective**: Lower cost compared to GPT-4 for similar quality.
- **Where it's used**:
  - `/app/api/gemini/route.ts` - Main Gemini API endpoint
  - `/app/api/generate-questions/route.ts` - Question generation
  - Question generation in aptitude and coding modules
- **Rate Limiting**: Implemented via `lib/quota-manager.ts` to manage API quota

#### **Judge0 API (Code Execution Service)**
- **What it is**: An API for executing code in multiple programming languages in a sandboxed environment.
- **Why it's used**:
  - **Code Compilation**: Compiles and runs code in various languages (JavaScript, Python, Java, C++, etc.).
  - **Sandboxed Execution**: Runs code safely without affecting the server.
  - **Multiple Languages**: Supports 40+ programming languages.
  - **Test Case Execution**: Can run test cases and compare outputs.
- **Where it's used**:
  - `/app/api/compile/route.ts` - Main compilation endpoint
  - `/app/modules/coding/page.tsx` - Code execution in coding module
  - `/components/CodeEditor.tsx` - Running user's code
- **Access Method**: Accessed via RapidAPI platform

#### **APYHub Resume Parser API (Resume Parsing Service)**
- **What it is**: An API that extracts structured data from resume files (PDF, DOC, DOCX).
- **Why it's used**:
  - **Resume Extraction**: Automatically extracts personal info, skills, experience, education from resumes.
  - **Structured Data**: Converts unstructured resume text into JSON format.
  - **Multiple Formats**: Supports PDF, DOC, DOCX, TXT, RTF files.
- **Where it's used**:
  - `/app/api/resume-parser-v2/route.ts` - Primary resume parser
  - `/app/tools/page.tsx` - Resume upload and analysis
  - Fallback option if APILayer fails

#### **APILayer Resume Parser API (Resume Parsing Service - Backup)**
- **What it is**: Alternative resume parsing API with similar functionality to APYHub.
- **Why it's used**:
  - **Fallback Option**: Used if APYHub API fails or is unavailable.
  - **Redundancy**: Ensures resume parsing still works if one service is down.
  - **Different Format**: Handles slightly different response formats, increasing compatibility.
- **Where it's used**:
  - `/app/api/resume-parser-v2/route.ts` - Fallback parser
  - Only called if APYHub fails

#### **LanguageTool API (Grammar Checking)**
- **What it is**: An API for checking grammar, spelling, and style in text.
- **Why it's used**:
  - **Grammar Checking**: Validates text content for grammar and spelling errors.
  - **Multi-Language Support**: Can check multiple languages.
  - **Writing Quality**: Improves overall writing quality in generated content.
- **Where it's used**:
  - `/app/api/languagetool/route.ts` - Grammar checking endpoint
  - Potentially used for resume analysis and communication practice

### 1.5 Authentication & Security

#### **Supabase Auth (Authentication Service)**
- **What it is**: Built-in authentication system provided by Supabase.
- **Why it's used**:
  - **Email/Password Auth**: Standard email and password authentication.
  - **Session Management**: Automatic session creation and refresh token handling.
  - **Email Verification**: Built-in email confirmation (optional).
  - **Password Security**: Automatic password hashing and secure storage.
  - **JWT Tokens**: Issues JSON Web Tokens for secure API authentication.
  - **Row Level Security**: Can integrate with database security policies.
- **Where it's used**:
  - `/contexts/AuthContext.tsx` - Authentication state management
  - `/app/login/page.tsx` - Login functionality
  - `/app/signup/page.tsx` - User registration
  - `/lib/supabase.ts` - Supabase client configuration

#### **JWT (JSON Web Tokens)**
- **What it is**: A secure way to transmit information between parties as a JSON object.
- **Why it's used**:
  - **Session Tokens**: Supabase uses JWT to represent user sessions.
  - **Stateless Authentication**: Server doesn't need to store session data.
  - **Secure**: Tokens are cryptographically signed, preventing tampering.
  - **Expiration**: Tokens expire automatically for security.
- **Where it's used**:
  - Automatically handled by Supabase Auth
  - Stored in browser cookies/localStorage
  - Sent with API requests for authentication

### 1.6 State Management

#### **React Context API (State Management)**
- **What it is**: React's built-in way to share state across components without prop drilling.
- **Why it's used**:
  - **Global State**: Share user authentication state across all components.
  - **Resume Data**: Share resume analysis data across multiple pages.
  - **No External Libraries**: Built into React, no additional dependencies.
  - **Simple**: Easy to understand and implement for small to medium apps.
- **Where it's used**:
  - `/contexts/AuthContext.tsx` - Global authentication state
  - `/app/contexts/ResumeContext.tsx` - Global resume data state
  - Wraps entire app in `/app/layout.tsx`

#### **React Hooks (useState, useEffect, useContext)**
- **What it is**: React functions that let you use state and lifecycle features in functional components.
- **Why it's used**:
  - **Local State**: `useState` manages component-specific state (form inputs, UI state).
  - **Side Effects**: `useEffect` handles data fetching, subscriptions, DOM updates.
  - **Context Access**: `useContext` accesses global context values.
  - **Modern React**: Standard way to write React components today.
- **Where it's used**:
  - Every component in the project
  - Form state management
  - Data fetching and API calls
  - Event handlers

### 1.7 Form Management & Validation

#### **React Hook Form (Form Library)**
- **What it is**: A performant library for building forms with easy validation.
- **Why it's used**:
  - **Performance**: Minimal re-renders, better than controlled inputs for large forms.
  - **Validation**: Easy form validation with error messages.
  - **Less Code**: Requires less boilerplate than manual form handling.
  - **TypeScript Support**: Full TypeScript support for type-safe forms.
- **Where it's used**:
  - Form components throughout the application
  - Input validation
  - Error message display

#### **Zod (Schema Validation)**
- **What it is**: TypeScript-first schema validation library.
- **Why it's used**:
  - **Type Safety**: Validates data and infers TypeScript types automatically.
  - **Runtime Validation**: Validates data at runtime (API responses, form inputs).
  - **Error Messages**: Provides detailed error messages for validation failures.
  - **Integration**: Works seamlessly with React Hook Form.
- **Where it's used**:
  - Form validation schemas
  - API response validation
  - Type-safe data parsing

### 1.8 Utility Libraries

#### **clsx & tailwind-merge (CSS Class Utilities)**
- **What it is**: Utilities for conditionally joining CSS class names and merging Tailwind classes.
- **Why it's used**:
  - **Conditional Classes**: Apply classes conditionally based on state (`clsx`).
  - **Tailwind Conflicts**: Merge Tailwind classes without conflicts (`tailwind-merge`).
  - **Clean Code**: Keeps className attributes readable and maintainable.
- **Where it's used**:
  - `/lib/utils.ts` - Utility functions
  - All components with conditional styling
  - Dynamic class name generation

#### **date-fns (Date Utility Library)**
- **What it is**: Modern JavaScript date utility library for date manipulation.
- **Why it's used**:
  - **Date Formatting**: Format dates for display (e.g., "Jan 15, 2024").
  - **Date Calculations**: Calculate differences, add/subtract time periods.
  - **Lightweight**: Smaller bundle size than Moment.js.
  - **Immutable**: Functions don't mutate original dates.
- **Where it's used**:
  - Date formatting in components
  - Timestamp display
  - Date calculations for test results

#### **class-variance-authority (CVA) (Component Variants)**
- **What it is**: A library for creating type-safe component variants.
- **Why it's used**:
  - **Component Variants**: Define button styles (primary, secondary, outline, etc.).
  - **Type Safety**: TypeScript ensures only valid variants are used.
  - **Consistency**: Enforces consistent styling across components.
- **Where it's used**:
  - Button component variants
  - Badge component variants
  - Other UI component variants

### 1.9 Development Tools

#### **TypeScript (Language)**
- **Already covered in Frontend Technologies**

#### **ESLint (Code Linting)**
- **What it is**: Tool that finds and fixes problems in JavaScript/TypeScript code.
- **Why it's used**:
  - **Code Quality**: Catches bugs and code quality issues.
  - **Consistency**: Enforces coding standards across the project.
  - **Best Practices**: Suggests improvements and best practices.
- **Note**: Disabled during builds in `next.config.mjs` for faster builds

#### **PostCSS (CSS Processing)**
- **What it is**: Tool for transforming CSS with JavaScript plugins.
- **Why it's used**:
  - **Tailwind Processing**: Processes Tailwind CSS classes into actual CSS.
  - **Autoprefixer**: Adds vendor prefixes automatically for browser compatibility.
  - **CSS Optimization**: Minifies and optimizes CSS in production.
- **Where it's used**:
  - `postcss.config.mjs` - PostCSS configuration
  - Automatic CSS processing during build

### 1.10 Build & Deployment

#### **Vercel (Hosting Platform)**
- **What it is**: Platform for deploying Next.js applications with zero configuration.
- **Why it's used**:
  - **Next.js Optimized**: Built by the same team that created Next.js.
  - **Automatic Deployments**: Deploys on every git push.
  - **Serverless Functions**: API routes run as serverless functions.
  - **CDN**: Global content delivery network for fast loading.
  - **Free Tier**: Free hosting for personal projects.
- **Where it's used**:
  - Production deployment
  - Staging deployments
  - Preview deployments for pull requests

#### **npm / pnpm (Package Manager)**
- **What it is**: Tools for managing JavaScript dependencies and packages.
- **Why it's used**:
  - **Dependency Management**: Installs and manages all project dependencies.
  - **Lock Files**: Ensures same package versions across all environments.
  - **Scripts**: Runs build, dev, and test scripts.
- **Where it's used**:
  - `package.json` - Lists all dependencies
  - `package-lock.json` / `pnpm-lock.yaml` - Locks dependency versions
  - Installation and building the project

### 1.11 Additional Libraries & Tools

#### **sonner (Toast Notifications)**
- **What it is**: Beautiful toast notification library for React.
- **Why it's used**:
  - **User Feedback**: Shows success/error messages to users.
  - **Non-Intrusive**: Appears temporarily and auto-dismisses.
  - **Customizable**: Easy to style and customize.
- **Where it's used**:
  - Success messages after actions
  - Error notifications
  - Info messages

#### **recharts (Chart Library)**
- **What it is**: Composable charting library built on React components.
- **Why it's used**:
  - **Data Visualization**: Display charts and graphs (progress, statistics).
  - **React Integration**: Built specifically for React.
  - **Customizable**: Easy to customize colors, labels, animations.
- **Where it's used**:
  - Dashboard statistics visualization
  - Progress charts
  - Performance graphs

#### **cmdk (Command Menu)**
- **What it is**: Command palette component (like VS Code's Ctrl+K menu).
- **Why it's used**:
  - **Quick Actions**: Allows users to quickly navigate and execute actions.
  - **Keyboard Navigation**: Keyboard-first interface for power users.
  - **Search**: Built-in search functionality.
- **Where it's used**:
  - Command menu component (if implemented)
  - Quick navigation

---

**End of Section 1: Complete Tech Stack**

---

## 2. MAIN MODULE LIST

This section lists all major modules in the SkillZen project and provides a detailed description of each module's purpose, functionality, and role in the overall system.

### 2.1 Authentication Module

**Location**: `/app/login/page.tsx`, `/app/signup/page.tsx`, `/contexts/AuthContext.tsx`, `/lib/supabase.ts`

**Purpose**: Handles user authentication, registration, and session management throughout the application.

**Description**: 
- **Login Functionality**: Allows existing users to sign in with email and password. Validates credentials against Supabase Auth, creates a session, and redirects authenticated users to the dashboard.
- **Signup Functionality**: Enables new users to create accounts by providing personal information (name, email, password, role, location). Stores user data in Supabase and creates authentication records.
- **Session Management**: Tracks user authentication state globally using React Context. Automatically refreshes tokens and manages session expiration.
- **Protected Routes**: Ensures that authenticated users can access protected pages while redirecting unauthenticated users to the login page.
- **User State**: Maintains current user information (email, metadata, role) accessible throughout the application.

**Key Features**:
- Email/password authentication via Supabase
- Automatic session refresh
- Protected route handling
- Error handling for invalid credentials
- Development-friendly email confirmation bypass

---

### 2.2 Dashboard Module

**Location**: `/app/dashboard/page.tsx`

**Purpose**: Serves as the main hub after user login, displaying personalized information, progress statistics, and quick access to all learning modules.

**Description**:
- **Welcome Section**: Displays personalized greeting with user's name and role information.
- **Statistics Cards**: Shows key metrics including:
  - Overall progress percentage
  - Number of tests completed
  - Skills improved count
  - Current resume ATS score
- **Learning Modules Grid**: Displays all available learning modules (Aptitude, Coding, Interview Prep, Resume Analysis, Company Papers, Communication) with progress indicators.
- **Quick Actions**: Provides shortcuts to frequently used features like uploading resume, taking mock tests, and viewing salary insights.
- **Skills Display**: Shows skills extracted from user's resume, helping users understand their current skill set.
- **Salary Prediction**: Displays expected salary range based on user profile, skills, and location.
- **Admin Layout**: Special layout for admin users (admin@gmail.com) with different card arrangements and features.
- **User Profile Dropdown**: Quick access to profile editing and logout functionality.

**Key Features**:
- Personalized user dashboard
- Progress tracking across all modules
- Quick navigation to learning modules
- Admin-specific layout
- Real-time statistics updates

---

### 2.3 Landing Page Module

**Location**: `/app/page.tsx`

**Purpose**: Marketing and informational homepage that introduces SkillZen to visitors, showcases features, and encourages signups.

**Description**:
- **Hero Section**: Eye-catching introduction with call-to-action buttons directing users to signup or login.
- **Features Grid**: Displays 8 key features of the platform (Aptitude Practice, Coding Challenges, Interview Prep, Resume Analysis, Company Papers, Salary Insights, Mock Tests, Personalized Path) with icons and descriptions.
- **About Section**: Company story, mission statement, statistics (students trained, success rate, companies covered, satisfaction score), and AI-powered learning information.
- **Contact Section**: Contact form and contact information (email, phone, address) for user inquiries.
- **Navigation Header**: Smooth scroll navigation to different sections (Features, About, Contact).
- **Footer**: Links to important pages, social media icons, and copyright information.
- **Responsive Design**: Optimized for both desktop and mobile viewing.

**Key Features**:
- Marketing-focused design
- Feature showcase
- Contact functionality
- Smooth scroll navigation
- Mobile-responsive layout

---

### 2.4 Aptitude Practice Module

**Location**: `/app/modules/aptitude/page.tsx`

**Purpose**: Provides aptitude test preparation with questions covering quantitative reasoning, logical reasoning, and verbal ability.

**Description**:
- **Topic Selection**: Users can choose from 8 aptitude topics:
  - Mixture and Alligation
  - Profit and Loss
  - Pipes and Cisterns
  - Age Problems
  - Permutation and Combination
  - Speed, Time and Distance
  - Simple Interest
  - Calendar Problems
- **Difficulty Levels**: Questions can be generated at Easy, Medium, or Hard difficulty levels.
- **Test Configuration**: Users can select:
  - Number of questions (typically 5-20)
  - Difficulty level
  - Test type (Practice or Timed)
  - Duration (for timed tests)
- **Question Generation**: Uses Google Gemini AI to generate contextual questions based on selected topic and difficulty.
- **Test Interface**: Interactive test-taking interface with:
  - Question display with multiple-choice options
  - Radio button selection
  - Navigation between questions
  - Timer for timed tests
  - Progress indicator
- **Results & Analysis**: After test completion, shows:
  - Score (correct/total questions)
  - Percentage score
  - Individual question review with correct answers
  - Explanations for each question
  - Test history tracking
- **Fallback Questions**: Pre-defined fallback questions available when AI generation fails or API is unavailable.
- **API Status Tracking**: Monitors Gemini API availability and quota status.

**Key Features**:
- AI-powered question generation
- Multiple topic coverage
- Difficulty-based questions
- Timed and practice modes
- Detailed explanations
- Test history tracking
- Fallback question system

---

### 2.5 Coding Challenges Module

**Location**: `/app/modules/coding/page.tsx`, `/app/modules/coding/test/page.tsx`, `/components/CodeEditor.tsx`

**Purpose**: Provides coding practice with DSA (Data Structures & Algorithms), database queries, and problem-solving challenges with code compilation and execution.

**Description**:
- **Category Selection**: Three main categories:
  - **DSA**: 17 topics including Arrays, Strings, Linked Lists, Stacks, Queues, Trees, Graphs, Dynamic Programming, Backtracking, etc.
  - **Database**: 15 topics including Basic Queries, Joins, Subqueries, Window Functions, Indexing, Normalization, Transactions, etc.
  - **Problem Solving**: 8 topics including Mathematics, Number Theory, Recursion, Combinatorics, String Matching, Geometry, etc.
- **Topic & Subtopic Selection**: Users can drill down into specific subtopics within each main topic.
- **Question Configuration**:
  - Difficulty level (Easy, Medium, Hard)
  - Number of questions
  - Test type (Practice or Timed)
  - Duration selection
- **Code Editor**: Integrated Monaco Editor (VS Code editor) with:
  - Syntax highlighting for multiple languages
  - Auto-completion
  - Code folding
  - Multi-cursor editing
  - Language selection (JavaScript, Python, Java, C++, C, C#, Go, Rust, PHP, Ruby, TypeScript, SQL)
- **Code Execution**: 
  - Compiles and runs code using Judge0 API
  - Supports 40+ programming languages
  - Sandboxed execution environment
  - Test case execution and validation
  - Output comparison with expected results
- **Question Display**: Shows:
  - Problem statement
  - Examples with input/output
  - Constraints
  - Test cases
  - Pre-written solutions in multiple languages
- **Solution Tabs**: Allows switching between different language solutions for the same problem.
- **Results Display**: Shows compilation results, execution time, memory usage, and test case pass/fail status.

**Key Features**:
- Comprehensive DSA and database topics
- Multi-language code editor
- Real code compilation and execution
- Test case validation
- Solution comparison
- Performance metrics (time, memory)
- Pre-written solutions in multiple languages

---

### 2.6 Interview Preparation Module

**Location**: `/app/modules/interview/page.tsx`

**Purpose**: Provides interview preparation resources including technical interview questions and HR interview questions with communication practice.

**Description**:
- **Technical Interview Questions**: Collection of technical questions covering:
  - Programming concepts
  - Data structures and algorithms
  - System design basics
  - Problem-solving approaches
- **HR Interview Questions**: Common HR interview questions covering:
  - Behavioral questions
  - Situational questions
  - Strengths and weaknesses
  - Career goals and motivations
- **Communication Practice**: Features to practice verbal communication skills.
- **Question Categories**: Organized by topic and difficulty level.
- **Interactive Practice**: Users can practice answering questions with AI-powered feedback (potential future enhancement).
- **Preparation Tips**: Guidance and tips for interview success.

**Key Features**:
- Technical and HR question banks
- Communication skills practice
- Interview tips and guidance
- Practice mode for interview scenarios

---

### 2.7 Company Papers Module

**Location**: `/app/modules/company-papers/page.tsx`, `/app/modules/company-papers/loading.tsx`

**Purpose**: Provides access to previous year placement test papers from major companies like TCS, Infosys, Wipro, and others.

**Description**:
- **Company Selection**: Users can select from a list of companies whose previous year papers are available.
- **Paper Categories**: Organized by company and year.
- **Question Papers**: Access to actual questions from previous placement drives.
- **Loading States**: Proper loading indicators while fetching papers.
- **PDF/Document Viewers**: Ability to view and download question papers.
- **Practice Mode**: Users can attempt questions similar to actual company placement tests.
- **Score Tracking**: Track performance on company-specific papers.

**Key Features**:
- Previous year question papers
- Multiple company coverage
- Authentic placement test questions
- Performance tracking

---

### 2.8 Resume Analysis Module (Tools)

**Location**: `/app/tools/page.tsx`, `/app/api/resume-parser-v2/route.ts`, `/app/api/resume-parser/route.ts`, `/lib/resumeService.ts`

**Purpose**: AI-powered resume parsing and analysis tool that extracts information from resumes, calculates ATS scores, and provides improvement suggestions.

**Description**:
- **Resume Upload**: Users can upload resumes in multiple formats (PDF, DOC, DOCX, TXT, RTF).
- **File Validation**: 
  - File type checking
  - File size validation (5MB limit)
  - Format verification
- **Resume Parsing**: 
  - Primary parser: APYHub API (asynchronous job-based parsing)
  - Fallback parser: APILayer API (direct parsing)
  - Extracts structured data from unstructured resume text
- **Data Extraction**: Automatically extracts:
  - Personal information (name, email, phone, address, LinkedIn, website)
  - Professional summary
  - Work experience (company, position, duration, description)
  - Education (institution, degree, field, year)
  - Skills (technical and soft skills)
  - Achievements
  - Certifications
  - Languages
  - Projects
- **ATS Score Calculation**: Calculates Applicant Tracking System score (0-100) based on:
  - Contact information completeness (25 points)
  - Professional summary (15 points)
  - Work experience details (30 points)
  - Education information (15 points)
  - Skills section (20 points)
  - Achievements and certifications (10 points)
  - ATS keywords and optimization (10 points)
- **Analysis & Insights**:
  - Strengths identified in the resume
  - Areas for improvement
  - Overall analysis and recommendations
  - Skills gap analysis
- **Salary Prediction**: Predicts expected salary range based on:
  - Role/title
  - Location
  - Years of experience
  - Skills identified
- **Data Storage**: 
  - Saves parsed data to Supabase database
  - Caches data in localStorage for fast access
  - User-specific data isolation
- **Data Display**: 
  - Tabbed interface showing different sections
  - Editable fields for manual corrections
  - Visual ATS score display with progress bar
  - Skills displayed as badges
  - Download/reset options

**Key Features**:
- Multi-format resume parsing
- Automatic data extraction
- ATS score calculation
- Improvement suggestions
- Skills extraction
- Salary prediction
- Data persistence
- User-specific storage

---

### 2.9 Profile Management Module

**Location**: `/app/edit-profile/page.tsx`

**Purpose**: Allows users to view and edit their personal profile information.

**Description**:
- **Profile Display**: Shows current user information including:
  - Full name
  - Email address
  - Role/target role
  - Location
  - Profile picture (if available)
- **Profile Editing**: Users can update:
  - Personal information
  - Role preferences
  - Location details
  - Profile picture upload
- **Data Sync**: Updates are synced with Supabase database and reflected across the application.
- **Validation**: Form validation ensures data integrity before saving.
- **Avatar Display**: Shows user initials or uploaded profile picture.

**Key Features**:
- Profile information editing
- Real-time updates
- Data validation
- Profile picture support
- Synced with database

---

### 2.10 API Integration Module

**Location**: `/app/api/` directory

**Purpose**: Handles all API endpoints for external service integrations and internal data processing.

**Description**:
This module contains all API route handlers organized by functionality:

- **Gemini API** (`/app/api/gemini/route.ts`): 
  - Wraps Google Gemini AI API
  - Manages quota and rate limiting
  - Handles multiple API keys with fallback
  - Returns AI-generated content

- **Question Generation API** (`/app/api/generate-questions/route.ts`):
  - Generates coding questions using Gemini AI
  - Formats questions in structured JSON
  - Provides fallback questions if AI fails
  - Supports multiple difficulty levels

- **Code Compilation API** (`/app/api/compile/route.ts`):
  - Compiles and executes code via Judge0 API
  - Supports 40+ programming languages
  - Handles test case execution
  - Returns compilation results, output, errors, time, and memory usage

- **Compile Fallback API** (`/app/api/compile-fallback/route.ts`):
  - JavaScript-only code execution fallback
  - Runs when Judge0 API is unavailable
  - Browser-based execution for JavaScript

- **Resume Parser V2** (`/app/api/resume-parser-v2/route.ts`):
  - Primary resume parsing endpoint
  - Tries APYHub first, falls back to APILayer
  - Processes and structures resume data
  - Returns parsed resume information

- **Resume Parser** (`/app/api/resume-parser/route.ts`):
  - Legacy resume parser endpoint
  - Similar functionality to V2
  - Maintained for backward compatibility

- **LanguageTool API** (`/app/api/languagetool/route.ts`):
  - Grammar and spelling checking
  - Text validation and improvement suggestions

- **Test APIs** (`/app/api/test-apis/route.ts`, etc.):
  - Diagnostic endpoints for testing API connectivity
  - Validates API keys and service availability

**Key Features**:
- Centralized API management
- Error handling and fallback mechanisms
- Rate limiting and quota management
- Response formatting and validation
- Service health monitoring

---

### 2.11 Context/State Management Module

**Location**: `/contexts/AuthContext.tsx`, `/app/contexts/ResumeContext.tsx`

**Purpose**: Manages global application state using React Context API, providing shared state across all components.

**Description**:
- **AuthContext** (`/contexts/AuthContext.tsx`):
  - **Global Authentication State**: Stores current user, session, and loading state
  - **Authentication Methods**: Provides `signIn`, `signUp`, and `signOut` functions
  - **Session Management**: Automatically refreshes sessions and handles token expiration
  - **State Updates**: Listens to Supabase auth state changes and updates context
  - **Protected Route Logic**: Used by components to check authentication status
  - **Error Handling**: Manages authentication errors gracefully

- **ResumeContext** (`/app/contexts/ResumeContext.tsx`):
  - **Global Resume Data**: Stores parsed resume data (ATS score, skills, experience, education, etc.)
  - **Data Persistence**: Saves resume data to localStorage with user-specific keys
  - **Data Methods**: Provides `setResumeData`, `updateResumeScore`, `updateSkills`, `clearResumeData`
  - **User-Specific Storage**: Isolates data per user using user ID as storage key
  - **Data Loading**: Loads user-specific data when user logs in
  - **Data Clearing**: Clears data when user logs out

**Key Features**:
- Global state management without prop drilling
- Automatic persistence to localStorage
- User-specific data isolation
- Session management
- Reactive state updates across components

---

### 2.12 Utility Services Module

**Location**: `/lib/` directory

**Purpose**: Provides reusable utility functions and services used across the application.

**Description**:
- **Supabase Client** (`/lib/supabase.ts`):
  - Initializes Supabase client with environment variables
  - Provides authentication helper functions
  - Exports reusable Supabase instance

- **Resume Service** (`/lib/resumeService.ts`):
  - **saveResumeData**: Saves resume data to Supabase database
  - **getResumeData**: Retrieves resume data for a user
  - **updateResumeScore**: Updates ATS score in database
  - **updateSkills**: Updates skills list in database
  - Handles database errors and provides fallback

- **Quota Manager** (`/lib/quota-manager.ts`):
  - **API Quota Tracking**: Tracks Gemini API quota usage client-side
  - **Rate Limiting**: Prevents API calls too close together (2-second minimum interval)
  - **Multiple API Keys**: Manages multiple Gemini API keys with automatic fallback
  - **Quota Reset**: Handles quota reset when status changes
  - **LocalStorage Persistence**: Stores quota info in browser localStorage
  - **Status Management**: Tracks API status (online, offline, quota-exceeded)

- **Utils** (`/lib/utils.ts`):
  - **cn() Function**: Combines CSS class names using clsx and tailwind-merge
  - **Class Name Utilities**: Helps with conditional styling
  - **Other Utility Functions**: General helper functions

**Key Features**:
- Reusable service functions
- Centralized configuration
- Error handling
- LocalStorage integration
- API quota management

---

### 2.13 UI Components Module

**Location**: `/components/ui/` directory

**Purpose**: Provides reusable UI components built with shadcn/ui and Radix UI primitives.

**Description**:
Contains 50+ pre-built, accessible UI components including:

- **Form Components**: Button, Input, Textarea, Select, Checkbox, Radio Group, Switch, Label
- **Layout Components**: Card, Separator, Tabs, Accordion, Collapsible, Sheet, Dialog
- **Navigation Components**: Breadcrumb, Navigation Menu, Menubar, Pagination
- **Feedback Components**: Alert, Alert Dialog, Toast, Progress, Skeleton, Tooltip
- **Data Display Components**: Table, Badge, Avatar, Aspect Ratio
- **Advanced Components**: Command (Command Palette), Calendar, Carousel, Chart, Resizable Panels

Each component:
- Built with TypeScript for type safety
- Styled with Tailwind CSS
- Accessible (ARIA compliant)
- Customizable and themable
- Follows consistent design patterns

**Key Features**:
- Consistent design system
- Accessibility-first
- Fully customizable
- Type-safe
- Production-ready components

---

### 2.14 Layout & Navigation Module

**Location**: `/app/layout.tsx`, `/app/globals.css`

**Purpose**: Defines the root layout structure, global styles, and context providers for the entire application.

**Description**:
- **Root Layout** (`/app/layout.tsx`):
  - Wraps entire application
  - Provides Context Providers (AuthProvider, ResumeProvider)
  - Sets global metadata (title, description)
  - Loads global CSS
  - Configures fonts (Inter from Google Fonts)
  - Defines HTML structure

- **Global Styles** (`/app/globals.css`):
  - Tailwind CSS directives
  - Custom CSS variables
  - Global style overrides
  - Animation definitions
  - Dark mode support (if implemented)

**Key Features**:
- Application-wide configuration
- Context provider setup
- Global styling
- Metadata management
- Font optimization

---

**End of Section 2: Main Module List**

---

## 3. MODULE-WISE FUNCTION LIST

This section provides a detailed breakdown of all functions, components, classes, hooks, and handlers in each module, explaining their purpose, inputs, outputs, internal logic, and interactions with other modules.

---

### 3.1 Authentication Module

#### 3.1.1 AuthContext Component (`/contexts/AuthContext.tsx`)

**Component: `AuthProvider`**
- **Type**: React Context Provider Component
- **Purpose**: Provides authentication state and methods to all child components
- **Input Parameters**: 
  - `children`: React.ReactNode - All child components that need access to auth context
- **Output/Return**: JSX with AuthContext.Provider wrapping children
- **Internal Logic**:
  1. Initializes state for `user`, `session`, and `loading`
  2. On mount, calls `getInitialSession()` to check if user is already logged in
  3. Sets up listener for auth state changes from Supabase
  4. Provides `signIn`, `signUp`, and `signOut` functions to child components
  5. Updates state whenever auth state changes
- **Interactions**:
  - Uses `supabase` from `/lib/supabase.ts` to interact with authentication
  - Used by login page, signup page, dashboard, and all protected pages
  - Provides state to `useAuth` hook

**Function: `getInitialSession` (Internal)**
- **Type**: Async Function
- **Purpose**: Checks if user has an active session when app loads
- **Input Parameters**: None (uses Supabase client)
- **Output/Return**: 
  - Sets `session` and `user` state
  - Sets `loading` to false
- **Internal Logic**:
  1. Calls `supabase.auth.getSession()` to get current session
  2. If error and it's a refresh token error, signs out user
  3. Sets session and user state if session exists
  4. Sets loading to false to indicate check is complete
- **Interactions**: Called automatically in `useEffect` when AuthProvider mounts

**Function: `signIn`**
- **Type**: Async Function
- **Purpose**: Signs in a user with email and password
- **Input Parameters**:
  - `email`: string - User's email address
  - `password`: string - User's password
- **Output/Return**: 
  - `Promise<{ data: any, error: any }>` - Returns data with user object or error
- **Internal Logic**:
  1. Calls `supabase.auth.signInWithPassword()` with email and password
  2. If error mentions "Email not confirmed", logs a message (for development)
  3. Returns the response data and error
  4. Supabase automatically updates auth state, triggering the listener
- **Interactions**:
  - Called from login page when user submits form
  - Updates Supabase auth state
  - Listener automatically updates context state

**Function: `signUp`**
- **Type**: Async Function
- **Purpose**: Creates a new user account
- **Input Parameters**:
  - `email`: string - User's email address
  - `password`: string - User's password
  - `userData`: any - Additional user metadata (name, role, location)
- **Output/Return**: 
  - `Promise<{ data: any, error: any }>` - Returns data with user object or error
- **Internal Logic**:
  1. Calls `supabase.auth.signUp()` with email, password, and user metadata
  2. Sets `emailRedirectTo` to dashboard URL for email confirmation
  3. If user is created but email not confirmed, logs a message
  4. Returns the response data and error
- **Interactions**:
  - Called from signup page when user submits form
  - Creates user in Supabase Auth
  - Stores user metadata in user_metadata field

**Function: `signOut`**
- **Type**: Async Function
- **Purpose**: Signs out the current user
- **Input Parameters**: None
- **Output/Return**: `Promise<void>`
- **Internal Logic**:
  1. Calls `supabase.auth.signOut()` to end the session
  2. Supabase automatically clears session and user data
  3. Auth state change listener updates context state to null
- **Interactions**:
  - Called from dashboard logout button
  - Clears Supabase session
  - Listener automatically updates context state to null

**Hook: `useAuth`**
- **Type**: Custom React Hook
- **Purpose**: Allows components to access authentication context
- **Input Parameters**: None
- **Output/Return**: 
  - `AuthContextType` object with `user`, `session`, `loading`, `signIn`, `signUp`, `signOut`
- **Internal Logic**:
  1. Calls `useContext(AuthContext)` to get context value
  2. Throws error if used outside AuthProvider
  3. Returns context value
- **Interactions**: Used by all components that need authentication state

---

#### 3.1.2 Supabase Client (`/lib/supabase.ts`)

**Variable: `supabase`**
- **Type**: Supabase Client Instance
- **Purpose**: Main Supabase client for database and auth operations
- **Input Parameters**: Created from environment variables
- **Output/Return**: Supabase client instance
- **Internal Logic**:
  1. Reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from environment
  2. Throws error if variables are missing
  3. Creates and exports Supabase client using `createClient()`
- **Interactions**: Used by AuthContext, resumeService, and all database operations

**Function: `signUp` (Helper)**
- **Type**: Async Function
- **Purpose**: Helper function for user registration (duplicate of context function)
- **Input Parameters**:
  - `email`: string
  - `password`: string
  - `userData`: any
- **Output/Return**: `Promise<{ data: any, error: any }>`
- **Internal Logic**: Wraps `supabase.auth.signUp()` call
- **Interactions**: Can be used directly without context

**Function: `signIn` (Helper)**
- **Type**: Async Function
- **Purpose**: Helper function for user login
- **Input Parameters**:
  - `email`: string
  - `password`: string
- **Output/Return**: `Promise<{ data: any, error: any }>`
- **Internal Logic**: Wraps `supabase.auth.signInWithPassword()` call
- **Interactions**: Can be used directly without context

**Function: `signOut` (Helper)**
- **Type**: Async Function
- **Purpose**: Helper function for user logout
- **Input Parameters**: None
- **Output/Return**: `Promise<{ error: any }>`
- **Internal Logic**: Wraps `supabase.auth.signOut()` call
- **Interactions**: Can be used directly without context

**Function: `getCurrentUser`**
- **Type**: Async Function
- **Purpose**: Gets the currently authenticated user
- **Input Parameters**: None
- **Output/Return**: `Promise<{ user: User | null, error: any }>`
- **Internal Logic**: Calls `supabase.auth.getUser()` and returns user or error
- **Interactions**: Used for server-side user verification

**Function: `getSession`**
- **Type**: Async Function
- **Purpose**: Gets the current session
- **Input Parameters**: None
- **Output/Return**: `Promise<{ session: Session | null, error: any }>`
- **Internal Logic**: Calls `supabase.auth.getSession()` and returns session or error
- **Interactions**: Used for checking authentication status

---

#### 3.1.3 Login Page Component (`/app/login/page.tsx`)

**Component: `LoginPage` (Default Export)**
- **Type**: React Functional Component
- **Purpose**: Displays login form and handles user authentication
- **Input Parameters**: None (page component)
- **Output/Return**: JSX for login page
- **Internal Logic**:
  1. Uses `useAuth` hook to get authentication functions
  2. Manages form state (email, password, showPassword, isLoading, error)
  3. Redirects to dashboard if user is already logged in
  4. Handles form submission with validation
  5. Displays error messages if login fails
- **Interactions**:
  - Uses `useAuth` from AuthContext
  - Uses Next.js `useRouter` for navigation
  - Calls `signIn` function on form submit

**State Variables**:
- `showPassword`: boolean - Toggles password visibility
- `email`: string - User's email input
- `password`: string - User's password input
- `isLoading`: boolean - Indicates if login is in progress
- `isVisible`: boolean - Controls animation visibility
- `error`: string - Stores error message

**Handler: `handleLogin`**
- **Type**: Async Function
- **Purpose**: Handles login form submission
- **Input Parameters**: 
  - `e`: React.FormEvent - Form submission event
- **Output/Return**: `Promise<void>`
- **Internal Logic**:
  1. Prevents default form submission
  2. Sets loading state to true
  3. Clears previous errors
  4. Calls `signIn(email, password)` from useAuth
  5. If error, displays error message
  6. If success, user is automatically redirected by useEffect
- **Interactions**: Uses `signIn` from AuthContext

**Effect: `useEffect` (User Redirect)**
- **Type**: React Hook Effect
- **Purpose**: Redirects user to dashboard if already logged in
- **Input Parameters**: `[user, loading, router]` dependencies
- **Output/Return**: None (side effect)
- **Internal Logic**: If user exists and not loading, redirects to `/dashboard`
- **Interactions**: Watches `user` from AuthContext

---

#### 3.1.4 Signup Page Component (`/app/signup/page.tsx`)

**Component: `SignupPage` (Default Export)**
- **Type**: React Functional Component
- **Purpose**: Displays signup form and handles user registration
- **Input Parameters**: None (page component)
- **Output/Return**: JSX for signup page
- **Internal Logic**:
  1. Manages form state with multiple fields
  2. Validates password confirmation match
  3. Calls signup API with user data
  4. Redirects to dashboard on success
- **Interactions**:
  - Uses `useAuth` from AuthContext
  - Uses Next.js `useRouter` for navigation

**State Variables**:
- `formData`: object - Contains fullName, email, password, confirmPassword, role, location
- `showPassword`: boolean - Password visibility toggle
- `isLoading`: boolean - Loading state
- `error`: string - Error message

**Handler: `handleSignup`**
- **Type**: Async Function
- **Purpose**: Handles signup form submission
- **Input Parameters**: 
  - `e`: React.FormEvent - Form submission event
- **Output/Return**: `Promise<void>`
- **Internal Logic**:
  1. Prevents default form submission
  2. Validates passwords match
  3. Calls `signUp()` with email, password, and user metadata
  4. Redirects to dashboard on success
  5. Shows error if signup fails
- **Interactions**: Uses `signUp` from AuthContext

**Handler: `handleInputChange`**
- **Type**: Function
- **Purpose**: Updates form data when input changes
- **Input Parameters**: 
  - `field`: string - Field name to update
  - `value`: string - New value
- **Output/Return**: None (updates state)
- **Internal Logic**: Updates `formData` state with new value for specified field
- **Interactions**: Called by all input onChange handlers

---

### 3.2 Context/State Management Module

#### 3.2.1 ResumeContext Component (`/app/contexts/ResumeContext.tsx`)

**Component: `ResumeProvider`**
- **Type**: React Context Provider Component
- **Purpose**: Provides resume data state and methods to all child components
- **Input Parameters**: 
  - `children`: ReactNode - Child components
- **Output/Return**: JSX with ResumeContext.Provider
- **Internal Logic**:
  1. Manages `resumeData` state and `currentUserId` state
  2. Automatically saves resume data to localStorage when it changes
  3. Provides functions to update, load, and clear resume data
- **Interactions**:
  - Used by tools page (resume upload)
  - Used by dashboard (display resume data)
  - Saves to localStorage with user-specific keys

**Function: `getStorageKey` (Internal)**
- **Type**: Function
- **Purpose**: Generates localStorage key for user-specific resume data
- **Input Parameters**: 
  - `userId`: string - User's unique ID
- **Output/Return**: string - Storage key like `"resumeAnalysis_user123"`
- **Internal Logic**: Concatenates `"resumeAnalysis_"` with userId
- **Interactions**: Used internally for localStorage operations

**Function: `setResumeData`**
- **Type**: Function (from useState)
- **Purpose**: Sets the entire resume data object
- **Input Parameters**: 
  - `data`: ResumeData | null - Complete resume data object
- **Output/Return**: None (updates state)
- **Internal Logic**: Updates `resumeData` state, triggers useEffect to save to localStorage
- **Interactions**: Used by tools page after parsing resume

**Function: `updateResumeScore`**
- **Type**: Function
- **Purpose**: Updates only the ATS score in resume data
- **Input Parameters**: 
  - `score`: number - New ATS score (0-100)
- **Output/Return**: None (updates state)
- **Internal Logic**: 
  1. Uses setResumeData with spread operator to keep existing data
  2. Updates only `atsScore` field
  3. Updates `lastUpdated` timestamp
- **Interactions**: Can be called to update score without full resume data

**Function: `updateSkills`**
- **Type**: Function
- **Purpose**: Updates only the skills array in resume data
- **Input Parameters**: 
  - `skills`: string[] - Array of skill names
- **Output/Return**: None (updates state)
- **Internal Logic**: 
  1. Uses setResumeData with spread operator
  2. Updates only `skills` array
  3. Updates `lastUpdated` timestamp
- **Interactions**: Called when skills are modified

**Function: `clearResumeData`**
- **Type**: Function
- **Purpose**: Clears resume data from state and localStorage
- **Input Parameters**: None
- **Output/Return**: None
- **Internal Logic**:
  1. Sets resumeData to null
  2. Removes data from localStorage if currentUserId exists
- **Interactions**: Called when user wants to reset resume data

**Function: `loadUserData`**
- **Type**: Function
- **Purpose**: Loads user-specific resume data from localStorage
- **Input Parameters**: 
  - `userId`: string - User's unique ID
- **Output/Return**: None (updates state)
- **Internal Logic**:
  1. Checks if userId is different from currentUserId
  2. If different, sets currentUserId
  3. Reads data from localStorage using user-specific key
  4. Parses JSON and sets resumeData state
  5. Handles errors if JSON is invalid
- **Interactions**: 
  - Called from dashboard when user logs in
  - Loads data specific to logged-in user

**Function: `clearUserData`**
- **Type**: Function
- **Purpose**: Clears resume data when user logs out
- **Input Parameters**: None
- **Output/Return**: None
- **Internal Logic**:
  1. Sets resumeData to null
  2. Sets currentUserId to null
- **Interactions**: Called when user logs out to prevent data leakage

**Effect: `useEffect` (Save to localStorage)**
- **Type**: React Hook Effect
- **Purpose**: Automatically saves resume data to localStorage when it changes
- **Input Parameters**: `[resumeData, currentUserId]` dependencies
- **Output/Return**: None (side effect)
- **Internal Logic**:
  1. Watches for changes in resumeData or currentUserId
  2. If both exist, generates storage key
  3. Converts resumeData to JSON string
  4. Saves to localStorage
- **Interactions**: Automatically triggered when resumeData is updated

**Hook: `useResume`**
- **Type**: Custom React Hook
- **Purpose**: Allows components to access resume context
- **Input Parameters**: None
- **Output/Return**: ResumeContextType with resumeData and all methods
- **Internal Logic**: 
  1. Calls `useContext(ResumeContext)`
  2. Throws error if used outside ResumeProvider
  3. Returns context value
- **Interactions**: Used by tools page and dashboard

---

### 3.3 Utility Services Module

#### 3.3.1 QuotaManager Class (`/lib/quota-manager.ts`)

**Class: `QuotaManager`**
- **Type**: Static Class (no instances needed)
- **Purpose**: Manages Gemini API quota tracking, rate limiting, and multiple API key switching
- **Input Parameters**: None (static class)
- **Output/Return**: N/A (class definition)
- **Internal Logic**: All methods are static, using localStorage for persistence
- **Interactions**: Used by Gemini API route and aptitude/coding modules

**Static Property: Constants**
- `QUOTA_KEY`: string - localStorage key for quota info
- `STATUS_KEY`: string - localStorage key for API status
- `CACHE_DURATION`: number - 5 minutes in milliseconds

**Static Method: `getApiKeys`**
- **Type**: Static Function
- **Purpose**: Gets all configured Gemini API keys from environment variables
- **Input Parameters**: None
- **Output/Return**: `ApiKeyInfo[]` - Array of API key objects with quota info
- **Internal Logic**:
  1. Reads `GEMINI_API_KEY`, `GEMINI_API_KEY_2`, `GEMINI_API_KEY_3` from environment
  2. Filters out undefined/null keys
  3. Maps each key to ApiKeyInfo object with default quota (50)
  4. Marks first key as active
- **Interactions**: Called by `initializeApiKeys()`

**Static Method: `hasBackupApiKey`**
- **Type**: Static Function
- **Purpose**: Checks if a backup API key exists
- **Input Parameters**: None
- **Output/Return**: boolean - True if backup key exists
- **Internal Logic**:
  1. On server, checks environment variables directly
  2. On client, checks localStorage for non-active keys
  3. Returns true if any backup key found
- **Interactions**: Used by Gemini API route to decide if fallback is possible

**Static Method: `getCurrentApiKey`**
- **Type**: Static Function
- **Purpose**: Gets the currently active API key
- **Input Parameters**: None
- **Output/Return**: string | null - Active API key or null
- **Internal Logic**:
  1. On server, returns first available key from environment
  2. On client, reads from localStorage to find active key
  3. Falls back to environment variable if localStorage fails
- **Interactions**: Called by Gemini API route before making API call

**Static Method: `switchToBackupApiKey`**
- **Type**: Static Function
- **Purpose**: Switches from primary to backup API key when quota exhausted
- **Input Parameters**: None
- **Output/Return**: boolean - True if switch was successful
- **Internal Logic**:
  1. Only works on client (not server)
  2. Reads API keys from localStorage
  3. Finds backup key (apiKeyIndex === 1)
  4. Deactivates all keys
  5. Activates backup key
  6. Saves updated keys to localStorage
- **Interactions**: Called by Gemini API route when primary quota is exhausted

**Static Method: `initializeApiKeys`**
- **Type**: Static Function
- **Purpose**: Initializes API keys data in localStorage
- **Input Parameters**: None
- **Output/Return**: void
- **Internal Logic**:
  1. Only works on client
  2. Gets API keys from environment
  3. Saves to localStorage as JSON
- **Interactions**: Called once when app loads (in Gemini API route)

**Static Method: `getQuotaInfo`**
- **Type**: Static Function
- **Purpose**: Gets current quota information for active API key
- **Input Parameters**: None
- **Output/Return**: QuotaInfo | null - Quota info or null if expired/not found
- **Internal Logic**:
  1. Only works on client
  2. Reads from localStorage
  3. Finds active key
  4. Checks if cache is still valid (within 5 minutes)
  5. Returns quota info if valid, null otherwise
- **Interactions**: Used to display quota status in UI

**Static Method: `setQuotaInfo`**
- **Type**: Static Function
- **Purpose**: Updates quota information for active API key
- **Input Parameters**: 
  - `quotaInfo`: QuotaInfo - Updated quota information
- **Output/Return**: void
- **Internal Logic**:
  1. Only works on client
  2. Reads API keys from localStorage
  3. Finds active key index
  4. Updates quota with new info and current timestamp
  5. Saves back to localStorage
- **Interactions**: Called after API calls to update quota

**Static Method: `decreaseQuota`**
- **Type**: Static Function
- **Purpose**: Decreases remaining quota by 1 (called after each API call)
- **Input Parameters**: None
- **Output/Return**: QuotaInfo - Updated quota info
- **Internal Logic**:
  1. Gets current quota info
  2. Decreases remaining by 1 (minimum 0)
  3. Updates quota in localStorage
  4. Returns updated quota
  5. If no quota exists, initializes new quota (49 remaining)
- **Interactions**: Called by Gemini API route after successful API call

**Static Method: `resetQuota`**
- **Type**: Static Function
- **Purpose**: Resets quota to full capacity
- **Input Parameters**: 
  - `total`: number (default 50) - Total quota capacity
- **Output/Return**: QuotaInfo - Reset quota info
- **Internal Logic**:
  1. Creates new quota with full remaining amount
  2. Sets lastUpdated to current time
  3. Saves to localStorage
- **Interactions**: Called when API status changes or quota refreshes

**Static Method: `getApiStatus`**
- **Type**: Static Function
- **Purpose**: Gets cached API status (online/offline/quota-exceeded)
- **Input Parameters**: None
- **Output/Return**: "online" | "offline" | "quota-exceeded"
- **Internal Logic**:
  1. Reads status from localStorage
  2. Checks if cache is still valid (within 5 minutes)
  3. Returns cached status if valid, "offline" otherwise
- **Interactions**: Used by aptitude/coding modules to show API status

**Static Method: `setApiStatus`**
- **Type**: Static Function
- **Purpose**: Updates cached API status
- **Input Parameters**: 
  - `status`: "online" | "offline" | "quota-exceeded"
- **Output/Return**: void
- **Internal Logic**:
  1. Saves status to localStorage
  2. Saves current timestamp
- **Interactions**: Called after checking API availability

**Static Method: `isQuotaLow`**
- **Type**: Static Function
- **Purpose**: Checks if quota is low (less than 100)
- **Input Parameters**: None
- **Output/Return**: boolean
- **Internal Logic**: Gets quota info and checks if remaining <= 100
- **Interactions**: Used for warnings

**Static Method: `isQuotaExhausted`**
- **Type**: Static Function
- **Purpose**: Checks if quota is completely exhausted
- **Input Parameters**: None
- **Output/Return**: boolean
- **Internal Logic**: Gets quota info and checks if remaining <= 0
- **Interactions**: Used by Gemini API route to decide if backup key needed

**Static Method: `shouldWaitForRateLimit`**
- **Type**: Static Function
- **Purpose**: Checks if too little time has passed since last API call (rate limiting)
- **Input Parameters**: None
- **Output/Return**: boolean
- **Internal Logic**:
  1. Only works on client
  2. Reads last call time from localStorage
  3. Calculates time since last call
  4. Returns true if less than 2 seconds have passed
- **Interactions**: Called before making API calls to prevent too many requests

**Static Method: `recordApiCall`**
- **Type**: Static Function
- **Purpose**: Records the current time as last API call time
- **Input Parameters**: None
- **Output/Return**: void
- **Internal Logic**:
  1. Only works on client
  2. Saves current timestamp to localStorage
- **Interactions**: Called before each API call for rate limiting

---

#### 3.3.2 Resume Service (`/lib/resumeService.ts`)

**Function: `saveResumeData`**
- **Type**: Async Function
- **Purpose**: Saves resume data to Supabase database
- **Input Parameters**:
  - `userId`: string - User's unique ID
  - `resumeData`: ResumeData - Complete resume data object
- **Output/Return**: `Promise<any>` - Saved data from database
- **Internal Logic**:
  1. First checks if record exists for this user
  2. Uses `upsert` (insert or update) to save data
  3. If record exists, uses existing ID for update
  4. If new, creates new record
  5. Handles errors (including missing table)
  6. Returns saved data
- **Interactions**:
  - Uses `supabase` client to access database
  - Called from tools page after resume parsing
  - Stores data in `resume_data` table

**Function: `getResumeData`**
- **Type**: Async Function
- **Purpose**: Retrieves resume data for a user from database
- **Input Parameters**:
  - `userId`: string - User's unique ID
- **Output/Return**: `Promise<any>` - Resume data or null if not found
- **Internal Logic**:
  1. Queries `resume_data` table for user's data
  2. Orders by `updated_at` descending (most recent first)
  3. Limits to 1 result
  4. Uses `maybeSingle()` to return null if not found
  5. Handles errors gracefully
- **Interactions**:
  - Uses `supabase` client
  - Called from dashboard to load saved resume data

**Function: `updateResumeScore`**
- **Type**: Async Function
- **Purpose**: Updates only the ATS score in database
- **Input Parameters**:
  - `userId`: string - User's unique ID
  - `score`: number - New ATS score
- **Output/Return**: `Promise<any>` - Updated data
- **Internal Logic**:
  1. Uses `upsert` with `onConflict: 'user_id'` to update existing or create new
  2. Updates only `ats_score` field
  3. Updates `updated_at` timestamp
  4. Returns updated data
- **Interactions**: Can be called independently to update just the score

**Function: `updateSkills`**
- **Type**: Async Function
- **Purpose**: Updates only the skills array in database
- **Input Parameters**:
  - `userId`: string - User's unique ID
  - `skills`: string[] - Array of skill names
- **Output/Return**: `Promise<any>` - Updated data
- **Internal Logic**: Similar to `updateResumeScore` but updates skills array
- **Interactions**: Can be called to update just skills

---

#### 3.3.3 Utils (`/lib/utils.ts`)

**Function: `cn`**
- **Type**: Function
- **Purpose**: Combines CSS class names intelligently
- **Input Parameters**: 
  - `...inputs`: ClassValue[] - Variable number of class values (strings, objects, arrays)
- **Output/Return**: string - Merged class names
- **Internal Logic**:
  1. Uses `clsx` to combine classes conditionally
  2. Uses `tailwind-merge` to resolve Tailwind class conflicts (keeps last one)
  3. Returns final merged string
- **Interactions**: Used throughout all components for conditional styling

---

### 3.4 Code Editor Component (`/components/CodeEditor.tsx`)

**Component: `CodeEditor` (Default Export)**
- **Type**: React Functional Component
- **Purpose**: Provides code editor with Monaco Editor and code execution
- **Input Parameters** (Props):
  - `initialCode`: string (optional) - Starting code
  - `language`: string (optional, default "javascript") - Programming language
  - `onCodeChange`: function (optional) - Callback when code changes
  - `onRun`: function (optional) - Callback when code runs
  - `onLanguageChange`: function (optional) - Callback when language changes
  - `testCases`: array (optional) - Test cases to run
  - `className`: string (optional) - Additional CSS classes
- **Output/Return**: JSX with code editor UI
- **Internal Logic**:
  1. Manages code, language, running state, results
  2. Renders Monaco Editor with syntax highlighting
  3. Provides run button that compiles and executes code
  4. Displays compilation results and test case results
- **Interactions**:
  - Calls `/api/compile` or `/api/compile-fallback` APIs
  - Used by coding module pages
  - Monaco Editor handles code editing

**State Variables**:
- `code`: string - Current code in editor
- `selectedLanguage`: string - Currently selected programming language
- `isRunning`: boolean - Indicates if code is executing
- `result`: CompilationResult | null - Compilation/execution result
- `testResults`: array - Results for each test case
- `editorRef`: ref - Reference to Monaco Editor instance

**Handler: `handleEditorDidMount`**
- **Type**: Function
- **Purpose**: Callback when Monaco Editor is mounted
- **Input Parameters**: 
  - `editor`: any - Monaco Editor instance
- **Output/Return**: None (saves reference)
- **Internal Logic**: Saves editor instance to ref for later access
- **Interactions**: Called by Monaco Editor component

**Handler: `handleCodeChange`**
- **Type**: Function
- **Purpose**: Handles code changes in editor
- **Input Parameters**: 
  - `value`: string | undefined - New code value
- **Output/Return**: None (updates state)
- **Internal Logic**:
  1. Updates `code` state
  2. Calls `onCodeChange` callback if provided
- **Interactions**: Called by Monaco Editor on code changes

**Handler: `handleLanguageChange`**
- **Type**: Function
- **Purpose**: Handles programming language selection change
- **Input Parameters**: 
  - `newLanguage`: string - New language ID
- **Output/Return**: None (updates state)
- **Internal Logic**:
  1. Updates `selectedLanguage` state
  2. Calls `onLanguageChange` callback if provided
- **Interactions**: Called when user selects different language

**Handler: `runCode`**
- **Type**: Async Function
- **Purpose**: Compiles and executes code with test cases
- **Input Parameters**: None (uses state)
- **Output/Return**: `Promise<void>`
- **Internal Logic**:
  1. Validates code is not empty
  2. Sets `isRunning` to true
  3. Clears previous results
  4. For each test case:
     - Tries `/api/compile` first (Judge0)
     - If fails, tries `/api/compile-fallback` (JavaScript only)
     - Collects result and compares with expected output
  5. Updates `testResults` and `result` state
  6. Calls `onRun` callback
  7. Sets `isRunning` to false
  8. Handles errors gracefully
- **Interactions**:
  - Calls compile APIs
  - Updates UI with results
  - Used by coding module

**Handler: `resetEditor`**
- **Type**: Function
- **Purpose**: Resets editor to initial code
- **Input Parameters**: None
- **Output/Return**: None (updates state)
- **Internal Logic**:
  1. Resets code to `initialCode`
  2. Clears results
  3. Calls `onCodeChange` callback
- **Interactions**: Called by reset button

**Function: `getStatusColor`**
- **Type**: Function
- **Purpose**: Returns CSS class name based on compilation status
- **Input Parameters**: 
  - `status`: string - Compilation status (e.g., "Accepted", "Error")
- **Output/Return**: string - CSS class names for styling
- **Internal Logic**: Maps status strings to color classes (green for success, red for errors, etc.)
- **Interactions**: Used to style status badges

---

### 3.5 API Routes Module

#### 3.5.1 Gemini API Route (`/app/api/gemini/route.ts`)

**Function: `POST` (Default Export)**
- **Type**: Async Function (Next.js API Route Handler)
- **Purpose**: Handles Gemini AI API requests for content generation
- **Input Parameters**: 
  - `request`: Request - HTTP request object with JSON body containing:
    - `prompt`: string - Text prompt for AI
    - `audio`: string (optional) - Audio data for transcription
    - `modelId`: string (optional) - Specific model to use
- **Output/Return**: `Response` - JSON response with generated content or error
- **Internal Logic**:
  1. Parses request body
  2. Initializes API keys in QuotaManager
  3. Gets current API key
  4. Checks rate limiting (shouldWaitForRateLimit)
  5. Checks if quota exhausted, switches to backup if needed
  6. Records API call time
  7. Decreases quota
  8. Creates GoogleGenerativeAI instance
  9. Tries multiple models if one fails (fallback logic)
  10. Generates content with prompt
  11. Returns response text or error
- **Interactions**:
  - Uses QuotaManager for quota and rate limiting
  - Calls Google Gemini API
  - Called by aptitude and coding modules for question generation

---

#### 3.5.2 Compile API Route (`/app/api/compile/route.ts`)

**Function: `POST`**
- **Type**: Async Function (Next.js API Route Handler)
- **Purpose**: Compiles and executes code using Judge0 API
- **Input Parameters**: 
  - `request`: NextRequest - Request with JSON body containing:
    - `code`: string - Source code to compile
    - `language`: string - Programming language
    - `input`: string (optional) - Input data
    - `expectedOutput`: string (optional) - Expected output for comparison
- **Output/Return**: NextResponse - JSON with compilation result
- **Internal Logic**:
  1. Parses request body
  2. Validates code and language
  3. Maps language name to Judge0 language ID
  4. Submits code to Judge0 API
  5. Gets submission token
  6. Polls Judge0 API every 1 second for result (max 30 attempts)
  7. Processes result (output, errors, time, memory)
  8. Compares output with expected if provided
  9. Returns formatted result
- **Interactions**:
  - Calls Judge0 API via RapidAPI
  - Used by CodeEditor component
  - Supports 40+ programming languages

**Function: `GET`**
- **Type**: Async Function
- **Purpose**: Gets list of supported languages from Judge0
- **Input Parameters**: None
- **Output/Return**: NextResponse - JSON array of supported languages
- **Internal Logic**: Fetches languages from Judge0 API and returns them
- **Interactions**: Used to get available languages

---

#### 3.5.3 Resume Parser V2 API Route (`/app/api/resume-parser-v2/route.ts`)

**Function: `POST`**
- **Type**: Async Function (Next.js API Route Handler)
- **Purpose**: Parses resume files and extracts structured data
- **Input Parameters**: 
  - `request`: NextRequest - Request with FormData containing:
    - `file`: File - Resume file (PDF, DOC, DOCX, TXT, RTF)
- **Output/Return**: NextResponse - JSON with parsed resume data
- **Internal Logic**:
  1. Extracts file from FormData
  2. Validates file type and size (5MB limit)
  3. Tries APYHub API first (asynchronous job-based)
  4. If APYHub fails, tries APILayer API (direct)
  5. Processes raw data into structured format
  6. Returns parsed resume data
- **Interactions**:
  - Calls APYHub or APILayer APIs
  - Uses helper functions to process data
  - Called by tools page

**Function: `parseWithAPYHub` (Helper)**
- **Type**: Async Function
- **Purpose**: Parses resume using APYHub API
- **Input Parameters**: 
  - `file`: File - Resume file
- **Output/Return**: Promise<any> - Parsed resume data
- **Internal Logic**:
  1. Creates FormData with file
  2. Submits to APYHub API
  3. Gets job_id from response
  4. Polls job status every 1 second (max 30 attempts)
  5. When completed, processes result
  6. Returns processed data
- **Interactions**: Called by POST handler

**Function: `parseWithAPILayer` (Helper)**
- **Type**: Async Function
- **Purpose**: Parses resume using APILayer API (fallback)
- **Input Parameters**: 
  - `file`: File - Resume file
- **Output/Return**: Promise<any> - Parsed resume data
- **Internal Logic**:
  1. Converts file to ArrayBuffer
  2. Sends to APILayer API directly
  3. Processes result immediately
  4. Returns processed data
- **Interactions**: Called by POST handler if APYHub fails

**Function: `processResumeData` (Helper)**
- **Type**: Function
- **Purpose**: Processes raw API response into structured resume data
- **Input Parameters**: 
  - `data`: any - Raw API response
  - `source`: string - API source name
- **Output/Return**: object - Structured resume data
- **Internal Logic**:
  1. Calls `calculateATSScore()` to get score
  2. Calls extraction functions for each data field
  3. Structures data into standard format
  4. Returns complete resume data object
- **Interactions**: Called by parser functions

**Function: `calculateATSScore` (Helper)**
- **Type**: Function
- **Purpose**: Calculates ATS (Applicant Tracking System) score from resume data
- **Input Parameters**: 
  - `data`: any - Raw or structured resume data
- **Output/Return**: number - Score from 0-100
- **Internal Logic**:
  1. Starts with score 0
  2. Adds points for contact info (25 max)
  3. Adds points for summary (15)
  4. Adds points for work experience (30 max)
  5. Adds points for education (15 max)
  6. Adds points for skills (20 max)
  7. Adds points for achievements/certifications (10)
  8. Adds points for ATS keywords (10 max)
  9. Returns score capped at 100
- **Interactions**: Called by `processResumeData`

**Function: `extractSkills` (Helper)**
- **Type**: Function
- **Purpose**: Extracts skills from resume data
- **Input Parameters**: 
  - `data`: any - Resume data
- **Output/Return**: string[] - Array of skill names
- **Internal Logic**:
  1. Checks multiple possible fields (skills, technical_skills, competencies)
  2. Extracts from experience descriptions by keyword matching
  3. Extracts from summary by keyword matching
  4. Removes duplicates
  5. Returns up to 25 skills
- **Interactions**: Called by `processResumeData`

**Function: `extractPersonalInfo` (Helper)**
- **Type**: Function
- **Purpose**: Extracts personal information from resume data
- **Input Parameters**: 
  - `data`: any - Resume data
- **Output/Return**: object - Personal info with name, email, phone, address, etc.
- **Internal Logic**: Checks multiple possible field names and returns first found value
- **Interactions**: Called by `processResumeData`

**Function: `extractExperience` (Helper)**
- **Type**: Function
- **Purpose**: Extracts work experience from resume data
- **Input Parameters**: 
  - `data`: any - Resume data
- **Output/Return**: array - Array of experience objects
- **Internal Logic**: Maps experience array to standardized format
- **Interactions**: Called by `processResumeData`

**Function: `extractEducation` (Helper)**
- **Type**: Function
- **Purpose**: Extracts education history from resume data
- **Input Parameters**: 
  - `data`: any - Resume data
- **Output/Return**: array - Array of education objects
- **Internal Logic**: Maps education array to standardized format
- **Interactions**: Called by `processResumeData`

**Function: `extractStrengths` (Helper)**
- **Type**: Function
- **Purpose**: Identifies resume strengths
- **Input Parameters**: 
  - `data`: any - Resume data
- **Output/Return**: string[] - Array of strength descriptions
- **Internal Logic**: Analyzes data and generates strength statements
- **Interactions**: Called by `processResumeData`

**Function: `extractImprovements` (Helper)**
- **Type**: Function
- **Purpose**: Identifies areas for improvement in resume
- **Input Parameters**: 
  - `data`: any - Resume data
- **Output/Return**: string[] - Array of improvement suggestions
- **Internal Logic**: Checks for missing information and suggests improvements
- **Interactions**: Called by `processResumeData`

**Function: `generateOverallAnalysis` (Helper)**
- **Type**: Function
- **Purpose**: Generates overall analysis text for resume
- **Input Parameters**: 
  - `data`: any - Resume data
- **Output/Return**: string - Analysis text
- **Internal Logic**: Creates analysis based on ATS score and data completeness
- **Interactions**: Called by `processResumeData`

---

**End of Section 3: Module-Wise Function List**

---

## 4. AUTHENTICATION SYSTEM

This section explains the complete authentication system used in SkillZen, including how signup, login, session management, and protected routes work, along with security concepts.

---

### 4.1 What Authentication System is Used

**Primary System: Supabase Auth with JWT Tokens**

SkillZen uses **Supabase Auth**, which is a built-in authentication service provided by Supabase. Under the hood, Supabase Auth uses **JWT (JSON Web Tokens)** for secure authentication.

#### **Key Components:**

1. **Supabase Auth Service**:
   - Manages user accounts, passwords, and sessions
   - Handles email verification (optional)
   - Provides secure password storage using bcrypt hashing
   - Issues and validates JWT tokens

2. **JWT Tokens**:
   - **Access Token**: Short-lived token (typically 1 hour) used for API requests
   - **Refresh Token**: Long-lived token (typically 7-30 days) used to get new access tokens
   - Contains user information (ID, email, metadata) encoded securely
   - Cryptographically signed to prevent tampering

3. **React Context API**:
   - `AuthContext` provides authentication state to all components
   - `useAuth` hook allows components to access auth state
   - Automatically updates when auth state changes

4. **Session Management**:
   - Sessions stored in browser (localStorage/cookies by Supabase)
   - Automatically refreshed when access token expires
   - Listens for auth state changes in real-time

---

### 4.2 How Signup Works (Step-by-Step)

Let's trace what happens when a new user creates an account:

#### **Step 1: User Fills Signup Form**
- **Location**: `/app/signup/page.tsx`
- **User Input**: 
  - Full name
  - Email address
  - Password
  - Confirm password
  - Target role (optional)
  - Location (optional)

#### **Step 2: Form Validation (Client-Side)**
- **Handler**: `handleSignup` function in SignupPage component
- **Validations**:
  1. Checks if passwords match (password === confirmPassword)
  2. Validates email format (HTML5 validation)
  3. Ensures required fields are filled

#### **Step 3: Call Signup Function**
- **Code**: `const { data, error } = await signUp(email, password, userData)`
- **Function**: `signUp` from `AuthContext` (or directly from `/lib/supabase.ts`)
- **User Data Object Created**:
  ```javascript
  {
    full_name: "John Doe",
    role: "web-developer",
    location: "Mumbai"
  }
  ```

#### **Step 4: Supabase Auth Processes Request**
- **Action**: `supabase.auth.signUp()` is called
- **What Happens on Server**:
  1. **Email Uniqueness Check**: Supabase checks if email already exists
  2. **Password Hashing**: Password is hashed using bcrypt (never stored in plain text)
  3. **User Record Creation**: Creates user record in `auth.users` table in Supabase
  4. **Metadata Storage**: Stores user metadata (name, role, location) in `user_metadata` field
  5. **Email Confirmation**: Sends confirmation email (if enabled) or marks as unconfirmed
  6. **Session Creation**: Creates initial session with JWT tokens

#### **Step 5: Response Received**
- **Success Response**:
  ```javascript
  {
    data: {
      user: {
        id: "uuid-123",
        email: "user@example.com",
        email_confirmed_at: null, // or timestamp if auto-confirmed
        user_metadata: {
          full_name: "John Doe",
          role: "web-developer",
          location: "Mumbai"
        }
      },
      session: {
        access_token: "jwt-access-token",
        refresh_token: "jwt-refresh-token",
        expires_at: timestamp
      }
    },
    error: null
  }
  ```

#### **Step 6: Session Storage**
- **Automatic**: Supabase automatically stores session in browser
- **Storage Location**: 
  - Access token: Stored in localStorage by Supabase client
  - Refresh token: Stored in httpOnly cookie (more secure, not accessible to JavaScript)
- **What's Stored**:
  - JWT access token (for API requests)
  - JWT refresh token (for getting new access tokens)
  - Expiration times

#### **Step 7: Auth State Update**
- **Automatic**: Supabase triggers `onAuthStateChange` event
- **Listener**: `AuthContext` has a listener that detects this change
- **Action**: 
  - `setUser(user)` - Updates user state
  - `setSession(session)` - Updates session state
  - `setLoading(false)` - Indicates loading is complete

#### **Step 8: Redirect to Dashboard**
- **Location**: SignupPage component
- **Code**: `router.push("/dashboard")` after successful signup
- **Timing**: Happens automatically when `user` state is updated

#### **Step 9: Dashboard Access**
- **Location**: `/app/dashboard/page.tsx`
- **Check**: Dashboard checks if user exists, if not, redirects to login
- **Result**: User sees personalized dashboard

#### **Complete Flow Diagram:**
```
User fills form → Validation → signUp() → Supabase Auth
    ↓
Password hashed → User created in database → JWT tokens generated
    ↓
Tokens stored in browser → Auth state updated → User redirected
    ↓
Dashboard checks auth → User authenticated → Dashboard displayed
```

---

### 4.3 How Login Works (Step-by-Step)

Let's trace what happens when an existing user logs in:

#### **Step 1: User Fills Login Form**
- **Location**: `/app/login/page.tsx`
- **User Input**: 
  - Email address
  - Password

#### **Step 2: Form Submission**
- **Handler**: `handleLogin` function in LoginPage component
- **Action**: Prevents default form submission, sets loading state

#### **Step 3: Call SignIn Function**
- **Code**: `const { data, error } = await signIn(email, password)`
- **Function**: `signIn` from `AuthContext`
- **Action**: `supabase.auth.signInWithPassword()` is called

#### **Step 4: Supabase Auth Validates Credentials**
- **What Happens on Server**:
  1. **Email Lookup**: Finds user by email in `auth.users` table
  2. **Password Verification**: 
     - Retrieves hashed password from database
     - Hashes provided password using bcrypt
     - Compares hashed passwords (never compares plain text)
  3. **Account Status Check**: Verifies account is active and email confirmed (if required)
  4. **Session Creation**: If credentials are valid, creates new session with JWT tokens

#### **Step 5: Response Received**
- **Success Response**:
  ```javascript
  {
    data: {
      user: {
        id: "uuid-123",
        email: "user@example.com",
        user_metadata: { ... }
      },
      session: {
        access_token: "new-jwt-access-token",
        refresh_token: "new-jwt-refresh-token",
        expires_at: timestamp
      }
    },
    error: null
  }
  ```
- **Error Response** (if invalid):
  ```javascript
  {
    data: null,
    error: {
      message: "Invalid login credentials"
    }
  }
  ```

#### **Step 6: Error Handling**
- **If Error**: 
  - Display error message to user
  - Set `error` state
  - Keep user on login page
- **If "Email not confirmed"**: Show helpful message (for development)

#### **Step 7: Session Storage (Same as Signup)**
- Tokens automatically stored in browser by Supabase
- Access token in localStorage
- Refresh token in httpOnly cookie

#### **Step 8: Auth State Update**
- Supabase triggers `onAuthStateChange` event with "SIGNED_IN" event type
- `AuthContext` listener detects change
- Updates `user` and `session` state automatically

#### **Step 9: Automatic Redirect**
- **Location**: LoginPage component's `useEffect`
- **Code**: 
  ```javascript
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard")
    }
  }, [user, loading, router])
  ```
- **Trigger**: When `user` changes from `null` to user object

#### **Step 10: Dashboard Access**
- Dashboard loads with user's personalized data
- User can access all protected features

#### **Complete Flow Diagram:**
```
User enters credentials → signIn() → Supabase Auth
    ↓
Email found → Password verified (bcrypt hash comparison)
    ↓
If valid: Session created → JWT tokens generated → Tokens stored
    ↓
Auth state updated → User state changes → useEffect triggers
    ↓
Automatic redirect to dashboard → User logged in
```

---

### 4.4 How Tokens/Sessions Are Stored

#### **Storage Mechanism:**

1. **JWT Access Token**:
   - **Location**: Browser's `localStorage`
   - **Key**: Managed by Supabase client (internal key)
   - **Format**: 
     ```json
     {
       "access_token": "eyJhbGc...",
       "token_type": "bearer",
       "expires_at": 1234567890
     }
     ```
   - **Accessible**: Yes (JavaScript can read it, but it's signed and verified)
   - **Lifespan**: Short-lived (typically 1 hour)
   - **Purpose**: Sent with every API request to identify user

2. **JWT Refresh Token**:
   - **Location**: Browser's httpOnly cookie
   - **Accessible**: No (JavaScript cannot read it, more secure)
   - **Lifespan**: Long-lived (typically 7-30 days)
   - **Purpose**: Used to get new access tokens when current one expires

3. **Session Object**:
   - **Storage**: Supabase client maintains session in memory
   - **Content**: Contains user info, tokens, expiration times
   - **Sync**: Synced with `AuthContext` state

#### **How Storage Works:**

**Initial Storage (After Login/Signup)**:
```javascript
// Automatic by Supabase client
localStorage.setItem('sb-<project>-auth-token', JSON.stringify({
  access_token: "...",
  refresh_token: "...",
  expires_at: 1234567890
}))
```

**Retrieval (On App Load)**:
```javascript
// Automatic by Supabase client
const session = await supabase.auth.getSession()
// Reads from localStorage and cookie
// Validates tokens haven't expired
```

**Token Refresh (Automatic)**:
```javascript
// When access token expires
// Supabase automatically uses refresh token
// Gets new access token from Supabase Auth API
// Updates localStorage with new token
```

#### **Security Considerations:**

1. **Access Token in localStorage**:
   - ✅ Convenient for JavaScript access
   - ⚠️ Vulnerable to XSS attacks (but tokens expire quickly)
   - ✅ Signed cryptographically (can't be tampered)

2. **Refresh Token in httpOnly Cookie**:
   - ✅ Protected from JavaScript access (XSS protection)
   - ✅ Only sent over HTTPS in production
   - ✅ More secure for long-lived tokens

3. **Automatic Expiration**:
   - Access tokens expire after 1 hour
   - User must re-authenticate if refresh token expires
   - Reduces risk if token is stolen

---

### 4.5 How Protected Routes Are Implemented

Protected routes ensure only authenticated users can access certain pages. Here's how it's implemented:

#### **Method 1: Client-Side Protection (Primary Method)**

**Implementation Location**: Individual page components (e.g., `/app/dashboard/page.tsx`)

**Code Pattern**:
```javascript
export default function Dashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Protect route: redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Show loading state while checking
  if (loading) {
    return <div>Loading...</div>
  }

  // Only render if authenticated
  if (!user) {
    return null // Prevents flash of content
  }

  // Render protected content
  return <div>Dashboard content...</div>
}
```

**How It Works**:
1. Component loads and calls `useAuth()` hook
2. Gets `user` and `loading` state from `AuthContext`
3. `useEffect` runs after component mounts
4. Checks: if `loading` is false AND `user` is null, redirect to login
5. Shows loading spinner while checking authentication
6. Only renders content if user is authenticated

**Pages Using This Pattern**:
- Dashboard (`/app/dashboard/page.tsx`)
- Tools/Resume (`/app/tools/page.tsx`)
- Edit Profile (`/app/edit-profile/page.tsx`)
- All module pages (aptitude, coding, interview, etc.)

#### **Method 2: AuthContext Automatic Check**

**Implementation**: Built into `AuthContext`

**Code**:
```javascript
useEffect(() => {
  const getInitialSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      // Handle error (e.g., invalid refresh token)
      await supabase.auth.signOut()
    }
    
    setSession(session)
    setUser(session?.user ?? null)
    setLoading(false)
  }

  getInitialSession()
}, [])
```

**How It Works**:
1. On app load, `AuthProvider` mounts
2. Immediately checks for existing session
3. Reads tokens from localStorage/cookies
4. Validates tokens with Supabase
5. Updates `user` and `session` state
6. Sets `loading` to false when done
7. All protected pages can check `user` state

#### **Method 3: Route-Level Protection (Not Currently Used, but Available)**

**Future Implementation** (Middleware):
```javascript
// middleware.ts (Next.js)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protect routes starting with /dashboard
  if (req.nextUrl.pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}
```

---

### 4.6 How the Application Checks If a User is Logged In

The application uses multiple layers to check authentication status:

#### **Layer 1: Initial Session Check (On App Load)**

**Location**: `AuthContext` component (`/contexts/AuthContext.tsx`)

**When**: When app first loads (when `AuthProvider` mounts)

**Code**:
```javascript
useEffect(() => {
  const getInitialSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    setSession(session)
    setUser(session?.user ?? null)
    setLoading(false)
  }
  getInitialSession()
}, [])
```

**What Happens**:
1. Calls `supabase.auth.getSession()`
2. Supabase reads tokens from localStorage/cookies
3. Validates tokens haven't expired
4. If valid, returns session with user data
5. If invalid/expired, returns null
6. Updates `user` and `session` state in context

#### **Layer 2: Real-Time Auth State Listener**

**Location**: `AuthContext` component

**Code**:
```javascript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  async (event, session) => {
    setSession(session)
    setUser(session?.user ?? null)
    setLoading(false)
  }
)
```

**What Happens**:
1. Listens for auth state changes in real-time
2. Triggers on events: `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`, `USER_UPDATED`
3. Automatically updates context state
4. All components using `useAuth()` automatically receive updates

**Events Triggered**:
- **SIGNED_IN**: User logs in
- **SIGNED_OUT**: User logs out
- **TOKEN_REFRESHED**: Access token refreshed automatically
- **USER_UPDATED**: User profile updated

#### **Layer 3: Component-Level Check**

**Location**: Protected pages (e.g., Dashboard)

**Code**:
```javascript
const { user, loading } = useAuth()

useEffect(() => {
  if (!loading && !user) {
    router.push("/login")
  }
}, [user, loading, router])
```

**What Happens**:
1. Component uses `useAuth()` hook to get current auth state
2. `useAuth()` reads from `AuthContext` (which has latest state)
3. Checks if `user` exists
4. If `loading` is false and `user` is null, redirects to login
5. If `user` exists, allows access to protected content

#### **Layer 4: Automatic Token Refresh**

**Location**: Handled automatically by Supabase client

**When**: Before access token expires (proactive refresh)

**What Happens**:
1. Supabase client monitors token expiration
2. Before token expires, automatically calls refresh endpoint
3. Uses refresh token to get new access token
4. Updates localStorage with new token
5. Triggers `TOKEN_REFRESHED` event
6. Updates session in `AuthContext`
7. User stays logged in seamlessly

#### **Check Flow Diagram**:
```
App Loads
    ↓
AuthProvider mounts
    ↓
getInitialSession() → Reads tokens from storage
    ↓
Validates tokens with Supabase
    ↓
Sets user state (or null)
    ↓
onAuthStateChange listener starts
    ↓
Components check user state via useAuth()
    ↓
If user exists: Allow access
If user null: Redirect to login
```

---

### 4.7 Why This Authentication Method Was Chosen

#### **Reasons for Choosing Supabase Auth:**

1. **Easy Integration**:
   - Built-in service, no need to build auth from scratch
   - Simple API: `signUp()`, `signIn()`, `signOut()`
   - Works seamlessly with Supabase database (same project)

2. **Security Built-In**:
   - Password hashing handled automatically (bcrypt)
   - JWT token management included
   - Secure token storage (httpOnly cookies for refresh tokens)
   - Automatic token refresh
   - Email verification support

3. **Cost-Effective**:
   - Free tier available for development
   - No separate auth service needed
   - Included with Supabase subscription

4. **Developer Experience**:
   - TypeScript support
   - React hooks available
   - Real-time auth state updates
   - Comprehensive documentation

5. **Scalability**:
   - Handles thousands of users out of the box
   - No server infrastructure needed
   - Automatic scaling

6. **Features Included**:
   - Email/password auth (used in this project)
   - Social auth (Google, GitHub, etc.) - available but not implemented
   - Magic link login - available but not implemented
   - Password reset - available but not implemented
   - Email verification - optional

7. **Database Integration**:
   - Same database for auth and app data
   - Row Level Security (RLS) can use auth users
   - User ID automatically available for queries

#### **Comparison with Alternatives:**

**vs. Firebase Auth**:
- ✅ Supabase uses PostgreSQL (more familiar SQL)
- ✅ Open source
- ✅ More control over database

**vs. Auth0**:
- ✅ Free tier more generous
- ✅ Simpler setup
- ✅ Better integration with database

**vs. Custom JWT Auth**:
- ✅ No need to manage tokens manually
- ✅ Built-in password hashing
- ✅ Token refresh handled automatically
- ✅ More secure by default

**vs. NextAuth.js**:
- ✅ Works better with Supabase database
- ✅ Simpler for this use case
- ✅ Built-in session management

---

### 4.8 Security Concepts Used

SkillZen implements several security best practices through Supabase Auth:

#### **1. Password Hashing**

**What It Is**: Converting plain text passwords into irreversible hash values

**Algorithm Used**: **bcrypt** (handled by Supabase)

**How It Works**:
```
User enters: "MyPassword123"
    ↓
bcrypt hashes it: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890..."
    ↓
Only hash is stored in database (never plain text)
```

**Why It's Secure**:
- One-way function: Can't reverse hash to get original password
- Salted: Each password has unique salt, prevents rainbow table attacks
- Computationally expensive: Makes brute-force attacks slow

**Implementation**: Automatic by Supabase, developers never see passwords

#### **2. JWT (JSON Web Tokens)**

**What It Is**: Compact, URL-safe tokens containing user information

**Structure**:
```
JWT = Header.Payload.Signature

Header: { "alg": "HS256", "typ": "JWT" }
Payload: { "user_id": "123", "email": "user@example.com", "exp": 1234567890 }
Signature: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

**Why It's Secure**:
- **Signed**: Signature prevents tampering (any change invalidates token)
- **Expires**: Access tokens expire after 1 hour, forcing refresh
- **Stateless**: Server doesn't need to store sessions
- **Contains User Info**: Reduces database queries

**How It's Used**:
1. Created after successful login/signup
2. Stored in browser
3. Sent with every API request in `Authorization` header
4. Server validates signature before processing request

#### **3. Refresh Tokens**

**What It Is**: Long-lived token used to get new access tokens

**Purpose**: 
- Keeps user logged in without re-entering password
- Access tokens expire quickly (1 hour) for security
- Refresh tokens used to get new access tokens automatically

**Storage**: httpOnly cookie (not accessible to JavaScript, more secure)

**Flow**:
```
Access token expires
    ↓
Supabase client detects expiration
    ↓
Sends refresh token to Supabase Auth API
    ↓
Gets new access token
    ↓
Updates localStorage
    ↓
User stays logged in
```

#### **4. Token Expiration**

**Access Token**: 
- Lifetime: ~1 hour
- Purpose: Reduces risk if token is stolen
- Auto-refreshed before expiration

**Refresh Token**:
- Lifetime: 7-30 days (configurable)
- Purpose: Keeps user logged in
- Stored more securely (httpOnly cookie)

#### **5. HTTPS/SSL Encryption**

**In Production**: All communication encrypted
- Tokens transmitted over HTTPS only
- Prevents man-in-the-middle attacks
- Required by Supabase in production

#### **6. Email Verification (Optional)**

**Available Feature**: Supabase can require email confirmation
- Sends verification link to user's email
- User clicks link to confirm
- Account activated only after confirmation
- Prevents fake accounts

**Current Status**: Optional in this project (for development ease)

#### **7. Row Level Security (RLS) - Available**

**What It Is**: Database-level security that restricts data access per user

**How It Works**:
```sql
-- Example: Users can only see their own resume data
CREATE POLICY "Users can view own resume"
ON resume_data
FOR SELECT
USING (auth.uid() = user_id);
```

**Benefits**:
- Security at database level (not just application)
- Prevents unauthorized data access even if application code has bugs
- Can be used with Supabase Auth user IDs

**Current Status**: Not implemented but available for future use

#### **8. Protected Routes**

**Client-Side Checks**: 
- Components check `user` state before rendering
- Redirect to login if not authenticated
- Prevents unauthorized access to pages

**Future Enhancement**: Server-side middleware for additional security

#### **9. Secure Token Storage**

**Access Token**: localStorage
- ✅ Convenient for JavaScript
- ⚠️ Vulnerable to XSS (but expires quickly)

**Refresh Token**: httpOnly cookie
- ✅ Not accessible to JavaScript (XSS protection)
- ✅ Only sent over HTTPS
- ✅ More secure for long-lived tokens

#### **10. Error Handling**

**Secure Error Messages**:
- Doesn't reveal if email exists (prevents user enumeration)
- Generic error messages for invalid credentials
- Prevents information leakage to attackers

**Example**:
```javascript
// Good (current implementation)
error.message = "Invalid login credentials" // Doesn't reveal if email exists

// Bad (would reveal information)
error.message = "Email not found" // Reveals email doesn't exist
```

---

### 4.9 Authentication Flow Summary

**Complete User Journey:**

1. **Signup Flow**:
   ```
   User enters info → Form validation → supabase.auth.signUp()
   → Password hashed → User created → JWT tokens generated
   → Tokens stored → Auth state updated → Redirect to dashboard
   ```

2. **Login Flow**:
   ```
   User enters credentials → supabase.auth.signInWithPassword()
   → Password verified → JWT tokens generated → Tokens stored
   → Auth state updated → Redirect to dashboard
   ```

3. **Session Persistence**:
   ```
   App loads → getInitialSession() → Reads tokens from storage
   → Validates tokens → Updates auth state → User stays logged in
   ```

4. **Protected Route Access**:
   ```
   User navigates to protected page → Component checks user state
   → If authenticated: Show page → If not: Redirect to login
   ```

5. **Token Refresh**:
   ```
   Access token expires → Supabase detects → Uses refresh token
   → Gets new access token → Updates storage → User stays logged in
   ```

6. **Logout Flow**:
   ```
   User clicks logout → supabase.auth.signOut() → Clears tokens
   → Clears session → Auth state updated → Redirect to login
   ```

---

### 4.10 Security Best Practices Implemented

1. ✅ **Password Hashing**: Automatic bcrypt hashing (never plain text)
2. ✅ **JWT Tokens**: Signed and validated tokens
3. ✅ **Token Expiration**: Short-lived access tokens, longer refresh tokens
4. ✅ **Secure Storage**: Refresh tokens in httpOnly cookies
5. ✅ **Automatic Refresh**: Seamless token renewal
6. ✅ **Protected Routes**: Client-side route protection
7. ✅ **Real-time Updates**: Auth state synchronized across app
8. ✅ **Error Handling**: Secure error messages
9. ⚠️ **HTTPS**: Required in production (Vercel provides automatically)
10. ⚠️ **Email Verification**: Optional (can be enabled)

---

**End of Section 4: Authentication System**

---

## 5. OVERALL PROJECT INTERACTIVITY

This section explains how all parts of the SkillZen application work together, how data flows between frontend and backend, how pages navigate, how UI updates reactively, and how errors are handled across the entire system.

---

### 5.1 How All Modules Communicate

SkillZen uses a **hierarchical communication structure** where modules interact through several layers:

#### **Communication Architecture:**

```
Root Layout (app/layout.tsx)
    ↓
Context Providers (AuthProvider, ResumeProvider)
    ↓
Pages (Dashboard, Login, Tools, Modules)
    ↓
Components (UI Components, CodeEditor, etc.)
    ↓
API Routes (/app/api/*)
    ↓
External Services (Supabase, Gemini, Judge0, etc.)
```

#### **1. Context Providers (Global State Sharing)**

**Location**: Wraps entire app in `/app/layout.tsx`

**How It Works**:
- `AuthProvider` and `ResumeProvider` wrap all pages
- Any component can access shared state via hooks
- No need to pass props through multiple component layers

**Example**:
```javascript
// In layout.tsx - Provides state to ALL children
<AuthProvider>
  <ResumeProvider>
    {children} // All pages can access auth and resume data
  </ResumeProvider>
</AuthProvider>

// In any component - Access shared state
const { user } = useAuth() // Gets user from AuthProvider
const { resumeData } = useResume() // Gets resume data from ResumeProvider
```

#### **2. Module-to-Module Communication Patterns**

**Pattern A: Direct Function Calls**
- Modules call functions from other modules directly
- Example: Dashboard calls `getResumeData()` from `resumeService`
- Example: Tools page calls `setResumeData()` from ResumeContext

**Pattern B: Context Sharing**
- Modules share state through React Context
- Example: Login page updates AuthContext → Dashboard automatically gets updated user
- Example: Tools page updates ResumeContext → Dashboard automatically shows new resume data

**Pattern C: API Communication**
- Frontend modules call API routes
- API routes communicate with external services
- Example: Aptitude module → `/api/gemini` → Google Gemini API

**Pattern D: Event-Driven Updates**
- Supabase triggers auth state changes
- Context listeners detect changes
- All components using context automatically update

#### **3. Communication Flow Examples**

**Example 1: User Logs In**
```
Login Page (UI)
    ↓ (calls signIn function)
AuthContext (signIn function)
    ↓ (calls Supabase)
Supabase Auth API
    ↓ (returns session)
AuthContext (updates user state)
    ↓ (triggers onAuthStateChange)
All Components Using useAuth()
    ↓ (receive updated user)
Dashboard, Tools, All Pages
    ↓ (redirect/show content)
UI Updates
```

**Example 2: Resume Upload**
```
Tools Page (user uploads file)
    ↓ (creates FormData)
API Route (/api/resume-parser-v2)
    ↓ (calls APYHub API)
APYHub Service (parses resume)
    ↓ (returns parsed data)
API Route (processes data)
    ↓ (returns to frontend)
Tools Page (receives data)
    ↓ (calls setResumeData)
ResumeContext (updates state)
    ↓ (saves to localStorage)
    ↓ (saves to Supabase via resumeService)
Dashboard (uses useResume hook)
    ↓ (receives updated data)
UI Updates (shows new skills, score)
```

---

### 5.2 Event Flow Between Frontend and Backend

#### **Frontend → Backend Flow (Request Flow)**

**Step 1: User Action**
- User performs action (clicks button, submits form, etc.)
- Component's event handler is triggered

**Step 2: Frontend Processing**
- Component validates input
- Prepares data (formData, JSON, etc.)
- Sets loading state

**Step 3: API Call**
- Component calls `fetch()` or uses function that calls API
- Request sent to Next.js API route (e.g., `/api/resume-parser-v2`)

**Step 4: API Route Processing**
- API route receives request
- Validates input
- Calls external service or processes data
- May interact with Supabase database

**Step 5: External Service (if needed)**
- API route calls external API (Gemini, Judge0, APYHub, etc.)
- Waits for response
- Processes response data

**Step 6: Response Preparation**
- API route formats response
- Returns JSON to frontend
- Includes success/error status

**Step 7: Frontend Receives Response**
- Component receives response
- Updates state with new data
- Updates UI

#### **Complete Request-Response Cycle:**

```
USER ACTION
    ↓
Component Event Handler
    ↓
Validation & Preparation
    ↓
fetch('/api/route', { method: 'POST', body: data })
    ↓
Next.js API Route (route.ts)
    ↓
External API / Database (if needed)
    ↓
API Route Processes Response
    ↓
Returns JSON Response
    ↓
Component Receives Response
    ↓
Updates State
    ↓
UI Re-renders with New Data
```

#### **Real Example: Resume Upload Flow**

```
1. User selects file
   → handleResumeUpload(event) triggered
   
2. Component validates file
   → Checks file type, size
   → Sets isAnalyzing = true
   
3. Creates FormData
   → formData.append('file', file)
   
4. Fetches API
   → fetch('/api/resume-parser-v2', { method: 'POST', body: formData })
   
5. API Route receives request
   → Extracts file from FormData
   → Validates file type and size
   
6. API calls APYHub
   → POST to APYHub API with file
   → Gets job_id
   
7. API polls for result
   → GET request every 1 second
   → Waits for completion
   
8. API processes data
   → Calls processResumeData()
   → Calculates ATS score
   → Extracts all fields
   
9. API returns response
   → JSON with resume data, score, skills, etc.
   
10. Component receives response
    → setResumeAnalysis(data)
    → setResumeData(data) (updates context)
    
11. Context updates
    → ResumeContext saves to localStorage
    → Calls saveResumeData() to Supabase
    
12. Dashboard updates
    → useResume() hook receives new data
    → UI shows updated skills and score
```

#### **Backend → Frontend Flow (Push Updates)**

**Real-time Updates via Supabase**:
```
Supabase Auth Event (user logs in/out)
    ↓
AuthContext listener (onAuthStateChange)
    ↓
Context state updates (setUser, setSession)
    ↓
All components using useAuth() hook
    ↓
Components re-render with new state
    ↓
UI updates automatically
```

---

### 5.3 Navigation Flow Between Pages

SkillZen uses **Next.js App Router** for navigation, which provides file-based routing.

#### **How Routing Works:**

**File-Based Routing**:
- Each folder in `/app` directory becomes a route
- `app/dashboard/page.tsx` → URL: `/dashboard`
- `app/modules/aptitude/page.tsx` → URL: `/modules/aptitude`
- `app/api/compile/route.ts` → URL: `/api/compile` (API endpoint)

#### **Navigation Methods:**

**Method 1: Link Component (Client-Side Navigation)**
```javascript
import Link from 'next/link'

<Link href="/dashboard">Go to Dashboard</Link>
```
- **Type**: Client-side navigation (no full page reload)
- **Benefit**: Fast, smooth transitions
- **Used**: Navigation menus, buttons, links throughout app

**Method 2: useRouter Hook (Programmatic Navigation)**
```javascript
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/dashboard')
```
- **Type**: Programmatic navigation (from code)
- **Benefit**: Can be triggered conditionally (after login, on error, etc.)
- **Used**: Redirects after login, protected routes, error handling

**Method 3: Window Location (Full Page Reload)**
- Not commonly used in this project
- Would cause full page reload (slower)

#### **Complete Navigation Flow: Landing → Login → Dashboard**

**Step 1: User Visits Site**
```
URL: https://skillzen.com/
    ↓
Next.js Router
    ↓
app/page.tsx (Landing Page)
    ↓
Component Renders
```

**Step 2: User Clicks "Login"**
```
Landing Page → Link href="/login"
    ↓
Next.js Router (client-side navigation)
    ↓
app/login/page.tsx
    ↓
LoginPage Component Renders
```

**Step 3: User Logs In**
```
Login Form Submission
    ↓
handleLogin() → signIn()
    ↓
AuthContext Updates (user state changes)
    ↓
useEffect detects user exists
    ↓
router.push("/dashboard")
    ↓
Next.js Router navigates
```

**Step 4: Dashboard Loads**
```
URL: /dashboard
    ↓
app/dashboard/page.tsx
    ↓
Dashboard Component Renders
    ↓
Checks auth (useAuth hook)
    ↓
If not authenticated → redirect to /login
If authenticated → Show dashboard
```

#### **Protected Route Flow:**

```
User tries to access /dashboard
    ↓
Dashboard Component Mounts
    ↓
useAuth() hook called
    ↓
Gets user state from AuthContext
    ↓
useEffect runs:
  if (!loading && !user) {
    router.push("/login")
  }
    ↓
If user exists: Render dashboard
If user null: Redirect to login
```

#### **Module Navigation Flow:**

```
Dashboard
    ↓ (User clicks "Aptitude Practice")
/modules/aptitude
    ↓ (User clicks "Start Test")
Generate Questions → API Call
    ↓ (User clicks "Dashboard")
Dashboard (back)
    ↓ (User clicks "Resume Analysis")
/tools
    ↓ (User uploads resume)
API Call → Context Update
    ↓ (User clicks "Dashboard")
Dashboard (shows updated resume data)
```

#### **Navigation State Management:**

**State Persisted**:
- Authentication state (via AuthContext)
- Resume data (via ResumeContext + localStorage)
- User session (via Supabase, persists across page navigations)

**State Not Persisted**:
- Form inputs (lost on navigation)
- Temporary UI state (modals, dropdowns)
- Page-specific state (test answers, code editor content)

---

### 5.4 How UI Updates When Backend Data Changes

The application uses **reactive state management** where UI automatically updates when data changes.

#### **Update Mechanisms:**

**1. Context-Based Updates (Primary Method)**

**How It Works**:
```javascript
// Step 1: Data changes in one component
setResumeData(newData) // In Tools Page

// Step 2: Context state updates
ResumeContext updates resumeData state

// Step 3: All components using context re-render
const { resumeData } = useResume() // In Dashboard
// Component automatically re-renders with new data

// Step 4: UI updates
// Skills badges update, ATS score updates, etc.
```

**Real Example: Resume Upload Updates Dashboard**

```
User uploads resume in Tools Page
    ↓
handleResumeUpload() processes file
    ↓
API returns parsed data
    ↓
setResumeData(parsedData) called
    ↓
ResumeContext state updates
    ↓
useEffect in ResumeContext saves to localStorage
    ↓
Dashboard component uses useResume() hook
    ↓
React detects context state change
    ↓
Dashboard component re-renders
    ↓
UI shows new skills, updated ATS score
```

**2. State Updates via Hooks**

**How useState Updates UI**:
```javascript
const [count, setCount] = useState(0)

// When setCount is called
setCount(5)

// React detects state change
// Component re-renders
// UI shows new count value
```

**Real Example: Loading State**
```javascript
const [isAnalyzing, setIsAnalyzing] = useState(false)

// Start analysis
setIsAnalyzing(true)
// UI immediately shows "Analyzing..." spinner

// Analysis completes
setIsAnalyzing(false)
// UI immediately hides spinner, shows results
```

**3. Supabase Real-Time Updates**

**Auth State Changes**:
```javascript
// User logs in via Supabase
supabase.auth.signIn()
    ↓
Supabase triggers onAuthStateChange event
    ↓
AuthContext listener receives event
    ↓
setUser(user) called
    ↓
All components using useAuth() re-render
    ↓
Protected pages become accessible
    ↓
UI updates to show authenticated content
```

**4. API Response Updates**

**Pattern**:
```javascript
// Component makes API call
const response = await fetch('/api/route')
const data = await response.json()

// Update state with response
setState(data)

// React re-renders component
// UI shows new data
```

**Real Example: Question Generation**
```javascript
// User clicks "Generate Questions"
const response = await fetch('/api/generate-questions', { ... })
const { questions } = await response.json()

// Update state
setQuestions(questions)

// UI immediately shows new questions
```

#### **Update Propagation Flow:**

```
BACKEND DATA CHANGES
    ↓
API Returns New Data
    ↓
Component Receives Response
    ↓
State Updated (useState or Context)
    ↓
React Detects State Change
    ↓
Component Re-renders
    ↓
Child Components Re-render (if props changed)
    ↓
UI Updates with New Data
```

#### **Optimistic Updates (Not Currently Used, but Available)**

**Concept**: Update UI immediately, then sync with backend
```javascript
// Update UI immediately (optimistic)
setResumeScore(85)

// Then save to backend
await saveResumeScore(85)

// If backend fails, revert UI
if (error) {
  setResumeScore(oldScore)
}
```

---

### 5.5 How State is Managed

SkillZen uses a **multi-layer state management approach**:

#### **State Management Layers:**

**Layer 1: Local Component State (useState)**
- **Purpose**: Component-specific, temporary state
- **Examples**:
  - Form inputs (email, password)
  - UI state (dropdown open/closed, modal visible)
  - Loading states (isLoading, isAnalyzing)
- **Lifespan**: Exists only while component is mounted
- **Scope**: Single component

**Layer 2: Context State (React Context)**
- **Purpose**: Shared state across multiple components
- **Examples**:
  - `AuthContext`: User authentication state
  - `ResumeContext`: Resume data state
- **Lifespan**: Exists while app is running
- **Scope**: All components wrapped by Provider

**Layer 3: Persistent Storage (localStorage)**
- **Purpose**: Data that persists across browser sessions
- **Examples**:
  - Resume data (user-specific)
  - API quota information
  - User preferences
- **Lifespan**: Persists until manually cleared or user clears browser data
- **Scope**: Browser-specific (tied to domain)

**Layer 4: Database State (Supabase)**
- **Purpose**: Permanent, server-side data storage
- **Examples**:
  - User accounts
  - Resume data
  - User profiles
- **Lifespan**: Permanent until deleted
- **Scope**: All devices (cloud storage)

#### **State Flow Hierarchy:**

```
USER ACTION
    ↓
Component State (useState)
    ↓ (if data needs to be shared)
Context State (AuthContext/ResumeContext)
    ↓ (if data needs to persist)
localStorage (browser storage)
    ↓ (if data needs to be permanent)
Supabase Database (cloud storage)
```

#### **State Synchronization:**

**Example: Resume Data Flow**

```
1. User uploads resume
   → Component state: resumeFile

2. API processes file
   → Component state: resumeAnalysis

3. Data saved to Context
   → Context state: resumeData (shared across app)

4. Context saves to localStorage
   → Persistent state: localStorage['resumeAnalysis_user123']

5. Context saves to Supabase
   → Database state: resume_data table

6. On app reload
   → Reads from localStorage (fast)
   → Syncs with Supabase (ensures latest data)
   → Updates Context state
   → Components render with data
```

#### **State Update Triggers:**

**1. User Interactions**
- Button clicks → State updates
- Form submissions → State updates
- Input changes → State updates

**2. API Responses**
- Successful API call → State updates with response
- Failed API call → State updates with error

**3. Auth State Changes**
- Login → User state updates
- Logout → User state clears
- Token refresh → Session state updates

**4. External Events**
- Supabase auth events → Context updates
- Browser storage changes → Can trigger updates

**5. Component Lifecycle**
- Component mount → Load initial state
- Component unmount → Clean up state

---

### 5.6 How Errors and Success States Are Handled

Error and success handling is implemented at multiple levels:

#### **1. Component-Level Error Handling**

**Pattern**:
```javascript
const [error, setError] = useState<string | null>(null)
const [isLoading, setIsLoading] = useState(false)

try {
  setIsLoading(true)
  setError(null) // Clear previous errors
  
  const response = await apiCall()
  
  if (!response.ok) {
    throw new Error('API call failed')
  }
  
  // Success: Update state
  setData(response.data)
  setIsLoading(false)
  
} catch (err) {
  // Error: Set error state
  setError(err.message)
  setIsLoading(false)
}
```

**Real Example: Login Error Handling**
```javascript
// In LoginPage component
const handleLogin = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setError("") // Clear previous error

  try {
    const { data, error } = await signIn(email, password)
    
    if (error) {
      // Handle specific errors
      if (error.message.includes("Email not confirmed")) {
        setError("Email not confirmed. Please contact support.")
      } else {
        setError(error.message)
      }
      setIsLoading(false)
    } else if (data.user) {
      // Success: User will be redirected by useEffect
    }
  } catch (err) {
    // Unexpected error
    setError("An unexpected error occurred")
    setIsLoading(false)
  }
}
```

#### **2. API Route Error Handling**

**Pattern**:
```javascript
export async function POST(request: NextRequest) {
  try {
    // Process request
    const data = await processData()
    
    // Return success
    return NextResponse.json({ success: true, data })
    
  } catch (error) {
    // Handle error
    console.error('API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Operation failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
```

**Real Example: Resume Parser Error Handling**
```javascript
// In /app/api/resume-parser-v2/route.ts
try {
  const file = formData.get('file')
  
  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }
  
  // Try APYHub
  try {
    const result = await parseWithAPYHub(file)
    return NextResponse.json(result)
  } catch (error) {
    console.log('APYHub failed:', error)
  }
  
  // Try APILayer as fallback
  try {
    const result = await parseWithAPILayer(file)
    return NextResponse.json(result)
  } catch (error) {
    console.log('APILayer failed:', error)
  }
  
  // Both failed
  return NextResponse.json({ 
    error: 'Resume parsing failed',
    details: 'Both APIs unavailable'
  }, { status: 503 })
  
} catch (error) {
  return NextResponse.json({ 
    error: 'Internal server error',
    details: error.message 
  }, { status: 500 })
}
```

#### **3. Success State Handling**

**Display Methods**:

**Method 1: Success Messages**
```javascript
const [success, setSuccess] = useState(false)

// On success
setSuccess(true)
setTimeout(() => setSuccess(false), 3000) // Auto-hide after 3 seconds

// In JSX
{success && (
  <div className="bg-green-50 border border-green-200 rounded-md p-3">
    <p className="text-sm text-green-600">Operation successful!</p>
  </div>
)}
```

**Method 2: Toast Notifications**
```javascript
import { toast } from 'sonner'

// On success
toast.success('Resume analyzed successfully!')

// On error
toast.error('Failed to analyze resume')
```

**Method 3: Redirect on Success**
```javascript
// After successful login
if (data.user) {
  router.push('/dashboard') // Redirect to success page
}
```

**Method 4: UI State Updates**
```javascript
// Success: Update UI with new data
setResumeData(analysisData)
// UI automatically updates to show new resume data
```

#### **4. Global Error Handling Patterns**

**Error Types and Handling**:

**Network Errors**:
```javascript
try {
  const response = await fetch('/api/route')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
} catch (error) {
  if (error instanceof TypeError) {
    // Network error (no internet, CORS, etc.)
    setError('Network error. Please check your connection.')
  } else {
    // Other errors
    setError(error.message)
  }
}
```

**Validation Errors**:
```javascript
// Client-side validation
if (password !== confirmPassword) {
  setError('Passwords do not match')
  return
}

// API returns validation error
if (error.code === 'VALIDATION_ERROR') {
  setError(`Validation failed: ${error.details}`)
}
```

**Quota/Rate Limit Errors**:
```javascript
if (response.status === 429) {
  setError('Too many requests. Please wait a moment.')
  // Show retry option
}
```

**Authentication Errors**:
```javascript
if (error.message.includes('Invalid credentials')) {
  setError('Invalid email or password')
} else if (error.message.includes('Email not confirmed')) {
  setError('Please confirm your email first')
} else {
  setError('Authentication failed')
}
```

#### **5. Error Display in UI**

**Error Display Patterns**:

**Pattern 1: Inline Error Messages**
```javascript
{error && (
  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
    <p className="text-sm text-red-600">{error}</p>
  </div>
)}
```

**Pattern 2: Form Field Errors**
```javascript
{errors.email && (
  <p className="text-xs text-red-600 mt-1">{errors.email}</p>
)}
```

**Pattern 3: Error Boundaries (Future Enhancement)**
```javascript
// Could wrap components to catch React errors
<ErrorBoundary>
  <Component />
</ErrorBoundary>
```

#### **6. Loading State Management**

**Loading Indicators**:

**Button Loading State**:
```javascript
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <RotateCcw className="animate-spin" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

**Full Page Loading**:
```javascript
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Spinner />
        <p>Loading...</p>
      </div>
    </div>
  )
}
```

**Skeleton Loading**:
```javascript
{isLoading ? (
  <Skeleton className="h-20 w-full" />
) : (
  <Card>{content}</Card>
)}
```

#### **7. Error Recovery Mechanisms**

**Automatic Retry** (Not implemented, but pattern available):
```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) return response
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
}
```

**Fallback Mechanisms**:
```javascript
// Resume parser: Try APYHub, fallback to APILayer
try {
  return await parseWithAPYHub(file)
} catch {
  return await parseWithAPILayer(file) // Fallback
}

// Gemini API: Try primary key, fallback to backup key
if (QuotaManager.isQuotaExhausted()) {
  QuotaManager.switchToBackupApiKey()
}
```

**Graceful Degradation**:
```javascript
// If API fails, use fallback data
try {
  const questions = await generateQuestions()
  setQuestions(questions)
} catch (error) {
  // Use fallback questions
  setQuestions(fallbackQuestions)
  setApiStatus('offline')
}
```

---

### 5.7 Complete Interaction Flow Example

Let's trace a complete user journey from login to using features:

#### **Complete Flow: Login → Dashboard → Resume Upload → View Results**

**Step 1: User Opens App**
```
Browser loads app
    ↓
app/layout.tsx renders
    ↓
AuthProvider mounts
    ↓
getInitialSession() checks for existing session
    ↓
If session exists: setUser(session.user)
If no session: setUser(null)
    ↓
app/page.tsx (Landing) renders
```

**Step 2: User Navigates to Login**
```
User clicks "Login" button
    ↓
<Link href="/login"> → Client-side navigation
    ↓
app/login/page.tsx renders
    ↓
LoginPage component mounts
    ↓
useAuth() hook gets user state
    ↓
If user exists: useEffect redirects to /dashboard
If user null: Shows login form
```

**Step 3: User Logs In**
```
User enters email/password
    ↓
User clicks "Sign In"
    ↓
handleLogin() triggered
    ↓
setIsLoading(true) → Button shows "Signing in..."
    ↓
signIn(email, password) called
    ↓
AuthContext.signIn() → supabase.auth.signInWithPassword()
    ↓
Supabase validates credentials
    ↓
If valid:
  - Creates session
  - Returns user and session
  - Triggers onAuthStateChange('SIGNED_IN')
    ↓
AuthContext listener receives event
    ↓
setUser(user) → Updates context state
    ↓
LoginPage useEffect detects user change
    ↓
router.push('/dashboard') → Navigate to dashboard
```

**Step 4: Dashboard Loads**
```
URL changes to /dashboard
    ↓
app/dashboard/page.tsx renders
    ↓
Dashboard component mounts
    ↓
useAuth() → Gets user from AuthContext
useResume() → Gets resumeData from ResumeContext
    ↓
useEffect checks authentication:
  if (!loading && !authUser) {
    router.push("/login") // Not needed, user is logged in
  }
    ↓
useEffect loads resume data:
  - loadUserData(user.id) → Loads from localStorage
  - getResumeData(user.id) → Loads from Supabase
  - setResumeData() → Updates context
    ↓
Dashboard renders with:
  - User name from user state
  - Skills from resumeData
  - ATS score from resumeData
```

**Step 5: User Navigates to Tools**
```
User clicks "Resume Analysis" card
    ↓
<Link href="/tools"> → Navigation
    ↓
app/tools/page.tsx renders
    ↓
ToolsPage component mounts
    ↓
useAuth() → Gets user (still logged in)
useResume() → Gets existing resumeData (if any)
    ↓
Shows upload interface
```

**Step 6: User Uploads Resume**
```
User selects file
    ↓
handleResumeUpload() triggered
    ↓
Validates file (type, size)
    ↓
setIsAnalyzing(true) → Shows "Analyzing..." spinner
    ↓
Creates FormData with file
    ↓
fetch('/api/resume-parser-v2', { method: 'POST', body: formData })
    ↓
API Route receives request
    ↓
Calls APYHub API with file
    ↓
Polls for result (every 1 second)
    ↓
When complete, processes data:
  - calculateATSScore()
  - extractSkills()
  - extractPersonalInfo()
  - etc.
    ↓
Returns JSON response to frontend
    ↓
ToolsPage receives response
    ↓
setResumeAnalysis(data) → Updates local state
setResumeData(data) → Updates ResumeContext
    ↓
ResumeContext useEffect triggers:
  - Saves to localStorage
  - Calls saveResumeData() to Supabase
    ↓
setAnalysisSuccess(true) → Shows success message
setIsAnalyzing(false) → Hides spinner
    ↓
UI updates:
  - Shows ATS score
  - Shows skills badges
  - Shows analysis sections
```

**Step 7: User Returns to Dashboard**
```
User clicks "Dashboard" in navigation
    ↓
router.push('/dashboard')
    ↓
Dashboard component re-renders
    ↓
useResume() → Gets updated resumeData from context
    ↓
UI shows:
  - Updated ATS score (from new resume)
  - New skills (from parsed resume)
  - Updated statistics
```

---

### 5.8 State Synchronization Summary

**State Sync Flow:**

```
1. User Action (Frontend)
    ↓
2. API Call (Frontend → Backend)
    ↓
3. External Service / Database (Backend)
    ↓
4. Response (Backend → Frontend)
    ↓
5. Context Update (Shared State)
    ↓
6. LocalStorage Save (Persistence)
    ↓
7. Database Save (Permanent)
    ↓
8. All Components Update (Re-render)
    ↓
9. UI Updates (User sees changes)
```

**Multi-Device Sync:**

```
Device 1: User uploads resume
    ↓
Resume saved to Supabase
    ↓
Device 2: User logs in
    ↓
Dashboard loads
    ↓
getResumeData() fetches from Supabase
    ↓
Resume data synced across devices
```

---

### 5.9 Error Propagation Flow

**How Errors Flow Through System:**

```
1. External API Fails
   → Error thrown in API route
   
2. API Route Catches Error
   → Logs error
   → Returns error response (JSON with error)
   
3. Frontend Receives Error Response
   → response.ok === false
   → Extracts error message
   
4. Component Handles Error
   → setError(errorMessage)
   → setLoading(false)
   
5. UI Shows Error
   → Error message displayed
   → User can retry or fix issue
```

**Error Handling Hierarchy:**

```
Component Level
  ↓ (if not handled)
API Route Level
  ↓ (if not handled)
External Service Level
  ↓ (if not handled)
Global Error Handler (Future: Error Boundary)
```

---

### 5.10 Module Interaction Patterns Summary

**Pattern 1: Parent-Child Communication**
- Parent passes props to child
- Child calls parent callback functions
- Example: Dashboard passes user to child components

**Pattern 2: Context Sharing**
- Provider wraps components
- Components access via hooks
- Example: AuthContext shared across all pages

**Pattern 3: API Communication**
- Component → API Route → External Service
- Async request/response pattern
- Example: Resume upload → API → APYHub → Response

**Pattern 4: Event-Driven Updates**
- External events trigger state changes
- Listeners update context
- Components automatically re-render
- Example: Auth state changes → Context updates → UI updates

**Pattern 5: LocalStorage Persistence**
- Context saves to localStorage on change
- On app load, reads from localStorage
- Example: Resume data persists across sessions

**Pattern 6: Database Persistence**
- Context saves to Supabase
- On app load, syncs with database
- Example: Resume data synced across devices

---

**End of Section 5: Overall Project Interactivity**

---

## Section 6: Data Flow and Database Logic

### 6.1 API Call Flow Overview

**Who Calls Which API:**

1. **Frontend Components** call **Next.js API Routes** (`/app/api/*`)
   - Login/Signup pages → `/api/auth/*` (via Supabase client)
   - Tools page → `/api/resume-parser-v2`
   - Coding module → `/api/generate-questions` and `/api/compile`
   - Aptitude module → `/api/gemini`

2. **Next.js API Routes** call **External Services**
   - `/api/resume-parser-v2` → APYHub API (primary) or APILayer API (fallback)
   - `/api/gemini` → Google Gemini AI API
   - `/api/generate-questions` → Google Gemini AI API
   - `/api/compile` → Judge0 API
   - `/api/languagetool` → LanguageTool API

3. **Frontend Components** call **Supabase Client** directly
   - AuthContext → `supabase.auth.signInWithPassword()`, `supabase.auth.signUp()`
   - ResumeContext → `supabase.from('resume_data').select()`
   - ResumeService → `supabase.from('resume_data').upsert()`

---

### 6.2 Complete Data Flow Pattern

**General Flow: UI → Function → API → Database → API Response → UI**

```
User Action (UI)
    ↓
Component Handler Function
    ↓
API Route or Supabase Client Call
    ↓
External API or Database Query
    ↓
Response/Data Returned
    ↓
State/Context Updated
    ↓
UI Re-renders with New Data
```

**Example 1: Resume Upload Flow**
```
1. User selects file in /tools page
   ↓
2. handleResumeUpload() function triggered
   ↓
3. POST /api/resume-parser-v2 with FormData
   ↓
4. API route calls APYHub API (or APILayer fallback)
   ↓
5. External API returns parsed data
   ↓
6. API route processes and structures data
   ↓
7. Response sent back to component
   ↓
8. setResumeData() updates ResumeContext
   ↓
9. saveResumeData() saves to Supabase database
   ↓
10. UI updates to show parsed resume data
```

**Example 2: Dashboard Data Loading Flow**
```
1. User navigates to /dashboard
   ↓
2. Dashboard component mounts
   ↓
3. useEffect loads data:
   - loadUserData(userId) from localStorage
   - getResumeData(userId) from Supabase
   ↓
4. Supabase query: SELECT * FROM resume_data WHERE user_id = ?
   ↓
5. Database returns user's resume data
   ↓
6. setResumeData() updates ResumeContext
   ↓
7. localStorage also updated for caching
   ↓
8. Dashboard renders with skills and ATS score
```

---

### 6.3 Data Insertion (Supabase)

**How Data is Inserted:**

1. **Via Supabase Client Directly:**
   - `supabase.from('table_name').insert({ data })`
   - Example: Resume data inserted via `resumeService.saveResumeData()`

2. **Via Upsert (Insert or Update):**
   - `supabase.from('table_name').upsert({ data })`
   - Used for resume data: If record exists, updates it; if not, creates new one
   - Uses `user_id` as conflict key

3. **Authentication Data:**
   - User accounts inserted automatically by Supabase Auth
   - Stored in `auth.users` table (managed by Supabase)

**Insert Flow:**
```
Component → ResumeService.saveResumeData()
    ↓
Checks if record exists (SELECT by user_id)
    ↓
If exists: UPDATE
If not: INSERT
    ↓
Supabase processes upsert
    ↓
Database stores data
    ↓
Response returned to component
```

---

### 6.4 Data Updates (Supabase)

**How Data is Updated:**

1. **Full Record Update:**
   - `upsert()` method updates entire record
   - Used for resume data updates

2. **Partial Field Updates:**
   - `updateResumeScore()` → Updates only `ats_score` field
   - `updateSkills()` → Updates only `skills` array
   - Uses `upsert()` with `onConflict: 'user_id'`

3. **Update Flow:**
```
Component → updateResumeScore(userId, score)
    ↓
Supabase upsert with user_id conflict key
    ↓
Database finds existing record by user_id
    ↓
Updates specific fields (ats_score, updated_at)
    ↓
Returns updated record
```

---

### 6.5 Data Deletion (Supabase)

**How Data is Deleted:**

1. **Explicit Deletion:**
   - `supabase.from('table_name').delete().eq('user_id', userId)`
   - Currently not implemented in frontend, but available via database

2. **Cascade Deletion:**
   - When user account is deleted, `resume_data` is automatically deleted
   - Due to `ON DELETE CASCADE` in foreign key constraint

3. **LocalStorage Clearing:**
   - `clearUserData()` removes data from localStorage
   - Called on user logout

---

### 6.6 Queries and Filters

**Query Patterns Used:**

1. **Select by User ID:**
   ```typescript
   supabase
     .from('resume_data')
     .select('*')
     .eq('user_id', userId)
   ```
   - Filters rows where `user_id` matches current user

2. **Ordered Selection:**
   ```typescript
   .order('updated_at', { ascending: false })
   .limit(1)
   ```
   - Gets most recent record first
   - Limits to one result

3. **Single Record Query:**
   ```typescript
   .maybeSingle()
   ```
   - Returns single record or null (doesn't throw error if not found)

4. **Filter Options Available:**
   - `.eq(column, value)` - Equal to
   - `.neq(column, value)` - Not equal to
   - `.gt(column, value)` - Greater than
   - `.lt(column, value)` - Less than
   - `.like(column, pattern)` - Pattern matching
   - `.in(column, array)` - In array
   - `.order(column, options)` - Sorting
   - `.limit(count)` - Limit results

---

### 6.7 Row-Level Security (RLS) Policies

**What is RLS:**
- Database-level security feature in Supabase/PostgreSQL
- Ensures users can only access their own data
- Policies are checked before every query

**Policies Configured:**

1. **Resume Data Table (`resume_data`):**
   - **View Policy:** `auth.uid() = user_id` - Users can only SELECT their own data
   - **Insert Policy:** `auth.uid() = user_id` - Users can only INSERT with their own user_id
   - **Update Policy:** `auth.uid() = user_id` - Users can only UPDATE their own records
   - **Delete Policy:** `auth.uid() = user_id` - Users can only DELETE their own records

2. **Profiles Table (`profiles`):**
   - Similar policies: Users can only view/update/insert their own profile
   - Protected by `auth.uid() = id` checks

**How RLS Works:**
```
1. User makes query: SELECT * FROM resume_data
    ↓
2. Supabase checks: Is user authenticated? (has auth.uid())
    ↓
3. RLS policy applied: WHERE user_id = auth.uid()
    ↓
4. Query automatically filtered to user's data only
    ↓
5. Returns only user's own records
```

**Benefits:**
- **Security:** Users cannot access other users' data even if they modify frontend code
- **Automatic:** No need to add `WHERE user_id = ?` in every query manually
- **Database-Level:** Security enforced at database level, not application level

---

### 6.8 Data Storage Layers

**Three Storage Layers:**

1. **Component State (Temporary):**
   - React `useState` for form inputs, UI state
   - Lost on page refresh
   - Fast access

2. **LocalStorage (Client-Side Persistence):**
   - Browser storage for resume data caching
   - Persists across sessions
   - User-specific keys: `resumeData_${userId}`
   - Used for offline access and fast loading

3. **Supabase Database (Server-Side Persistence):**
   - PostgreSQL database hosted on Supabase
   - Persistent across devices
   - Protected by RLS policies
   - Source of truth for user data

**Storage Priority:**
```
1. Load from localStorage (fast)
2. Load from Supabase (sync across devices)
3. Update both when data changes
4. localStorage for caching, Supabase for persistence
```

---

### 6.9 Database Schema Overview

**Main Tables:**

1. **`auth.users`** (Managed by Supabase):
   - `id` (UUID, Primary Key)
   - `email`
   - `encrypted_password`
   - `created_at`
   - Other auth-related fields

2. **`resume_data`** (User Resume Data):
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, Foreign Key → auth.users)
   - `ats_score` (Integer)
   - `skills` (Text Array)
   - `analysis` (JSONB)
   - `personal_info` (JSONB)
   - `experience` (JSONB Array)
   - `education` (JSONB Array)
   - `summary` (Text)
   - `achievements` (Text Array)
   - `certifications` (Text Array)
   - `languages` (Text Array)
   - `projects` (Text Array)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

3. **`profiles`** (User Profile Information):
   - `id` (UUID, Primary Key, Foreign Key → auth.users)
   - `name` (Text)
   - `role` (Text)
   - `location` (Text)
   - `avatar_url` (Text)
   - `created_at` (Timestamp)
   - `updated_at` (Timestamp)

---

### 6.10 Summary: Complete Data Journey

**From User Action to Database and Back:**

```
User clicks "Upload Resume"
    ↓
File selected → Component state updated
    ↓
API call → /api/resume-parser-v2
    ↓
External API (APYHub) → Parses resume
    ↓
API route → Processes and structures data
    ↓
Response → Component receives data
    ↓
ResumeContext → setResumeData() updates global state
    ↓
localStorage → Saved with user-specific key
    ↓
Supabase → saveResumeData() upserts to database
    ↓
Database → Stores data with RLS protection
    ↓
UI → Re-renders showing parsed resume data
    ↓
User sees skills, ATS score, and analysis
```

**On Next Visit:**
```
User logs in
    ↓
Dashboard loads
    ↓
localStorage → Quick load from cache
    ↓
Supabase → Sync with database (latest data)
    ↓
ResumeContext → Updated with latest data
    ↓
Dashboard → Shows cached or synced data
```

---

**End of Section 6: Data Flow and Database Logic**

