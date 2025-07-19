# AuthService Documentation

## 1. Overview

`AuthService.ts` provides a high-level, client-side authentication service for interacting with an Odoo backend. It encapsulates the logic for user login, registration, session management, and logout, acting as a bridge between the frontend application and the lower-level `OdooClientService`.

Its primary responsibility is to be the **single source of truth for user authentication state** within the application.

## 2. Core Design & Strategy

*   **Facade Pattern**: `AuthService` simplifies the complex process of Odoo authentication by providing a clean API (`login`, `logout`, `isAuthenticated`, `getCurrentUser`).
*   **Dependency Injection**: It relies on an instance of `OdooClientService` passed via its constructor, promoting modularity and testability.
*   **Official Cookie Reliance**: The authentication strategy is built entirely around the official `session_id` cookie set by the Odoo backend. This service **does not** create or manage its own session cookies. The `session_id` is received by the browser via the Next.js API proxy, which correctly forwards the `Set-Cookie` header from Odoo's response.
*   **In-Memory Caching**: The authenticated user's data (`AuthUser`) is cached in a private `currentUser` property for fast, synchronous access during the user's session.
*   **Session Restoration**: On a page load or refresh, if a `session_id` cookie is present, `AuthService` can automatically restore the user's session by fetching their data from Odoo via the `getCurrentUser` method.

## 3. Interfaces

### `AuthUser`

This interface defines the structure of the user object managed by `AuthService`.

| Property    | Type                | Description                                                 |
| :---------- | :------------------ | :---------------------------------------------------------- |
| `id`        | `number`            | The unique identifier for the user from Odoo.               |
| `name`      | `string`            | The user's full name.                                       |
| `email`     | `string`            | The user's email address (login).                           |
| `isAdmin`   | `boolean`           | Indicates if the user has administrative privileges.        |
| `token`     | `string`            | The Odoo `session_id` for the current session.              |
| `partnerId` | `number` (optional) | The ID of the associated `res.partner` record.              |
| `context`   | `object` (optional) | The user's session context from Odoo (lang, tz, etc.).      |

## 4. Class: `AuthService`

### Key Methods

#### `async login(email, password)`

-   **Action**: Authenticates the user against Odoo.
-   **Mechanism**: Calls `odooClientService.login()`. The browser receives the `session_id` cookie from the response.
-   **Result**: Populates the `currentUser` in memory and returns the `AuthUser` object.

#### `async logout()`

-   **Action**: Logs the user out.
-   **Mechanism**: Clears the server session via `odooClientService.clearSession()`, removes the `session_id` cookie from the browser, and clears the user from memory.

#### `isAuthenticated()`

-   **Action**: Synchronously checks if a user is authenticated.
-   **Mechanism**: Checks for the existence of the `session_id` cookie in `document.cookie`.

#### `async getCurrentUser()`

-   **Action**: Asynchronously retrieves the current user's data.
-   **Mechanism**: If the user isn't in memory, it uses the `session_id` cookie to fetch user details from Odoo via `odooClientService.getUser()`.

#### `async register(userData)`

-   **Action**: Registers a new user in Odoo.
-   **Mechanism**: Creates a `res.partner` and a `res.users` record, then calls `login()` to start a session.

## 5. Usage Example

```typescript
import { authService } from '@/services';
import { useState, useEffect } from 'react';

function AuthStatus() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // On page load, try to get the current user.
        // This will restore the session if a valid session_id cookie exists.
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Not authenticated.', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <div>Welcome, {user.name}!</div> : <div>Please log in.</div>;
}
