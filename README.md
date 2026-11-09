# Maven Bridge × Knomo Developers

A responsive three-page React website based on `../Maven_Bridge_Florida_Website_Build_Brief.md`. Home contains Services, industry Solutions and AI Products. About explains the partnership. Contact supports a manually arranged discovery conversation. Privacy, Terms and a 404 are utility pages.

## Local setup

Use Node 22.12+ or 24 and npm.

```sh
npm install
npm run dev
npm run build
npm run preview
npm test
node scripts/verify-build.mjs
```

`npm run dev` serves the site and the contact endpoint locally at the printed Vite URL (normally `http://localhost:5173`). Copy `.env.example` to `.env.local` and configure the server-only email settings if testing real delivery. `SITE_URL` must exactly match the local origin including port. Restart the dev server after changing environment settings. The local endpoint is for development and does not reproduce Netlify's edge rate limiting. `npm run dev:full` uses the official Netlify CLI through npx for host integration testing; install/run it when needed.

The production build runs strict TypeScript checking, Vite compilation and static rendering of all marketing/legal routes plus a 404. Direct routes contain real HTML before JavaScript runs; React mounts the interactive experience. Product demo code is loaded separately. No Three.js is shipped: the coastal image, original SVGs and restrained Motion interactions provide depth without WebGL overhead. Reduced motion removes nonessential motion.

## Primary production host: Netlify

1. Import this `maven-bridge` directory into a Netlify project, or connect its source repository. If your repository includes the parent brief, set the base directory to `maven-bridge`. Keep `netlify.toml` in the selected base directory.
2. Use `npm run build` and publish `dist`. Netlify bundles `netlify/functions/contact.ts` as the only contact backend. Its exported custom route is `/api/contact`, with per-IP/per-domain edge rate limiting (5 requests per 180 seconds). The pre-rendered routes are served directly; unknown routes use `404.html`.
3. Set **server-only Function-scope** environment variables in Netlify: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_APP_PASSWORD`, `CONTACT_TO_EMAIL`, `SITE_URL`. Use the exact final origin for `SITE_URL`, such as `https://your-real-domain.example` (no path). Do not put a password in any `VITE_*` variable, source file, public directory or chat message.
4. With an authorized Gmail account, use `smtp.gmail.com`, port `465`, an eligible Google app password and the authorized sender address. Configure account two-step verification and check app-password eligibility in the account. Only the configured business inbox receives inquiries; the user's email becomes Reply-To. The transport requires TLS. No auto-reply is sent.
5. Set public build variables `VITE_SITE_URL`, `VITE_CONTACT_EMAIL` and optionally `VITE_CONTACT_PHONE` to verified details, then rebuild. `VITE_SITE_URL` generates canonical links, social URLs and the sitemap. Until configured, direct email/phone actions are omitted. The private Sites review build can use its own expected origin; replace it for the Netlify production build.
6. Verify `GET /api/contact` returns `{"configured":true}`, submit an authorized test inquiry, and confirm inbox receipt. Only then share the contact page with prospects. Test spam/rate-limit behavior on Netlify; the edge limit is host-enforced. SMTP acceptance is not proof of ultimate inbox placement.
7. Confirm the legal identity, privacy contact, retention policy and draft legal text before public launch. Configure your final domain in Netlify and rebuild the metadata.

Netlify's Free plan allows commercial projects per its [official Free plan announcement](https://www.netlify.com/blog/introducing-netlify-free-plan/). Current credit-based Free plans include 300 monthly credits; production deploys, requests, bandwidth and compute consume credits. Sites can pause when the included credits are exhausted. Review the account's actual plan before launch; a free tier is not a guarantee of free operation at every traffic level. See [current pricing](https://www.netlify.com/pricing/) and [credit plan documentation](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/). Reviewed November 10, 2026.

Do not deploy this SMTP function as a Cloudflare Worker: raw SMTP sockets and the Node transport are specific to the chosen Netlify serverless path. The companion private ChatGPT Sites deployment is a **static review copy**; it does not run Netlify functions. Its contact page truthfully reports unavailable delivery and allows a local brief download. Configuring SMTP on Sites alone will not enable this Netlify endpoint. There is no competing email backend.

## Optional private Google Sheets CRM

The email path works independently. To enable CRM logging, create a private sheet tab named `Leads` with these 17 columns:

`created_at, name, email, company, phone, service_interest, budget, message, preferred_callback, timezone, utm_source, utm_medium, utm_campaign, referral_code, referral_source, industry, status`

Enable the Sheets API for a service account and share only the target spreadsheet with that account's email. Add Function-scope `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` (PEM, escaped `\n` accepted) and `GOOGLE_SHEET_ID`. Never publish the sheet or put the key in frontend variables. The append uses RAW values with formula-injection protection. SMTP is the primary delivery channel: a CRM outage does not turn an already accepted email into a false failure or invite duplicate submissions. Monitor generic server logs to detect CRM errors; no submitted personal details or credentials are logged. Reconcile missing CRM rows from the business inbox.

## Form and privacy behavior

Shared Zod validation runs on client and server. The server enforces a 16 KB request limit, origin validation, JSON content type, a honeypot, and host edge rate limiting. Email uses plain text with a fixed recipient and fixed service-based subject. Success appears only after SMTP accepts a recipient. Errors preserve the form. A local text download never sends an inquiry. The live SMTP and Sheets integrations have not been tested with owner credentials because none were supplied.

Campaign parameters `utm_source`, `utm_medium`, `utm_campaign`, `ref` travel through internal navigation in the URL. They are submitted only if the visitor separately opts in, and are not stored in cookies/local storage. No analytics provider is installed and no personal data is sent to analytics. Product demos use synthetic data, make no real calls, confirm no appointments and make no hiring decisions.

## Editing and assets

Business copy is in `src/data/content.ts`, `services.ts`, `solutions.ts`, `products.ts`, `contact.ts`, and `legal.ts`. Tokens and responsive styles are in `src/styles/main.css`. Both parties have distinct roles. No fictional client logos, testimonials, results, case studies, US addresses or Adobe endorsement claims are included.

The genuine Miami Beach photograph is licensed and optimized locally; see `THIRD_PARTY_NOTICES.md`. All production photo/font/icon requests use local assets. Rebuild coastal derivatives with `node scripts/prepare-assets.mjs`. Update the selected Boxicons styles with `node scripts/prepare-icons.mjs` if you add icon names. Font and icon license files ship in `/licenses/`.

## Verification and launch inputs

- Strict TypeScript and production build; backend automated tests for invalid input, origin, payload limits, honeypot, disabled delivery, accepted/rejected email, CRM failure and attribution consent.
- Build verifier checks six pre-rendered pages, unique metadata, real image/font/script links and Home anchors.
- Dependency audit fixed to zero known vulnerabilities at build time.
- Automated browser surfaces were unavailable in the authoring session. Visual QA, real-device overflow at 375px/tablet/desktop, keyboard focus and mobile menu behavior still need a browser pass. Responsive layouts, native dialog focus trapping/restoration, keyboard-operated industry tabs and reduced-motion rules are implemented, but do not treat that as measured browser verification. No Lighthouse/Core Web Vitals claims are made.
- Real SMTP delivery, Netlify deployment/rate limiting and optional Sheets writes require owner settings and are unverified. No prospect messages were sent during development.

Before public launch, confirm logos and partnership wording, legal identity, domain, contact details, privacy/retention terms, final imagery approval and actual product readiness. Replace the provisional monogram if approved brand artwork is supplied. Product walkthroughs remain clearly marked concept demos until real integrations exist.
