import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Article } from "@shared/schema";

interface ArticleCardProps {
  article: Article & { link?: string };
  className?: string;
}

// Default fallback image for broken images
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop';

export default function ArticleCard({ article, className = "" }: ArticleCardProps) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = imageError ? DEFAULT_IMAGE : (article.imageUrl || DEFAULT_IMAGE);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.setAttribute('data-gsap', 'true');
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.1 }
      );
    }
  }, []);

  return (
    <Link href={`/article/${article.slug}`} onClick={() => {
      try { sessionStorage.setItem(`article:${article.slug}`, JSON.stringify(article)); } catch {}
    }}>
      <Card ref={cardRef} className={`overflow-hidden hover-elevate cursor-pointer transition-all duration-300 hover:shadow-xl ${className}`}>
      <div data-testid={`link-article-${article.id}`}>
        {/* Article Image */}
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
            data-testid={`img-article-${article.id}`}
          />
        </div>
        
        {/* Article Content */}
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-3 line-clamp-2 leading-tight">
            {article.title}
          </h3>
          
          <Button 
            size="sm"
            className="text-sm"
            data-testid={`button-read-more-${article.id}`}
          >
            READ MORE
            {/* icon removed for internal page navigation */}
          </Button>
        </div>
      </div>
    </Card>
  </Link>
  );
}