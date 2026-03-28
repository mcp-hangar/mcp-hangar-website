# Teams & Roles

Manage who has access to your Hangar Cloud organization.

## Seats

Each plan includes a number of seats:

| Plan | Seats Included | Additional Seats |
|------|---------------|-----------------|
| Pro | 5 | $15/seat/month |
| Enterprise | Unlimited | Included |

## Roles

| Role | Permissions |
|------|------------|
| **Owner** | Full access, billing, team management, delete organization |
| **Admin** | Manage agents, policies, team members (except billing) |
| **Member** | View dashboard, audit trail, metrics. Cannot modify policies |
| **Viewer** | Read-only access to dashboard and audit trail |

## Inviting Members

1. Navigate to **Settings → Team**
2. Click **Invite Member**
3. Enter email address and select role
4. Invitee receives email with signup/login link

Pending invitations expire after 7 days.

## SSO / SAML

> Available on Enterprise plans.

Configure SAML 2.0 or OIDC identity provider for single sign-on:

1. Navigate to **Settings → Authentication → SSO**
2. Enter your IdP metadata URL or upload XML
3. Map IdP groups to Hangar Cloud roles
4. Enable "Require SSO" to enforce for all members

Supported identity providers:

- Okta
- Azure AD / Entra ID
- Google Workspace
- OneLogin
- Any SAML 2.0 / OIDC compliant provider

