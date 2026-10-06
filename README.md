# Big Horn Contracting website

A bilingual, multi-page lead-generation site for an Albuquerque-area contractor. The frontend is React, Vite, TypeScript, Tailwind CSS v4, Framer Motion, React Router, and shadcn-style Radix UI primitives. The optional desktop hero scene uses lazy-loaded React Three Fiber. Estimate requests use a Vercel Function, Supabase, and Resend.

## Run locally

1. Use Node 22 (see `.nvmrc`) and install dependencies with `npm install`.
2. Start the frontend with `npm run dev`. The pages work without credentials, but `/api/estimate` requires Vercel's local function runtime.
3. For end-to-end form testing, copy `.env.example` to `.env.local`, fill in real secrets, run `supabase/schema.sql` in your Supabase SQL editor, and run `vercel dev` after linking a Vercel project.
4. Build with `npm run build`. Vercel can deploy this repository with the Vite preset and `dist` output.

The root `vite.config.js` intentionally takes precedence over the original starter `vite.config.ts`. It preserves route-level code splitting; the starter's single-file plugin would otherwise bundle the lazy 3D scene and every page into the initial HTML.

The same config generates responsive WebP versions of local placeholder photos and AVIF/WebP hero sizes with Sharp. The original JPGs remain as fallbacks. Generated formats are created during development/build and copied to `dist/images` for deployment.

## Estimate workflow

- The form posts to `api/estimate.ts` on the same origin. It validates fields and image type/size, checks a honeypot and submission timing, and calls an atomic Supabase rate-limit function (three requests per hashed IP per hour).
- The service-role key is server-only. Requests are saved in an RLS-protected table. Optional photos go into a private Supabase Storage bucket. The owner receives a Resend email. `notification_status` records `sent` or `failed` for follow-up.
- Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RATE_LIMIT_SALT`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `OWNER_EMAIL` in Vercel for Production, Preview, and Development as appropriate. Verify the sending domain in Resend. Never expose the service-role key through a `VITE_` variable.
- Without those variables, the endpoint returns 503 and the form honestly asks visitors to call or text instead. A successful database save still returns success if Resend has a temporary delivery error; monitor rows with `notification_status = 'failed'`.
- Keep the owner response-time promise accurate. The success message promises a call within one business day.

## SEO and analytics

Routes update title, description, canonical, Open Graph metadata, and JSON-LD. LocalBusiness, Service, and FAQ schemas are active. Review schema is ready but deliberately excludes the sample testimonials until verified customer reviews are supplied. Replace `YOUR-DOMAIN.example` in `.env.example`, `public/sitemap.xml`, and `public/robots.txt` before launch. For stronger indexing beyond client-rendered metadata, add prerendering or SSR later.

The empty journal scaffold and 404 page are marked `noindex`. Add real articles before indexing the journal.

Analytics scripts are optional and only load after consent. Add `VITE_GA4_ID` and/or `VITE_META_PIXEL_ID` to enable them. Call clicks, text clicks, shares, and successful form submissions have event hooks.

## Owner replacement checklist

All visual project examples and the portrait are illustrative, not documented Big Horn work. Replace them before publishing:

- Phone number `(505) 555-0148`, email `hello@bighorncontracting.example`, WhatsApp number, street address, business hours, and final domain.
- Owner name/story and generated portrait in `public/images/owner-placeholder.jpg`; confirm the one-business-day response promise.
- Generated hero, concrete, block, stucco, kitchen, and before-remodel photos in `public/images/`; stock Pexels images and all project captions in `src/data/site.ts`. Add permissioned before/after pairs and real project locations. Project records have `placeholder: true` for easy CMS migration.
- Sample testimonials, ratings, and reviewer attribution in `src/data/site.ts`. Do not enable review schema until approved real reviews are added.
- New Mexico license number, current insurance documentation, exact workmanship warranty terms, and any required legal disclosures. The current badges are explicitly marked unverified.
- The surrounding-area list (Rio Rancho, Bernalillo, Los Lunas, Belen, Corrales, Placitas, Edgewood, Moriarty), plus service availability in each community.
- Facebook, Instagram, and Google Business profile URLs. The generic Google Maps search link is only a placeholder.
- Privacy-policy retention period, confirmed payment/permit wording, real sender email and owner inbox, optional GA4/Meta IDs, and final Open Graph image if a branded share image is available.
- Review the custom SVG horn logo and brand copy with the owner before production.

The logo mark is in `src/components/Brand.tsx` and `public/logo-mark.svg`; its short, reduced-motion-aware screen loader is in the same component. Page images have descriptive alt text, while decorative shapes are hidden from assistive technology.