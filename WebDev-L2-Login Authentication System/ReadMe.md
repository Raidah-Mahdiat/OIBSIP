# Northstar Authentication Demo

A client-side authentication demo using HTML, CSS, JavaScript, `localStorage`, and `sessionStorage`.

## Run locally

Serve the folder from a local web server so the Web Crypto API works consistently:

```powershell
python -m http.server 8000
```

Open <http://localhost:8000> in a browser.

## Included behavior

- Registration with username, email, and password validation.
- Duplicate username/email prevention.
- SHA-256 password hashing with a per-user random salt before storage.
- Generic login failure messaging that does not identify the invalid field.
- Protected `dashboard.html` guarded by a browser session.
- Logout clears the active session and redirects back to login.

This is intentionally a front-end demonstration. A production authentication system should hash passwords on a server with a slow password hashing algorithm such as bcrypt or Argon2, and should use secure, `HttpOnly`, `SameSite` cookies for sessions.

## Reference

The session flow is modeled conceptually after MDN's [Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies) guide, especially its explanation of sign-in status, session identifiers, and why modern storage APIs are appropriate for client-side storage demos.
