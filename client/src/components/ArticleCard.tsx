import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Article } from "@shared/schema";
import articleImage1 from "@assets/generated_images/Corporate_building_article_image_8b8034ea.png";
import articleImage2 from "@assets/generated_images/City_skyline_article_image_2c04a75a.png";

interface ArticleCardProps {
  article: Article;
  className?: string;
}

// TODO: Remove mock image mapping when real images are available
const imageMap: Record<string, string> = {
  "1": articleImage1,
  "2": articleImage2,
  "3": articleImage1,
};

export default function ArticleCard({ article, className = "" }: ArticleCardProps) {
  const imageUrl = imageMap[article.id] || articleImage1;

  return (
    <Card className={`overflow-hidden hover-elevate ${className}`}>
      <Link href={`/article/${article.slug}`} data-testid={`link-article-${article.id}`}>
        {/* Article Image */}
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
            data-testid={`img-article-${article.id}`}
          />
        </div>
        
        {/* Article Content */}
        <div className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-3 line-clamp-2 leading-tight">
            {article.title}
          </h3>
          
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm"
            data-testid={`button-read-more-${article.id}`}
          >
            READ MORE
          </Button>
        </div>
      </Link>
    </Card>
  );
}