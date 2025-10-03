// News services for fetching news articles
// Vite exposes env vars prefixed with VITE_ via import.meta.env
const NEWSDATA_API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY || '';
const NEWSAPI_KEY = import.meta.env.VITE_NEWSAPI_KEY || '';

// Debug: Log keys on load (first 10 chars only for security)
if (NEWSDATA_API_KEY) {
  console.log('[newsApi] NewsData key loaded:', NEWSDATA_API_KEY.substring(0, 10) + '...');
} else {
  console.warn('[newsApi] VITE_NEWSDATA_API_KEY is missing. Add it to client/.env and restart dev server.');
}

if (NEWSAPI_KEY) {
  console.log('[newsApi] NewsAPI key loaded:', NEWSAPI_KEY.substring(0, 10) + '...');
}

const BASE_URL = 'https://newsdata.io/api/1/news';
const NEWSAPI_BASE = 'https://newsapi.org/v2';

export interface NewsArticle {
  article_id: string;
  title: string;
  description: string | null;
  content: string | null;
  link: string;
  image_url: string | null;
  pubDate: string;
  source_id: string;
  source_name: string;
  category: string[];
  country: string[];
  language: string;
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsArticle[];
  nextPage?: string;
}

// Map NewsData categories to our app categories
const categoryMap: Record<string, string> = {
  'politics': 'politics',
  'sports': 'sports',
  'tech': 'technology',
  'technology': 'technology',
  'entertainment': 'entertainment',
};

// Default fallback image for articles without images
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';

function buildNewsDataUrl(params: Record<string, string | number | undefined>) {
  const usp = new URLSearchParams();
  usp.set('language', 'en');
  
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') usp.set(k, String(v));
  });
  
  if (NEWSDATA_API_KEY) {
    usp.set('apikey', NEWSDATA_API_KEY);
  } else {
    // Surface a clear warning once per session
    if (!(window as any).__newsdata_key_warned) {
      console.warn('[newsApi] NEWS_DATA_API_KEY / VITE_NEWSDATA_API_KEY missing. Add it to .env and restart dev server.');
      (window as any).__newsdata_key_warned = true;
    }
  }
  return `${BASE_URL}?${usp.toString()}`;
}

// Fetch top headlines. Prefer NewsAPI if key is provided (richer headlines endpoint).
export async function fetchTopHeadlines(country: string = 'us'): Promise<NewsArticle[]> {
  try {
    if (NEWSAPI_KEY) {
      const url = `${NEWSAPI_BASE}/top-headlines?country=${country}&pageSize=10&apiKey=${NEWSAPI_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Top headlines error: ${res.statusText}`);
      const data = await res.json();
      // Map NewsAPI articles into our NewsArticle shape (partial mapping)
      const mapped: NewsArticle[] = (data.articles || []).map((a: any, idx: number) => ({
        article_id: a.url || String(idx),
        title: a.title,
        description: a.description ?? a.title,
        content: a.content ?? a.description ?? a.title,
        link: a.url,
        image_url: a.urlToImage ?? null,
        pubDate: a.publishedAt ?? new Date().toISOString(),
        source_id: a.source?.id ?? 'newsapi',
        source_name: a.source?.name ?? 'NewsAPI',
        category: ['general'],
        country: [country],
        language: 'en',
      }));
      return filterValidArticles(mapped);
    }
    // Fallback: use NewsData latest as banner if NewsAPI key is not present
    return await fetchLatestNews();
  } catch (e) {
    console.error('Error fetching top headlines:', e);
    return [];
  }
}

// Fetch latest news articles (no page param as requested)
export async function fetchLatestNews(): Promise<NewsArticle[]> {
  try {
    // Required format: https://newsdata.io/api/1/news?language=en&country=us&apikey=...
    const url = buildNewsDataUrl({ country: 'us' });
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }
    
    const data: NewsDataResponse = await response.json();
    return filterValidArticles(data.results);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return [];
  }
}

// Fetch news by category (no page param as requested)
export async function fetchNewsByCategory(category: string): Promise<NewsArticle[]> {
  try {
    const mappedCategory = categoryMap[category.toLowerCase()] || category.toLowerCase();
    // Required format: https://newsdata.io/api/1/news?language=en&category=<cat>&country=us&apikey=...
    const url = buildNewsDataUrl({ category: mappedCategory, country: 'us' });
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.statusText}`);
    }
    
    const data: NewsDataResponse = await response.json();
    return filterValidArticles(data.results);
  } catch (error) {
    console.error(`Error fetching news for category ${category}:`, error);
    return [];
  }
}

// Search news articles using /latest endpoint with q parameter
export async function searchNews(query: string): Promise<NewsArticle[]> {
  try {
    // Use /latest endpoint as requested: https://newsdata.io/api/1/latest?apikey=...&q=query
    const url = `https://newsdata.io/api/1/latest?apikey=${NEWSDATA_API_KEY}&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to search news: ${response.statusText}`);
    }
    
    const data: NewsDataResponse = await response.json();
    
    // Also search NewsAPI if key is available
    let newsApiResults: NewsArticle[] = [];
    if (NEWSAPI_KEY) {
      try {
        const newsApiUrl = `${NEWSAPI_BASE}/everything?q=${encodeURIComponent(query)}&language=en&pageSize=20&apiKey=${NEWSAPI_KEY}`;
        const newsApiRes = await fetch(newsApiUrl);
        if (newsApiRes.ok) {
          const newsApiData = await newsApiRes.json();
          newsApiResults = (newsApiData.articles || []).map((a: any, idx: number) => ({
            article_id: a.url || `newsapi-${idx}`,
            title: a.title,
            description: a.description ?? a.title,
            content: a.content ?? a.description ?? a.title,
            link: a.url,
            image_url: a.urlToImage ?? null,
            pubDate: a.publishedAt ?? new Date().toISOString(),
            source_id: a.source?.id ?? 'newsapi',
            source_name: a.source?.name ?? 'NewsAPI',
            category: ['general'],
            country: ['us'],
            language: 'en',
          }));
        }
      } catch (e) {
        console.warn('NewsAPI search failed:', e);
      }
    }
    
    // Combine and deduplicate results
    const combined = [...data.results, ...newsApiResults];
    return filterValidArticles(combined);
  } catch (error) {
    console.error(`Error searching news for query ${query}:`, error);
    return [];
  }
}

// Filter out articles with broken images or missing data, and remove duplicates
function filterValidArticles(articles: NewsArticle[]): NewsArticle[] {
  const seen = new Set<string>();
  const seenTitles = new Set<string>();
  const validArticles: NewsArticle[] = [];

  for (const article of articles) {
    // Skip if we've seen this article ID before (duplicate)
    if (seen.has(article.article_id)) {
      continue;
    }

    // Skip if we've seen this title before (duplicate content)
    const normalizedTitle = article.title?.toLowerCase().trim();
    if (normalizedTitle && seenTitles.has(normalizedTitle)) {
      continue;
    }

    // Skip if missing essential data
    if (!article.title || !article.description) {
      continue;
    }

    // Skip articles with broken or invalid links
    if (!article.link || !article.link.startsWith('http')) {
      continue;
    }

    // Clean title and description from special characters
    if (article.title) {
      article.title = article.title.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
    }
    if (article.description) {
      article.description = article.description.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
    }

    // Add default image if missing or broken
    if (!article.image_url || article.image_url.includes('[Removed]')) {
      article.image_url = DEFAULT_IMAGE;
    }

    seen.add(article.article_id);
    if (normalizedTitle) seenTitles.add(normalizedTitle);
    validArticles.push(article);
  }

  return validArticles;
}

// Convert NewsArticle to our Article format
export function convertToArticle(newsArticle: NewsArticle) {
  return {
    id: newsArticle.article_id,
    title: newsArticle.title,
    content: newsArticle.content || newsArticle.description || '',
    excerpt: newsArticle.description || newsArticle.title,
    category: newsArticle.category?.[0] || 'General',
    author: newsArticle.source_name || 'Unknown',
    publishedAt: new Date(newsArticle.pubDate),
    imageUrl: newsArticle.image_url || DEFAULT_IMAGE,
    slug: newsArticle.article_id,
    link: newsArticle.link,
    createdAt: new Date(newsArticle.pubDate),
    updatedAt: new Date(newsArticle.pubDate),
  };
}
