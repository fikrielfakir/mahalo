# Mahalo — SEO Audit Prompt Pack
> Paste any of these prompts directly to an AI agent (Claude, GPT-4, Gemini).  
> Every prompt is pre-loaded with your actual stack: **React 18 + Vite 5 + react-router-dom v6 + Laravel 11 + Tailwind CSS 3**.  
> No generic answers — each prompt references your real files, models, and patterns.

---

## AUDIT 1 — Full Technical SEO Audit (Master Prompt)

```
You are a senior SEO engineer. Perform a complete technical SEO audit
for the following production web application and deliver a prioritized
findings report with severity ratings and exact fix instructions.

── APPLICATION CONTEXT ──────────────────────────────────────────
App name:      Mahalo Immobilier
Type:          Real estate listing platform (Morocco market)
Target users:  Arabic + French speaking Moroccans
Target engines: Google, Bing, Yahoo, Yandex

Stack:
  Frontend:  React 18.3, Vite 5.1, react-router-dom v6.22 (BrowserRouter, CSR only)
  Styling:   Tailwind CSS 3.4
  Backend:   Laravel 11, REST API at /api/v1/*
  Auth:      Laravel Sanctum + Google OAuth
  Media:     Images stored in /storage/, served at /storage/{path}
  Maps:      MapLibre GL JS

Installed packages (package.json):
  axios ^1.6, lucide-react ^0.344, maplibre-gl ^5.24, swiper ^11,
  react ^18.3, react-dom ^18.3, react-router-dom ^6.22
  NO react-helmet-async, NO next.js, NO prerender plugin

Public routes:
  /                        Home (no SEO tags set)
  /properties              Property listing with URL filter params
                           (?city_id=&type=&min_price=&max_price=&bedrooms=&category_id=)
  /properties/:slug        Property detail page
  /projects                Projects listing
  /projects/:slug          Project detail
  /neighborhoods           Neighborhoods listing
  /agents                  Agents listing
  /agents/:id              Agent profile
  /about                   About page
  /privacy                 Privacy policy
  /terms                   Terms of service

Non-indexed routes (must be blocked):
  /admin/*                 Admin panel (React SPA)
  /login, /register        Auth pages
  /profile, /messages      User account pages
  /forgot-password, /reset-password
  /email/verify/:id/:hash
  /auth/google/callback, /admin/auth/google/callback

── CURRENT SEO STATE (FINDINGS FROM CODE REVIEW) ────────────────

1. RENDERING: Pure CSR (Client-Side Rendering). No SSR, no prerendering.
   BrowserRouter renders everything in JS. Bing, Yahoo, Yandex cannot
   reliably crawl JS-rendered content.

2. META TAGS:
   - Home.jsx: NO title tag, NO meta description, NO OG tags at all.
   - Properties.jsx: NO title, NO meta description.
   - PropertyDetail.jsx: HAS partial meta tags via manual useEffect +
     document.querySelector() pattern. Missing: structured data, hreflang,
     canonical is set but uses window.location.origin (breaks SSR).
   - ProjectDetail.jsx: NO meta tags at all.
   - AgentDetail.jsx: NO meta tags.
   - All admin routes: NO robots noindex tag.
   - NO react-helmet-async installed.

3. STRUCTURED DATA: Zero JSON-LD on any page. No RealEstateListing,
   no LocalBusiness, no BreadcrumbList, no WebSite/SearchAction schema.

4. SITEMAP: No sitemap.xml exists. routes/web.php only returns a JSON
   status response. No SitemapController exists.

5. ROBOTS.TXT: No robots.txt file found in either public directory.

6. URL STRUCTURE:
   - Slugs served from `slugs` table (key field). Format varies — no
     consistent SEO-optimized pattern.
   - /properties?city_id=1&type=sale creates unlimited duplicate URLs
     with no canonical tags.
   - /agents/:id uses numeric ID, not slug.

7. IMAGES:
   - No loading="lazy" on any images.
   - No explicit width/height attributes (causes CLS).
   - No WebP conversion — all images served as original format.
   - No srcset or sizes attributes.
   - Hero image has no fetchpriority="high".

8. PERFORMANCE:
   - App.jsx imports ALL 30+ pages eagerly (no React.lazy).
   - No code splitting between admin and public bundles.
   - No API response caching in Laravel controllers.
   - No Cache-Control headers on API responses.

9. PACKAGE GAPS:
   react-helmet-async — NOT installed
   @prerenderer/vite-plugin or vike — NOT installed
   spatie/laravel-sitemap — NOT installed (composer)
   intervention/image — NOT installed (composer)
   spatie/laravel-sluggable — NOT installed (composer)

── YOUR AUDIT TASK ──────────────────────────────────────────────
Produce a structured SEO audit report with these sections:

SECTION 1: SEVERITY MATRIX
List every issue found with:
  - Issue name
  - Severity: Critical / High / Medium / Low
  - Impact on Google / Impact on Bing & Yandex (separate columns)
  - Estimated traffic loss %
  - Fix complexity: Easy (<2h) / Medium (2–8h) / Hard (>8h)

SECTION 2: CRITICAL ISSUES (must fix immediately)
For each critical issue:
  - Root cause explanation (technical, not generic)
  - Exact file(s) to change with line-level guidance
  - Code snippet showing the fix
  - How to verify the fix worked

SECTION 3: HIGH PRIORITY ISSUES
Same format as Section 2.

SECTION 4: QUICK WINS (< 1 hour each, high ROI)
List 5–8 changes that take under 1 hour but deliver measurable results.
For each: what to do, which file, expected benefit.

SECTION 5: MISSING SEO INFRASTRUCTURE
List what needs to be built from scratch (doesn't exist yet):
  - SEO component layer
  - Sitemap system
  - Structured data layer
  - Crawl infrastructure

SECTION 6: KEYWORD OPPORTUNITY ANALYSIS
Based on the app being a Moroccan real estate platform, identify:
  - Top 10 target keywords in French (fr-MA)
  - Top 10 target keywords in Arabic (ar-MA)
  - Which pages should target which keywords
  - Content gaps (pages that should exist but don't)

SECTION 7: COMPETITOR BASELINE
What would a well-optimized Moroccan real estate competitor have that
this app currently lacks? List 10 specific technical differences.

SECTION 8: 30-DAY ROADMAP
Week 1: Emergency fixes (Critical issues)
Week 2: Foundation (Sitemap, robots.txt, meta tags)
Week 3: Structured data + speed
Week 4: Local SEO + monitoring setup

Be specific. Reference actual file names. No generic advice.
```

---

## AUDIT 2 — Rendering & Crawlability Audit

```
You are a technical SEO specialist focused on JavaScript rendering issues.
Audit the crawlability of this React SPA and give a concrete migration plan.

── APP CONTEXT ──────────────────────────────────────────────────
Stack: React 18 + Vite 5 + BrowserRouter (CSR only)
Entry: index.html → main.jsx → App.jsx
Routing: react-router-dom v6, all client-side
API: Laravel REST API at /api/v1/*
No SSR. No prerendering. No static export.

Routes that need to be crawlable (have unique content):
  / → Home (hero, featured properties from API, agents count)
  /properties/:slug → Property detail (name, price, images, description, location)
  /projects/:slug → Project detail
  /agents/:id → Agent profile
  /neighborhoods → Neighborhoods listing
  /about → Static content

Routes that do NOT need to be crawlable:
  /admin/*, /login, /register, /profile, /messages

── SPECIFIC QUESTIONS TO ANSWER ─────────────────────────────────

1. GOOGLEBOT BEHAVIOR
   - Can Googlebot currently render this app? Explain why/why not.
   - What does Googlebot see on the first byte of HTML vs after JS executes?
   - How long is the "crawl budget delay" for JS rendering vs HTML?
   - What does the current <title> in index.html look like before JS runs?

2. BING / YAHOO / YANDEX BEHAVIOR
   - Can these crawlers execute React's JavaScript? Explain per-engine.
   - What do they currently index for /properties/:slug?
   - How much traffic is being lost to these engines right now?
   - Will IndexNow alone fix the indexing problem for Bing/Yandex?

3. SOLUTION COMPARISON
   For this specific stack (React + Vite + Laravel API), compare:

   Option A: vite-plugin-prerender (static prerendering at build time)
     - Which routes can be prerendered?
     - What happens to /properties/:slug (thousands of dynamic URLs)?
     - Build time impact?
     - How to configure with Vite 5?

   Option B: Vike (vite-plugin-ssr successor)
     - Migration complexity from BrowserRouter?
     - How does it call the Laravel API during SSR?
     - Does it require Node.js server in production?

   Option C: React Router v6 + express-react-views (Node SSR middleware)
     - Add a Node.js layer in front of the Vite build
     - How does it handle the existing Laravel API calls?

   Option D: Keep CSR + fix meta tags with react-helmet-async
     - What percentage of the SEO problem does this solve?
     - Is this acceptable for Google only? What about Bing?

   Recommend the best option for a 2-developer team building a
   Moroccan real estate platform. Include setup time estimate.

4. CRAWL BUDGET
   - How many URLs will this app have at scale (estimate for 5,000 properties)?
   - How to structure sitemaps to maximize crawl budget?
   - Which pages should be in sitemap vs blocked in robots.txt?

5. IMMEDIATE ACTIONS BEFORE FULL SSR
   While SSR is being implemented, what 3 changes can be made TODAY
   to improve crawlability with zero architectural changes?
   Show the exact code for each.
```

---

## AUDIT 3 — On-Page SEO Audit (Page by Page)

```
You are an on-page SEO specialist. Audit every public page of this
React real estate app and tell me exactly what's wrong and how to fix it.

── CURRENT IMPLEMENTATION ───────────────────────────────────────
Library: NONE (no react-helmet-async installed yet)
Current approach: Manual document.title + document.querySelector() in useEffect
Only PropertyDetail.jsx has any meta tags. All other pages have nothing.

── PAGE-BY-PAGE AUDIT ───────────────────────────────────────────
For each page below, provide:
  a) Current state (what meta tags exist or don't)
  b) What the optimized title should be (max 60 chars)
  c) What the optimized meta description should be (max 160 chars)
  d) What the canonical URL should be
  e) What OG tags are needed
  f) What structured data / JSON-LD is needed
  g) What the H1 tag should be
  h) Severity of the current gap: Critical / High / Medium / Low

PAGES TO AUDIT:

Page 1: Home (/)
  Current: No title, no description, no OG tags, no H1 visible in JSX.
  Components: Navbar, Hero (search bar + stats), FeaturedProperties,
              NeighborhoodsSection, NewProjects, AgentsSection, Footer.

Page 2: Properties listing (/properties)
  Current: No meta tags. URL has filter params:
  /properties?city_id=1&type=sale&min_price=500000&category_id=2
  This creates ~1000+ unique filter combinations = duplicate content risk.

Page 3: Property detail (/properties/:slug)
  Current: Has partial meta tags via useEffect/document.querySelector.
  Has: title, description (stripped HTML), og:title, og:description,
       og:type, og:url, og:image, twitter:card, canonical.
  Missing: structured data, hreflang, breadcrumb, og:locale,
           og:site_name, price meta tags.
  Data available: property.name, property.city.name, property.description
  (HTML string), property.images[0] (URL), property.price (decimal),
  property.slug, property.number_bedroom, property.square, property.type.

Page 4: Projects listing (/projects)
  Current: No meta tags at all.

Page 5: Project detail (/projects/:slug)
  Current: No meta tags at all.
  Data available: project.name, project.description, project.city,
                  project.images, project.slug.

Page 6: Neighborhoods (/neighborhoods)
  Current: No meta tags. Static content.

Page 7: Agents listing (/agents)
  Current: No meta tags.

Page 8: Agent detail (/agents/:id)
  Current: No meta tags. Uses numeric :id not slug in URL.
  Data: agent.name, agent.bio, agent.city, agent.avatar, agent.phone.

Page 9: About (/about)
  Current: No meta tags. Static page.

Page 10: Privacy Policy (/privacy)
  Current: No meta tags.

Page 11: Terms of Service (/terms)
  Current: No meta tags.

── AFTER THE AUDIT ──────────────────────────────────────────────
After auditing each page, provide:

1. A complete SEOHead React component using react-helmet-async with all
   necessary props (title, description, image, url, type, noindex, breadcrumbs).

2. The exact import + JSX for each page (copy-paste ready code).

3. A usePageSEO(config) custom hook that standardizes meta tag generation
   across all pages.

4. Title formula for property pages: Must include property name, city, and
   "Mahalo Immobilier" brand. Max 60 chars. Handle long property names gracefully.

5. Description formula for property pages: Include price (MAD format),
   bedrooms, city. Strip HTML from property.description. Max 160 chars.

Target language: French (fr-MA) for titles and descriptions (primary market).
```

---

## AUDIT 4 — Structured Data & Rich Results Audit

```
You are a structured data specialist. Audit the JSON-LD / schema.org
implementation of this real estate platform and provide complete working
implementations for all missing schemas.

── CURRENT STATE ────────────────────────────────────────────────
JSON-LD implemented: NONE (zero structured data on any page)
Library: react-helmet-async (to be installed)

── DATA SHAPES FROM API ─────────────────────────────────────────
Property object (from /api/v1/properties/:slug):
{
  id, name, slug, type (sale|rent), description (HTML),
  location (text address), images (array of URLs or paths),
  number_bedroom (int), number_bathroom (int), square (float, m²),
  price (decimal), status (selling|renting),
  city: { id, name },
  categories: [{ id, name }],
  features: [{ id, name, icon }],
  latitude (nullable), longitude (nullable),
  agent: { id, name, avatar, phone, email }
}

Agent object (from /api/v1/agents/:id):
{
  id, name, bio, city (string), avatar (URL),
  phone, email, listings_count
}

Project object (from /api/v1/projects/:slug):
{
  id, name, slug, description (HTML), location,
  images (array), city: { name },
  price_from, price_to
}

── SCHEMAS TO IMPLEMENT ─────────────────────────────────────────
For each schema, provide:
  a) The complete JSON-LD object (filled with real example data from Morocco)
  b) The React hook/component to inject it via react-helmet-async
  c) Which Google rich result it unlocks
  d) How to test it in Google Rich Results Test

SCHEMA 1: RealEstateListing (for /properties/:slug)
  - Use schema.org/RealEstateListing
  - Include: @type, name, description (no HTML), url, image (array),
    offers: { @type: Offer, price, priceCurrency: "MAD" },
    numberOfRooms, floorSize: { @type: QuantitativeValue, value, unitCode: "MTK" },
    address: { @type: PostalAddress, addressLocality: city.name,
               addressCountry: "MA" },
    geo (if latitude/longitude available): { @type: GeoCoordinates, latitude, longitude }
  - Example: Villa 4 bedrooms in Casablanca, 2,500,000 MAD

SCHEMA 2: RealEstateAgent (for /agents/:id)
  - Use schema.org/RealEstateAgent
  - Include: @type, name, description (bio), telephone, email, image,
    address, url, aggregateRating (if reviews exist)
  - Example: Ahmed Benali, Casablanca agent

SCHEMA 3: WebSite + SearchAction (for /)
  - Use schema.org/WebSite for Sitelinks Searchbox
  - SearchAction target: https://mahalo.ma/properties?search={search_term_string}
  - Include: @type: WebSite, name, url, potentialAction

SCHEMA 4: Organization (for /)
  - Use schema.org/Organization
  - Include: name: "Mahalo Immobilier", url, logo, contactPoint,
    sameAs: [social media URLs placeholder], address (Morocco)

SCHEMA 5: BreadcrumbList (for all inner pages)
  - /properties/:slug → [Home, Properties, {property.name}]
  - /projects/:slug → [Home, Projects, {project.name}]
  - /agents/:id → [Home, Agents, {agent.name}]
  - Show reusable useBreadcrumbs(items) hook

SCHEMA 6: LocalBusiness (for city landing pages)
  - Type: RealEstateAgent (extends LocalBusiness)
  - Address specific to each Moroccan city
  - areaServed: array of neighborhoods

── TESTING INSTRUCTIONS ─────────────────────────────────────────
After providing all schemas:
1. Show how to test each one in Google Rich Results Test
2. Show how to validate in Yandex Structured Data Validator
3. List which schemas Bing specifically rewards
4. Provide a checklist to verify correct injection (no SSR = no static HTML issue)
```

---

## AUDIT 5 — URL & Slug Architecture Audit

```
You are an SEO URL architecture specialist. Audit the URL structure of
this real estate platform and fix all issues.

── CURRENT URL STRUCTURE ────────────────────────────────────────
Database: slugs table with columns: id, key, reference_id, reference_type, prefix
Property slugs stored in `key` field. Format currently varies — no standard.
Example slugs seen: might be property name lowercased, or numeric ID fallback.

Laravel lookup code (PropertyController::show):
  $slugModel = Slug::where('key', $slug)
    ->where('reference_type', 'Botble\\RealEstate\\Models\\Property')
    ->first();
  // Falls back to: Property::where('name', 'like', "%$slug%") if no slug found

Agent URLs: /agents/:id  (numeric ID — not SEO friendly)
Property URLs: /properties/:slug
Project URLs: /projects/:slug

Filter URLs: /properties?city_id=1&type=sale&min_price=500000
  → Creates 1000+ duplicate content URLs
  → No canonical tags set on listing pages
  → No pagination meta (rel prev/next)

── URL ISSUES TO AUDIT ──────────────────────────────────────────

ISSUE 1: Property Slug Quality
  Current: unknown format, possibly just property name lowercased
  Problem: No city keyword, no property type keyword
  Target format: {type}-{bedrooms}br-{city-slug}-{ref-id}
  Example: villa-4br-casablanca-1847

  Questions:
  a) Should the ID suffix always be included? When?
  b) How to handle Arabic property names (transliteration)?
  c) How to handle duplicate names in same city?
  d) What's the character limit for an SEO-optimal slug?
  e) Should we include price range? (argument for/against)

  Provide:
  - The Laravel slug generation function (PHP)
  - The migration to update existing slugs
  - How to 301 redirect old slugs to new slugs (preserve backlinks)

ISSUE 2: Agent URLs (/agents/:id vs /agents/:slug)
  Current: /agents/42 (numeric ID, zero keyword value)
  Target: /agents/ahmed-benali-casablanca (name + city)
  
  Provide:
  - Migration to add slug column to agents table
  - Observer/boot() to auto-generate agent slugs
  - Laravel route change
  - React router change in App.jsx
  - 301 redirect from /agents/42 → /agents/ahmed-benali-casablanca

ISSUE 3: Filter URL Duplicate Content
  Current: /properties?city_id=1&type=sale creates infinite combinations
  Problem: Google sees thousands of near-identical pages

  Provide 3 solutions ranked by implementation effort:
  Solution A: Canonical to /properties on all filter pages
  Solution B: City-specific landing pages /immobilier-casablanca
  Solution C: Parameter handling via Google Search Console

  For Solution A: show the React code to set canonical
  For Solution B: show the new route structure

ISSUE 4: Pagination
  Current: No pagination meta tags at all
  /properties?page=2 is treated as separate page with no relationship to /properties

  Provide the React code to add:
  - rel="prev" for page > 1
  - rel="next" when more pages exist
  - Updated canonical per page

ISSUE 5: URL Language Structure
  Target market is French (fr-MA) + Arabic (ar-MA)
  Current URLs are English (/properties, /agents, /about)

  Options:
  A: Keep English URLs (easier, acceptable)
  B: French URLs (/proprietes, /agents, /a-propos)
  C: Subdirectory language routing (/fr/properties, /ar/properties)
  D: Subdomain (/fr.mahalo.ma, /ar.mahalo.ma)

  Recommend the best option for a 2-dev team.
  Show the React Router + Laravel changes for the recommended option.
```

---

## AUDIT 6 — Core Web Vitals & Page Speed Audit

```
You are a Core Web Vitals performance specialist. Audit this React real
estate app for speed issues that affect Google's ranking signals.

── APP PROFILE ──────────────────────────────────────────────────
Framework: React 18 + Vite 5
CSS: Tailwind CSS 3.4 (purged)
Images: Stored in /storage/, no CDN, no WebP, no optimization
No CDN configured. Likely served from a single origin.
Bundle: No code splitting. All 30+ pages loaded in one chunk.
Maps: MapLibre GL JS (large library, ~800KB)

── PAGES TO AUDIT ───────────────────────────────────────────────
Focus on these 3 pages (highest traffic):
  1. / (Home) — LCP is likely the hero background image
  2. /properties (Listing) — LCP is the first property card image
  3. /properties/:slug (Detail) — LCP is the first gallery image

── METRICS TO EVALUATE ──────────────────────────────────────────
For each of the 3 pages, estimate current scores and provide fixes for:

LCP (Largest Contentful Paint) — target: < 2.5s
  Current issue: Images not preloaded, loaded after JS executes
  Current issue: No fetchpriority="high" on hero/first images
  Current issue: No srcset for responsive images
  Question: At what point in the React lifecycle does the LCP image load?
  Fix: Show the exact JSX/HTML changes to preload critical images

CLS (Cumulative Layout Shift) — target: < 0.1
  Current issue: PropertyCard images have no width/height attributes
  Current issue: API-loaded content shifts layout on load
  Current issue: Swiper (carousel) may cause reflow
  Fix: Show how to add aspect-ratio CSS and explicit dimensions

INP (Interaction to Next Paint) — target: < 200ms
  Current issue: All pages imported eagerly in App.jsx (large JS parse time)
  Current issue: MapLibre GL loaded on every page, not just map pages
  Fix: Show the React.lazy() split for App.jsx

FCP (First Contentful Paint) — target: < 1.8s
  Current issue: CSR means nothing renders until JS executes
  Fix: What can be done without full SSR migration?

── CODE SPLITTING AUDIT ─────────────────────────────────────────
Current App.jsx imports (all eager):
  import Home from './pages/Home'
  import Properties from './pages/Properties'
  import PropertyDetail from './pages/PropertyDetail'
  import Projects from './pages/Projects'
  import ProjectDetail from './pages/ProjectDetail'
  import Neighborhoods from './pages/Neighborhoods'
  import Agents from './pages/Agents'
  import AgentDetail from './pages/AgentDetail'
  import About from './pages/About'
  [... 20+ more pages including all admin pages]

Task:
  a) Show the complete App.jsx rewrite with React.lazy() for all pages
  b) Show the Suspense boundary strategy (per-route vs per-section)
  c) Show how to use the existing Skeletons.jsx as the fallback
  d) How to split MapLibre GL into its own chunk (it's huge)
  e) Expected bundle size reduction in KB

── IMAGE OPTIMIZATION AUDIT ─────────────────────────────────────
Current state:
  - Images loaded: property.images[0] (full URL) with no optimization
  - PropertyCard.jsx renders: <img src={img} alt="" className="w-16 h-16...">
  - No loading="lazy", no width, no height, no srcset

Task:
  a) Show updated PropertyCard.jsx with lazy loading + explicit dimensions
  b) Show PropertyDetail.jsx hero image with fetchpriority="high"
  c) Show a responsive <img> with srcset for 400w, 800w, 1200w breakpoints
  d) Laravel: show intervention/image v3 WebP conversion in MediaController
  e) Nginx config: add Cache-Control: max-age=31536000 for /storage/* assets

── FINAL DELIVERABLE ────────────────────────────────────────────
Provide:
1. Estimated Lighthouse scores before your fixes (current state)
2. Estimated Lighthouse scores after your fixes
3. The single highest-ROI change for LCP improvement
4. The single highest-ROI change for CLS improvement
5. Total development hours needed for all fixes
```

---

## AUDIT 7 — Local SEO & Morocco Market Audit

```
You are a local SEO specialist for the MENA real estate market.
Audit the local SEO signals for Mahalo Immobilier and provide an
actionable strategy to rank in Moroccan cities.

── MARKET CONTEXT ────────────────────────────────────────────────
Platform: Real estate listings for Morocco
Primary language: French (fr-MA) — Moroccan urban internet users
Secondary language: Arabic (ar-MA) — growing mobile user base
Key cities: Casablanca, Rabat, Marrakech, Tanger, Agadir, Fes, Meknès
Currency: MAD (Moroccan Dirham)
Country code: .MA
Popular search engines in Morocco: Google (dominant), Bing, Yandex (Arabic)

Top competitor sites to audit:
  - mubawab.ma (leading Moroccan real estate portal)
  - avito.ma (classifieds, heavy real estate)
  - sarouty.ma
  - remax.ma

── CURRENT LOCAL SEO GAPS ───────────────────────────────────────
1. No hreflang tags (no ar-MA or fr-MA alternate links)
2. No city-specific landing pages
3. No LocalBusiness schema markup
4. No NAP (Name/Address/Phone) in structured format
5. No Google Business Profile mentioned
6. URLs are English (/properties, /agents) not French (/proprietes)
7. No city-specific meta descriptions
8. No Moroccan city names in page titles

── AUDIT QUESTIONS ──────────────────────────────────────────────

QUESTION 1: HREFLANG STRATEGY
  The app has one language (English/French mixed). What's the minimal
  hreflang implementation that signals Moroccan French and Arabic to Google?
  
  Provide:
  a) The hreflang link tags for PropertyDetail.jsx (fr-MA + ar-MA + x-default)
  b) The Helmet implementation using react-helmet-async
  c) Do hreflang tags work without actual translated content?
  d) What's the minimum viable multilingual SEO for Morocco without
     full translation?

QUESTION 2: CITY LANDING PAGES
  Target keyword: "appartements à vendre à Casablanca" (French)
  Target keyword: "شقق للبيع في الدار البيضاء" (Arabic)

  Design a city landing page architecture:
  a) URL structure: /immobilier-casablanca vs /casablanca vs /fr/casablanca
  b) What unique content does each city page need to avoid duplicate content?
  c) How many cities warrant dedicated landing pages?
  d) Show a complete React component for a city landing page
     (use existing /api/v1/properties?city_id= endpoint)
  e) What city-specific JSON-LD schema is needed?

QUESTION 3: KEYWORD RESEARCH
  Provide keyword analysis for Moroccan real estate in French:
  Format: Keyword | Monthly searches (estimate) | Competition | Target page

  Cover these intent categories:
  - Buy apartment (acheter appartement + city)
  - Rent apartment (louer appartement + city)  
  - Villa for sale (villa à vendre + city)
  - New real estate project (programme immobilier + city)
  - Real estate agent (agent immobilier + city)

  Then repeat for Arabic (ar-MA):
  - شقة للبيع + city
  - شقة للإيجار + city
  - فيلا للبيع + city
  - مشروع عقاري + city

QUESTION 4: CONTENT GAPS
  Compared to mubawab.ma (the market leader), what content pages
  is Mahalo currently missing that would drive organic traffic?
  List 10 content types with SEO rationale.

QUESTION 5: YANDEX OPTIMIZATION
  Yandex has significant usage among Arabic-speaking users.
  What are 5 Yandex-specific optimizations beyond standard Google SEO?
  Include Yandex Turbo Pages and Yandex Webmaster specifics.

QUESTION 6: GOOGLE BUSINESS PROFILE
  What should the Google Business Profile for Mahalo Immobilier look like?
  Provide:
  a) Exact business category to select
  b) Service areas to list (Moroccan cities)
  c) Products to add (apartment listings, villa listings)
  d) Weekly posting cadence for the platform
  e) How to connect the GBP to the website for local ranking signals

── DELIVERABLE ───────────────────────────────────────────────────
End with a 90-day local SEO roadmap specific to the Moroccan market,
broken into:
  Month 1: Technical foundations
  Month 2: Content and landing pages
  Month 3: Link building and citation building in Morocco
```

---

## AUDIT 8 — Competitor Gap Analysis Prompt

```
You are an SEO competitive intelligence analyst. Compare Mahalo Immobilier
against the leading Moroccan real estate portals and identify exact gaps.

── MAHALO CURRENT STATE (CONFIRMED) ─────────────────────────────
Technical: React CSR SPA, no SSR, no meta tags on most pages, no sitemap,
           no robots.txt, no structured data, no image optimization.
Content: Properties, Projects, Agents, Neighborhoods pages.
Domain: New/unknown authority.
Market: Morocco (Casablanca, Rabat, Marrakech, Tanger, Agadir, Fes)

── COMPETITORS TO ANALYZE ───────────────────────────────────────
mubawab.ma — #1 Moroccan real estate portal
avito.ma — #1 Moroccan classifieds (heavy real estate section)
sarouty.ma — Moroccan real estate specialist
remax.ma — International brand, Morocco franchises

── ANALYSIS TASKS ───────────────────────────────────────────────

TASK 1: TECHNICAL SEO COMPARISON
For each competitor, analyze and compare to Mahalo:
  - Rendering method (SSR / SSG / CSR)?
  - Do they have meta tags? Structured data?
  - Sitemap structure?
  - Page speed scores (estimate)?
  - Mobile optimization?

Format as a comparison table:
  Feature | Mahalo | Mubawab | Avito | Sarouty | Remax

TASK 2: URL STRUCTURE COMPARISON
Compare URL patterns:
  - How does mubawab.ma structure property URLs?
  - How does avito.ma structure listing URLs?
  - What keywords do they include in URLs?
  - What can Mahalo learn from their URL architecture?

TASK 3: CONTENT STRATEGY GAPS
What content pages do competitors have that Mahalo is missing?
Focus on:
  - Blog / editorial content (market reports, buying guides)
  - Neighborhood guides
  - City real estate market overviews
  - Mortgage calculator pages
  - Agent directory / profiles
  - Developer / promoteur pages

For each gap: estimate monthly search volume and difficulty.

TASK 4: BACKLINK OPPORTUNITY ANALYSIS
Where do Moroccan real estate sites get their backlinks from?
List 10 types of Moroccan sites that link to real estate portals:
  - News sites (Hespress, Le360, Médias24)
  - Government / municipality sites
  - Architecture / construction firms
  - Notaries / legal sites
  - Banks / mortgage providers (CIH Bank, Attijariwafa, BMCE)

For each: how to earn a link + pitch angle.

TASK 5: 6-MONTH SEO CATCH-UP PLAN
Given Mahalo starts from zero technical SEO and competes with established
Moroccan portals, what is a realistic 6-month plan to:
  a) Get the first 100 organic visitors/month
  b) Rank on page 1 for 5 long-tail keywords
  c) Get first property pages indexed in Google and Bing
  
Be realistic about timelines. Don't oversell.

TASK 6: QUICK WIN OPPORTUNITIES
What niches or keyword clusters are UNDERSERVED by current Moroccan
real estate portals that Mahalo could dominate quickly?
Think: new cities, property types, price ranges, or content formats
that competitors ignore.
```

---

## HOW TO USE THESE PROMPTS

**Which prompt for which purpose:**

| Goal | Use |
|------|-----|
| Full technical overview before starting | Audit 1 (Master) |
| Bing/Yandex can't see my app | Audit 2 (Rendering) |
| Fix meta tags on every page | Audit 3 (On-Page) |
| Get rich results in Google | Audit 4 (Structured Data) |
| Fix duplicate content from filters | Audit 5 (URLs) |
| Improve Google PageSpeed score | Audit 6 (Core Web Vitals) |
| Rank in Moroccan cities | Audit 7 (Local SEO) |
| Understand what competitors do better | Audit 8 (Competitor Gap) |

**Tips for best AI responses:**
- Paste one audit prompt at a time — don't combine them.
- After getting an answer, follow up with: *"Now write the actual code for [specific fix]"*
- If the answer is too generic, add: *"Be specific to the files I mentioned. Don't give general advice."*
- For code output, add: *"Show complete file contents, not just the changed lines."*

---

*Stack: React 18 + Vite 5 + react-router-dom v6 + Laravel 11 + Tailwind 3*  
*Market: Morocco — French (fr-MA) + Arabic (ar-MA)*  
*Engines: Google, Bing, Yahoo, Yandex*
