## TaskNova

A role-based task management web application built using Angular and Firebase, designed to help teams manage tasks efficiently with separate dashboards for Admin and Employee users.

## Live Demo

 https://taskdashboard-13.web.app

## 📌Project Overview

TaskNova is a single-page application that demonstrates Role-Based Access Control (RBAC) using Angular and Firebase. The application uses Firebase Email/Password Authentication along with Firestore-based user profiles to provide secure authentication, team-based task management, and controlled access based on user roles.

The project is designed to simulate real-world task management workflows where admins can manage team tasks while employees can track and update their own assigned work.

## ✨Features

# 🔐Authentication & User Management

* Firebase Email/Password Authentication
* Secure user registration and login
* Persistent login sessions
* Unique username validation
* Firestore user profiles linked with Firebase Auth UID


# 👥Role-Based Access Control (RBAC)

Default role: **Employee**
* Employee dashboard for viewing personal tasks assigned by both admin and self-assigned
* Search task by name and filter by Status and priority
* Update all task details and delete any particular task assigned
* create new task for self

Assigned role: **Admin**
* Admin dashboard for team-level task visibility and self task visibility
* Create, edit and reassign tasks
* Filter tasks by employee, status and priority
* Create new task for team and self.

# 📝Task Management

* Create, edit, and delete tasks, Popup-based task editing
* Task reassignment support
* Automatic createdAt and updatedAt tracking
* Task Fields

Title
Description
Status
Priority
Due Date
Overdue
Assigned User
Assigned By
Created At / Updated At


# 🎨UI & UX Enhancements
Responsive design for desktop and mobile devices
Compact task cards with expandable details
Cleaner dashboard layout
Improved mobile login experience
Bootstrap + custom modern styling

## 🏗️Tech Stack

* **Frontend:** Angular
* **Backend:** Firebase Firestore
* **Authentication:** Firebase Auth (Email/Password)
* **Hosting:** Firebase Hosting
* **Styling:** Bootstrap + Custom CSS

## 📁Project Architecture

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

1. User registers using name, username, email, password and Team(old teams population in dropdown and new team created if not existing)
2. Firebase Auth creates account and returns UID
3. Firestore user profile is created using UID
4. User logs in using email/password
5. Role and team info fetched from Firestore
6. Tasks are fetched based on:

   * Role (Admin / Employee)
   * Ownership (`assignedTo`)
   * Team (`teamId`)
7. By default the role assigned at the time of registration is Employee, which can be changed later from firebase to admin
8. UI updates dynamically based on permissions

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

## 📈 Future Improvements

* Firestore security rules (server-side enforcement)
* Activity logs / audit trail
* UI/UX enhancements
* Notifications and reminders
* Dark mode support

## 👨‍💻 Author

Developed by: **Pranjali Sahu**

## 🏁 Summary

This project demonstrates a production-ready task management system with:

* Firebase Authentication
* Role-based access control
* Team-based task segregation
* Clean Angular architecture

It reflects real-world patterns for scalable frontend + backend integration using Firebase.
