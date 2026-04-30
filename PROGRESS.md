## Phase 1 — Setup

- Initialized NestJS project
- Configured env + MongoDB (Mongoose)
- Structured folders (config, modules, common)
- Setup Git + pushed to GitHub

## Phase 2 — Database Design

- Created User schema (auth + roles)
- Created Student schema (linked to Class)
- Created Teacher schema
- Created Class schema (linked to Teacher & Students)
- Created Attendance schema (student + class + date + status)

## Phase 3 — Authentication

- Implemented user registration with password hashing
- Implemented login with JWT token generation
- Configured JWT strategy for authentication
- Added Auth Guard to protect routes
- Implemented Role Guard for role-based access

## Phase 4 — Core Modules

- Implemented Student CRUD (with pagination & validation)
- Implemented Teacher CRUD
- Implemented Class module with teacher & student relationships
- Implemented Attendance module (mark & query by date)