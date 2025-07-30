# Security Policy

**Last Updated:** July 30, 2025

---

## Overview

Hack SV is committed to protecting the security of our participants, organizers, and platform. We follow modern security practices to protect your data, accounts, and experience across all our services.  
This policy describes the steps we take to safeguard our systems, what happens in the case of a security issue, and how you can report one to us.

---

## Platform Security

-   All hack.sv websites and services use **HTTPS with HSTS** and modern TLS configurations.
-   **Session tokens** are short-lived and invalidated on logout or verification reset.
-   **CSRF protection** is enforced on all forms and actions requiring authentication.
-   We implement **rate limiting** and IP throttling across login, registration, and key APIs.
-   **Content Security Policy (CSP)** headers are in use where supported.

---

## Authentication & Access Control

-   We offer two login methods:
    -   **Google OAuth** (name and email only)
    -   **Email verification codes** (no password stored)
-   We do **not store passwords**.
-   All internal tools use **role-based access control**.
-   **Audit logs** are kept for sensitive admin actions.

---

## Infrastructure & Hosting

-   Our backend and frontend services are hosted using **secure third-party infrastructure providers**.
-   **Environment secrets** (API keys, credentials) are encrypted and not hard-coded.
-   Basic **uptime and error monitoring** is in place to detect outages or unusual activity.
-   Critical systems are **backed up regularly** with access limited to core organizers.

---

## Third-Party Services

We use a small number of trusted third-party tools (e.g., Google, Discord, Amazon SES). These services only receive the minimum data needed to function.  
See our [Privacy Policy](https://hack.sv/privacy#third-party-services) for full details.

---

## Vulnerability Reporting

If you believe you’ve discovered a vulnerability or security issue with hack.sv, please report it privately:

-   **Email:** <security@hack.sv>
-   Please include as much detail as possible (URLs, reproduction steps, relevant metadata).
-   We will respond within **3 business days** (usually sooner).
-   Please **do not publicly disclose** vulnerabilities until we have confirmed and fixed them.

---

## Internal Practices

-   Admin access is limited to verified hack.sv team members.
-   All admin access is reviewed and revoked when staff leave.
-   Team members follow basic operational security hygiene.
-   Permissions are handed out on a need-to-know basis.

---

## Incident Response

In the event of a confirmed data breach or major incident:

-   We will initiate a thorough investigation and take immediate corrective actions.
-   Affected users will be notified within **3 business days** via email.
-   A public incident summary may be published upon resolution, depending on the scope and impact.
-   We may offer a reward based on the severity and nature of the issue, at our discretion.

---

## Contact

If you have questions about security at Hack SV:

-   **Email:** <security@hack.sv>
-   **Subject:** _Security Inquiry_

---
