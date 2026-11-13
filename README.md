# Maven Bridge × Knomo Developers

A three-page React + Vite + TypeScript business website with coastal design, original decorative SVGs, supplied business logos, industry solutions and interactive synthetic-data AI walkthroughs. Home contains Services, Solutions and AI Agents as anchored sections. About explains the partnership; Contact handles project inquiries. Privacy, Terms and 404 are utility routes.

## Confirmed business information

- Public business contacts: `bharatsingh2110023@gmail.com`, `vaibhvbhardwj@gmail.com`.
- Inquiry notifications go to `kafakaaaa@gmail.com` through the owner's EmailJS account. This operational inbox is not presented as a public business contact in the UI.
- Maven Bridge handles business strategy, discovery, financial and commercial coordination, management and client relationships.
- Knomo Developers handles engineering, development, AI configuration, integrations and technical delivery.
- AI agents are built on demand against client requirements. A call AI agent demo is available; each client implementation requires discovery, business-specific configuration, integration and testing. The on-page walkthrough remains illustrative, and Virtual AI HR remains a concept example.
- The owner supplied `maven-bridge-logo.png` and `knomo-logo.webp`. Both already have transparent backgrounds. The originals are preserved in `public/images/`; the site displays them without white tiles or borders. Knomo uses a light CSS treatment on dark surfaces for legibility.

## Local development

Use Node 22.12+ or 24 and npm (Node 24 is recommended for the SQLite rate-limit tests).

```sh
npm install
npm run dev
npm run build
npm test
node scripts/verify-build.mjs
node scripts/verify-worker.mjs
```

`npm run dev` starts Vite with a local `/api/contact` adapter. Copy `.env.example` to `.env.local`, enter keys locally and set `SITE_URL` to the printed Vite origin if testing real email. Do not commit `.env.local`. Vite embeds only public `VITE_*` settings; all private provider values remain server-only. The local Vite adapter does not reproduce hosted D1 or Netlify edge rate limiting.

`npm run build` strictly type-checks, compiles the frontend, pre-renders the marketing/legal pages and 404, then builds a Worker for Sites. The Worker embeds the local runtime assets so the hosted backend can serve the complete website and `/api/contact` from one origin. Text assets are gzip-compressed inside the bundle and decoded before responding; the hosting gateway handles HTTP compression. Image/font bytes remain in their original formats. No runtime filesystem or raw SMTP connection is required. `dist/`, `.sites-runtime/` and other generated files are ignored by Git.

## EmailJS: notification plus acknowledgement

The Gmail SMTP transport has been replaced with EmailJS's HTTPS API. No Gmail app password is required by this project.

1. Browser validates and submits the inquiry to the same-origin `/api/contact` endpoint.
2. Server enforces validation, origin checking, a 16 KB body limit, a honeypot and hosted rate limiting.
3. Server triggers notification template `template_t2evd56` using service `service_iim5qoe`, sending all entered details to `kafakaaaa@gmail.com` with the visitor's email as Reply-To.
4. After at least 1.1 seconds, server triggers acknowledgement template `template_1qxf57q` addressed to the visitor.
5. A successful team notification is the acceptance boundary. If acknowledgement delivery fails afterward, the response still confirms the accepted inquiry and the page explains that resubmission is unnecessary. No unverified meeting time or response deadline is promised.

See [emailjs/SETUP.md](emailjs/SETUP.md) for exact dashboard settings, variables and copyable notification/acknowledgement HTML. The dashboard notification recipient must be fixed; the acknowledgement recipient uses `{{to_email}}`. Keep the provider's linked auto-reply feature off on the notification template because the application sends the second template itself. EmailJS requires non-browser API requests to be enabled for this server-side path. Private-key authorization is supported if your account requires it.

The polished email bodies are self-contained HTML with inline CSS, mobile adjustments and table-based layouts. They contain no JavaScript, remote images or web-font dependencies. Subjects and all EmailJS field settings are in `emailjs/template-settings.json`. Paste the matching HTML into the dashboard's HTML/source editor and save the template; committing the file does not update the EmailJS dashboard automatically.

**The private key exposed in chat should be rotated in EmailJS. No screenshot key or replacement secret belongs in this repository.** Store `EMAILJS_PRIVATE_KEY` only in runtime settings if required. Even the public key is supplied through server configuration in this implementation. Template and service IDs are nonsecret and are included in `.env.example`.

Required runtime variables:

| Variable | Purpose |
|---|---|
| `EMAILJS_SERVICE_ID` | `service_iim5qoe` |
| `EMAILJS_NOTIFICATION_TEMPLATE_ID` | `template_t2evd56` |
| `EMAILJS_ACK_TEMPLATE_ID` | `template_1qxf57q` |
| `EMAILJS_PUBLIC_KEY` | Account's public API key, set directly in hosting settings |
| `EMAILJS_PRIVATE_KEY` | Optional server-only key if required by EmailJS account security |
| `CONTACT_TO_EMAIL` | `kafakaaaa@gmail.com` |
| `CONTACT_REPLY_TO_EMAIL` | `bharatsingh2110023@gmail.com` |
| `SITE_URL` | Exact primary website origin, including `www` if applicable |

Public build variables are `VITE_SITE_URL`, `VITE_CONTACT_EMAIL`, `VITE_SECONDARY_CONTACT_EMAIL`, and optional `VITE_CONTACT_PHONE`. Both supplied business emails are defaults; no phone or address is invented. Set `VITE_SITE_URL` before building to generate canonical URLs, social URLs and the sitemap.

## Hosted Sites version

The project identity is preserved in `.openai/hosting.json`. The Site now uses a Worker rather than the original static-only review deployment. Its existing audience is preserved when publishing.

- Entrypoint: `dist/server/index.js`, default-exported Worker `fetch` handler.
- Assets: embedded at build time by `scripts/build-worker.mjs`; no asset storage binding is required.
- Contact rate limiting: logical D1 binding `CONTACT_DB`; migration `drizzle/0000_contact_rate_limits.sql` is applied during publication.
- Rate-limit records contain a window-specific hashed network identifier, count and bucket—not inquiry messages. Hosted calls fail closed if the database is unavailable. The threshold is five accepted-form attempts per 180-second window. Old buckets are removed on subsequent submissions. If the platform supplies no trusted connecting identifier, visitors share a restrictive fallback bucket.
- EmailJS settings are native Sites runtime environment values. Update settings and deploy a saved version to apply them. Never store runtime keys in the hosting manifest.
- The optional Google Sheets adapter is Netlify-only. It is not included in the Worker.

## Netlify deployment from GitHub

Repository: https://github.com/vaibhvbhardwj/MB-KNOMO

The application is at the **repository root**. Import that GitHub repository into Netlify with no `maven-bridge` base subdirectory. Use the included `netlify.toml`:

- Build command: `npm run build:netlify`.
- Publish directory: `dist`.
- Functions directory: `netlify/functions`.
- Node version: 22 (22.12+).

`build:netlify` produces frontend pages without embedding a duplicate Worker in the public assets. Netlify runs `netlify/functions/contact.ts` at its exported `/api/contact` route. The exported function config applies edge rate limiting, five requests per 180 seconds per domain/IP. Unknown static routes use the native custom `404.html` behavior.

Set the EmailJS runtime variables above under Project configuration → Environment variables. If scope controls are available, include Functions for the server values and Builds for public `VITE_*` values; the default all-scopes setting also works. Use Production context and rebuild/redeploy after changes. Do not enter private values in `netlify.toml` or GitHub source files.

For an already linked Netlify project:

```sh
npx netlify-cli login
npx netlify-cli deploy --prod --context production
```

Review the account's actual hosting plan and usage limits before public launch. This source does not promise unlimited free hosting or email. Each inquiry normally uses two EmailJS send requests.

## Optional private Google Sheets CRM (Netlify only)

Email delivery works independently. Create a private spreadsheet tab named `Leads` with these columns:

`created_at, name, email, company, phone, service_interest, budget, message, preferred_callback, timezone, utm_source, utm_medium, utm_campaign, referral_code, referral_source, industry, status`

Enable the Sheets API for an authorized service account; share only the target spreadsheet with that account. Configure `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (PEM; escaped `\n` accepted), and `GOOGLE_SHEET_ID` as server variables. The Netlify adapter appends RAW values with spreadsheet formula protection. A CRM failure does not change a successfully accepted team notification into a false failure. Reconcile missing rows from the notification inbox. The sheet must not be public.

## Editing, privacy and verification

Editable business copy lives in `src/data/*.ts`. Layout and responsive styling are in `src/styles/main.css` and `branding.css`. The coast photograph and font/icon licensing are documented in `THIRD_PARTY_NOTICES.md`. The logos are owner-provided assets.

The hero uses a compact content-driven height rather than filling the viewport. `src/styles/motion.css` adds coastal SVG arches, palm linework and tidal contour backgrounds; staggered section/card reveals; restrained wave/palm movement; and hover/menu details. Server-rendered content stays visible before JavaScript, and offscreen entrances are activated only when the browser supports them. Reduced-motion preferences remove the nonessential motion. No image-generation edit was needed for either logo.

Campaign/referral URL values are submitted only with separate opt-in and are not stored in cookies/local storage. No analytics or advertising provider is installed. No private keys, provider error bodies or inquiry text are logged. A local brief download does not submit an inquiry. Notification acceptance does not guarantee ultimate inbox placement, and the page distinguishes acknowledgement failures.

Automated checks cover input/origin/payload/spam rejection, fixed-recipient delivery, acknowledgement sequencing and failure, provider throttling, CRM failure, attribution consent and persistent SQL rate-limit behavior. Artifact checks cover pre-rendered routes, metadata, Home anchors, logos, public contacts, bundled HTML/assets, gzip, HEAD and 404 handling. Browser automation was unavailable; real-device visual, focus and mobile-overflow checks remain unverified.

Before final public launch, confirm the legal operator and retention policy, review the draft Privacy/Terms text, verify the configured EmailJS template contents and sender authorization, and check real inbox receipt for both emails. No fake customer results, certifications, Florida office address or third-party endorsement is claimed.
