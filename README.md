# Reactive Task Dashboard

A role-based task management web application built using Angular and Firebase, designed to help teams manage tasks efficiently with separate dashboards for Admin and Employee users.

---

## 🚀 Live Demo

[https://eloquent-chaja-a1eff7.netlify.app/login](https://eloquent-chaja-a1eff7.netlify.app/login)

---

## 📌 Project Overview

Reactive Task Dashboard is a single-page application that demonstrates role-based access control (RBAC) using Angular and Firebase. It allows users to register and log in using a unique username and assigned role, and provides different permissions for Admin and Employee users.

The system focuses on task management within teams, where users can create, update, and delete tasks based on their assigned role and ownership.

---

## 🎯 Key Features

### 🔐 Authentication System

* Username-based registration and login
* Role selection during registration (Admin / Employee)
* User profile stored in Firebase Firestore
* Session-based access control

### 👥 Role-Based Access Control (RBAC)

* Admin dashboard for team-level task management
* Employee dashboard for personal task management
* Route protection using Angular Guards
* Access restriction based on assigned role

### 📝 Task Management

* Create new tasks
* Edit existing tasks
* Delete tasks
* Task ownership enforcement (users can manage only their own tasks)
* Admin can manage tasks within their assigned team scope

### 🧭 Navigation & Guards

* Auth guards for protected routes
* Role-based route access control
* Prevent unauthorized dashboard access

### 🧱 Application Structure

* Modular Angular architecture
* Separation of concerns using Services
* Pipes for UI data transformation
* Clean component-based UI design

---

## 🏗️ Tech Stack

* Frontend: Angular
* Backend: Firebase (Firestore)
* Authentication: Custom username-based system (Firestore-backed)
* Hosting: Netlify
* Styling: CSS / Bootstrap

---

## 📁 Project Architecture

```
App
 ├── Components
 │    ├── Login / Register
 │    ├── Admin Dashboard
 │    ├── Employee Dashboard
 │    └── Task Components
 │
 ├── Services
 │    └── Task Service (CRUD operations)
 │
 ├── Guards
 │    ├── Auth Guard
 │    └── Role Guard
 │
 ├── Pipes
 │    └── Data transformation utilities
 │
 └── Firebase Integration
      ├── Firestore (tasks + users + teams)
      └── Custom authentication logic
```

---

## 🔄 Application Flow

1. User registers with username and selects role
2. User data is stored in Firestore
3. User logs in using username
4. Role is validated and stored in session
5. Route guards control dashboard access
6. Users interact with task system based on permissions

---

## 🔐 Security Model

* Route-level protection using Angular Guards
* Role-based access enforced at UI and routing level
* Task ownership validation before edit/delete operations
* Firebase Firestore used as backend data store

---

## ⚠️ Design Notes

* Authentication is implemented using a custom username-based system (not email/password authentication)
* Role assignment is performed at registration and used for access control
* Firebase Firestore is used for persistent storage of users and tasks

---

## 📈 Future Improvements

* Firebase Email/Password authentication integration
* Enhanced Firestore security rules
* Audit logs for task updates
* Real-time collaboration features
* Advanced filtering and search
* Pagination for large task sets

---

## 👨‍💻 Author

Developed by: Pranjali Sahu

---

## 🏁 Summary

This project demonstrates a role-based task management system built with Angular and Firebase, focusing on modular architecture, route protection, and task-level permissions in a multi-user