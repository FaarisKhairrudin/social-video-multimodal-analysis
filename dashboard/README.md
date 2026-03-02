# Social Video Insights Dashboard

An interactive web application for exploring social media video insights built with Next.js 14, TypeScript, and modern React components.

## 🚀 Features

### Overview Page
- **KPI Cards**: Total videos, unique topics, top emotion, average confidence, platform distribution
- **Interactive Heatmap**: Topic × Emotion matrix with clickable cells for filtering
- **Topic Rankings**: Sort by video count or average confidence
- **Real-time Insights**: Auto-generated key findings based on filtered data

### Topic Explorer
- **Topic Cards**: Display topic statistics, keywords, dominant emotions, and confidence scores
- **Grid/List Views**: Toggle between card grid and list layouts
- **Quick Filtering**: Click any topic card to filter the entire dashboard
- **Search**: Find topics by name or keywords

### Emotion Insights
- **Global Distribution**: Pie and bar charts showing emotion distribution
- **Topic Comparison**: Side-by-side emotion analysis for any two topics
- **Entity Analysis**: Top entities (NER) within each topic
- **Interactive Charts**: Click and filter directly from visualizations

### Video Browser
- **Advanced Data Table**: Sortable, searchable, paginated video listing
- **Rich Metadata**: Platform, topic, emotion, confidence, summary, entity count
- **Direct Links**: Open source videos in new tabs
- **Responsive Design**: Optimized for desktop and mobile viewing

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI primitives
- **Charts**: Recharts for data visualization
- **Tables**: TanStack Table for advanced data grids
- **State Management**: Zustand for global filters and data
- **Animations**: Framer Motion for smooth interactions
- **Data Processing**: PapaParse for CSV parsing, Fuse.js for fuzzy search

## 📊 Data Schema

The application expects a CSV file with the following columns:

### Required Fields
- `Id`: Unique identifier (integer)
- `Video`: URL to video source (string)
- `Emotion`: Detected emotion (string)
- `Platform`: Video platform ("instagram" | "google_drive" | "unknown")
- `Topic_ID`: Topic identifier (integer) 
- `Topic_Label`: Human-readable topic name (string)
- `Topic_Keywords`: Comma-separated keywords (string)
- `Topic_Confidence`: Classification confidence 0-1 (float)
- `Summary`: Video content summary (string)
- `NER`: Named entities as JSON array (string)

### Optional Fields
- `publish_datetime`: Publication date
- `duration_sec`: Video duration in seconds
- `title`: Video title
- `views`: View count
- `likes`: Like count  
- `comments`: Comment count
- `author`: Content creator

## 🚦 Getting Started

### Installation

```bash
# Clone the repository
cd dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Data Setup

1. Place your CSV file at `/public/data.csv`
2. Ensure the CSV follows the required schema above
3. The dashboard will automatically load and parse the data on first visit

### Replacing Data

To use your own dataset:

1. **Format your CSV**: Ensure it matches the required schema
2. **Replace the file**: Copy your CSV to `/public/data.csv`
3. **Restart the app**: The new data will be loaded automatically

## 📱 Usage Guide

### Demo Scenarios

#### 1. Topic vs Emotion Analysis
1. Navigate to **Overview** page
2. Click on a cell in the Topic×Emotion heatmap (e.g., "Teknologi & Tutorial" + "Trust")
3. Observe how all charts and data update to show only videos matching that combination
4. Go to **Videos** page to see individual videos with those characteristics
5. Click video links to open source content

#### 2. Discover Popular Topics
1. Go to **Topics** page
2. Topics are sorted by video count by default
3. Click **Filter Dashboard by this Topic** on any topic card
4. Switch to **Overview** to see that topic's emotion distribution
5. Use **Emotions** page to compare with another topic

#### 3. Entity Deep Dive
1. On **Emotions** page, compare two topics (e.g., "Gaming" vs "Travel & Vlog")
2. Look at the "Top Entities" comparison
3. Note entities like "Jakarta", "Nike", "Toyota" and their frequencies
4. Use the global search in **Overview** to filter by specific entities
5. See how entity mentions correlate with emotions and topics

### Navigation Tips

- **Global Filters**: Available on every page, changes apply across the entire dashboard
- **Quick Search**: Use the search bar to find videos by content, topics, or entities
- **Filter Reset**: Click the reset button to clear all filters
- **Responsive**: Works on mobile devices, optimized for desktop viewing

## 🎨 Design Features

- **Dark Mode**: Default dark theme with premium aesthetics
- **Smooth Animations**: Framer Motion micro-interactions
- **Color Coding**: Consistent emotion and topic color schemes
- **Hover Effects**: Interactive feedback on all clickable elements
- **Loading States**: Skeleton loaders for smooth user experience
- **Empty States**: Friendly messages when no data matches filters

## ⚡ Performance

- **Client-side Processing**: All data processing happens in the browser
- **Memoized Calculations**: Expensive aggregations are cached
- **Debounced Search**: Text search doesn't trigger on every keystroke
- **Pagination**: Large datasets are split into manageable pages
- **Optimized Rendering**: Only re-render components when data changes

## 🏗 Architecture

```
app/
├── layout.tsx              # Root layout with navigation
├── page.tsx               # Overview page with KPIs and charts
├── topics/page.tsx        # Topic explorer
├── emotions/page.tsx      # Emotion analysis
└── videos/page.tsx        # Data table browser

components/
├── ui/                    # shadcn/ui components
├── charts/                # Recharts visualizations
├── filters/               # Global filter controls
├── Navigation.tsx         # Main navigation bar
├── KpiCard.tsx           # Metric display cards
└── TopicCard.tsx         # Topic information cards

lib/
├── data.ts               # CSV loading and aggregation logic
├── types.ts              # TypeScript interfaces and utilities
└── utils.ts              # Utility functions

store/
└── useFilters.ts         # Zustand state management
```

## 🔧 Customization

### Adding New Visualizations

1. Create new chart components in `/components/charts/`
2. Use Recharts for consistency with existing charts
3. Follow the established color schemes for emotions and topics
4. Add interactive filtering capabilities

### Extending Data Schema

1. Update the `VideoData` interface in `/lib/types.ts`
2. Modify CSV parsing logic in `/lib/data.ts`
3. Add new aggregation functions as needed
4. Update UI components to display new fields

### Styling Changes

1. Modify color schemes in `/lib/types.ts`
2. Update Tailwind CSS classes throughout components
3. Adjust the global CSS in `/app/globals.css`
4. Customize shadcn/ui components in `/components/ui/`

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for exploring social media video insights**