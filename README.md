# TaskNova

A role-based task management web application built using Angular and Firebase, designed to help teams manage tasks efficiently with separate dashboards for Admin and Employee users.

## 🚀 Live Demo

👉 https://taskdashboard-13.web.app

## 📌 Project Overview

TaskNova is a single-page application that demonstrates role-based access control (RBAC) using Angular and Firebase.
The application now uses **Firebase Email/Password Authentication** along with Firestore-based user profiles. It enables secure login, team-based task management, and controlled access based on user roles.

## 🎯 Key Features

### 🔐 Authentication System

* Firebase Email/Password authentication
* Secure user registration and login
* Firestore user profile linked with Firebase Auth UID
* Persistent login sessions
* Unique username support (validated during registration)


### 👥 Role-Based Access Control (RBAC)

* Default role: **Employee**
* Admin dashboard for team-level task visibility
* Employee dashboard for personal task management
* Role-based UI rendering and access control

### 📝 Task Management

* Create, edit, and delete tasks
* Task ownership enforcement
* Admin can view team tasks (excluding their own)
* Employee sees only assigned tasks
* Task fields include:

  * Title, Description
  * Status (Pending / In Progress / Completed)
  * Priority (Low / Medium / High)
  * Due Date
  * Assigned User
  * Created At / Updated At timestamps


### 🔍 Filtering & Pagination

* Search by task title
* Filter by status and priority
* Separate pagination for:

  * My Tasks
  * Team Tasks (Admin)
* Proper flow: **Filter → Paginate → Render**

### 👥 Team Management

* Users can select or create teams during registration
* Tasks are scoped by `teamId`
* Admins operate within their team context

### 🧭 Navigation & Session Handling

* Session stored in localStorage
* Auto-redirect if already logged in
* Logout clears session and redirects to login

## 🏗️ Tech Stack

* **Frontend:** Angular
* **Backend:** Firebase Firestore
* **Authentication:** Firebase Auth (Email/Password)
* **Hosting:** Firebase Hosting
* **Styling:** Bootstrap + Custom CSS

## 📁 Project Architecture

App
 ├── Components
 │    ├── Login / Register
 │    ├── Task Dashboard
 │
 ├── Services
 │    ├── User Service (Auth + Profile)
 │    ├── Task Service (CRUD)
 │    └── Team Service
 │
 ├── Pipes
 │    └── Task Filter Pipe
 │
 └── Firebase Integration
      ├── Auth (Email/Password)
      ├── Firestore (users, tasks, teams)
      └── Hosting

## 🔄 Application Flow

1. User registers using email & password
2. Firebase Auth creates account and returns UID
3. Firestore user profile is created using UID
4. User logs in using email/password
5. Role and team info fetched from Firestore
6. Tasks are fetched based on:

   * Role (Admin / Employee)
   * Ownership (`assignedTo`)
   * Team (`teamId`)
7. UI updates dynamically based on permissions

## 🔐 Security Model

* Firebase Authentication for secure login
* Firestore stores user metadata (role, team)
* Role-based UI restrictions
* Task ownership enforced in UI logic
* Team-based task isolation

## ⚠️ Design Notes

* Role is **not user-selectable** during registration (defaults to Employee)
* Username is required and must be unique
* Admin role must be assigned manually (via Firestore if needed)
* Pagination and filtering are handled separately for accuracy

## 📈 Future Improvements

* Firestore security rules (server-side enforcement)
* Admin user management panel
* Real-time updates with listeners
* Task assignment to multiple users
* Activity logs / audit trail
* UI/UX enhancements

## 👨‍💻 Author

Developed by: **Pranjali Sahu**

## 🏁 Summary

This project demonstrates a production-ready task management system with:

* Firebase Authentication
* Role-based access control
* Team-based task segregation
* Clean Angular architecture

It reflects real-world patterns for scalable frontend + backend integration using Firebase.
