# 🏠 Mahalo — SEO Architecture Master Prompt

> **Stack detected:** React (Vite) SPA + Laravel API backend  
> **Target search engines:** Google, Yahoo, Bing, Yandex  
> **App type:** Real estate platform with Properties, Projects, Agents, Neighborhoods  

---

## THE CORE PROBLEM TO SOLVE FIRST

Your app is a **React SPA rendered in the browser (client-side rendering)**. Search engine crawlers — especially Bing, Yahoo, and Yandex — may not execute JavaScript well enough to index your content. **This is the #1 SEO blocker** that must be addressed before anything else.

---

## PROMPT 1 — SSR / SSG Strategy (Foundation)

```
I have a React + Vite SPA (react-router-dom v6) with a Laravel REST API backend.
The app is a real estate platform called Mahalo with these public routes:
  /                        → Home
  /properties              → Property listing with filters
  /properties/:slug        → Single property detail
  /projects                → Real estate projects listing
  /projects/:slug          → Single project detail
  /neighborhoods           → Neighborhoods listing
  /agents                  → Agents listing
  /agents/:id              → Single agent profile
  /about, /privacy, /terms → Static pages

The problem: all pages are client-side rendered (CSR). Google can handle this
but Bing, Yahoo, and Yandex cannot reliably crawl JS-rendered content.

Give me a complete plan to convert this app to SSR or implement prerendering,
choosing between these options:
  Option A: Migrate to Vite SSR (vite-plugin-ssr / vike) keeping React + Laravel API
  Option B: Add prerendering with @prerenderer/webpack-plugin or vite-plugin-prerender
            for static pages + dynamic routes
  Option C: Add a Node.js SSR middleware layer (Express + ReactDOMServer) in front
            of the Vite build

For each option explain:
1. Migration complexity (1–10)
2. Which search engines benefit
3. How it handles dynamic pages like /properties/:slug (thousands of records)
4. The exact file/folder changes needed in my Vite + React project
5. How it keeps the Laravel API intact without changes

Recommend the best option for a team of 2 developers and implement it step by step.
```

---

## PROMPT 2 — Meta Tags & Structured Data per Page

```
I have a React SPA for real estate. I need dynamic SEO meta tags on every page.
I am NOT using Next.js — I am using react-router-dom v6 and Vite.

I already have a basic pattern in PropertyDetail.jsx using document.title and
manual <meta> tag injection via useEffect + useRef. I need to:

1. Create a reusable <SEOHead /> component using react-helmet-async that sets:
   - <title> (page-specific, max 60 chars)
   - <meta name="description"> (max 160 chars)
   - <meta name="robots"> (index,follow for public; noindex for /admin/*, /profile, /messages)
   - <link rel="canonical"> (absolute URL)
   - Open Graph tags (og:title, og:description, og:image, og:url, og:type)
   - Twitter Card tags
   - Hreflang tags (Arabic + English versions of each URL)

2. Show me the exact SEO content for each route:
   Route: /                     → Home
   Route: /properties           → Property listing
   Route: /properties/:slug     → Single property (use property.name, property.city, property.description)
   Route: /projects/:slug       → Single project
   Route: /neighborhoods        → Neighborhoods
   Route: /agents/:id           → Agent profile (use agent.name, agent.bio, agent.city)
   Route: /about                → About
   Route: /privacy              → Privacy Policy
   Route: /terms                → Terms of Service

3. Show the HelmetProvider setup in my App.jsx root

4. All admin routes (/admin/*) must have <meta name="robots" content="noindex,nofollow">

Property data shape for reference:
  { name, slug, city: { name }, price, bedrooms, bathrooms, area,
    description (HTML string), images: [{ url }], category: { name } }

Agent data shape:
  { id, name, bio, city, avatar, phone, email, listings_count }
```

---

## PROMPT 3 — JSON-LD Structured Data (Rich Results)

```
I am building SEO for a real estate platform (React + Laravel).
I need to add JSON-LD structured data so Google, Bing, and Yandex show
rich results (price, photos, ratings) in search results.

Implement JSON-LD schema markup for these page types:

1. Property listing page (/properties/:slug):
   Use schema.org/RealEstateListing (or Apartment / House as subtypes).
   Include: name, description, price (with currency MAD), address (city, country: MA),
   numberOfRooms, floorSize, image array, offers, geo coordinates if available.

2. Real estate project page (/projects/:slug):
   Use schema.org/RealEstateListing with additionalType "NewConstruction".
   Include: name, description, developer name, location, image, offers.

3. Agent profile page (/agents/:id):
   Use schema.org/RealEstateAgent (a LocalBusiness subtype).
   Include: name, description, telephone, email, image, address, aggregateRating.

4. Home page (/):
   Use schema.org/WebSite with SearchAction (Sitelinks Searchbox).
   Use schema.org/Organization for the Mahalo brand.
   Use schema.org/LocalBusiness for the agency.

5. Breadcrumb on every inner page:
   Use schema.org/BreadcrumbList.
   Example for /properties/:slug → Home > Properties > {property name}

Create a reusable React hook called useStructuredData(type, data) that:
- Accepts the schema type and data object
- Injects a <script type="application/ld+json"> tag into <head>
- Cleans up on unmount
- Works with react-helmet-async

Show complete JSON-LD output examples for a real property in Casablanca, Morocco.
```

---

## PROMPT 4 — Sitemap XML (Laravel Backend)

```
I have a Laravel 11 API backend. I need to generate dynamic XML sitemaps
that Google Search Console, Bing Webmaster Tools, and Yandex Webmaster can consume.

Implement a full sitemap strategy with these requirements:

1. Sitemap Index at /sitemap.xml that references:
   - /sitemap-static.xml      (Home, About, Agents, Properties listing, etc.)
   - /sitemap-properties.xml  (all /properties/:slug URLs, paginated if >50k)
   - /sitemap-projects.xml    (all /projects/:slug URLs)
   - /sitemap-agents.xml      (all /agents/:id URLs)
   - /sitemap-neighborhoods.xml

2. Each URL entry must include:
   <loc>        — full absolute URL (https://domain.com/properties/villa-casablanca)
   <lastmod>    — property updated_at date formatted as YYYY-MM-DD
   <changefreq> — daily for properties, weekly for agents, monthly for static
   <priority>   — 1.0 for home, 0.9 for property detail, 0.7 for listing pages

3. For multilingual support (Arabic + French + English):
   Include <xhtml:link rel="alternate" hreflang="ar" href="..."/>
   for each URL

4. Performance: the properties table may have 10,000+ records. Use
   lazy loading / chunked queries (LazyCollection) so the sitemap
   doesn't exhaust PHP memory.

5. Cache the sitemap output for 24 hours using Laravel Cache.

6. Add a route in routes/api.php (or routes/web.php) to serve it.
   The route must NOT require authentication.

7. Automatically ping Google and Bing when sitemap updates:
   https://www.google.com/ping?sitemap=https://domain.com/sitemap.xml
   https://www.bing.com/indexnow (IndexNow protocol with API key)

Show complete Laravel controller, route, and caching implementation.
```

---

## PROMPT 5 — robots.txt & Crawl Configuration

```
Create a robots.txt file for a real estate SPA (Mahalo) deployed on a single domain.
The frontend is React and backend API is Laravel served under /api/*.

Rules to implement:
1. Allow all search engine bots to crawl: /, /properties/*, /projects/*,
   /neighborhoods, /agents/*, /about, /privacy, /terms
2. Disallow all bots from: /admin/*, /api/*, /profile, /messages,
   /login, /register, /forgot-password, /reset-password, /email/*,
   /auth/*, /*.json, /*.xml (except /sitemap*.xml)
3. Add specific rules for:
   - Googlebot: full access to public pages
   - Bingbot: same as Googlebot
   - Yandex: same but also disallow /storage/private/*
   - GPTBot (OpenAI): Disallow all (to block AI training scraping)
   - CCBot (Common Crawl): Disallow all
   - AhrefsBot: Disallow all
   - SemrushBot: Disallow all
4. Crawl-delay: 2 seconds for Yandex, none for Google/Bing
5. Sitemap reference: Sitemap: https://domain.com/sitemap.xml

Also explain:
- Where to place this file in the Vite build output
- How to serve it via Laravel (as a static file vs controller)
- How to verify it in Google Search Console, Bing Webmaster Tools, Yandex Webmaster
```

---

## PROMPT 6 — URL Structure & Slug Optimization

```
I have a real estate app (Mahalo) with Laravel backend and React frontend.
Properties are accessed via /properties/:slug (slug comes from the database).

Design an SEO-optimized URL slug strategy:

1. Slug formula for properties:
   Pattern: {type}-{bedrooms}br-{city}-{neighborhood}-{id}
   Example: apartment-3br-casablanca-maarif-4821
   Rules:
   - lowercase, hyphens only (no underscores, no spaces)
   - max 75 characters
   - must include city name (high keyword value for local SEO)
   - must be unique (append short ID if duplicate)
   - Arabic city names must be transliterated (e.g., الدار البيضاء → casablanca)

2. Slug formula for projects:
   Pattern: {project-name}-{city}-{year}
   Example: marina-towers-rabat-2025

3. Slug formula for agents:
   Pattern: {first-name}-{last-name}-{city}-agent
   Example: ahmed-benali-casablanca-agent

4. Show the Laravel migration to add/update the slug column:
   - unique index
   - nullable with fallback to ID

5. Show the Laravel Eloquent Observer or boot() method that:
   - Auto-generates slug on create if not provided
   - Does NOT change slug on update (to preserve existing backlinks)
   - Handles duplicates by appending -{n}

6. Show the React router change if slugs change format:
   - 301 redirect from old /properties/4821 to new /properties/apartment-3br-casablanca-4821
   - How to handle this in Laravel routes

Use the spatie/laravel-sluggable package or implement from scratch — show both options.
```

---

## PROMPT 7 — Page Speed & Core Web Vitals

```
I have a React + Vite real estate SPA (Mahalo). Core Web Vitals (LCP, FID/INP, CLS)
are a Google ranking factor. Optimize my app for score 90+ on PageSpeed Insights.

Analyze and fix these areas:

1. IMAGE OPTIMIZATION
   - Properties have image galleries (up to 20 images per property)
   - Implement lazy loading for all images below the fold
   - Convert images to WebP on upload (Laravel backend: intervention/image)
   - Add responsive srcset for different screen sizes
   - Add explicit width/height attributes to prevent CLS
   - Show the React <PropertyImage /> component with blur placeholder

2. CODE SPLITTING
   - My App.jsx loads ALL pages eagerly (no lazy loading)
   - Convert all page imports to React.lazy() + Suspense
   - Split admin bundle completely from public bundle
   - Show the updated App.jsx with lazy imports

3. FONT LOADING
   - Add font-display: swap to all custom fonts
   - Preload the main font file
   - Show the updated index.html <head>

4. CRITICAL CSS
   - Inline critical above-the-fold CSS
   - Defer non-critical Tailwind styles
   - Show vite.config.js changes

5. API RESPONSE CACHING
   - Cache /api/properties, /api/projects list responses in Laravel for 1 hour
   - Show Laravel Cache::remember() implementation in controllers
   - Add HTTP Cache-Control headers: max-age=3600, s-maxage=86400

6. LARGEST CONTENTFUL PAINT (LCP)
   - The LCP element is the hero image on the home page
   - Add <link rel="preload"> for the hero image in index.html
   - OR if hero image is dynamic, show how to detect and preload it in JS

Show before/after Lighthouse score estimates for each optimization.
```

---

## PROMPT 8 — Local SEO & Google Business (Morocco)

```
I am building local SEO for Mahalo, a property platform
targeting Moroccan cities: Casablanca, Rabat, Marrakech, Tanger, Agadir, Fes.

Implement local SEO signals:

1. CITY LANDING PAGES
   Create dedicated SEO landing pages for each major city:
   URL pattern: /properties?city=casablanca  (existing filter page)
   OR better: /immobilier-casablanca, /immobilier-rabat (French slugs for Morocco)

   For each city page:
   - Unique <title>: "Appartements & Villas à Casablanca | Mahalo Immobilier"
   - Unique <meta description> mentioning neighborhoods, price range
   - H1 with city name
   - Intro paragraph (150–300 words) about real estate in that city
   - LocalBusiness JSON-LD schema with city address

2. NAP CONSISTENCY (Name, Address, Phone)
   Add consistent NAP in footer and contact page:
   - Exact same format everywhere
   - Structured with schema.org/PostalAddress
   - Moroccan phone format: +212 5XX-XXXXXX

3. HREFLANG FOR ARABIC + FRENCH
   Morocco searches in Arabic (ar-MA) and French (fr-MA).
   Implement hreflang alternate tags:
   <link rel="alternate" hreflang="ar-MA" href="https://mahalo.ma/ar/properties"/>
   <link rel="alternate" hreflang="fr-MA" href="https://mahalo.ma/fr/properties"/>
   <link rel="alternate" hreflang="x-default" href="https://mahalo.ma/properties"/>

   Show how to structure this in React without Next.js i18n routing.

4. GOOGLE BUSINESS PROFILE OPTIMIZATION
   List the exact fields to complete in Google Business Profile:
   - Business category for a real estate listing platform
   - Service areas (list of Moroccan cities)
   - Products (property types: apartments, villas, commercial)
   - Posts cadence (weekly property highlights)
   - Q&A seeding

5. YANDEX WEBMASTER (important for Arabic-speaking users)
   - Verify site in Yandex Webmaster Tools
   - Submit Arabic sitemap separately
   - Enable Turbo Pages for mobile (Yandex's equivalent of AMP)

Show implementation code for items 1, 2, and 3.
```

---

## PROMPT 9 — IndexNow (Bing + Yandex Instant Indexing)

```
I want to implement IndexNow protocol to instantly notify Bing and Yandex
when new properties are listed or updated on my Mahalo platform.

My backend is Laravel 11. New properties are created via POST /api/properties
(admin panel) and updated via PUT /api/properties/:id.

Implement:

1. IndexNow key setup:
   - Generate a random API key (UUID or random 32-char hex)
   - Serve it at: GET /{key}.txt → returns the key as plain text
   - Show the Laravel route for this

2. Laravel Service class IndexNowService:
   - Method: notify(array $urls): void
   - Sends POST to https://api.indexnow.org/indexnow with:
     { host, key, keyLocation, urlList }
   - Handle errors gracefully (don't throw on 4xx/5xx)
   - Batch up to 10,000 URLs per request

3. Hook into Eloquent events:
   - Property::created → notify([property URL])
   - Property::updated → notify([property URL]) if is_published changed to true
   - Project::created → notify([project URL])
   - Show the Laravel EventServiceProvider or Observer registration

4. Queue the notifications (don't block the request):
   - Create a Laravel Job: SendIndexNowNotificationJob
   - Dispatch it on the queue after model events
   - Show the job class and dispatch call

5. Also ping Google (Google doesn't support IndexNow but has its own API):
   - Use Google Search Console API (indexing API) as an alternative
   - Show how to set up a service account and send indexing requests
   - This is separate from IndexNow — show both flows

Show all code: service, job, observer, and routes.
```

---

## PROMPT 10 — Monitoring & Measuring SEO Performance

```
I launched SEO for Mahalo platform. Help me set up monitoring
to track organic search performance across Google, Bing, and Yandex.

1. GOOGLE SEARCH CONSOLE SETUP
   - Verify domain using DNS TXT record (not HTML file — SPA makes HTML verification hard)
   - Submit sitemap: /sitemap.xml
   - Set target country: Morocco (MA)
   - Which reports to check weekly: Coverage, Performance, Core Web Vitals, Enhancements
   - How to detect crawl errors for /properties/:slug pages

2. BING WEBMASTER TOOLS SETUP
   - Verify site
   - Submit sitemap
   - Enable IndexNow (from Prompt 9)
   - Keyword research tool usage for Moroccan real estate

3. YANDEX WEBMASTER SETUP
   - Add and verify site
   - Submit sitemap
   - Monitor indexing of Arabic-language pages

4. ANALYTICS (Privacy-compliant for GDPR + Moroccan law)
   - Set up Google Analytics 4 with:
     * Organic traffic segment filter
     * Property detail page engagement events (contact form submit, phone click, gallery view)
     * Custom dimension: property_city, property_type, property_price_range
   - OR recommend a privacy-first alternative (Plausible, Fathom) that works without cookie banners

5. RANK TRACKING
   - Keywords to track for Moroccan real estate:
     * "appartement à vendre casablanca"
     * "villa à louer marrakech"
     * "immobilier maroc"
     * Arabic equivalents: "شقة للبيع الدار البيضاء"
   - Free tools: Google Search Console + Data Studio
   - Paid tools worth the cost: Ahrefs / Semrush for competitor gap analysis

6. AUTOMATED SEO AUDIT
   - Set up a monthly Lighthouse CI run in GitHub Actions
   - Alert if LCP > 2.5s or CLS > 0.1 on any key page

Show configuration files and code for items 4 and 6.
```

---

## IMPLEMENTATION ORDER (Priority Roadmap)

| Priority | Prompt | Impact | Effort | Who |
|----------|--------|--------|--------|-----|
| 🔴 P0 | Prompt 1 — SSR/Prerender | Critical | High | Frontend Dev |
| 🔴 P0 | Prompt 4 — Sitemap XML | Critical | Low | Backend Dev |
| 🔴 P0 | Prompt 5 — robots.txt | Critical | Low | DevOps |
| 🟠 P1 | Prompt 2 — Meta Tags | High | Medium | Frontend Dev |
| 🟠 P1 | Prompt 3 — JSON-LD Schema | High | Medium | Frontend Dev |
| 🟠 P1 | Prompt 6 — URL Slugs | High | Medium | Full Stack |
| 🟡 P2 | Prompt 7 — Page Speed | High | High | Frontend Dev |
| 🟡 P2 | Prompt 9 — IndexNow | Medium | Low | Backend Dev |
| 🟢 P3 | Prompt 8 — Local SEO | Medium | Medium | Full Stack |
| 🟢 P3 | Prompt 10 — Monitoring | Low | Low | DevOps |

---

## QUICK WINS (Do Today, < 1 hour each)

1. **Add `<meta name="robots" content="noindex">` to all `/admin/*` routes** — prevents admin panel from appearing in search results.

2. **Create `robots.txt`** in your `public/` folder (both Laravel public and Vite dist).

3. **Verify your domain** in Google Search Console, Bing Webmaster Tools, and Yandex Webmaster via DNS TXT records.

4. **Submit your sitemap** (even a basic static one) immediately after step 3.

5. **Add `<link rel="canonical">`** to prevent duplicate content from filter URLs like `/properties?city=casa&type=apartment`.

6. **Fix `document.title`** — ensure every page has a unique, descriptive `<title>` tag (not just "Mahalo").

---

## TECHNOLOGY PACKAGES TO INSTALL

```bash
# Frontend (React/Vite)
npm install react-helmet-async          # Meta tags management
npm install @prerenderer/webpack-plugin # OR use vike for SSR

# Backend (Laravel)
composer require spatie/laravel-sluggable   # Auto-generate SEO slugs
composer require intervention/image        # WebP image conversion
composer require spatie/laravel-sitemap    # XML sitemap generation
```

---

*Generated for Mahalo — React (Vite) + Laravel 11 stack*  
*Target markets: Morocco (Casablanca, Rabat, Marrakech, Tanger, Agadir, Fes)*  
*Search engines: Google, Yahoo (Bing-powered), Bing, Yandex*
