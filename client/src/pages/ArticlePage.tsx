import { useEffect, useMemo, useRef, useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { gsap } from "gsap";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ArticleCard from "@/components/ArticleCard";
import { fetchNewsByCategory } from "@/lib/newsApi";

// Default fallback image for broken images
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';

// Lightweight sanitization helpers
function stripHtml(input?: string | null) { return input ? input.replace(/<[^>]*>/g, '') : ''; }
function decodeEntities(input?: string | null) {
  if (!input) return '';
  return input
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}
function cleanText(input?: string | null) {
  const noHtml = stripHtml(input);
  const decoded = decodeEntities(noHtml);
  // Remove bracketed notes like [ ... ] and paid-plan banners
  const noBrackets = decoded.replace(/\[[^\]]*\]/g, '');
  const noPaidBanner = noBrackets.replace(/only available in paid plans/gi, '');
  return noPaidBanner.replace(/[\u0000-\u001F\u007F]+/g, '').replace(/\s+/g, ' ').trim();
}

export default function ArticlePage() {
  const [match, params] = useRoute("/article/:slug");
  const contentRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [imageError, setImageError] = useState(false);

  const slug = params?.slug as string | undefined;

  // Retrieve article from sessionStorage (set by ArticleCard)
  const stored = useMemo(() => {
    if (!slug) return null;
    try { return JSON.parse(sessionStorage.getItem(`article:${slug}`) || 'null'); } catch { return null; }
  }, [slug]);

  const category = (stored?.category || 'general').toLowerCase();

  const { data: related = [] } = useQuery({
    queryKey: ['related', category],
    queryFn: () => fetchNewsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current) {
        gsap.fromTo(contentRef.current, 
          { opacity: 0, y: 40, scale: 0.98 }, 
          { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power2.out" }
        );
      }
      if (sidebarRef.current) {
        gsap.fromTo(sidebarRef.current, 
          { opacity: 0, x: 30 }, 
          { opacity: 1, x: 0, duration: 0.8, delay: 0.2, ease: "power3.out" }
        );
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [slug]);

  if (!match) return null;

  if (!stored) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/"><Button><ArrowLeft className="h-4 w-4 mr-2"/>Back to Home</Button></Link>
        <Card className="mt-6 p-6">We couldn't load this article. Please return to the homepage and try again.</Card>
      </div>
    );
  }

  const title = cleanText(stored.title);
  const excerpt = cleanText(stored.excerpt || stored.description || '');
  const content = cleanText(stored.content || stored.excerpt || stored.description || '');
  // We won't display author by request, but keep for internal logic if needed
  const author = stored.author || stored.source_name || '';
  const published = stored.publishedAt ? new Date(stored.publishedAt).toLocaleString() : '';
  const hero = imageError ? DEFAULT_IMAGE : (stored.imageUrl || DEFAULT_IMAGE);
  
  // Build full article text with multiple paragraphs for better reading
  const fullArticleText = [
    excerpt,
    content,
    // Add some context if content is too short
    content.length < 200 ? `This article was published by ${author}. For the complete story and latest updates, visit the original source.` : ''
  ].filter(Boolean).join('\n\n');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0 animate-slide-up" ref={contentRef}>
          <Link href="/" onClick={() => window.scrollTo(0, 0)}><Button variant="outline" className="mb-4 text-sm"><ArrowLeft className="h-4 w-4 mr-2"/>Back to Home</Button></Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3">{title}</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground mb-4">
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3 md:h-4 md:w-4"/>{published}</span>
            {stored.category && <Badge variant="secondary" className="capitalize text-xs">{stored.category}</Badge>}
          </div>

          <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted mb-4 md:mb-6">
            <img src={hero} alt={title} className="w-full h-full object-cover" onError={() => setImageError(true)} />
          </div>

          <div className="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none leading-relaxed">
            {fullArticleText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="mb-4 text-base leading-7">
                {paragraph}
              </p>
            ))}
            
            {stored.link && (
              <div className="mt-8">
                <a
                  href={stored.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:opacity-90"
                >
                  READ MORE
                </a>
              </div>
            )}
          </div>
        </div>

        <aside className="w-full lg:w-80 lg:sticky lg:top-24 lg:h-fit" ref={sidebarRef}>
          <Card className="p-4 mb-4">
            <h3 className="font-semibold mb-2 text-sm md:text-base">Related in {category}</h3>
            <div className="space-y-4">
              {related.slice(0, 4).map((a) => (
                <ArticleCard key={a.article_id} article={{
                  id: a.article_id,
                  title: a.title,
                  content: a.content || a.description || '',
                  excerpt: a.description || a.title,
                  category: a.category?.[0] || 'General',
                  author: a.source_name || 'Unknown',
                  publishedAt: new Date(a.pubDate),
                  imageUrl: a.image_url || DEFAULT_IMAGE,
                  slug: a.article_id,
                  link: a.link,
                  createdAt: new Date(a.pubDate),
                  updatedAt: new Date(a.pubDate),
                }} className="article-card" />
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}