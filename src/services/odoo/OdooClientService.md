# `OdooClientService` Documentation

**File Path:** `src/services/odoo/OdooClientService.ts`

## 1. Overview

The `OdooClientService` is a stateless, low-level client responsible for all direct communication with the Odoo backend. It provides a core set of methods for authentication, data fetching, and record creation. Built on `axios`, it serves as the foundational layer for higher-level services like `AuthService`. The service now includes detailed diagnostic logging for all core data-fetching methods (`searchRead`, `callOdooMethod`) to improve debugging and traceability of API calls.

## 2. Core Design

- **Stateless:** The service does not hold any user or session state. Each method call is an independent, atomic operation. State management is delegated to higher-level services.
- **Axios-Powered:** Utilizes an `axios` instance for all HTTP requests, configured to communicate with the Odoo server, typically through a proxy.
- **Cookie-Based Authentication:** Relies on the browser to automatically manage the `session_id` cookie provided by Odoo upon successful login.

## 3. Key Data Models

The service interacts with the following core Odoo models:

- **`res.users`**: For user authentication and data retrieval.
- **`res.partner`**: For managing contacts. **Dogs are stored as child contacts** of an owner (`res.partner`).
- **`project.task`**: For managing **Training Plans**. Each plan is a task linked to one or more users via the `user_ids` field.
- **`calendar.event`**: For managing **Appointments** and calendar entries.

## 4. Public API Reference

### Authentication

- **`async login(db, login, password)`**: Authenticates a user and returns their session info. The browser handles the session cookie.
- **`async getSessionInfo()`**: Retrieves session details for the current user, useful for validating an existing session.
- **`async clearSession()`**: Destroys the session on the Odoo server.

### User and Dog Management

- **`async getCurrentUser()`**: Gets the full user object for the currently authenticated user by validating the session.
- **`async getUser(uid)`**: Fetches details for a specific user by their ID, including `partner_id`, `is_admin`, and `groups_id`.
- **`async getUserDogs(partnerId)`**: Fetches all dog profiles (child `res.partner` records) associated with an owner's partner ID.
- **`async createDogProfile(partnerId, dogData)`**: Creates a new dog profile as a child contact under the specified owner's partner ID.

### Training Plans & Tasks

- **`async getTrainingPlans(userId)`**: Retrieves all training plans (`project.task` records) for a specific user by querying on the `user_ids` field.
- **`async createTrainingPlan(data)`**: Creates a new training plan (`project.task`), which should include a `dog_id` to link it to the correct dog.
- **`async getUserTasks(partnerId)`**: A legacy method that fetches tasks (`project.task`) assigned to a user's partner ID. Prefer `getTrainingPlans` for fetching user-specific plans.

### Calendar & Appointments

- **`async getUserCalendar(partnerId)`**: Fetches all calendar events (`calendar.event`) for a user's partner ID.

### Low-Level Utilities

- **`async searchRead(model, domain, fields, ...)`**: A generic helper for performing `search_read` operations on any model. Includes detailed logging for diagnostics.
- **`async callOdooMethod(model, method, args, kwargs)`**: The core method for making any JSON-RPC call to an Odoo model. Includes detailed logging for diagnostics.

## 5. Error Handling

A private `handleError` method centralizes error processing. It normalizes `axios` and Odoo RPC errors into standard JavaScript `Error` objects, ensuring consistent error handling across the application.