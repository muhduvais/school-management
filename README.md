# School Management System (NestJS + Next.js)

A full-stack School Management System built with **NestJS (backend)** and **Next.js (frontend)**.  
It supports role-based access (Admin & Teacher), student management, class handling, attendance tracking, and fee management.

---

## Features

### Authentication & Roles
- JWT-based authentication
- Role-based access control (Admin, Teacher)
- Admin creates teacher accounts (no public registration)

---

### Teacher Management
- Admin can create, update, and delete teachers
- Each teacher is linked to a user account
- Teachers can log in and access only their data

---

### Student Management
- CRUD operations for students
- Pagination support
- Fee tracking per student

---

### Class Management
- Create classes and assign:
  - Teacher
  - Students
- Teachers can view only their assigned classes

---

### Attendance System
- Mark attendance per class and date
- Prevent duplicate attendance entries
- Status: Present / Absent

---

### Fee Management
- Assign fees to students
- Track:
  - Total amount
  - Paid amount
  - Pending amount
- Supports partial payments

---

### Dashboard
- Overview of:
  - Students
  - Teachers
  - Classes
- Built with a clean UI using TailwindCSS

---

## Architecture
User (Auth)
↓
Teacher (Profile)
↓
Class → Students → Attendance → Payments


- `users` collection → authentication & roles  
- `teachers` collection → domain data (linked to user)  
- Clear separation of concerns

---

## Tech Stack

### Backend
- NestJS
- MongoDB with Mongoose
- JWT Authentication
- Class Validator
- Role Guards

### Frontend
- Next.js (App Router)
- React Hooks
- Axios
- TailwindCSS

---

## Setup Instructions

### Clone Repository

```bash
git clone <your-repo-url>
cd school-management

```
Backend Setup

```bash
cd backend
npm install
```

Create .env

```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Run backend

```bash
npm run start:dev
```

Frontend Setup

```bash
cd frontend
npm install
```

Create .env.local

```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Run Frontend

```bash
npm run dev
```

### Key Design Decisions
- Separate User and Teacher collections
- Role-based UI and backend guards
- Prevent duplicate attendance entries
- Maintain data integrity across:
- User → Teacher → Class

## Author

Muhammad Uvais
MERN Stack Developer