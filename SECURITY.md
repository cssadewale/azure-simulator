# Security Policy

## Supported Versions

This is an educational, client-side only static web application. There is no backend, no database, and no user authentication. All data is simulated and stored in-memory only (no persistence between sessions).

| Version | Supported |
|---|---|
| Latest (main branch) | ✅ Yes |

## Security Design

This project is intentionally minimal in attack surface:

- **No backend server** — 100% static HTML/CSS/JavaScript
- **No user data collection** — nothing is stored, transmitted, or logged
- **No API keys** — no external API calls are made
- **No cookies** — no tracking or session management
- **No localStorage** — data resets on every page refresh
- **No external dependencies** — only Google Fonts is loaded from an external CDN

## Reporting a Vulnerability

If you discover a security vulnerability (e.g., XSS in the simulated terminal or modal injection), please:

1. **Do NOT open a public GitHub Issue**
2. Email **adewale@cssadewale.dev** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if you have one)

You will receive a response within 48 hours. If confirmed, a fix will be deployed within 7 days and you will be credited in the release notes (unless you prefer to remain anonymous).

## Security Best Practices for Contributors

When contributing code:

- Never commit real API keys, passwords, or secrets — use placeholder values only
- Never add external script tags from untrusted CDNs
- Sanitise any user input before inserting it into the DOM (use `textContent` not `innerHTML` for user-provided values)
- Never use `eval()` or `new Function()` with user-provided strings

## Contact

**Adewale Adeagbo** — adewale@cssadewale.dev — [@cssadewale](https://github.com/cssadewale)
