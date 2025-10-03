# Infinite News Stream

A modern, real-time news aggregation website built with React, TypeScript, and the NewsData API. Features category-specific news filtering, search functionality, and a responsive design.

## Features

- ✨ Real-time news updates from NewsData API
- 🔍 Search functionality for finding specific articles
- 📱 Fully responsive design for all devices
- 🎨 Modern UI with smooth animations (GSAP)
- 🔄 Auto-refresh every 5 minutes for latest news
- 🖼️ Automatic fallback for broken images
- 🚫 Duplicate article filtering
- 📂 Category-specific news filtering (Politics, Sports, Tech, Entertainment)
- 🔗 External links to original news sources

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. The API key is already configured in `client/.env`:
```
VITE_NEWSDATA_API_KEY=pub_057b1f4feec14f1aa5f6634c54e68f96
```

## Development

Run the development server:

```bash
npm run dev
```

The app will open automatically at `http://localhost:5000`

## Building for Production

Build the project:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment to Vercel

This project is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect the configuration from `vercel.json`
4. Deploy!

The environment variable `VITE_NEWSDATA_API_KEY` is already set in the code, but you can override it in Vercel's environment variables if needed.

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and API services
│   │   └── App.tsx         # Main app component
│   └── .env                # Environment variables
├── shared/                 # Shared types and schemas
├── vite.config.ts          # Vite configuration
├── vercel.json             # Vercel deployment config
└── package.json            # Dependencies and scripts
```

## Technologies Used

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query** - Data fetching and caching
- **Wouter** - Lightweight routing
- **GSAP** - Animations
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **NewsData API** - News data source

## API Information

This project uses the [NewsData.io API](https://newsdata.io/) to fetch real-time news articles. The free tier provides:
- 200 requests per day
- English language news
- Multiple categories
- Search functionality

## Features Explained

### Real-time Updates
News articles are automatically refetched every 5 minutes to ensure you always see the latest headlines.

### Image Handling
All article images have automatic fallback handling. If an image fails to load, a default placeholder image is displayed.

### Duplicate Prevention
The app filters out duplicate articles based on their unique article IDs to ensure a clean browsing experience.

### Category Filtering
Each category (Politics, Sports, Tech, Entertainment) fetches news specifically related to that topic using NewsData API's category filtering.

### External Links
Clicking on any article card opens the full article on the original publisher's website in a new tab.

## License

MIT
