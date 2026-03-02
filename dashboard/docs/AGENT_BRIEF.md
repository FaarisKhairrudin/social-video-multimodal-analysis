TITLE: Copilot Brief — Interactive Social Video Insights (Frontend-Only, Next.js App Router)

ROLE & GOAL
You are a lead front-end engineer building a competition-grade web app to explore social-media videos using an augmented CSV (dummy) dataset. Objective: help judges extract insights quickly from Emotion, Topic_Label, Summary, Topic_Confidence, and NER with a modern, responsive, high-performance UI. No backend required for now (CSV loaded in the browser). Make it visually premium.

DATA & SCHEMA
Source: /public/data.csv (client-side load).
Required columns:
- Id:int
- Video:string (URL to Instagram/Google Drive)
- Emotion:string
- Topic_ID:int
- Topic_Label:string
- Topic_Keywords:string  (comma-separated keywords)
- Topic_Confidence:float
- Summary:string
- NER:string (JSON array: [{ "text": "...", "type": "ORG|GPE|PRODUCT|..." }])
- Platform:string ("instagram" | "google_drive" | "unknown")
Optional (if present, use gracefully): publish_datetime, duration_sec, title, views, likes, comments, author.

TECH STACK
- Frontend only: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Recharts, TanStack Table, Zustand (for global filters/state), Framer Motion (micro animations).
- CSV parsing: PapaParse. Optional fuzzy search: Fuse.js.

STRUCTURE (MINIMUM)
- app/
  - layout.tsx
  - page.tsx                # Overview
  - topics/page.tsx         # Topic Explorer
  - emotions/page.tsx       # Emotion Insights
  - videos/page.tsx         # Video Browser
- components/
  - charts/*                # Recharts components (Heatmap, Timeline, Donut, Bars)
  - ui/*                    # shadcn generated components
  - filters/GlobalFilters.tsx
  - TopicCard.tsx, KpiCard.tsx, NerCloud.tsx
- lib/
  - data.ts                 # CSV loader, parsing, aggregations (matrix Topic×Emotion, entities freq)
  - color.ts                # emotion→badge color, topic colors
- store/
  - useFilters.ts           # Zustand store for data + filters
- public/
  - data.csv                # augmented CSV

DATA FLOW
1) On first load, fetch /public/data.csv, parse via PapaParse (header:true).
2) Normalize data:
   - Coerce numeric fields (Id, Topic_ID, Topic_Confidence).
   - Parse NER JSON string into array.
   - Ensure Platform (infer if missing).
3) Store rows in Zustand; compute memoized aggregates (selectors).
4) Apply global filters to derive filtered rows for all pages.

GLOBAL FILTERS (persist in state)
- Platform (multi)
- Emotion (multi)
- Topic_Label (multi)
- Text search `q` (search in Summary, Topic_Keywords, Topic_Label, NER.text, optional title).
- Optional date range if publish_datetime exists.
Filters must affect all pages consistently.

PAGES & FEATURES
A) Overview (Landing)
- KPI Cards: 
  - Total Videos
  - Unique Topics
  - Top Emotion (by count)
  - Avg Topic_Confidence (2 decimals)
  - Platform distribution (if room)
- Charts:
  - Topic × Emotion Heatmap (click cell applies [Topic_Label, Emotion] filters).
  - Timeline (videos/day or engagement/day if available) with brush/zoom.
  - Top Topics (bar) with toggle “by count / by Topic_Confidence avg”.
- “Insight hints” text under charts (1–2 lines explaining what the user is seeing).

B) Topic Explorer
- Grid/List of Topic Cards:
  - Topic_Label, size (#videos), 3–5 Topic_Keywords, dominant Emotion badge, average Topic_Confidence.
  - CTA “Filter Dashboard by this Topic”.
- Topic Detail Drawer/Page:
  - Auto topic summary (merge top 5–10 Summary into 2–3 sentence synopsis).
  - Emotion mix donut for the topic.
  - NER Cloud (entity chips with tooltip showing type and frequency; clicking a chip sets q=entity).
  - Representative Videos (top 10 by simple heuristic—e.g., earliest + most frequent Emotion or by Topic_Confidence; link to Video new tab).

C) Emotion Insights
- Global Emotion distribution (bar/pie).
- Compare two topics (select Topic A & B):
  - Emotion distribution side-by-side.
  - Mini-list: top 5 entities (NER) in each topic.
- Sankey (if feasible): Topic_Label → Emotion (weight = count). If not, use stacked/grouped bars.

D) Video Browser
- DataTable with client-side pagination & sorting (TanStack Table).
- Columns: Platform icon, Title (or Id), Topic_Label, Emotion, Summary (truncated with tooltip), NER count, Topic_Confidence, Actions (Open Source).
- Row expand: show full Summary, NER list (chips), and “Open Video” button.

UX / DESIGN GUIDELINES
- Dark mode default. Rounded-2xl, soft shadows, generous spacing. 
- shadcn/ui components for Cards/Badges/Tabs/Tooltip/Drawer/Skeleton.
- Color scheme:
  - Emotion badges: e.g., Trust=emerald, Proud=amber, Surprise=violet, Neutral=slate.
  - Topics get categorical hues with consistent mapping.
- Loading skeletons for all views; empty states with friendly copy.
- Micro-interactions using Framer Motion (hover, entrance).
- Accessibility: keyboard navigation and aria labels on interactive elements.

PERFORMANCE
- Dataset up to ~5k rows should feel snappy:
  - Use memoized selectors (`useMemo`) for aggregates.
  - Debounce text search.
  - Virtualize long tables if needed (optional).
- No backend calls—only one CSV fetch.

AGGREGATIONS (IMPLEMENT)
- topicEmotionMatrix(rows): returns { topics[], emotions[], matrix Map } for heatmap.
- topKeywordsByTopic(rows): parse Topic_Keywords; count per topic.
- dominantEmotionByTopic(rows): mode of Emotion per Topic_Label.
- topicConfidenceAvg(rows): average Topic_Confidence (global and per topic).
- entitiesFrequency(rows, scope?): frequency of NER.text globally or by topic.

SEARCH
- Simple string includes over Summary, Topic_Keywords, Topic_Label, NER.text.
- Optional: Fuse.js fuzzy search with keys: ["Summary", "Topic_Keywords", "Topic_Label", "NER[].text"].

DELIVERABLES
- Working Next.js project with pages & components above.
- `/public/data.csv` loader implemented and documented in README.
- Styled dark theme with shadcn/ui; consistent Emotion & Topic color mapping.
- README with:
  - How to run locally (`pnpm dev`)
  - How to replace the CSV
  - Feature overview and 3 demo scenarios
  - Screenshots (Overview, Topic Detail, Emotion Compare, Video Browser)

DEMO SCENARIOS (SCRIPT)
1) Topic vs Emotion: Select “Teknologi & Tutorial” → show Emotion donut (Trust/Surprise) → open representative videos → point to NER like “Ubuntu/Hadoop”.
2) What’s Hot: Sort topics by size or avg Topic_Confidence → highlight Topic with high Surprise/Proud share → narrate why it matters.
3) Entity Drilldown: Click “Telkom University” in NER Cloud → auto-filter `q="Telkom University"` → observe consistent Topic/Emotion pattern across videos.

QUALITY BAR / ACCEPTANCE CRITERIA
- All global filters instantly re-compute and reflect across pages.
- Heatmap cell click reliably sets filters and navigates to relevant views.
- Table interactions (search, sort, paginate) remain responsive.
- Mobile-friendly, but optimized for desktop judges (≥1280px).
- No console errors; TypeScript strict where reasonable.

OPTIONAL (NICE-TO-HAVE)
- Export filtered view as CSV.
- Persist filters in URL query params for shareable states.
- Minimal “About” page explaining data fields (Emotion, Topic_Label, Summary, NER, Topic_Confidence) so judges understand the semantics quickly.

NOTES TO COPILOT
- No backend for now. Everything is client-side from a single CSV file.
- Be defensive: if any optional columns are missing, hide UI elements gracefully.
- Provide small helper utilities and keep components clean and reusable.
- Prioritize clarity, interactivity, and storytelling value in the charts and layouts.
